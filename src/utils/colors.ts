export const ZONE_COLORS: Record<string, string> = {
  RedBase: "var(--zone-red-base)",
  RedBeach: "var(--zone-red-beach)",
  Mid: "var(--zone-mid)",
  BlueBeach: "var(--zone-blue-beach)",
  BlueBase: "var(--zone-blue-base)",
  RedJungle: "var(--zone-jungle)",
  BlueJungle: "var(--zone-jungle)",
};

export const TEAM_COLORS: Record<string, string> = {
  RED: "var(--team-red)",
  BLUE: "var(--team-blue)",
};

export const PHASE_COLORS: Record<string, string> = {
  PLANNING: "var(--phase-planning)",
  REVELATION: "var(--phase-revelation)",
  RESOLUTION: "var(--phase-resolution)",
  CLEANUP: "var(--phase-cleanup)",
  LEVEL_UP: "var(--phase-level-up)",
  GAME_OVER: "var(--phase-game-over)",
};

export const CARD_COLORS: Record<string, string> = {
  GOLD: "var(--card-gold)",
  SILVER: "var(--card-silver)",
  RED: "var(--card-red)",
  BLUE: "var(--card-blue)",
  GREEN: "var(--card-green)",
  PURPLE: "var(--card-purple)",
};

export function getUnitLabel(entityId: string, name?: string): string {
  if (entityId.startsWith("hero_") && name) {
    return name[0].toUpperCase();
  }
  if (entityId.startsWith("minion_")) {
    return "m";
  }
  return "?";
}
