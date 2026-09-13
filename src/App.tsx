import { useEffect, useMemo, useState } from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  type Node
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Activity,
  BrainCircuit,
  CheckCircle2,
  CircleDot,
  Database,
  GitBranch,
  MemoryStick,
  Pause,
  Play,
  PlugZap,
  ShieldAlert,
  TerminalSquare
} from "lucide-react";
import { MockBrainService } from "./services/mockBrainService";
import type { BrainEvent, BrainNodeData } from "./types/domain";
import { BrainNode } from "./components/BrainNode";
import { Inspector } from "./components/Inspector";
import { TaskFlow } from "./components/TaskFlow";
import { EvidenceInspector } from "./components/EvidenceInspector";

const service = new MockBrainService();

function AppInner() {
  const [nodes, setNodes] = useState<Node<BrainNodeData>[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [events, setEvents] = useState<BrainEvent[]>([]);
  const [selectedNode, setSelectedNode] = useState<BrainNodeData>();
  const [selectedEvent, setSelectedEvent] = useState<BrainEvent>();
  const [paused, setPaused] = useState(false);
  const [liveEvent, setLiveEvent] = useState<BrainEvent>();
  const [activeView, setActiveView] = useState("Brain");

  useEffect(() => {
    service.getGraph().then(g => { setNodes(g.nodes); setEdges(g.edges); });
    service.getEvents().then(setEvents);
  }, []);

  useEffect(() => {
    if (paused) return;
    return service.subscribe(event => {
      setLiveEvent(event);
      setSelectedEvent(event);
      setNodes(prev => prev.map(n => ({
        ...n,
        data: {
          ...n.data,
          lastEvent: n.id === event.nodeId ? event.title : n.data.lastEvent,
          status: n.id === event.nodeId ? "busy" : n.data.status
        }
      })));
      window.setTimeout(() => {
        setNodes(prev => prev.map(n => ({
          ...n,
          data: {
            ...n.data,
            status: n.id === event.nodeId ? "online" : n.data.status
          }
        })));
      }, 1000);
    });
  }, [paused]);

  const nodeTypes = useMemo(() => ({ brain: BrainNode }), []);

  const nav = [
    ["Brain", BrainCircuit],
    ["Tasks", GitBranch],
    ["Memory", MemoryStick],
    ["Plugins", PlugZap],
    ["Health", Activity],
    ["Approvals", ShieldAlert]
  ] as const;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark">RF</div><div><strong>ReasonForge</strong><span>Brain Studio</span></div></div>
        <nav>
          {nav.map(([label, Icon]) => (
            <button key={label} onClick={() => setActiveView(label)} className={activeView === label ? "active" : ""}>
              <Icon size={17}/><span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-foot">
          <div className="connection"><CircleDot size={13}/> Mock backend</div>
          <small>v0.1 local-first</small>
        </div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div>
            <strong>{activeView}</strong>
            <span className="crumb">/ live control plane</span>
          </div>
          <div className="status-strip">
            <span><i className="ok"/> Local Brain</span>
            <span><i className="busy"/> Codex</span>
            <span><i className="ok"/> Expert</span>
            <span>1 active task</span>
            <span className="warning">1 approval</span>
            <button className="icon-button" onClick={() => setPaused(v => !v)}>{paused ? <Play size={15}/> : <Pause size={15}/>}</button>
          </div>
        </header>

        <section className="content">
          <div className="brain-stage">
            <div className="stage-title">
              <div><span>LIVE BRAIN GRAPH</span><small>{liveEvent ? `last: ${liveEvent.title}` : "initializing event stream..."}</small></div>
              <div className="legend"><span><i className="ok"/>online</span><span><i className="busy"/>busy</span><span><i className="error"/>error</span></div>
            </div>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              fitView
              minZoom={0.45}
              maxZoom={1.5}
              onNodeClick={(_, node) => setSelectedNode(node.data)}
            >
              <Background gap={28} size={1} />
              <MiniMap pannable zoomable />
              <Controls />
            </ReactFlow>
          </div>

          <div className="right-stack">
            <Inspector node={selectedNode}/>
            <EvidenceInspector event={selectedEvent}/>
          </div>

          <TaskFlow events={events} activeId={selectedEvent?.id} onSelect={e => {
            setSelectedEvent(e);
            const n = nodes.find(n => n.id === e.nodeId);
            if (n) setSelectedNode(n.data);
          }}/>
        </section>
      </main>
    </div>
  );
}

export default function App() {
  return <ReactFlowProvider><AppInner/></ReactFlowProvider>;
}
