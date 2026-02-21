import { TEAM_COLORS } from "../../utils/colors";
import type { SpawnPointView } from "../../types/game";

interface Props {
  spawnPoint: SpawnPointView;
}

export function SpawnPointMarker({ spawnPoint }: Props) {
  const { team, type, minion_type } = spawnPoint;
  const fillColor = TEAM_COLORS[team] || "#888";
  const size = 10;
  const height = size * Math.sqrt(3) / 2;

  const getSpawnTypeLabel = (spawnType: string, minionType: string | null): string => {
    if (spawnType === "HERO") return "H";
    if (spawnType === "MINION" && minionType) {
      switch (minionType.toUpperCase()) {
        case "HEAVY":
          return "V";
        case "MELEE":
          return "M";
        case "RANGED":
          return "R";
        default:
          return "?";
      }
    }
    return "?";
  };

  const label = getSpawnTypeLabel(type, minion_type);

  return (
    <g>
      <polygon
        points={`0,${-height} ${-size / 2},${height / 2} ${size / 2},${height / 2}`}
        fill={fillColor}
        opacity={0.8}
        stroke="#fff"
        strokeWidth={1.5}
      />
      <text
        x={0}
        y={height / 3}
        textAnchor="middle"
        fill="#fff"
        fontSize={9}
        fontWeight="bold"
        pointerEvents="none"
      >
        {label}
      </text>
    </g>
  );
}
