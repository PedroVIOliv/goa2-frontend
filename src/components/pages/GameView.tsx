import { useParams, useSearchParams } from "react-router-dom";
import { useGameSocket } from "../../hooks/useGameSocket";
import { HexGrid } from "../board/HexGrid";
import { PhaseBar } from "../ui/PhaseBar";
import { Sidebar } from "../ui/Sidebar";
import { PromptBanner } from "../ui/PromptBanner";
import { OptionPicker } from "../ui/OptionPicker";
import { ErrorToast } from "../ui/ErrorToast";
import type { Hex } from "../../types/game";
import styles from "./GameView.module.css";

const BOARD_INPUT_TYPES = new Set([
  "SELECT_HEX",
  "SELECT_UNIT",
  "SELECT_UNIT_OR_TOKEN",
]);

export function GameView() {
  const { gameId } = useParams<{ gameId: string }>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const {
    view,
    inputRequest,
    error,
    connected,
    myHeroId,
    commitCard,
    passTurn,
    submitInput,
  } = useGameSocket(gameId ?? "", token);

  if (!view) {
    return <div className={styles.loading}>Connecting...</div>;
  }

  const isMyInput = inputRequest?.player_id === myHeroId;
  const needsPicker =
    isMyInput && inputRequest && !BOARD_INPUT_TYPES.has(inputRequest.type);
  const needsBanner =
    isMyInput && inputRequest && BOARD_INPUT_TYPES.has(inputRequest.type);

  const handleHexClick = (hex: Hex) => {
    submitInput(hex);
  };

  const handleUnitClick = (unitId: string) => {
    submitInput(unitId);
  };

  const handleOptionSelect = (value: string | number | null) => {
    submitInput(value);
  };

  const handleSkip = () => {
    submitInput(null);
  };

  return (
    <div className={styles.layout}>
      <PhaseBar view={view} />

      <div className={styles.main}>
        <div className={styles.boardArea}>
          <HexGrid
            view={view}
            inputRequest={isMyInput ? inputRequest : null}
            myHeroId={myHeroId}
            onHexClick={handleHexClick}
            onUnitClick={handleUnitClick}
          />

          {needsBanner && inputRequest && (
            <PromptBanner
              inputRequest={inputRequest}
              onSkip={inputRequest.can_skip ? handleSkip : undefined}
            />
          )}

          {needsPicker && inputRequest && (
            <OptionPicker
              inputRequest={inputRequest}
              onSelect={handleOptionSelect}
            />
          )}
        </div>

        <Sidebar
          view={view}
          myHeroId={myHeroId}
          onCommit={commitCard}
          onPass={passTurn}
        />
      </div>

      {!connected && (
        <div className={styles.disconnected}>Disconnected — reconnecting...</div>
      )}

      {error && <ErrorToast message={error} />}
    </div>
  );
}
