import { useState, useEffect } from "react";
import { fetchHeroes, createGame } from "../../api/rest";
import type { CreateGameResponse } from "../../types/game";
import styles from "./CreateGame.module.css";

export function CreateGame() {
  const [heroes, setHeroes] = useState<string[]>([]);
  const [redHero, setRedHero] = useState("");
  const [blueHero, setBlueHero] = useState("");
  const [cheatsEnabled, setCheatsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CreateGameResponse | null>(null);

  useEffect(() => {
    fetchHeroes()
      .then((h) => {
        setHeroes(h);
        if (h.length >= 2) {
          setRedHero(h[0]);
          setBlueHero(h[1]);
        }
      })
      .catch((e) => setError(e.message));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await createGame([redHero], [blueHero], "forgotten_island", cheatsEnabled);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create game");
    } finally {
      setLoading(false);
    }
  };

  const baseUrl = window.location.origin;

  return (
    <div className={styles.page}>
      <div className={styles.form}>
        <div className={styles.title}>Guards of Atlantis II</div>

        {!result ? (
          <form onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className={styles.label}>Red Hero</label>
              <select
                className={styles.select}
                value={redHero}
                onChange={(e) => setRedHero(e.target.value)}
              >
                {heroes.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Blue Hero</label>
              <select
                className={styles.select}
                value={blueHero}
                onChange={(e) => setBlueHero(e.target.value)}
              >
                {heroes.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>

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
              type="submit"
              disabled={loading || !redHero || !blueHero}
            >
              {loading ? "Creating..." : "Create Game"}
            </button>

            {error && <div className={styles.error}>{error}</div>}
          </form>
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
              onClick={() => setResult(null)}
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
