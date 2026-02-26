import { useState, useEffect } from "react";
import { CARD_COLORS } from "../../utils/colors";
import { getCardStatsDisplay } from "../../utils/cardStats";
import { colorizeIcon } from "../../utils/iconColorizer";
import type { CardView } from "../../types/game";
import { Tooltip } from "./Tooltip";
import { CardTooltipContent } from "./CardTooltipContent";
import styles from "./CardRow.module.css";

interface Props {
  card: CardView;
  isSelected?: boolean;
  onClick?: () => void;
}

export function CardRow({ card, isSelected, onClick }: Props) {
  const colorPip = CARD_COLORS[card.color ?? ""] || "#888";
  const isSilver = card.color === "SILVER";
  const stats = getCardStatsDisplay(card);
  const [coloredIcons, setColoredIcons] = useState<Record<string, string>>({});

  useEffect(() => {
    const primaryStat = stats.find((s) => s.isPrimary);
    if (primaryStat && !isSilver) {
      colorizeIcon(primaryStat.icon, colorPip).then((coloredUrl) => {
        setColoredIcons((prev) => prev[primaryStat.key] !== coloredUrl 
          ? { [primaryStat.key]: coloredUrl }
          : prev
        );
      });
    }
  }, [card.color, stats, colorPip, isSilver]);

  const hasTooltip = card.effect_text || Object.keys(card.secondary_actions).length > 0 || card.is_ranged || card.radius_value;

  const tooltipContent = <CardTooltipContent card={card} />;

  const cardRow = (
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
      <div className={styles.stats}>
        {stats.map((stat) => (
          <span
            key={stat.key}
            className={`${styles.stat} ${stat.isPrimary && isSilver ? styles.silverPrimary : ''}`}
            style={stat.isPrimary ? {
              borderColor: colorPip,
            } : undefined}
            title={`${stat.label}: ${stat.value ?? '0'}`}
          >
            <img src={stat.isPrimary && !isSilver ? (coloredIcons[stat.key] || stat.icon) : stat.icon} alt={stat.label} className={styles.statIcon} />
            {stat.value !== undefined && (
              <span style={stat.isPrimary ? { color: colorPip } : undefined}>{stat.value}</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );

  if (hasTooltip) {
    return (
      <Tooltip content={tooltipContent}>
        {cardRow}
      </Tooltip>
    );
  }

  return cardRow;
}
