import type { ChatResponse, ConnectorItem, Plugin, Settings, StatePayload, Widget } from './types';

async function jpost<T>(url: string, body: unknown): Promise<T> {
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return (await r.json().catch(() => ({}))) as T;
}

async function jget<T>(url: string): Promise<T> {
  const r = await fetch(url);
  return (await r.json()) as T;
}

export interface NewConnector {
  kind: string;
  name: string;
  endpoint: string;
  secretEnvVar?: string;
  configJson?: string;
}

// Le contrat avec le coeur .NET (meme origine que la page : /api/...).
export const api = {
  // Chat + IHM
  chat: (input: string) => jpost<ChatResponse>('/api/chat', { input }),
  state: () => jget<StatePayload>('/api/state'),
  ihm: () => jget<Widget[]>('/api/ihm'),
  refresh: (id: string) => jpost<ChatResponse>(`/api/ihm/${id}/refresh`, {}),
  removeWidget: (id: string) => fetch(`/api/ihm/${id}`, { method: 'DELETE' }),
  approval: (id: string, approved: boolean) => jpost<unknown>('/api/approval', { id, approved }),
  mode: (mode: string) => jpost<{ mode: string }>('/api/mode', { mode }),

  // Plugins (permissions deny par defaut, reglables)
  plugins: () => jget<Plugin[]>('/api/plugins'),
  togglePlugin: (pluginId: string, capId: string, granted: boolean) =>
    jpost<{ granted: boolean }>(`/api/plugins/${pluginId}/cap/${capId}/toggle`, { granted }),

  // Connecteurs declares
  connectors: () => jget<ConnectorItem[]>('/api/connectors'),
  addConnector: (c: NewConnector) => jpost<unknown>('/api/connectors', c),
  toggleConnector: (id: string, enabled: boolean) => jpost<unknown>(`/api/connectors/${id}/toggle`, { granted: enabled }),
  removeConnector: (id: string) => fetch(`/api/connectors/${id}`, { method: 'DELETE' }),
  testConnector: (id: string) => jpost<{ ok: boolean; detail: string }>(`/api/connectors/${id}/test`, {}),

  // Reglages
  getSettings: () => jget<Settings>('/api/settings'),
  saveSettings: (s: { preferences?: string; theme?: string; skill?: string }) => jpost<unknown>('/api/settings', s),
};
