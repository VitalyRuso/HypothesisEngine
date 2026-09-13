import type { Edge, Node } from "@xyflow/react";
import type {
  ApprovalRequest,
  BrainEvent,
  BrainNodeData,
  HealthSnapshot,
  PluginManifest,
  TaskRun
} from "../types/domain";

const n = (
  id: string,
  label: string,
  kind: string,
  x: number,
  y: number,
  status: BrainNodeData["status"],
  capabilities: string[]
): Node<BrainNodeData> => ({
  id,
  position: { x, y },
  data: {
    label,
    kind,
    status,
    capabilities,
    permissions: ["read", "observe"],
    currentTask: status === "busy" ? "Investigate retrieval regression" : undefined
  },
  type: "brain"
});

export const nodes: Node<BrainNodeData>[] = [
  n("user", "User", "human", 40, 260, "online", ["approve", "direct"]),
  n("telegram", "Telegram", "gateway", 220, 260, "online", ["messages", "voice"]),
  n("brain", "Local Brain", "model", 440, 250, "busy", ["assess", "plan", "route"]),
  n("memory", "Memory", "context", 440, 70, "online", ["retrieve", "store"]),
  n("project", "Project Context", "context", 440, 430, "online", ["git", "files", "state"]),
  n("planner", "Planner", "reasoning", 690, 120, "busy", ["plan", "hypothesize"]),
  n("hyp", "Hypotheses", "reasoning", 690, 320, "busy", ["rank", "reject", "support"]),
  n("router", "Router", "orchestration", 920, 230, "online", ["delegate", "escalate"]),
  n("codex", "Codex Worker", "worker", 1160, 80, "busy", ["code", "test", "git"]),
  n("expert", "Analysis Expert", "model", 1160, 220, "waiting", ["analyze", "critique"]),
  n("tools", "Tools", "capability", 1160, 360, "online", ["filesystem", "web", "shell"]),
  n("verifier", "Verifier", "verification", 920, 470, "busy", ["tests", "evidence"]),
  n("reflection", "Reflection", "reasoning", 690, 500, "waiting", ["learn", "replan"])
];

export const edges: Edge[] = [
  ["user","telegram"],["telegram","brain"],["memory","brain"],["project","brain"],
  ["brain","planner"],["planner","hyp"],["hyp","router"],["router","codex"],
  ["router","expert"],["router","tools"],["codex","verifier"],["expert","verifier"],
  ["tools","verifier"],["verifier","reflection"],["reflection","planner"]
].map(([source,target], i) => ({
  id: `e${i}`,
  source, target,
  animated: ["e1","e4","e5","e6","e7","e10","e13"].includes(`e${i}`),
  style: { strokeWidth: 1.8 }
}));

const now = new Date();
const ts = (offsetSec: number) =>
  new Date(now.getTime() + offsetSec * 1000).toISOString();

export const events: BrainEvent[] = [
  {
    id:"evt1", taskId:"task-184", timestamp:ts(0), type:"task.received",
    nodeId:"brain", title:"Task received",
    rationale:"Investigate retrieval quality regression after latest code change."
  },
  {
    id:"evt2", taskId:"task-184", timestamp:ts(4), type:"context.inspected",
    nodeId:"project", targetNodeId:"brain", title:"Project state inspected",
    rationale:"Latest commit touched retriever.py and retrieval configuration.",
    evidence:[{
      id:"ev1", claim:"Latest change modified retrieval code", state:"VERIFIED",
      source:"git diff", verificationMethod:"repository inspection", timestamp:ts(4)
    }]
  },
  {
    id:"evt3", taskId:"task-184", timestamp:ts(7), type:"hypotheses.created",
    nodeId:"hyp", title:"Three hypotheses created",
    rationale:"Configuration regression, chunking regression, or embedding mismatch."
  },
  {
    id:"evt4", taskId:"task-184", timestamp:ts(11), type:"hypothesis.rejected",
    nodeId:"hyp", targetNodeId:"router", title:"Configuration hypothesis rejected",
    rationale:"Configuration matches the last known-good run.",
    evidence:[{
      id:"ev2", claim:"Config mismatch caused regression", state:"CONFLICTED",
      source:"config comparison", verificationMethod:"exact diff", timestamp:ts(11)
    }]
  },
  {
    id:"evt5", taskId:"task-184", timestamp:ts(16), type:"worker.invoked",
    nodeId:"router", targetNodeId:"codex", title:"Codex worker invoked",
    rationale:"Code-level regression now has the highest information value."
  },
  {
    id:"evt6", taskId:"task-184", timestamp:ts(28), type:"verification.started",
    nodeId:"codex", targetNodeId:"verifier", title:"Patch produced; tests started",
    rationale:"Worker output is not accepted until independent verification passes."
  },
  {
    id:"evt7", taskId:"task-184", timestamp:ts(39), type:"verification.passed",
    nodeId:"verifier", targetNodeId:"reflection", title:"Regression test passed",
    rationale:"Recall@5 restored from 0.67 to 0.84 on the fixed benchmark.",
    evidence:[{
      id:"ev3", claim:"Retrieval quality restored", state:"VERIFIED",
      source:"eval suite #185", verificationMethod:"Recall@5 benchmark", timestamp:ts(39)
    }]
  }
];

export const tasks: TaskRun[] = [
  { id:"task-184", title:"Investigate retrieval regression", status:"RUNNING", duration:"00:41", steps:7, verifier:"PASS" },
  { id:"task-183", title:"Harden hypothesis retry guard", status:"SUCCESS", duration:"02:18", steps:11, verifier:"PASS" },
  { id:"task-182", title:"Inspect failing provider adapter", status:"FAILED", duration:"01:04", steps:8, verifier:"FAIL" }
];

export const approvals: ApprovalRequest[] = [
  {
    id:"approval-7",
    action:"Apply Codex patch to protected branch",
    risk:"HIGH",
    capability:"git.write.protected",
    target:"reasonforge/main",
    reason:"Patch changes verifier routing and requires explicit human approval."
  }
];

export const plugins: PluginManifest[] = [
  { id:"telegram", name:"Telegram", type:"Gateway", health:"online", configured:true, capabilities:["messages","voice"], permissions:["receive","send"] },
  { id:"codex", name:"Codex", type:"Coding Worker", health:"busy", configured:true, capabilities:["code","tests","git"], permissions:["project.write"] },
  { id:"openai", name:"OpenAI Expert", type:"LLM Provider", health:"online", configured:true, capabilities:["analysis","critic"], permissions:["remote.call"] },
  { id:"fs", name:"Filesystem", type:"Tool", health:"online", configured:true, capabilities:["read","list"], permissions:["local.read"] },
  { id:"git", name:"Git", type:"Tool", health:"online", configured:true, capabilities:["status","diff","commit"], permissions:["repo.read"] },
  { id:"tests", name:"Test Runner", type:"Tool", health:"online", configured:true, capabilities:["pytest","evals"], permissions:["process.safe"] },
  { id:"web", name:"Web Search", type:"Tool", health:"online", configured:false, capabilities:["search"], permissions:["network.read"] },
  { id:"http", name:"HTTP API", type:"Capability", health:"offline", configured:false, capabilities:["request"], permissions:[] }
];

export const health: HealthSnapshot = {
  localModel:{ status:"busy", vramUsedGb:12.8, vramTotalGb:16, tokensPerSecond:18.4 },
  codex:"busy",
  analysisExpert:"online",
  memoryRecords:12481,
  toolsHealthy:7,
  toolsTotal:8,
  activeTasks:1,
  pendingApprovals:1,
  failedToday:2,
  evalScore:91.7
};
