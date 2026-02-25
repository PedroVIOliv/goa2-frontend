import { PHASE_COLORS } from "../../utils/colors";
import type { GameView } from "../../types/game";
import styles from "./PhaseBar.module.css";

interface Props {
  view: GameView;
  winner: string | null;
}

export function PhaseBar({ view, winner }: Props) {
  const redTeam = view.teams["RED"];
  const blueTeam = view.teams["BLUE"];
  const isGameOver = view.phase === "GAME_OVER";
  const tieBreakerIcon = view.tie_breaker_team === "RED" ? "/icons/tiebreaker_orange.png" : "/icons/tiebreaker_blue.png";

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
        <img
          src={tieBreakerIcon}
          alt={`Tie breaker: ${view.tie_breaker_team}`}
          className={styles.tieBreaker}
          title={`Tie breaker: ${view.tie_breaker_team}`}
        />
      </div>
      <div className={styles.info}>
        {isGameOver && winner && (
          <span className={`${styles.winner} ${styles[winner.toLowerCase()]}`}>
            {winner} WINS!
          </span>
        )}
        <span className={`${styles.lives} ${styles.blue}`}>
          BLUE: {blueTeam?.life_counters ?? 0}
        </span>
      </div>
    </div>
  );
}
