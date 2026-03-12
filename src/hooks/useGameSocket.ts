import { useEffect, useRef, useCallback, useState } from "react";
import { GameSocket } from "../api/socket";
import type {
  ServerMessage,
  GameView,
  InputRequest,
  GameEvent,
  Hex,
} from "../types/game";

interface GameState {
  view: GameView | null;
  inputRequest: InputRequest | null;
  lastEvents: GameEvent[];
  error: string | null;
  connected: boolean;
  myHeroId: string | null;
  winner: string | null;
}

export function useGameSocket(gameId: string, token: string) {
  const [state, setState] = useState<GameState>({
    view: null,
    inputRequest: null,
    lastEvents: [],
    error: null,
    connected: false,
    myHeroId: null,
    winner: null,
  });

  const socketRef = useRef<GameSocket | null>(null);
  const errorTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!gameId || !token) return;

    const apiBase = import.meta.env.VITE_API_URL || "";
    let wsBase: string;
    if (apiBase) {
      wsBase = apiBase.replace(/^http/, "ws");
    } else {
      wsBase = "ws://localhost:8000";
    }
    const wsUrl = `${wsBase}/games/${gameId}/ws?token=${token}`;

    const handleMessage = (data: unknown) => {
      const msg = data as ServerMessage;
      console.log("useGameSocket handling message:", msg.type);

      switch (msg.type) {
        case "STATE_UPDATE":
          console.log("STATE_UPDATE received");
          console.log("  new input_request:", msg.input_request);
          console.log("  new view phase:", msg.view.phase);
          console.log("  winner:", msg.winner);
          setState((prev) => ({
            ...prev,
            view: msg.view,
            inputRequest: msg.input_request ?? null,
            myHeroId: prev.myHeroId ?? detectHeroId(msg.view),
            winner: msg.winner ?? null,
          }));
          break;

        case "ACTION_RESULT":
          console.log("ACTION_RESULT received, updating input request");
          setState((prev) => ({
            ...prev,
            lastEvents: msg.events,
            inputRequest: msg.input_request ?? null,
          }));
          break;

        case "ERROR":
          console.log("ERROR received:", msg.detail);
          setState((prev) => ({ ...prev, error: msg.detail }));
          if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
          errorTimerRef.current = window.setTimeout(() => {
            setState((prev) => ({ ...prev, error: null }));
          }, 5000);
          break;
      }
    };

    const handleStatusChange = (connected: boolean) => {
      setState((prev) => ({ ...prev, connected }));
    };

    const socket = new GameSocket(wsUrl, handleMessage, handleStatusChange);
    socketRef.current = socket;
    socket.connect();

    return () => {
      socket.disconnect();
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    };
  }, [gameId, token]);

  const send = useCallback((message: Record<string, unknown>) => {
    socketRef.current?.send(message);
  }, []);

  const commitCard = useCallback(
    (cardId: string) => send({ type: "COMMIT_CARD", card_id: cardId }),
    [send]
  );

  const passTurn = useCallback(
    () => send({ type: "PASS_TURN" }),
    [send]
  );

  const submitInput = useCallback(
    (selection: string | Hex | number | null | { hero_id: string; card_id: string }) =>
      send({ type: "SUBMIT_INPUT", selection }),
    [send]
  );

  const requestView = useCallback(
    () => send({ type: "GET_VIEW" }),
    [send]
  );

  const cheatsGold = useCallback(
    (heroId: string, amount: number) =>
      send({ type: "CHEATS_GOLD", hero_id: heroId, amount }),
    [send]
  );

  return {
    ...state,
    winner: state.winner,
    commitCard,
    passTurn,
    submitInput,
    requestView,
    cheatsGold,
  };
}

/**
 * Detect which hero belongs to this token by checking which hero's
 * deck is an array (own hero sees full deck, others see {count}).
 */
function detectHeroId(view: GameView): string | null {
  for (const team of Object.values(view.teams)) {
    for (const hero of team.heroes) {
      if (Array.isArray(hero.deck)) {
        return hero.id;
      }
    }
  }
  return null;
}
