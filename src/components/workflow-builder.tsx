import 'reactflow/dist/style.css'

import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useReactFlow,
} from 'reactflow'
import { useCallback, useRef } from 'react'

import { CustomNode } from './custom-node'
import { NodeConfigModal } from './node-config-modal'
import { NodePalette } from './node-palette'
import { useWorkflowStore } from '../lib/store'

// Register custom node types
const nodeTypes = {
  customNode: CustomNode,
}

export function WorkflowBuilder() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const { project } = useReactFlow()

  // Get state from our Zustand store
  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    selectedNode,
    setSelectedNode,
  } = useWorkflowStore()

  // Handle connecting nodes
  const onConnect = useCallback(
    (params: any) => {
      setEdges((eds) => addEdge(params, eds))
    },
    [setEdges]
  )

  // Handle dropping nodes onto the canvas
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      if (!reactFlowWrapper.current) return

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
      const type = event.dataTransfer.getData('application/reactflow')

      // Check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return
      }

      const nodeData = JSON.parse(type)

      // Get position of drop
      const position = project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      })

      // Create a new node
      const newNode = {
        id: `${nodeData.type}-${Date.now()}`,
        type: 'customNode',
        position,
        data: {
          label: nodeData.label,
          type: nodeData.type,
          icon: nodeData.icon,
          config: {},
        },
      }

      // Add the new node to the workflow
      setNodes((nds) => nds.concat(newNode))
    },
    [project, setNodes]
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  // Handle node click to open config modal
  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: any) => {
      setSelectedNode(node)
    },
    [setSelectedNode]
  )

  return (
    <div className="flex h-[calc(100vh-57px)]">
      <NodePalette />
      <div className="flex-1" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background gap={12} size={1} />
        </ReactFlow>
      </div>
      {selectedNode && <NodeConfigModal />}
    </div>
  )
}
