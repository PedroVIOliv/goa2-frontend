// Hex coordinate (cube system: q + r + s = 0)
export interface Hex {
  q: number;
  r: number;
  s: number;
}

// Board
export interface TileView {
  hex: Hex;
  zone_id: string;
  is_terrain: boolean;
  occupant_id: string | null;
  spawn_point: SpawnPointView | null;
}

export interface SpawnPointView {
  location: Hex;
  team: string;
  type: string;
  minion_type: string | null;
}

export interface ZoneView {
  id: string;
  neighbors: string[];
  spawn_points: SpawnPointView[];
}

export interface BoardView {
  tiles: Record<string, TileView>;
  zones: Record<string, ZoneView>;
  entity_locations: Record<string, Hex>;
}

// Units
export interface HeroView {
  id: string;
  name: string;
  title: string;
  team: string;
  level: number;
  gold: number;
  items: Record<string, unknown>;
  hand: CardView[];
  deck: CardView[] | { count: number };
  played_cards: CardView[];
  current_turn_card: CardView | null;
  discard_pile: CardView[];
  ultimate_card: CardView | null;
}

export interface MinionView {
  id: string;
  type: string; // MELEE, RANGED, HEAVY
  team: string;
  value: number;
  is_heavy: boolean;
}

export interface CardView {
  id: string;
  name: string;
  tier: string;
  color: string | null;
  primary_action: string | null;
  primary_action_value: number | null;
  secondary_actions: Record<string, number>;
  effect_id: string | null;
  effect_text: string | null;
  initiative: number;
  state: string;
  is_facedown: boolean;
  is_ranged: boolean;
  range_value: number | null;
  radius_value: number | null;
  item: string | null;
  is_active: boolean;
}

// Teams
export interface TeamView {
  color: string;
  life_counters: number;
  heroes: HeroView[];
  minions: MinionView[];
}

// Effects & Markers
export interface EffectView {
  id: string;
  type: string;
  source_card_id: string;
  duration: string;
  is_active: boolean;
  scope: {
    shape: string;
    range: number;
    origin: Hex | null;
    affects: string;
  };
  stat_type: string | null;
  stat_value: number | null;
}

export interface MarkerView {
  target_id: string;
  value: number;
  source_id: string;
}

// Top-level game view
export interface GameView {
  phase: string;
  round: number;
  turn: number;
  current_actor_id: string | null;
  unresolved_hero_ids: string[];
  active_zone_id: string | null;
  teams: Record<string, TeamView>;
  board: BoardView;
  effects: EffectView[];
  markers: Record<string, MarkerView>;
}

// Input requests
export interface InputOption {
  id: string;
  text: string;
  [key: string]: unknown;
}

export interface UpgradeCardDetail {
  id: string;
  name: string;
  item: string | null;
  [key: string]: unknown;
}

export interface UpgradeOption {
  color: string;
  tier: string;
  pair: [string, string];
  card_details: [UpgradeCardDetail, UpgradeCardDetail];
}

export interface UpgradePlayerData {
  remaining: number;
  options: UpgradeOption[];
}

export interface InputRequest {
  type: string;
  player_id: string;
  prompt: string;
  can_skip?: boolean;
  valid_options?: (string | number | Hex)[];
  valid_hexes?: Hex[];
  options?: (InputOption | string)[];
  player_ids?: string[];
  players?: Record<string, UpgradePlayerData>;
  [key: string]: unknown;
}

// WebSocket messages
export interface StateUpdateMessage {
  type: "STATE_UPDATE";
  view: GameView;
  input_request?: InputRequest;
}

export interface ActionResultMessage {
  type: "ACTION_RESULT";
  result_type: string;
  current_phase: string;
  events: GameEvent[];
  input_request?: InputRequest;
  winner: string | null;
}

export interface ErrorMessage {
  type: "ERROR";
  detail: string;
}

export type ServerMessage =
  | StateUpdateMessage
  | ActionResultMessage
  | ErrorMessage;

export interface GameEvent {
  event_type: string;
  actor_id: string | null;
  target_id: string | null;
  from_hex: Hex | null;
  to_hex: Hex | null;
  metadata: Record<string, unknown>;
}

// REST API
export interface PlayerToken {
  hero_id: string;
  token: string;
}

export interface CreateGameResponse {
  game_id: string;
  player_tokens: PlayerToken[];
  spectator_token: string;
}
