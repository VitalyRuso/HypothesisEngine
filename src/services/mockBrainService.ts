import type { BrainService } from "./brainService";
import { approvals, edges, events, health, nodes, plugins, tasks } from "../data/mock";

export class MockBrainService implements BrainService {
  async getGraph() { return { nodes, edges }; }
  async getEvents() { return events; }
  async getTasks() { return tasks; }
  async getApprovals() { return approvals; }
  async getPlugins() { return plugins; }
  async getHealth() { return health; }

  subscribe(listener: (event: (typeof events)[number]) => void) {
    let i = 0;
    const timer = window.setInterval(() => {
      listener(events[i % events.length]);
      i += 1;
    }, 2400);
    return () => window.clearInterval(timer);
  }
}
