import { useMemo } from "react";
import type { InputRequest, UpgradeOption, GameView, CardView } from "../../types/game";
import { CARD_COLORS } from "../../utils/colors";
import { Tooltip } from "./Tooltip";
import styles from "./OptionPicker.module.css";
import tooltipStyles from "./Tooltip.module.css";

interface Props {
  inputRequest: InputRequest;
  myHeroId: string;
  view?: GameView;
  onSelect: (value: string | number | null | { hero_id: string; card_id: string }) => void;
}

export function OptionPicker({ inputRequest, myHeroId, view, onSelect }: Props) {
  console.log("OptionPicker render:", { type: inputRequest.type, prompt: inputRequest.prompt });
  const type = inputRequest.type;

  const cardLookup = useMemo(() => {
    if (!view || !myHeroId) return new Map<string, CardView>();
    for (const team of Object.values(view.teams)) {
      const hero = team.heroes.find(h => h.id === myHeroId);
      if (hero) {
        const lookup = new Map<string, CardView>();
        for (const card of hero.hand) {
          lookup.set(card.id, card);
        }
        return lookup;
      }
    }
    return new Map<string, CardView>();
  }, [view, myHeroId]);

  const isUpgradePhase = type === "UPGRADE_PHASE";
  const players = inputRequest.players as Record<string, { remaining: number; options: UpgradeOption[] }> | undefined;
  const myUpgradeData = players?.[myHeroId];

  let displayOptions: { id: string; text: string; defense_value?: number; base_defense?: number }[] = [];

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
  } else if (type === "SELECT_CARD_OR_PASS") {
    const opts = inputRequest.options as Array<{ id: string; text: string; defense_value?: number; base_defense?: number }> | undefined;
    displayOptions = opts ?? [];
  } else if (type === "CHOOSE_ACTION" || type === "SELECT_OPTION") {
    const opts = inputRequest.options ?? [];
    displayOptions = opts.map((opt) =>
      typeof opt === "string"
        ? { id: opt, text: opt }
        : { id: (opt as { id: string }).id, text: (opt as { id: string; text: string }).text }
    );
  } else if (type === "CONFIRM_PASSIVE" || type === "CHOOSE_RESPAWN") {
    const opts = (inputRequest.options as string[]) ?? ["YES", "NO"];
    displayOptions = opts.map((o) => ({ id: o, text: o }));
  } else if (type === "SELECT_CARD") {
    const opts = (inputRequest.valid_options as string[]) ?? [];
    displayOptions = opts.map((o) => ({ id: o, text: o }));
  } else if (type === "SELECT_CARD_OR_PASS") {
    const opts = (inputRequest.options as string[]) ?? [];
    displayOptions = opts.map((o) => ({ id: o, text: o === "PASS" ? "Pass (no defense)" : o }));
  } else if (type === "CHOOSE_ACTOR") {
    const ids = inputRequest.player_ids ?? [];
    displayOptions = ids.map((id) => ({ id, text: id }));
  } else if (type === "SELECT_NUMBER") {
    const nums = inputRequest.valid_options ?? [];
    displayOptions = nums.map((n) => ({ id: String(n), text: String(n) }));
  }

  const handleOptionClick = (opt: { id: string; text: string }) => {
    console.log("Option clicked:", opt);
    onSelect(opt.id);
  };

  const handleCardSelect = (cardId: string) => {
    console.log("Upgrade card selected:", cardId);
    onSelect({ hero_id: myHeroId, card_id: cardId });
  };

  const getTierClass = (tier: string) => {
    if (!tier) return "";
    const tierMap: Record<string, string> = { i: "tierI", ii: "tierIi", iii: "tierIii", iv: "tierIv" };
    return tierMap[tier.toLowerCase()] || `tier${tier}`;
  };

  const formatActionName = (action: string) => {
    const names: Record<string, string> = {
      MOVEMENT: "Movement",
      ATTACK: "Attack",
      DEFENSE: "Defense",
      SKILL: "Skill",
      DEFENSE_SKILL: "Defense Skill",
      HOLD: "Hold",
      CLEAR: "Clear",
      FAST_TRAVEL: "Fast Travel",
    };
    return names[action] || action;
  };

  const getActionClass = (action: string) => {
    const actionMap: Record<string, string> = {
      MOVEMENT: "actionMovement",
      ATTACK: "actionAttack",
      DEFENSE: "actionDefense",
      SKILL: "actionSkill",
      DEFENSE_SKILL: "actionDefenseSkill",
    };
    return actionMap[action] || "";
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
                  {option.card_details.map((card) => {
                    const hasTooltip = card.effect_text || (card.secondary_actions && Object.keys(card.secondary_actions).length > 0) || card.is_ranged || card.radius_value;

                    const tooltipContent = (
                      <div className={tooltipStyles.goaTooltip}>
                        <div className={tooltipStyles.goaTooltipHeader}>
                          <span className={tooltipStyles.goaTooltipTitle}>{card.name}</span>
                          {card.tier && (
                            <span className={`${tooltipStyles.goaTooltipTier} ${tooltipStyles[getTierClass(card.tier)]}`}>
                              {card.tier === "I" || card.tier === "II" || card.tier === "III"
                                ? `Tier ${card.tier}`
                                : card.tier}
                            </span>
                          )}
                        </div>

                        {card.effect_text && (
                          <div className={tooltipStyles.goaTooltipEffect}>{card.effect_text}</div>
                        )}

                        <div className={tooltipStyles.goaTooltipStats}>
                          {card.primary_action && (
                            <div className={tooltipStyles.goaTooltipStat}>
                              <span className={tooltipStyles.goaTooltipStatLabel}>Primary Action:</span>
                              <span className={`${tooltipStyles.goaTooltipStatValue} primary`}>
                                {formatActionName(card.primary_action)}{card.primary_action_value != null && !["HOLD", "CLEAR", "FAST_TRAVEL"].includes(card.primary_action) ? ` ${card.primary_action_value}` : ""}
                              </span>
                            </div>
                          )}

                          {card.is_ranged && card.range_value && (
                            <div className={tooltipStyles.goaTooltipStat}>
                              <span className={tooltipStyles.goaTooltipStatLabel}>Range:</span>
                              <span className={`${tooltipStyles.goaTooltipStatValue} range`}>
                                {card.range_value} hexes
                              </span>
                            </div>
                          )}

                          {card.radius_value && (
                            <div className={tooltipStyles.goaTooltipStat}>
                              <span className={tooltipStyles.goaTooltipStatLabel}>Radius:</span>
                              <span className={tooltipStyles.goaTooltipStatValue}>
                                {card.radius_value} hexes
                              </span>
                            </div>
                          )}

                          {card.item && (
                            <div className={tooltipStyles.goaTooltipStat}>
                              <span className={tooltipStyles.goaTooltipStatLabel}>Item Bonus:</span>
                              <span className={tooltipStyles.goaTooltipStatValue}>
                                {card.item}
                              </span>
                            </div>
                          )}
                        </div>

                        {card.secondary_actions && Object.keys(card.secondary_actions).length > 0 && (
                          <div className={tooltipStyles.goaTooltipSecondary}>
                            {Object.entries(card.secondary_actions).map(([action, value]) => (
                              <span
                                key={action}
                                className={`${tooltipStyles.goaTooltipSecondaryAction} ${tooltipStyles[getActionClass(action)]}`}
                              >
                                {formatActionName(action)}{!["HOLD", "CLEAR", "FAST_TRAVEL"].includes(action) ? `: ${value}` : ""}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );

                    const cardButton = (
                      <button
                        key={card.id}
                        type="button"
                        className={styles.upgradeCard}
                        onClick={() => handleCardSelect(card.id)}
                      >
                        <div className={styles.cardName}>{card.name}</div>
                        {card.item && <div className={styles.cardItem}>{card.item}</div>}
                      </button>
                    );

                    return hasTooltip ? (
                      <Tooltip key={card.id} content={tooltipContent}>
                        {cardButton}
                      </Tooltip>
                    ) : cardButton;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === "SELECT_CARD_OR_PASS") {
    return (
      <div className={styles.overlay}>
        <div className={styles.picker}>
          <div className={styles.title}>{inputRequest.prompt}</div>
          {inputRequest.attack_value !== undefined && inputRequest.attack_value !== null && (
            <div className={styles.combatContext}>
              <div className={styles.combatStat}>
                <span className={styles.combatLabel}>Attack:</span>
                <span className={styles.combatValue}>{inputRequest.attack_value}</span>
              </div>
              {inputRequest.minion_modifier !== undefined && inputRequest.minion_modifier !== 0 && (
                <div className={styles.combatStat}>
                  <span className={styles.combatLabel}>Minion bonus:</span>
                  <span className={`${styles.combatValue} ${inputRequest.minion_modifier > 0 ? styles.positive : styles.negative}`}>
                    {inputRequest.minion_modifier > 0 ? '+' : ''}{inputRequest.minion_modifier}
                  </span>
                </div>
              )}
              {inputRequest.defense_needed !== undefined && inputRequest.defense_needed !== null && (
                <div className={styles.combatStat}>
                  <span className={styles.combatLabel}>Defense needed:</span>
                  <span className={styles.combatValue}>{inputRequest.defense_needed}</span>
                </div>
              )}
            </div>
          )}
          <div className={styles.optionsList}>
            {displayOptions.map((opt) => {
              const defenseValue = opt.defense_value;
              const isPass = opt.id === "PASS";
              const canBlock = defenseValue !== undefined && inputRequest.defense_needed !== undefined &&
                              inputRequest.defense_needed !== null &&
                              defenseValue >= inputRequest.defense_needed;
              const card = cardLookup.get(opt.id);
              const cardColor = card?.color ? CARD_COLORS[card.color] : undefined;

              return (
                <button
                  key={opt.id}
                  type="button"
                  className={`${styles.option} ${isPass ? styles.passOption : ""} ${canBlock ? styles.canBlock : styles.cannotBlock}`}
                  onClick={() => handleOptionClick(opt)}
                >
                  <div className={styles.optionMain}>
                    <span className={styles.optionText} style={cardColor ? { color: cardColor } : undefined}>{opt.text}</span>
                    {!isPass && defenseValue !== undefined && (
                      <span className={`${styles.defenseBadge} ${canBlock ? styles.badgeGood : styles.badgeInsufficient}`}>
                        Def: {defenseValue}
                      </span>
                    )}
                  </div>
                  {defenseValue !== undefined && opt.base_defense !== undefined && (
                    <div className={styles.optionSubtext}>
                      Base: {opt.base_defense}
                      {defenseValue > opt.base_defense && ` (+${defenseValue - opt.base_defense})`}
                    </div>
                  )}
                </button>
              );
            })}
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
            onClick={() => onSelect("SKIP")}
          >
            Skip
          </button>
        )}
      </div>
    </div>
  );
}
