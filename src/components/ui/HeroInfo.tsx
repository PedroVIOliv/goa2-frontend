import { TEAM_COLORS } from "../../utils/colors";
import type { HeroView } from "../../types/game";
import styles from "./HeroInfo.module.css";

interface Props {
  hero: HeroView;
  isYou?: boolean;
}

export function HeroInfo({ hero, isYou }: Props) {
  const teamColor = TEAM_COLORS[hero.team] || "#888";

  return (
    <div className={styles.container}>
      <div className={styles.name} style={{ color: teamColor }}>
        {hero.name} {isYou && "(You)"}
      </div>
      <div className={styles.details}>
        {hero.title} &middot; Lv {hero.level} &middot; {hero.gold} Gold
      </div>
    </div>
  );
}
