import type { InputRequest } from "../../types/game";
import styles from "./PromptBanner.module.css";

interface Props {
  inputRequest: InputRequest;
  onSkip?: () => void;
}

export function PromptBanner({ inputRequest, onSkip }: Props) {
  return (
    <div className={styles.banner}>
      {inputRequest.prompt}
      {inputRequest.can_skip && onSkip && (
        <button className={styles.skipBtn} onClick={onSkip}>
          Skip
        </button>
      )}
    </div>
  );
}
