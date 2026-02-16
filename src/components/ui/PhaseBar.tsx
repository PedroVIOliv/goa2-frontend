import { PHASE_COLORS } from "../../utils/colors";
import type { GameView } from "../../types/game";
import styles from "./PhaseBar.module.css";

interface Props {
  view: GameView;
}

export function PhaseBar({ view }: Props) {
  const redTeam = view.teams["RED"];
  const blueTeam = view.teams["BLUE"];

  return (
    <div className={styles.bar}>
      <div className={styles.info}>
        <span className={`${styles.lives} ${styles.red}`}>
          RED: {redTeam?.life_counters ?? 0}
        </span>
      </div>
      <div className={styles.info}>
        <span>Round {view.round}</span>
        <span
          className={styles.phase}
          style={{ background: PHASE_COLORS[view.phase] || "#333" }}
        >
          {view.phase}
        </span>
        <span>Turn {view.turn}</span>
      </div>
      <div className={styles.info}>
        <span className={`${styles.lives} ${styles.blue}`}>
          BLUE: {blueTeam?.life_counters ?? 0}
        </span>
      </div>
    </div>
  );
}
