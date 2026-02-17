import type { InputRequest } from "../../types/game";
import styles from "./OptionPicker.module.css";

interface Props {
  inputRequest: InputRequest;
  onSelect: (value: string | number | null) => void;
}

export function OptionPicker({ inputRequest, onSelect }: Props) {
  console.log("OptionPicker render:", { type: inputRequest.type, prompt: inputRequest.prompt });
  const type = inputRequest.type;

  let displayOptions: { id: string; text: string }[] = [];

  if (type === "CHOOSE_ACTION" || type === "SELECT_OPTION") {
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
