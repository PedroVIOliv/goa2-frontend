export interface ItemConfig {
  key: string;
  icon: string;
  color: string;
  label: string;
}

export const ITEM_ORDER: string[] = [
  'ATTACK',
  'DEFENSE',
  'INITIATIVE',
  'RANGE',
  'MOVEMENT',
  'RADIUS',
];

export const ITEM_CONFIGS: Record<string, ItemConfig> = {
  ATTACK: {
    key: 'ATTACK',
    icon: '⚔️',
    color: '#e57373',
    label: 'Attack',
  },
  DEFENSE: {
    key: 'DEFENSE',
    icon: '🛡️',
    color: '#81c784',
    label: 'Defense',
  },
  INITIATIVE: {
    key: 'INITIATIVE',
    icon: '⚡',
    color: '#81c784',
    label: 'Initiative',
  },
  RANGE: {
    key: 'RANGE',
    icon: '🎯',
    color: '#ffb74d',
    label: 'Range',
  },
  MOVEMENT: {
    key: 'MOVEMENT',
    icon: '🏃',
    color: '#64b5f6',
    label: 'Movement',
  },
  RADIUS: {
    key: 'RADIUS',
    icon: '🌐',
    color: '#ba68c8',
    label: 'Radius',
  },
};

export function getItemsDisplay(items: Record<string, number>): ItemConfig[] {
  const displayItems: ItemConfig[] = [];
  
  for (const itemKey of ITEM_ORDER) {
    const value = items[itemKey];
    if (value && value > 0) {
      displayItems.push(ITEM_CONFIGS[itemKey]);
    }
  }
  
  return displayItems;
}
