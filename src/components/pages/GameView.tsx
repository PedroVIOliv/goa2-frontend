import { useParams, useSearchParams } from "react-router-dom";
import { useCallback, useMemo } from "react";
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
  "CHOOSE_RESPAWN_HEX",
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
    submitInput: rawSubmitInput,
    cheatsGold,
  } = useGameSocket(gameId ?? "", token);

  const submitInput = useCallback((value: string | number | Hex | null | { hero_id: string; card_id: string }) => {
    console.log("submitInput called with value:", value);
    rawSubmitInput(value);
  }, [rawSubmitInput]);

  const handleHexClick = useCallback((hex: Hex) => {
    submitInput(hex);
  }, [submitInput]);

  const handleUnitClick = useCallback((unitId: string) => {
    submitInput(unitId);
  }, [submitInput]);

  const handleOptionSelect = useCallback((value: string | number | "SKIP" | null | { hero_id: string; card_id: string }) => {
    console.log("handleOptionSelect called with value:", value);
    submitInput(value);
  }, [submitInput]);

  const handleSkip = useCallback(() => {
    submitInput("SKIP");
  }, [submitInput]);

  const myTeam = useMemo(() => {
    if (!myHeroId || !view) return null;
    for (const [teamColor, team] of Object.entries(view.teams)) {
      if (team.heroes.some(h => h.id === myHeroId)) {
        return teamColor;
      }
    }
    return null;
  }, [view, myHeroId]);

  if (!view) {
    return <div className={styles.loading}>Connecting...</div>;
  }

  const isMyInput = inputRequest?.player_id === myHeroId ||
                   (inputRequest?.player_id?.startsWith('team:') &&
                    inputRequest.player_id === `team:${myTeam}`);
  const isMyUpgradePhase = inputRequest?.type === "UPGRADE_PHASE" &&
                          inputRequest?.players &&
                          myHeroId &&
                          inputRequest.players[myHeroId];
  const needsPicker =
    (isMyInput || isMyUpgradePhase) && inputRequest && !BOARD_INPUT_TYPES.has(inputRequest.type);
  const needsBanner =
    isMyInput && inputRequest && BOARD_INPUT_TYPES.has(inputRequest.type);

  console.log("GameView render:", {
    isMyInput,
    needsPicker,
    inputRequest: inputRequest ? { type: inputRequest.type, prompt: inputRequest.prompt } : null,
    myHeroId
  });

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
            isMyInput={isMyInput}
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
              myHeroId={myHeroId ?? ""}
              onSelect={handleOptionSelect}
            />
          )}
        </div>

        <Sidebar
          view={view}
          myHeroId={myHeroId}
          onCommit={commitCard}
          onPass={passTurn}
          onGiveGold={cheatsGold}
        />
      </div>

      {!connected && (
        <div className={styles.disconnected}>Disconnected — reconnecting...</div>
      )}

      {error && <ErrorToast message={error} />}
    </div>
  );
}
