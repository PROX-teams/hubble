import type { SimulationLinkDatum, SimulationNodeDatum } from 'd3-force';
import type { GraphLink, GraphNode } from '@/entities/graph/model/graph.types';

/** D3가 변경하는 좌표와 연결 노드를 API 응답에서 분리한다. */
export interface SimulationGraphNode extends GraphNode, SimulationNodeDatum {
  radius: number;
}

export interface SimulationGraphLink extends Omit<GraphLink, 'source' | 'target'>, SimulationLinkDatum<SimulationGraphNode> {
  source: string | SimulationGraphNode;
  target: string | SimulationGraphNode;
}
