import type { ChatResponse, StatePayload, Widget } from './types';

async function jpost<T>(url: string, body: unknown): Promise<T> {
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return (await r.json()) as T;
}

async function jget<T>(url: string): Promise<T> {
  const r = await fetch(url);
  return (await r.json()) as T;
}

// Le contrat avec le coeur .NET (meme origine que la page : /api/...).
export const api = {
  chat: (input: string) => jpost<ChatResponse>('/api/chat', { input }),
  state: () => jget<StatePayload>('/api/state'),
  ihm: () => jget<Widget[]>('/api/ihm'),
  refresh: (id: string) => jpost<ChatResponse>(`/api/ihm/${id}/refresh`, {}),
  removeWidget: (id: string) => fetch(`/api/ihm/${id}`, { method: 'DELETE' }),
  approval: (id: string, approved: boolean) => jpost<unknown>('/api/approval', { id, approved }),
  mode: (mode: string) => jpost<{ mode: string }>('/api/mode', { mode }),
};
