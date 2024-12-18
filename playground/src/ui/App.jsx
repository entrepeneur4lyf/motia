import React, { useEffect, useState, useMemo } from 'react';
import ReactFlow, {
  Controls,
  Background,
  applyEdgeChanges,
  applyNodeChanges
} from 'reactflow';
import 'reactflow/dist/style.css';
import './styles.css';
import { MotiaUi, useMotiaFlow } from 'motia/ui';
import './motia-ui.js';
import EnhancedNode from './EnhancedNode.jsx';
import { layoutElements } from './utils/layout.js';

export default function EnhancedWorkflowUI() {
  const { nodes: initialNodes, edges: initialEdges, loading, error } = useMotiaFlow();
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const nodeTypes = useMemo(() => {
    return { ...MotiaUi.getNodeTypes(), default: EnhancedNode };
  }, []);

  useEffect(() => {
    // If we have nodes and edges, run them through dagre layout
    if (initialNodes.length > 0 && initialEdges.length > 0) {
      const { nodes: layoutedNodes, edges: layoutedEdges } = layoutElements(initialNodes, initialEdges);
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    } else {
      // If no nodes or edges yet, just set them directly (e.g., while loading)
      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  }, [initialNodes, initialEdges]);

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '100vw', height: '100vh', backgroundColor: '#111827', color: '#fff'
      }}>
        <div style={{ fontSize: '1.5rem' }}>Loading workflow...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '100vw', height: '100vh', backgroundColor: '#111827', color: '#fff'
      }}>
        <div style={{ fontSize: '1.5rem', color: 'red' }}>Error: {error}</div>
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#111827', position: 'relative' }}>
      <div style={{
        position: 'absolute', top: '1rem', left: '1rem', backgroundColor: '#1f2937',
        padding: '1rem', borderRadius: '8px', color: '#fff', zIndex: 10
      }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Workflow Visualization</h1>
        <p style={{ fontSize: '0.875rem', color: '#ccc' }}>Drag nodes to rearrange • Zoom to explore</p>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={(changes) => setNodes((ns) => applyNodeChanges(changes, ns))}
        onEdgesChange={(changes) => setEdges((es) => applyEdgeChanges(changes, es))}
        fitView
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#666', strokeWidth: 2 },
          markerEnd: { type: 'arrowclosed' },
        }}
        style={{ backgroundColor: '#111827' }}
      >
        <Background
          variant="dots"
          gap={20}
          size={1}
          color="#444"
          style={{ backgroundColor: '#111827' }}
        />
        <Controls style={{
          backgroundColor: '#333',
          borderRadius: '4px',
          color: '#fff'
        }}/>
      </ReactFlow>
    </div>
  );
}
