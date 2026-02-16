import { TEAM_COLORS } from "../../utils/colors";
import type { HeroView, MinionView } from "../../types/game";

interface Props {
  team: string;
  hero?: HeroView;
  minion?: MinionView;
  isCurrentActor?: boolean;
}

export function UnitToken({ team, hero, minion, isCurrentActor }: Props) {
  const color = TEAM_COLORS[team] || "#888";
  let label = "?";

  if (hero) {
    label = hero.name[0].toUpperCase();
  } else if (minion) {
    switch (minion.type) {
      case "HEAVY": label = "H"; break;
      case "RANGED": label = "r"; break;
      default: label = "m"; break;
    }
  }

  return (
    <g>
      <circle
        r={14}
        fill={color}
        stroke={isCurrentActor ? "#ffd700" : "#000"}
        strokeWidth={isCurrentActor ? 3 : 1.5}
        opacity={0.9}
      />
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fill="#fff"
        fontSize={hero ? 14 : 11}
        fontWeight={hero ? "bold" : "normal"}
      >
        {label}
      </text>
    </g>
  );
}
