'use client';

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
} from 'd3-force';
import { zoom, zoomIdentity, zoomTransform, ZoomBehavior } from 'd3-zoom';
import { drag } from 'd3-drag';
import { select } from 'd3-selection';
import 'd3-transition';
import type { GraphResponse } from '@/entities/graph/model/graph.types';
import type { SimulationGraphNode, SimulationGraphLink } from '../model/simulation.types';
import * as S from './NodeGraphCanvas.css';

interface NodeGraphCanvasProps {
  data: GraphResponse;
  selectedTag?: string;
  onSelectTag: (tagName: string) => void;
  onExpandTag: (tagName: string) => Promise<void>;
  expandingTagNames: Set<string>;
  expandedTagNames: Set<string>;
  hasMoreTagNames: Set<string>;
  expansionError: string | null;
}

// 줌 및 노드 크기 상수
const MIN_ZOOM = 0.4;
const MAX_ZOOM = 1.8; // 충분한 줌인을 허용하는 상한선
const LEVEL1_RADIUS = 30; // 1레벨 루트 노드 크기 (설계서 비율)
const MIN_LEVEL2_RADIUS = 14;
const MAX_LEVEL2_RADIUS = 24;
const PARENT_CAPPING_RATIO = 0.85; // 3레벨 노드는 부모 반지름의 85%를 초과하지 못하도록 캡핑

