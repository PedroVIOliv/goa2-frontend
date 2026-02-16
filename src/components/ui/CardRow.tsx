import { CARD_COLORS } from "../../utils/colors";
import type { CardView } from "../../types/game";

interface Props {
  card: CardView;
  isSelected?: boolean;
  onClick?: () => void;
}

export function CardRow({ card, isSelected, onClick }: Props) {
  const colorPip = CARD_COLORS[card.color ?? ""] || "#888";

  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 10px",
        background: isSelected ? "rgba(76, 175, 80, 0.3)" : "transparent",
        border: isSelected ? "1px solid #4caf50" : "1px solid transparent",
        borderRadius: 4,
        cursor: onClick ? "pointer" : "default",
        fontSize: 13,
      }}
    >
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: colorPip,
          flexShrink: 0,
        }}
      />
      <span style={{ flex: 1, fontWeight: 500 }}>{card.name}</span>
      {card.primary_action && (
        <span style={{ color: "var(--text-secondary)", fontSize: 11 }}>
          {card.primary_action[0]}
          {card.primary_action_value ? `:${card.primary_action_value}` : ""}
        </span>
      )}
      <span style={{ color: "var(--text-secondary)", fontSize: 11 }}>
        I:{card.initiative}
      </span>
    </div>
  );
}
