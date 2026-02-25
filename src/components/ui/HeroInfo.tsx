import { TEAM_COLORS } from "../../utils/colors";
import { getItemsDisplay } from "../../utils/itemIcons";
import { getHandColors, getHandColorDot } from "../../utils/handColors";
import { CardRow } from "./CardRow";
import { CardPile } from "./CardPile";
import type { HeroView } from "../../types/game";
import styles from "./HeroInfo.module.css";

interface Props {
  hero: HeroView;
  isYou?: boolean;
  phase?: string;
}

export function HeroInfo({ hero, isYou }: Props) {
  const teamColor = TEAM_COLORS[hero.team] || "#888";
  const items = getItemsDisplay(hero.items as Record<string, number>);
  const handColors = !isYou ? getHandColors(hero) : [];
  const currentCard = hero.current_turn_card;
  const hasColoredCard = currentCard && currentCard.color;

  return (
    <div className={styles.container}>
      <div className={styles.name}>
        <span style={{ color: teamColor }}>
          {hero.name} {isYou && "(You)"}
        </span>
        {items.length > 0 && (
          <span className={styles.items}>
            {items.map((item) => (
              <span
                key={item.key}
                className={styles.item}
                title={`${item.label}: +${hero.items[item.key] as number}`}
              >
                <img src={item.icon} alt={item.label} className={styles.itemIcon} />
                +{hero.items[item.key] as number}
              </span>
            ))}
          </span>
        )}
      </div>
      <div className={styles.details}>
        {hero.title}
        {!isYou && handColors.length > 0 && (
          <span className={styles.handColors}>
            {handColors.map((color) => (
              <span
                key={color}
                className={styles.handColorDot}
                style={{ backgroundColor: getHandColorDot(color) }}
                title={color}
              />
            ))}
          </span>
        )}
        {!isYou && handColors.length > 0 && " · "}
        Lv {hero.level} &middot; {hero.gold} Gold
      </div>
      <CardPile label="Played" cards={hero.played_cards} />
      <CardPile label="Discard" cards={hero.discard_pile} />
      {hasColoredCard && (
        <div className={styles.currentCard}>
          <div className={styles.currentLabel}>Current:</div>
          <CardRow card={currentCard} />
        </div>
      )}
    </div>
  );
}
