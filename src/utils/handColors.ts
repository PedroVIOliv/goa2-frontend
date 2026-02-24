import { CARD_COLORS } from "./colors";
import type { HeroView } from "../types/game";

const BASE_HAND_COLORS = ['SILVER', 'GOLD', 'RED', 'BLUE', 'GREEN'];

export function getHandColors(hero: HeroView): string[] {
  const usedColors = new Set<string>();
  
  hero.discard_pile
    .filter(card => card.color)
    .forEach(card => usedColors.add(card.color!));
  
  hero.played_cards
    .filter(card => card.color)
    .forEach(card => usedColors.add(card.color!));
  
  if (hero.current_turn_card?.color) {
    usedColors.add(hero.current_turn_card.color);
  }
  
  return BASE_HAND_COLORS.filter(color => !usedColors.has(color));
}

export function getHandColorDot(color: string): string {
  return CARD_COLORS[color] || '#888';
}
