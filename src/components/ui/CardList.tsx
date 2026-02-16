import { useState } from "react";
import { CardRow } from "./CardRow";
import type { CardView } from "../../types/game";
import styles from "./CardList.module.css";

interface Props {
  cards: CardView[];
  phase: string;
  canCommit: boolean;
  onCommit: (cardId: string) => void;
  onPass: () => void;
}

export function CardList({ cards, phase, canCommit, onCommit, onPass }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const isPlanning = phase === "PLANNING";
  const canAct = isPlanning && canCommit;

  return (
    <div>
      <div className={styles.label}>Hand</div>
      <div className={styles.container}>
        {cards.map((card) => (
          <CardRow
            key={card.id}
            card={card}
            isSelected={selectedId === card.id}
            onClick={canAct ? () => setSelectedId(card.id) : undefined}
          />
        ))}
        {cards.length === 0 && (
          <div style={{ color: "var(--text-secondary)", fontSize: 13, padding: 8 }}>
            No cards in hand
          </div>
        )}
      </div>
      {isPlanning && (
        <div className={styles.actions}>
          <button
            className={`${styles.btn} ${styles.confirm}`}
            disabled={!canCommit || !selectedId}
            onClick={() => selectedId && onCommit(selectedId)}
          >
            Commit
          </button>
          <button
            className={`${styles.btn} ${styles.pass}`}
            disabled={!canCommit}
            onClick={onPass}
          >
            Pass
          </button>
        </div>
      )}
    </div>
  );
}
