'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { CategoryType } from '@/shared/types';
import { getGraphNeighbors } from '@/entities/graph/api/graph.api';
import type { GraphLink, GraphNode, GraphResponse } from '@/entities/graph/model/graph.types';

interface ExplorationState {
  category: CategoryType;
  nodes: GraphNode[];
  links: GraphLink[];
  expandedTagNames: Set<string>;
  hasMoreTagNames: Set<string>;
}

export function useGraphExploration(category: CategoryType, seedData?: GraphResponse) {
  const queryClient = useQueryClient();
  const [exploration, setExploration] = useState<ExplorationState | null>(null);
  const [expandingTagNames, setExpandingTagNames] = useState<Set<string>>(new Set());
  const [expansionError, setExpansionError] = useState<string | null>(null);
  const inFlightRef = useRef(new Set<string>());

  useEffect(() => {
    if (!seedData) return;
    setExploration({
      category: seedData.category,
      nodes: seedData.nodes,
      links: seedData.links,
      expandedTagNames: new Set(),
      hasMoreTagNames: new Set(),
    });
    setExpansionError(null);
    inFlightRef.current.clear();
  }, [seedData]);

  const activeExploration = exploration?.category === category ? exploration : null;
  const graphData = useMemo(() => {
    if (!seedData) return undefined;
    return {
      ...seedData,
      nodes: activeExploration?.nodes ?? seedData.nodes,
      links: activeExploration?.links ?? seedData.links,
    };
  }, [seedData, activeExploration]);

  const expandTag = useCallback(async (tagName: string) => {
    if (!seedData || seedData.category !== category || inFlightRef.current.has(tagName) || inFlightRef.current.size > 0) return;
    const current = exploration?.category === category ? exploration : {
      category,
      nodes: seedData.nodes,
      links: seedData.links,
      expandedTagNames: new Set<string>(),
      hasMoreTagNames: new Set<string>(),
    };
    if (current.expandedTagNames.has(tagName) && !current.hasMoreTagNames.has(tagName)) return;

    inFlightRef.current.add(tagName);
    setExpandingTagNames((previous) => new Set(previous).add(tagName));
    setExpansionError(null);
    try {
      const excludedNames = current.nodes.map((node) => node.name).sort();
      const expansion = await queryClient.fetchQuery({
        queryKey: ['node-graph-expansion', category, tagName, excludedNames],
        queryFn: () => getGraphNeighbors(category, tagName, excludedNames),
        staleTime: 1000 * 60 * 5,
      });
      const center = current.nodes.find((node) => node.name === tagName);
      const knownIds = new Set(current.nodes.map((node) => node.id));
      const newNodes = expansion.nodes
        .filter((node) => !knownIds.has(node.id))
        .map((node) => ({ ...node, level: (center?.level ?? 2) + 1 }));
      const newIds = new Set(newNodes.map((node) => node.id));
      const newLinks = expansion.links.filter((link) =>
        newIds.has(link.target) && !current.links.some((existing) => existing.source === link.source && existing.target === link.target)
      );

      setExploration((previous) => {
        const state = previous?.category === category ? previous : current;
        return {
          category,
          nodes: [...state.nodes, ...newNodes],
          links: [...state.links, ...newLinks],
          expandedTagNames: new Set(state.expandedTagNames).add(tagName),
          hasMoreTagNames: expansion.hasMore
            ? new Set(state.hasMoreTagNames).add(tagName)
            : new Set([...state.hasMoreTagNames].filter((name) => name !== tagName)),
        };
      });
    } catch {
      setExpansionError(`“${tagName}” 주변 태그를 불러오지 못했습니다. 다시 클릭해 시도할 수 있습니다.`);
    } finally {
      inFlightRef.current.delete(tagName);
      setExpandingTagNames((previous) => {
        const next = new Set(previous);
        next.delete(tagName);
        return next;
      });
    }
  }, [category, exploration, queryClient, seedData]);

  return {
    graphData,
    expandTag,
    expandingTagNames,
    expandedTagNames: activeExploration?.expandedTagNames ?? new Set<string>(),
    hasMoreTagNames: activeExploration?.hasMoreTagNames ?? new Set<string>(),
    expansionError,
  };
}
