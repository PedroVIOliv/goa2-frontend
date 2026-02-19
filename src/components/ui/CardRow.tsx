import { CARD_COLORS } from "../../utils/colors";
import type { CardView } from "../../types/game";
import { Tooltip } from "./Tooltip";
import styles from "./Tooltip.module.css";

interface Props {
  card: CardView;
  isSelected?: boolean;
  onClick?: () => void;
}

export function CardRow({ card, isSelected, onClick }: Props) {
  const colorPip = CARD_COLORS[card.color ?? ""] || "#888";

  const hasTooltip = card.effect_text || Object.keys(card.secondary_actions).length > 0 || card.is_ranged || card.radius_value;

  const getTierClass = () => {
    if (!card.tier) return "";
    return `tier-${card.tier.toLowerCase()}`;
  };

  const formatActionName = (action: string) => {
    const names: Record<string, string> = {
      MOVEMENT: "Movement",
      ATTACK: "Attack",
      DEFENSE: "Defense",
      SKILL: "Skill",
      DEFENSE_SKILL: "Defense Skill",
      HOLD: "Hold",
      CLEAR: "Clear",
      FAST_TRAVEL: "Fast Travel",
    };
    return names[action] || action;
  };

  const getActionClass = (action: string) => {
    return `action-${action.toLowerCase()}`;
  };

  const tooltipContent = (
    <div className={styles.goaTooltip}>
      <div className={styles.goaTooltipHeader}>
        <span className={styles.goaTooltipTitle}>{card.name}</span>
        {card.tier && (
          <span className={`${styles.goaTooltipTier} ${styles[getTierClass()]}`}>
            {card.tier === "I" || card.tier === "II" || card.tier === "III"
              ? `Tier ${card.tier}`
              : card.tier}
          </span>
        )}
      </div>

      {card.effect_text && (
        <div className={styles.goaTooltipEffect}>{card.effect_text}</div>
      )}

      <div className={styles.goaTooltipStats}>
        {card.primary_action && card.primary_action_value && (
          <div className={styles.goaTooltipStat}>
            <span className={styles.goaTooltipStatLabel}>Primary Action:</span>
            <span className={`${styles.goaTooltipStatValue} primary`}>
              {formatActionName(card.primary_action)} {card.primary_action_value}
            </span>
          </div>
        )}

        {card.is_ranged && card.range_value && (
          <div className={styles.goaTooltipStat}>
            <span className={styles.goaTooltipStatLabel}>Range:</span>
            <span className={`${styles.goaTooltipStatValue} range`}>
              {card.range_value} hexes
            </span>
          </div>
        )}

        {card.radius_value && (
          <div className={styles.goaTooltipStat}>
            <span className={styles.goaTooltipStatLabel}>Radius:</span>
            <span className={styles.goaTooltipStatValue}>
              {card.radius_value} hexes
            </span>
          </div>
        )}

        {card.item && (
          <div className={styles.goaTooltipStat}>
            <span className={styles.goaTooltipStatLabel}>Item Bonus:</span>
            <span className={styles.goaTooltipStatValue}>
              {card.item}
            </span>
          </div>
        )}
      </div>

      {Object.keys(card.secondary_actions).length > 0 && (
        <div className={styles.goaTooltipSecondary}>
          {Object.entries(card.secondary_actions).map(([action, value]) => (
            <span
              key={action}
              className={`${styles.goaTooltipSecondaryAction} ${styles[getActionClass(action)]}`}
            >
              {formatActionName(action)}: {value}
            </span>
          ))}
        </div>
      )}
    </div>
  );

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

  if (hasTooltip) {
    return (
      <Tooltip content={tooltipContent}>
        {cardRow}
      </Tooltip>
    );
  }

  return cardRow;
}
