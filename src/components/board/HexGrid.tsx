import { useMemo } from "react";
import { hexToPixel, hexKey } from "../../utils/hex";
import { HexTile } from "./HexTile";
import type { GameView, InputRequest, Hex, HeroView, MinionView } from "../../types/game";
import styles from "./HexGrid.module.css";

interface Props {
  view: GameView;
  inputRequest: InputRequest | null;
  myHeroId: string | null;
  onHexClick: (hex: Hex) => void;
  onUnitClick: (unitId: string) => void;
}

export function HexGrid({ view, inputRequest, myHeroId, onHexClick, onUnitClick }: Props) {
  const unitLookup = useMemo(() => {
    const heroes = new Map<string, HeroView>();
    const minions = new Map<string, MinionView>();
    for (const team of Object.values(view.teams)) {
      for (const hero of team.heroes) heroes.set(hero.id, hero);
      for (const minion of team.minions) minions.set(minion.id, minion);
    }
    return { heroes, minions };
  }, [view.teams]);

  const validHexes = useMemo((): Hex[] => {
    if (!inputRequest || inputRequest.player_id !== myHeroId) return [];
    return inputRequest.valid_hexes ?? inputRequest.valid_options?.filter(isHex) as Hex[] ?? [];
  }, [inputRequest, myHeroId]);

  const validUnitIds = useMemo((): string[] => {
    if (!inputRequest || inputRequest.player_id !== myHeroId) return [];
    if (inputRequest.type === "SELECT_UNIT" || inputRequest.type === "SELECT_UNIT_OR_TOKEN") {
      return (inputRequest.valid_options as string[]) ?? [];
    }
    return [];
  }, [inputRequest, myHeroId]);

  const { tiles, viewBox } = useMemo(() => {
    const tileEntries = Object.values(view.board.tiles).filter((t) => !t.is_terrain);
    const positions = tileEntries.map((t) => ({
      tile: t,
      ...hexToPixel(t.hex),
    }));

    if (positions.length === 0) return { tiles: [], viewBox: "0 0 100 100" };

    const xs = positions.map((p) => p.x);
    const ys = positions.map((p) => p.y);
    const pad = 40;
    const minX = Math.min(...xs) - pad;
    const minY = Math.min(...ys) - pad;
    const maxX = Math.max(...xs) + pad;
    const maxY = Math.max(...ys) + pad;

    return {
      tiles: positions,
      viewBox: `${minX} ${minY} ${maxX - minX} ${maxY - minY}`,
    };
  }, [view.board.tiles]);

  return (
    <div className={styles.container}>
      <svg className={styles.svg} viewBox={viewBox}>
        {tiles.map(({ tile, x, y }) => {
          const occupantId = tile.occupant_id;
          const hero = occupantId ? unitLookup.heroes.get(occupantId) : undefined;
          const minion = occupantId ? unitLookup.minions.get(occupantId) : undefined;

          const isValidHex = validHexes.some(
            (h) => h.q === tile.hex.q && h.r === tile.hex.r && h.s === tile.hex.s
          );
          const isValidUnit = occupantId ? validUnitIds.includes(occupantId) : false;
          const isValid = isValidHex || isValidUnit;

          return (
            <HexTile
              key={hexKey(tile.hex)}
              hex={tile.hex}
              cx={x}
              cy={y}
              zoneId={tile.zone_id}
              occupantId={occupantId}
              hero={hero}
              minion={minion}
              isValidTarget={isValid}
              isCurrentActor={occupantId === view.current_actor_id}
              onClick={() => {
                if (isValidUnit && occupantId) {
                  onUnitClick(occupantId);
                } else if (isValidHex) {
                  onHexClick(tile.hex);
                }
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}

function isHex(value: unknown): value is Hex {
  return (
    typeof value === "object" &&
    value !== null &&
    "q" in value &&
    "r" in value &&
    "s" in value
  );
}