export function NodeGraphCanvas({
  data,
  selectedTag,
  onSelectTag,
  onExpandTag,
  expandingTagNames,
  expandedTagNames,
  hasMoreTagNames,
  expansionError,
}: NodeGraphCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const zoomBehaviorRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const previousCategoryRef = useRef<string | null>(null);
  const positionCategoryRef = useRef<string | null>(null);
  const positionCacheRef = useRef(new Map<string, { x: number; y: number }>());

  // 1. 컨테이너 리사이즈 정확한 감지 (ResizeObserver 및 초기 마운트 측정)
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    // 마운트 즉시 실제 컨테이너 크기 측정 (800x600 하드코딩 제거)
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      setDimensions({ width: rect.width, height: rect.height });
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setDimensions({ width, height });
        }
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // 2. 가중치 기반 노드 크기(반지름) 및 부모 캡핑 사전 연산 (Min-Max 정규화)
  const preparedGraphData = useMemo(() => {
    if (data.isEmpty) return null;

    const root: SimulationGraphNode = { ...data.rootNode, radius: LEVEL1_RADIUS };
    const rawNodes: SimulationGraphNode[] = data.nodes.map((n) => ({ ...n, radius: 18 }));
    const rawLinks: SimulationGraphLink[] = data.links.map((l) => ({ ...l }));

    // 노드 크기는 태그 사용량으로 계산한다. 탐색 깊이가 늘어나도 같은 기준을 쓴다.
    const level2Nodes = rawNodes.filter((n) => n.level === 2);
    const weights2 = level2Nodes.map((n) => n.usageCount);
    const minW2 = weights2.length > 0 ? Math.min(...weights2) : 1;
    const maxW2 = weights2.length > 0 ? Math.max(...weights2) : 10;

    const radiusById = new Map<string, number>();
    for (const node of level2Nodes) {
      const normalized = maxW2 > minW2 ? (node.usageCount - minW2) / (maxW2 - minW2) : 0.5;
      const radius = MIN_LEVEL2_RADIUS + normalized * (MAX_LEVEL2_RADIUS - MIN_LEVEL2_RADIUS);
      node.radius = radius;
      radiusById.set(node.id, radius);
    }

    // 3레벨 가중치 Min-Max 정규화 및 부모 85% 상한 캡핑
    const level3Nodes = rawNodes.filter((n) => n.level >= 3);
    const weights3 = level3Nodes.map((n) => n.usageCount);
    const minW3 = weights3.length > 0 ? Math.min(...weights3) : 1;
    const maxW3 = weights3.length > 0 ? Math.max(...weights3) : 10;

    for (const node of level3Nodes.sort((a, b) => a.level - b.level)) {
      const parentRadius = node.parentId ? radiusById.get(node.parentId) || 18 : 18;
      const normalized = maxW3 > minW3 ? (node.usageCount - minW3) / (maxW3 - minW3) : 0.5;
      const rawRadius = 12 + normalized * (20 - 12);
      node.radius = Math.max(8, Math.min(rawRadius, parentRadius * PARENT_CAPPING_RATIO));
      radiusById.set(node.id, node.radius);
    }

    return {
      allNodes: [root, ...rawNodes],
      allLinks: rawLinks,
    };
  }, [data]);

  // ID 기반 노드 빠른 안전 탐색용 Map
  const nodeMap = useMemo(() => {
    const map = new Map<string, SimulationGraphNode>();
    if (preparedGraphData) {
      for (const n of preparedGraphData.allNodes) {
        map.set(n.id, n);
      }
    }
    return map;
  }, [preparedGraphData]);

  // 3. D3 Force Simulation 초기화 및 직접 DOM 제어 (60fps 네이티브 성능 최적화)
  useEffect(() => {
    const svgElement = svgRef.current;
    if (!preparedGraphData || !svgElement || dimensions.width === 0 || dimensions.height === 0) return;

    const { width, height } = dimensions;
    const cx = width / 2;
    const cy = height / 2;
    const nodes: SimulationGraphNode[] = preparedGraphData.allNodes;
    const links: SimulationGraphLink[] = preparedGraphData.allLinks;

    if (positionCategoryRef.current !== data.category) {
      positionCacheRef.current.clear();
      positionCategoryRef.current = data.category;
    }

    // 1레벨 중심 노드는 화면 정중앙 고정
    const rootNode = nodes.find((n) => n.level === 1);
    if (rootNode) {
      rootNode.x = cx;
      rootNode.y = cy;
      rootNode.fx = cx;
      rootNode.fy = cy;
    }

    // 2레벨 노드 방사형(Circular) 대칭 초기 좌표 배정 (꼬임 및 폭발적 반발 원천 방지)
    const level2Nodes = nodes.filter((n) => n.level === 2);
    const level2Count = Math.max(level2Nodes.length, 1);
    const initRadius = Math.min(width, height) * 0.28;

    level2Nodes.forEach((node, idx) => {
      const cachedPosition = positionCacheRef.current.get(node.id);
      if ((node.x === undefined || node.y === undefined) && cachedPosition) {
        node.x = cachedPosition.x;
        node.y = cachedPosition.y;
      }
      if (node.x === undefined || node.y === undefined) {
        const angle = (2 * Math.PI * idx) / level2Count - Math.PI / 2;
        node.x = cx + initRadius * Math.cos(angle);
        node.y = cy + initRadius * Math.sin(angle);
      }
    });

    // 3레벨 노드는 부모 2레벨 노드 주변으로 초기 군집 배치
    const level3Nodes = nodes.filter((n) => n.level >= 3);
    level3Nodes.forEach((node, idx) => {
      const cachedPosition = positionCacheRef.current.get(node.id);
      if ((node.x === undefined || node.y === undefined) && cachedPosition) {
        node.x = cachedPosition.x;
        node.y = cachedPosition.y;
      }
      if (node.x === undefined || node.y === undefined) {
        const parent = node.parentId ? nodeMap.get(node.parentId) : null;
        const px = parent?.x ?? cx;
        const py = parent?.y ?? cy;
        const subAngle = (idx * 1.2) % (2 * Math.PI);
        node.x = px + 45 * Math.cos(subAngle);
        node.y = py + 45 * Math.sin(subAngle);
      }
    });

    // D3 Selection 캐싱 (DOM 요소 선택)
    const svgSelection = select(svgElement);
    const nodeSelection = svgSelection.selectAll<SVGGElement, unknown>('g[data-node-id]');
    const linkSelection = svgSelection.selectAll<SVGLineElement, unknown>('line[data-link-id]');

    // D3 Force Simulation 구성
    const simulation = forceSimulation<SimulationGraphNode>(nodes)
      .force(
        'link',
        forceLink<SimulationGraphNode, SimulationGraphLink>(links)
          .id((d) => d.id)
          .distance((link) => {
            const targetNode = typeof link.target === 'object' ? link.target : null;
            return targetNode && targetNode.level >= 3 ? 65 : 120;
          })
      )
      .force('charge', forceManyBody<SimulationGraphNode>().strength(-220))
      .force('center', forceCenter<SimulationGraphNode>(cx, cy))
      .force(
        'collide',
        forceCollide<SimulationGraphNode>().radius((d) => (d.radius || 18) + 12)
      )
      .alphaDecay(0.025);

    // 위치 갱신 공통 함수: D3 datum 바인딩 불일치 문제 없이 data-node-id / data-link-id로 100% 직격 갱신
    const updatePositions = () => {
      // 1. 링크 위치 갱신
      linkSelection.each(function () {
        const linkIdStr = this.getAttribute('data-link-id');
        if (linkIdStr === null) return;
        const linkIndex = Number(linkIdStr);
        const link = links[linkIndex];
        if (!link) return;

        const s = typeof link.source === 'object' ? (link.source as SimulationGraphNode) : nodeMap.get(link.source as string);
        const t = typeof link.target === 'object' ? (link.target as SimulationGraphNode) : nodeMap.get(link.target as string);
        if (s && t) {
          this.setAttribute('x1', String(s.x ?? 0));
          this.setAttribute('y1', String(s.y ?? 0));
          this.setAttribute('x2', String(t.x ?? 0));
          this.setAttribute('y2', String(t.y ?? 0));
        }
      });

      // 2. 노드 위치 갱신 (초기 좌측상단 (0,0) 뭉침 완전 해결)
      nodeSelection.each(function () {
        const id = this.getAttribute('data-node-id');
        if (!id) return;
        const n = nodeMap.get(id);
        if (n) {
          this.setAttribute('transform', `translate(${n.x ?? 0}, ${n.y ?? 0})`);
          if (n.x !== undefined && n.y !== undefined) {
            positionCacheRef.current.set(n.id, { x: n.x, y: n.y });
          }
        }
      });
    };

    // ★ 사전 웜업(Pre-warm): 초기 요동침 및 (0,0) 튐을 방지하기 위해 백그라운드에서 35회 사전 물리 연산
    for (let i = 0; i < 35; ++i) {
      simulation.tick();
    }
    updatePositions();

    // 이후 시뮬레이션 매 틱마다 60fps 네이티브 갱신
    simulation.on('tick', updatePositions);

    // ★ 노드 드래그(d3-drag) 인터랙션 바인딩: data-node-id를 통해 정확한 노드 객체 물리 제어
    const dragBehavior = drag<SVGGElement, unknown>()
      .on('start', function (event) {
        const id = this.getAttribute('data-node-id');
        const d = id ? nodeMap.get(id) : null;
        if (!d) return;
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', function (event) {
        const id = this.getAttribute('data-node-id');
        const d = id ? nodeMap.get(id) : null;
        if (!d) return;
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', function (event) {
        const id = this.getAttribute('data-node-id');
        const d = id ? nodeMap.get(id) : null;
        if (!d) return;
        if (!event.active) simulation.alphaTarget(0);
        // 루트 노드는 중앙 고정 유지, 일반 노드는 자유 물리 이동
        if (d.level !== 1) {
          d.fx = null;
          d.fy = null;
        }
      });

    nodeSelection.call(dragBehavior);

    return () => {
      simulation.stop();
    };
  }, [preparedGraphData, dimensions, nodeMap, data.category]);

  // 4. D3 Zoom 바인딩 (데이터 로드 후 확실하게 SVG에 바인딩 및 패닝/줌 지원)
  useEffect(() => {
    const svgElement = svgRef.current;
    if (data.isEmpty || !svgElement) return;

    const zoomBehavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([MIN_ZOOM, MAX_ZOOM])
      .on('zoom', (event) => {
        const { k, x, y } = event.transform;

        // SVG 내부 컨테이너 transform 직접 적용
        const gElement = svgElement.querySelector('g[data-zoom-group]');
        if (gElement) {
          gElement.setAttribute('transform', `translate(${x}, ${y}) scale(${k})`);
        }
      });

    const svgSelection = select(svgElement);
    svgSelection.call(zoomBehavior);
    // 기본 더블클릭 줌 비활성화 (D3 정석 공식 방식: selection.on('dblclick.zoom', null))
    svgSelection.on('dblclick.zoom', null);
    zoomBehaviorRef.current = zoomBehavior;

    // 카테고리 데이터셋이 바뀌면 이전 그래프의 카메라 위치를 버린다.
    if (previousCategoryRef.current !== data.category) {
      svgSelection.call(zoomBehavior.transform, zoomIdentity);
      previousCategoryRef.current = data.category;
    }

    return () => {
      svgSelection.interrupt();
      svgSelection.on('.zoom', null);
      zoomBehaviorRef.current = null;
    };
  }, [data.category, data.isEmpty]);

  // ★ 노드 클릭 시 해당 노드로 초점(카메라) 스무스 이동 (Transition)
  const focusOnNode = useCallback(
    (node: SimulationGraphNode) => {
      const svgElement = svgRef.current;
      const zoomBehavior = zoomBehaviorRef.current;
      if (!svgElement || !zoomBehavior || node.x === undefined || node.y === undefined) return;

      const { width, height } = dimensions;
      if (width === 0 || height === 0) return;

      const currentTransform = zoomTransform(svgElement);
      // 클릭 시 적정 배율 유지 (최소 1.05 이상으로 보기 편하게 줌인)
      const targetScale = Math.max(currentTransform.k, 1.05);
      const targetX = width / 2 - node.x * targetScale;
      const targetY = height / 2 - node.y * targetScale;

      select(svgElement)
        .transition()
        .duration(650)
        .call(
          zoomBehavior.transform,
          zoomIdentity.translate(targetX, targetY).scale(targetScale)
        );
    },
    [dimensions]
  );

  // 선택 노드에서 시작해 최초 발견 경로의 부모까지만 강조한다.
  const activeGraph = useMemo(() => {
    const activeNodeIds = new Set<string>();
    const activeLinkIndices = new Set<number>();

    if (!preparedGraphData) {
      return { activeNodeIds, activeLinkIndices };
    }

    // 1레벨 중심(루트) 노드는 항상 기본 활성
    const rootNode = preparedGraphData.allNodes.find((n) => n.level === 1);
    if (rootNode) {
      activeNodeIds.add(rootNode.id);
    }

    if (!selectedTag) {
      return { activeNodeIds, activeLinkIndices };
    }

    const currentTagLower = selectedTag.toLowerCase();
    const selectedNode = preparedGraphData.allNodes.find(
      (n) => n.name && n.name.toLowerCase() === currentTagLower
    );

    if (!selectedNode) {
      return { activeNodeIds, activeLinkIndices };
    }

    const nodesById = new Map(preparedGraphData.allNodes.map((node) => [node.id, node]));
    let current: SimulationGraphNode | undefined = selectedNode;
    while (current) {
      activeNodeIds.add(current.id);
      if (!current.parentId) break;
      activeNodeIds.add(current.parentId);
      const linkIndex = preparedGraphData.allLinks.findIndex((link) => {
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;
        return targetId === current?.id;
      });
      if (linkIndex >= 0) activeLinkIndices.add(linkIndex);
      current = nodesById.get(current.parentId);
    }

    return { activeNodeIds, activeLinkIndices };
  }, [selectedTag, preparedGraphData]);

  // 데이터 조회 상태는 페이지가 처리하고, 이 컴포넌트는 실제 빈 응답만 표시한다.
  if (data.isEmpty) {
    return (
      <div ref={containerRef} className={S.canvasContainer}>
        <div className={S.emptyContainer}>
          <p className={S.emptyTitle}>그래프를 표시할 태그가 충분하지 않습니다.</p>
        </div>
      </div>
    );
  }

  const nodes = preparedGraphData?.allNodes || [];
  const links = preparedGraphData?.allLinks || [];

  return (
    <div ref={containerRef} className={S.canvasContainer}>
      <svg ref={svgRef} className={S.svg}>
        {/* 배경 드래그(캔버스 패닝) 및 휠 줌을 수신하기 위한 투명 오버레이 */}
        <rect width="100%" height="100%" fill="transparent" />
        <g data-zoom-group>
          {/* 1. 연결선 (Links) 렌더링 */}
          <g>
            {links.map((link, idx) => {
              const sourceNode =
                typeof link.source === 'object' && link.source !== null
                  ? (link.source as SimulationGraphNode)
                  : nodeMap.get(link.source as string);

              const targetNode =
                typeof link.target === 'object' && link.target !== null
                  ? (link.target as SimulationGraphNode)
                  : nodeMap.get(link.target as string);

              const isLinkHighlighted = activeGraph.activeLinkIndices.has(idx);

              const linkClassName = isLinkHighlighted
                ? S.linkHighlighted
                : S.linkDefault;

              return (
                <g key={`link-${idx}`}>
                  <line
                    data-link-id={idx}
                    className={linkClassName}
                    style={{ strokeWidth: link.similarity === null ? undefined : 1 + link.similarity * 2 }}
                    x1={sourceNode?.x ?? 0}
                    y1={sourceNode?.y ?? 0}
                    x2={targetNode?.x ?? 0}
                    y2={targetNode?.y ?? 0}
                  />
                </g>
              );
            })}
          </g>

          {/* 2. 노드 및 텍스트 렌더링 */}
          <g>
            {nodes.map((node) => {
              const radius = node.radius || 18;
              const isRoot = node.level === 1;
              const isLevel2 = node.level === 2;
              const isExpanding = expandingTagNames.has(node.name);
              const isExpanded = expandedTagNames.has(node.name);
              const hasMore = hasMoreTagNames.has(node.name);
              const currentTag = selectedTag?.toLowerCase();
              const nodeName = node.name?.toLowerCase();
              const isSelected = Boolean(currentTag && nodeName && currentTag === nodeName);
              const isChainActive = activeGraph.activeNodeIds.has(node.id);
              const isActiveGreen = isRoot || isSelected || isChainActive;

              const circleClassName = isSelected
                ? S.nodeCircleSelected
                : isActiveGreen
                  ? S.nodeCircleActive
                  : S.nodeCircleDefault;

              const levelClass = isRoot
                ? S.rootNodeLabel
                : isLevel2
                  ? S.level2NodeLabel
                  : S.level3NodeLabel;

              const labelColorClass = isActiveGreen ? S.nodeLabelActive : S.nodeLabelDefault;

              return (
                <g
                  key={node.id}
                  data-node-id={node.id}
                  className={S.nodeGroup}
                  aria-label={`${node.name}${isExpanding ? ', 연관 태그 불러오는 중' : isExpanded && !hasMore ? ', 탐색 완료' : ', 클릭해 연관 태그 확장'}`}
                  transform={`translate(${node.x ?? 0}, ${node.y ?? 0})`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTag(node.name);
                    focusOnNode(node);
                    if (node.level > 1) void onExpandTag(node.name);
                  }}
                  aria-busy={isExpanding}
                >
                  <title>{isExpanding ? `${node.name} 주변 태그를 불러오는 중` : isExpanded && !hasMore ? `${node.name} 주변 탐색 완료` : isExpanded ? `${node.name}의 다음 연관 태그 보기` : `${node.name} 선택 및 주변 태그 확장`}</title>
                  {/* 노드 원형 */}
                  <circle className={circleClassName} r={radius} />

                  {/* 노드 라벨 텍스트 */}
                  <text
                    className={`${levelClass} ${labelColorClass}`}
                    dy={radius + (isRoot ? 18 : 13)}
                  >
                    {node.name}
                  </text>
                </g>
              );
            })}
          </g>
        </g>
      </svg>
      {expansionError && <div className={S.expansionStatus} role="status">{expansionError}</div>}
    </div>
  );
}
