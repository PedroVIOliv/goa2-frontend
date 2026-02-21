import type { CreateGameResponse } from "../types/game";

const API_BASE = "";  // Uses Vite proxy

export async function fetchHeroes(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/heroes`);
  if (!res.ok) throw new Error(`Failed to fetch heroes: ${res.status}`);
  return res.json();
}

export async function createGame(
  redHeroes: string[],
  blueHeroes: string[],
  mapName: string = "forgotten_island",
  cheatsEnabled: boolean = false
): Promise<CreateGameResponse> {
  const res = await fetch(`${API_BASE}/games`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      map_name: mapName,
      red_heroes: redHeroes,
      blue_heroes: blueHeroes,
      cheats_enabled: cheatsEnabled,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(err.detail || `Failed to create game: ${res.status}`);
  }
  return res.json();
}
