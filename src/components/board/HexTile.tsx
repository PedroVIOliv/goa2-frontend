import { hexCorners } from "../../utils/hex";
import { ZONE_COLORS } from "../../utils/colors";
import { UnitToken } from "./UnitToken";
import { SpawnPointMarker } from "./SpawnPointMarker";
import type { Hex, HeroView, MinionView, SpawnPointView } from "../../types/game";

interface Props {
  hex: Hex;
  cx: number;
  cy: number;
  zoneId: string;
  occupantId: string | null;
  hero?: HeroView;
  minion?: MinionView;
  spawnPoint?: SpawnPointView | null;
  isValidTarget: boolean;
  isCurrentActor: boolean;
  onClick?: () => void;
}

export function HexTile({
  cx,
  cy,
  zoneId,
  occupantId,
  hero,
  minion,
  spawnPoint,
  isValidTarget,
  isCurrentActor,
  onClick,
}: Props) {
  const points = hexCorners(0, 0);
  const fillColor = ZONE_COLORS[zoneId] || "#444";
  const team = hero?.team || minion?.team || "";

  return (
    <g
      transform={`translate(${cx}, ${cy})`}
      onClick={isValidTarget ? onClick : undefined}
      style={{ cursor: isValidTarget ? "pointer" : "default" }}
    >
      <polygon
        points={points}
        fill={fillColor}
        stroke={isValidTarget ? "#4caf50" : "#222"}
        strokeWidth={isValidTarget ? 2.5 : 1}
        opacity={0.85}
      />
      {isValidTarget && (
        <polygon
          points={points}
          fill="rgba(76, 175, 80, 0.25)"
          stroke="none"
        />
      )}
      {occupantId && (
        <UnitToken
          team={team}
          hero={hero}
          minion={minion}
          isCurrentActor={isCurrentActor}
        />
      )}
      {spawnPoint && !occupantId && (
        <SpawnPointMarker spawnPoint={spawnPoint} />
      )}
    </g>
  );
}
