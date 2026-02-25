import { CARD_COLORS } from "../../utils/colors";
import { Tooltip } from "./Tooltip";
import { CardTooltipContent } from "./CardTooltipContent";
import type { CardView } from "../../types/game";
import styles from "./CardPile.module.css";

interface Props {
  label: string;
  cards: (CardView | null)[];
}

export function CardPile({ label, cards: rawCards }: Props) {
  const cards = rawCards.filter((c): c is CardView => c !== null);

  const tooltipContent = (
    <div className={styles.tooltipList}>
      {cards.map((card, i) => (
        <CardTooltipContent key={`${card.id}-${i}`} card={card} />
      ))}
    </div>
  );

  const content = (
    <div className={styles.container}>
      <div className={styles.label}>{label}</div>
      <div className={styles.dots}>
        {cards.map((card, i) => (
          <span
            key={`${card.id}-${i}`}
            className={styles.dot}
            style={{
              backgroundColor: CARD_COLORS[card.color ?? ""] || "#888",
            }}
          />
        ))}
      </div>
    </div>
  );

  if (cards.length > 0) {
    return <Tooltip content={tooltipContent} maxWidth="none">{content}</Tooltip>;
  }

  return content;
}
