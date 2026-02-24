import { TEAM_COLORS } from "../../utils/colors";
import { getItemsDisplay } from "../../utils/itemIcons";
import { getHandColors, getHandColorDot } from "../../utils/handColors";
import type { HeroView } from "../../types/game";
import styles from "./HeroInfo.module.css";

interface Props {
  hero: HeroView;
  isYou?: boolean;
}

export function HeroInfo({ hero, isYou }: Props) {
  const teamColor = TEAM_COLORS[hero.team] || "#888";
  const items = getItemsDisplay(hero.items as Record<string, number>);
  const handColors = !isYou ? getHandColors(hero) : [];

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
                +{hero.items[item.key] as number}{item.icon}
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
    </div>
  );
}
