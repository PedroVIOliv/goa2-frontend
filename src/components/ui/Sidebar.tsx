import { CardList } from "./CardList";
import { HeroInfo } from "./HeroInfo";
import { CheatPanel } from "./CheatPanel";
import type { GameView, HeroView } from "../../types/game";
import styles from "./Sidebar.module.css";

interface Props {
  view: GameView;
  myHeroId: string | null;
  onCommit: (cardId: string) => void;
  onPass: () => void;
  onGiveGold?: (heroId: string, amount: number) => void;
}

export function Sidebar({ view, myHeroId, onCommit, onPass, onGiveGold }: Props) {
  let myHero: HeroView | null = null;
  const otherHeroes: HeroView[] = [];

  for (const team of Object.values(view.teams)) {
    for (const hero of team.heroes) {
      if (hero.id === myHeroId) {
        myHero = hero;
      } else {
        otherHeroes.push(hero);
      }
    }
  }

  const canCommit = myHero?.current_turn_card === null;

  return (
    <div className={styles.sidebar}>
      {view.cheats_enabled && onGiveGold && (
        <CheatPanel view={view} myHeroId={myHeroId} onGiveGold={onGiveGold} />
      )}
      {myHero && (
        <>
          <HeroInfo hero={myHero} isYou />
          <CardList
            cards={myHero.hand}
            phase={view.phase}
            canCommit={canCommit}
            onCommit={onCommit}
            onPass={onPass}
          />
          {myHero.current_turn_card && (
            <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
              Current card: {myHero.current_turn_card.name}
            </div>
          )}
        </>
      )}
      {otherHeroes.map((hero) => (
        <HeroInfo key={hero.id} hero={hero} />
      ))}
    </div>
  );
}
