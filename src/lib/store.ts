import { create } from 'zustand'
import {
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  applyEdgeChanges,
  applyNodeChanges,
} from 'reactflow'
import { persist } from 'zustand/middleware'

type RFState = {
  nodes: Node[]
  edges: Edge[]
  selectedNode: Node | null
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  setNodes: (nodes: Node[] | ((nodes: Node[]) => Node[])) => void
  setEdges: (edges: Edge[] | ((edges: Edge[]) => Edge[])) => void
  setSelectedNode: (node: Node | null) => void
  updateNodeConfig: (nodeId: string, config: unknown) => void
}

// Create a Zustand store with persistence
export const useWorkflowStore = create<RFState>()(
  persist(
    (set, get) => ({
      nodes: [],
      edges: [],
      selectedNode: null,
      onNodesChange: (changes: NodeChange[]) => {
        set({
          nodes: applyNodeChanges(changes, get().nodes),
        })
      },
      onEdgesChange: (changes: EdgeChange[]) => {
        set({
          edges: applyEdgeChanges(changes, get().edges),
        })
      },
      setNodes: (nodes) => {
        if (typeof nodes === 'function') {
          set({ nodes: nodes(get().nodes) })
        } else {
          set({ nodes })
        }
      },
      setEdges: (edges) => {
        if (typeof edges === 'function') {
          set({ edges: edges(get().edges) })
        } else {
          set({ edges })
        }
      },
      setSelectedNode: (node) => {
        set({ selectedNode: node })
      },
      updateNodeConfig: (nodeId, config) => {
        set({
          nodes: get().nodes.map((node) => {
            if (node.id === nodeId) {
              return {
                ...node,
                data: {
                  ...node.data,
                  config,
                },
              }
            }
            return node
          }),
        })
      },
    }),
    {
      name: 'workflow-storage', // localStorage key
    }
  )
)
