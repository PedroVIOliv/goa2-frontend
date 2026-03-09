import { useState, useEffect } from "react";
import { fetchHeroes, createGame } from "../../api/rest";
import type { CreateGameResponse } from "../../types/game";
import styles from "./CreateGame.module.css";

const MAX_HEROES_PER_TEAM = 5;

export function CreateGame() {
  const [heroes, setHeroes] = useState<string[]>([]);
  const [redHeroes, setRedHeroes] = useState<string[]>([]);
  const [blueHeroes, setBlueHeroes] = useState<string[]>([]);
  const [cheatsEnabled, setCheatsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CreateGameResponse | null>(null);
  const [draggedHero, setDraggedHero] = useState<string | null>(null);

  useEffect(() => {
    fetchHeroes()
      .then((h) => setHeroes(h))
      .catch((e) => setError(e.message));
  }, []);

  const handleDragStart = (hero: string) => {
    setDraggedHero(hero);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (team: "red" | "blue") => {
    if (!draggedHero) return;

    const newRedHeroes = redHeroes.filter((h) => h !== draggedHero);
    const newBlueHeroes = blueHeroes.filter((h) => h !== draggedHero);

    if (team === "red") {
      if (newRedHeroes.length < MAX_HEROES_PER_TEAM) {
        setRedHeroes([...newRedHeroes, draggedHero]);
        setBlueHeroes(newBlueHeroes);
      }
    } else {
      if (newBlueHeroes.length < MAX_HEROES_PER_TEAM) {
        setRedHeroes(newRedHeroes);
        setBlueHeroes([...newBlueHeroes, draggedHero]);
      }
    }
    setDraggedHero(null);
  };

  const handleRemoveHero = (hero: string, team: "red" | "blue") => {
    if (team === "red") {
      setRedHeroes(redHeroes.filter((h) => h !== hero));
    } else {
      setBlueHeroes(blueHeroes.filter((h) => h !== hero));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await createGame(redHeroes, blueHeroes, "forgotten_island", cheatsEnabled);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create game");
    } finally {
      setLoading(false);
    }
  };

  const baseUrl = window.location.origin;

  const availableHeroes = heroes.filter(
    (h) => !redHeroes.includes(h) && !blueHeroes.includes(h)
  );

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>Guards of Atlantis II</div>
        </div>

        {!result ? (
          <>
            <div className={styles.gameSetup}>
              <div className={styles.teamSection}>
                <div
                  className={styles.teamBox}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop("red")}
                >
                  <div className={styles.teamHeader}>
                    <span className={styles.teamTitle}>Red Team</span>
                    <span className={styles.teamCount}>
                      {redHeroes.length} / {MAX_HEROES_PER_TEAM}
                    </span>
                  </div>
                  <div className={styles.heroList}>
                    {redHeroes.map((hero) => (
                      <div key={hero} className={styles.heroCard} draggable onDragStart={() => handleDragStart(hero)}>
                        <span className={styles.heroName}>{hero}</span>
                        <button
                          className={styles.removeButton}
                          onClick={() => handleRemoveHero(hero, "red")}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {redHeroes.length === 0 && (
                      <div className={styles.emptySlot}>Drop heroes here</div>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.heroPool}>
                <div className={styles.poolHeader}>Heroes</div>
                <div className={styles.heroGrid}>
                  {availableHeroes.map((hero) => (
                    <div
                      key={hero}
                      className={styles.heroCard}
                      draggable
                      onDragStart={() => handleDragStart(hero)}
                    >
                      <span className={styles.heroName}>{hero}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.teamSection}>
                <div
                  className={styles.teamBox}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop("blue")}
                >
                  <div className={styles.teamHeader}>
                    <span className={styles.teamTitle}>Blue Team</span>
                    <span className={styles.teamCount}>
                      {blueHeroes.length} / {MAX_HEROES_PER_TEAM}
                    </span>
                  </div>
                  <div className={styles.heroList}>
                    {blueHeroes.map((hero) => (
                      <div key={hero} className={styles.heroCard} draggable onDragStart={() => handleDragStart(hero)}>
                        <span className={styles.heroName}>{hero}</span>
                        <button
                          className={styles.removeButton}
                          onClick={() => handleRemoveHero(hero, "blue")}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {blueHeroes.length === 0 && (
                      <div className={styles.emptySlot}>Drop heroes here</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.controls}>
              <div className={styles.field}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={cheatsEnabled}
                    onChange={(e) => setCheatsEnabled(e.target.checked)}
                  />
                  <span>Enable Cheats</span>
                </label>
              </div>

              <button
                className={styles.submit}
                onClick={handleSubmit}
                disabled={loading || redHeroes.length === 0 || blueHeroes.length === 0}
              >
                {loading ? "Creating..." : "Start Game"}
              </button>

              {error && <div className={styles.error}>{error}</div>}
            </div>
          </>
        ) : (
          <div className={styles.result}>
            <div className={styles.resultTitle}>Game Created!</div>

            {result.player_tokens.map((pt) => (
              <div key={pt.hero_id} className={styles.link}>
                <span className={styles.linkLabel}>{pt.hero_id}:</span>
                <a
                  href={`${baseUrl}/game/${result.game_id}?token=${pt.token}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {`${baseUrl}/game/${result.game_id}?token=${pt.token}`}
                </a>
              </div>
            ))}

            <div className={styles.link}>
              <span className={styles.linkLabel}>Spectator:</span>
              <a
                href={`${baseUrl}/game/${result.game_id}?token=${result.spectator_token}`}
                target="_blank"
                rel="noreferrer"
              >
                {`${baseUrl}/game/${result.game_id}?token=${result.spectator_token}`}
              </a>
            </div>

            <button
              className={styles.submit}
              onClick={() => {
                setResult(null);
                setRedHeroes([]);
                setBlueHeroes([]);
              }}
              style={{ marginTop: 16 }}
            >
              Create Another
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
