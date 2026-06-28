// Le schema UI neutre (miroir de Archon.Core.Ui), serialise en camelCase par le coeur.
export interface UiKeyValue {
  key: string;
  value: string;
  tone?: string;
}

export interface UiNode {
  type: string;
  text?: string;
  value?: string;
  unit?: string;
  tone?: string;
  items?: UiKeyValue[];
  points?: number[];
}

export interface UiView {
  nodes: UiNode[];
}

// Un widget de l'IHM (miroir de Archon.Core.Ihm.Widget, projete par l'API).
export interface Widget {
  id: string;
  title: string;
  kind: string; // "capability" | "html"
  refreshSec: number;
  capabilityId: string;
  html: string;
}

export interface RegItem {
  name: string;
  version: string;
  online: boolean;
}

export interface JournalItem {
  action: string;
  detail: string;
  allowed: boolean;
}

export interface ApprovalItem {
  id: string;
  title: string;
  detail: string;
}

export interface StatePayload {
  registry: RegItem[];
  journal: JournalItem[];
  approvals: ApprovalItem[];
  mode: string; // "Ask" | "AutoRun"
}

export interface ChatResponse {
  ok: boolean;
  message: string;
  ui?: UiView | null;
}
