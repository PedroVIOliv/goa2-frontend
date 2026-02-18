import type { InputRequest } from "../../types/game";
import { CARD_COLORS } from "../../utils/colors";
import styles from "./OptionPicker.module.css";

interface Props {
  inputRequest: InputRequest;
  myHeroId: string;
  onSelect: (value: string | number | null | { hero_id: string; card_id: string }) => void;
}

export function OptionPicker({ inputRequest, myHeroId, onSelect }: Props) {
  console.log("OptionPicker render:", { type: inputRequest.type, prompt: inputRequest.prompt });
  const type = inputRequest.type;

  const isUpgradePhase = type === "UPGRADE_PHASE";
  const players = inputRequest.players as Record<string, { remaining: number; options: { color: string; tier: string; pair: [string, string]; card_details: [{ id: string; name: string; item: string | null }, { id: string; name: string; item: string | null }] }[] }> | undefined;
  const myUpgradeData = players?.[myHeroId];

  let displayOptions: { id: string; text: string }[] = [];

  if (isUpgradePhase) {
    if (!myUpgradeData) {
      return (
        <div className={styles.overlay}>
          <div className={styles.picker}>
            <div className={styles.title}>{inputRequest.prompt}</div>
            <div className={styles.waiting}>Waiting for other players...</div>
          </div>
        </div>
      );
    }
  } else if (type === "CHOOSE_ACTION" || type === "SELECT_OPTION") {
    const opts = inputRequest.options ?? [];
    displayOptions = opts.map((opt) =>
      typeof opt === "string"
        ? { id: opt, text: opt }
        : { id: (opt as { id: string }).id, text: (opt as { id: string; text: string }).text }
    );
  } else if (type === "CONFIRM_PASSIVE") {
    const opts = (inputRequest.options as string[]) ?? ["YES", "NO"];
    displayOptions = opts.map((o) => ({ id: o, text: o }));
  } else if (type === "SELECT_CARD_OR_PASS") {
    const opts = (inputRequest.options as string[]) ?? [];
    displayOptions = opts.map((o) => ({ id: o, text: o === "PASS" ? "Pass (no defense)" : o }));
  } else if (type === "CHOOSE_ACTOR") {
    const ids = inputRequest.player_ids ?? [];
    displayOptions = ids.map((id) => ({ id, text: id }));
  }

  const handleOptionClick = (opt: { id: string; text: string }) => {
    console.log("Option clicked:", opt);
    onSelect(opt.id);
  };

  const handleCardSelect = (cardId: string) => {
    console.log("Upgrade card selected:", cardId);
    onSelect({ hero_id: myHeroId, card_id: cardId });
  };

  if (isUpgradePhase && myUpgradeData) {
    return (
      <div className={styles.overlay}>
        <div className={styles.picker}>
          <div className={styles.title}>{inputRequest.prompt}</div>
          <div className={styles.remaining}>Upgrades remaining: {myUpgradeData.remaining}</div>
          <div className={styles.upgradeGroups}>
            {myUpgradeData.options.map((option, idx) => (
              <div key={idx} className={styles.upgradeGroup}>
                <div className={styles.upgradeGroupHeader}>
                  <span
                    className={styles.colorPip}
                    style={{ background: CARD_COLORS[option.color] || "#888" }}
                  />
                  <span className={styles.groupInfo}>
                    {option.color} Tier {option.tier}
                  </span>
                </div>
                <div className={styles.cardPair}>
                  {option.card_details.map((card) => (
                    <button
                      key={card.id}
                      type="button"
                      className={styles.upgradeCard}
                      onClick={() => handleCardSelect(card.id)}
                    >
                      <div className={styles.cardName}>{card.name}</div>
                      {card.item && <div className={styles.cardItem}>{card.item}</div>}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.picker}>
        <div className={styles.title}>{inputRequest.prompt}</div>
        {displayOptions.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={styles.option}
            onClick={() => handleOptionClick(opt)}
          >
            {opt.text}
          </button>
        ))}
        {inputRequest.can_skip && (
          <button
            type="button"
            className={`${styles.option} ${styles.skip}`}
            onClick={() => onSelect(null)}
          >
            Skip
          </button>
        )}
      </div>
    </div>
  );
}
