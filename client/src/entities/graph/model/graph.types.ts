import { CategoryType } from '@/shared/types';

/**
 * GET /api/graph의 직렬화된 노드. 화면 좌표는 포함하지 않는다.
 */
export interface GraphNode {
  id: string;
  name: string;
  level: number;
  usageCount: number;
  parentId: string | null;
}

/**
 * 백엔드 그래프 DTO의 노드 간 연결선 인터페이스
 */
export interface GraphLink {
  source: string;
  target: string;
  coOccurrenceCount: number | null;
  similarity: number | null;
}

/**
 * GET /api/graph 응답 전체 DTO
 */
export interface GraphResponse {
  category: CategoryType;
  rootNode: GraphNode;
  nodes: GraphNode[];
  links: GraphLink[];
  isEmpty: boolean;
}

export interface GraphExpansionResponse {
  category: CategoryType;
  centerTag: string;
  nodes: GraphNode[];
  links: GraphLink[];
  hasMore: boolean;
}
