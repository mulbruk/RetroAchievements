import {
  AchievementSet, Condition, ConditionBuilder,
  define, andNext, orNext, once, measuredIf, resetIf
} from "@cruncheevos/core";

import { cond, prev, not, eq, neq, lt, gte } from "../../common/comparison.js";
import { commaSeparatedList, range } from "../../common/util.js";

import {
  inGame, worldMapLoadProtection, notOnWorldMap,

  // TODO: develop better naming conventions for functions (impossible)
  onStage, onStageMap, isStageID, stageStarted, stageMapActive, inBattle,
  stageWin, currentStageIsComplete, stageClear, winStageTriggered,
  localCitiesControlled, localTemplesControlled, 
  
  endingTransition, justiceEndingTransition, 
    
  characterIsRecruited, characterRecruited,
  
  receivedItem,
  itemWasInInventory, itemWasNotInInventory,
  itemIsInInventory, itemIsNotInInventory,
  hadEquippableItem, didNotHaveEquippableItem,
  haveEquippableItem, doNotHaveEquippableItem,
  itemWasNotEquipped,

  primeStageChallenge, winStage, resetStageChallenge,
  measuredTimedMapControlChallenge, timingRequirement,
  deployedCharactersRestriction,
  bossKillCharacterRequirement, bossKillEquippedItemRequirement,
} from "./accessors.js";
import {
  ADDR, FLAGS, hiddenItemsLookup, stageData, endingData, StageName, CharacterName,
  getCharacterID, getItemID
} from "./data.js";

import { match } from "ts-pattern";

// ---------------------------------------------------------------------------------------------------

function makeAchievements(set: AchievementSet) {
  // Progression -----------------------------------------------
  const progressionAchievements: {
    id: number, points: number, stage: StageName, boss: string, title?: string
  }[] = [
    { id: 475045, points:  1, stage: "Warren's Castle",  boss: "Warren",                      title: `The Beginning`},
    { id: 475046, points:  5, stage: "Charlom Border",   boss: "Usar",                        title: `Rise Up!`},
    { id: 475047, points:  5, stage: "Charlom District", boss: "Gilbald",                     title: `Estrangement`},
    { id: 475048, points: 10, stage: "Slums of Xenobia", boss: "Debonair",                    title: `A Decaying City from Days Long Gone`},
    { id: 475050, points: 10, stage: "Island of Avalon", boss: "Gareth",                      title: `Besting the Black Knight`},
    { id: 475051, points: 10, stage: "Shangrila Temple", boss: "Gareth",                      title: `Fracas in the Floating City`},
    { id: 475052, points: 10, stage: "Fort Alamut",      boss: "Castor and Pollux",           title: `Onward to Xytegenia`},
    { id: 475053, points: 10, stage: "City of Xandu",    boss: "Hikash Vinzalf",              title: `The Beginning of the End`},
    { id: 475057, points: 10, stage: "Xytegenia",        boss: "Empress Endora",              title: `Marching on the Black Queen`},
    { id: 475059, points: 25, stage: "Sharia Temple",    boss: "Gareth, Rashidi, and Diablo", title: `Defying the Dark God`},
  ];

  progressionAchievements.forEach((opts, n) => {
    set.addAchievement({
      title: opts.title ?? `[Needs title] Basic Progression ${n + 1}: ${opts.stage}`,
      id: opts.id, points: opts.points,
      type: 'progression',
      description: `Defeat ${opts.boss} at ${opts.stage}`,
      conditions: {
        core: define(
          onStage(opts.stage),
          stageMapActive(),
          stageWin(opts.stage),
        )
      }
    })
  });

  // Basic stage clear challenges --------------------------------
  const basicChallenges: {id: number, points: number, stage: StageName, days: number, title?: string}[] = [
    { id: 480407, points: 10, stage: `Lake Jansenia`,     days: 2, title: `Howling on a Moonlit Night` },
    { id: 480406, points: 10, stage: `Pogrom Forest`,     days: 2, title: `Spearheading the Charge` },
    { id: 475049, points: 10, stage: `Deneb's Garden`,    days: 2, title: `Shattering the Glass Pumpkin` },
    { id: 483474, points: 10, stage: `Kastolatian Sea`,   days: 2, title: `Mermaid Legend` },
    { id: 483475, points: 10, stage: `Diaspora`,          days: 2, title: `The Crime` },
    { id: 486916, points: 10, stage: `Eizensen District`, days: 2, title: `Dealing with Deneb's Pumpkin` },
    { id: 483476, points: 10, stage: `Valley of Kastro`,  days: 2, title: `Throwing Down Under the Thunder Cloud`},
    { id: 483477, points: 10, stage: `Galvian Peninsula`, days: 2, title: `Showdown on the Snowfield` },
    { id: 483478, points: 10, stage: `Balmorian Ruins`,   days: 2, title: `Wresting Balmoria from the Warlock`},
    { id: 486917, points: 10, stage: `Seujit District`,   days: 2, title: `The Laughing Merchant` },
    { id: 483479, points: 10, stage: `Muspelm`,           days: 2, title: `The Holy Knight` },
    { id: 483480, points: 10, stage: `Organa`,            days: 2, title: `The Sorrow Knight` },
    { id: 486918, points: 10, stage: `Zargan District`,   days: 2, title: `Sealing the Sinner's Fate` },
    { id: 483481, points: 10, stage: `City of Malano`,    days: 2, title: `In Pursuit of the Prince` },
    { id: 483482, points: 10, stage: `Permafrost`,        days: 2, title: `Dark Deeds on a White Night` },
    { id: 483483, points: 10, stage: `Antalya`,           days: 2, title: `The Ancient Seal` },
    { id: 483484, points: 10, stage: `Antanjyl`,          days: 2, title: `The Envoy of Darkness` },
    { id: 488709, points: 10, stage: `Fort Alamut`,       days: 2, title: `Castor and Pollux's Excellent Adventure` },
    { id: 483485, points: 10, stage: `Dalmuhd Desert`,    days: 2, title: `Ninja Assassin` },
    { id: 483486, points: 10, stage: `Ryhan Sea`,         days: 2, title: `Paradise Lost` },
    { id: 483487, points: 10, stage: `Sigurd`,            days: 2, title: `The Dragon Knight` },
    { id: 483488, points: 10, stage: `Fort Shramana`,     days: 2, title: `Farewell to Florent`},
    { id: 483489, points: 10, stage: `Kulyn Temple`,      days: 2, title: `Home of the Holy Grail` },
    { id: 486919, points: 10, stage: `Thanos Sea`,        days: 2, title: `Big Trouble for a Small Gemstone`},
  ];

  const withArticle = (stage: StageName) => `${stageData.find(({name}) => name === stage)!.article}${stage}`;

  const daysLookup = (n: number) => match(n)
    .with(1, () => 'one')
    .with(2, () => 'two')
    .with(3, () => 'three')
    .with(4, () => 'four')
    .with(5, () => 'five')
    .with(6, () => 'six')
    .with(7, () => 'seven')
    .otherwise(() => { throw new Error(`Weird number of days: ${n}`) });

  basicChallenges.forEach((opts) => set.addAchievement({
    title: opts.title ?? `[Needs title] ${opts.stage}`,
    id: opts.id,
    points: opts.points,
    type: 'missable',
    description: `Complete ${withArticle(opts.stage)} within ${daysLookup(opts.days)} days`,
    conditions: {
      core: define(
        primeStageChallenge(opts.stage),
        winStageTriggered(),
        resetStageChallenge(opts.stage),
        resetIf(gte(ADDR.stage_clock_days, opts.days)),
      )
    }
  }));

  // Challenges ------------------------------------------------
  // Tsargem Island ------------
  set.addAchievement({
    title: `The Swiftest Sword Taker`,
    id: 479780,
    points: 10,
    type: 'missable',
    description: `Complete Tsargem Island before dawn on the first day while controlling all cities and temples on the map`,
    conditions: measuredTimedMapControlChallenge(
      `Tsargem Island`,
      timingRequirement(1, 4)
    )
  });

  set.addAchievement({
    title: `Comrades in Arms`,
    id: 475063,
    points: 1,
    description: `Recruit Cynos or Arwind`,
    conditions: {
      core: define(
        onStage(`Tsargem Island`),
        stageMapActive()
      ),
      ...range(0, 100).reduce((acc, n) => ({
        ...acc,
        [`alt${n + 1}`]: define(
          eq(prev(ADDR.roster_ids(n)), 0),
          orNext(
            eq(ADDR.roster_ids(n), getCharacterID(`Arwind`)),
            eq(ADDR.roster_ids(n), getCharacterID(`Cynos`))
          )
        )
      }), {})
    }
  });

  set.addAchievement({
    title: `Tsargem Soloist`,
    id: 479781,
    points: 2,
    description: `Receive one of the Tsargem Island scenario's alternate endings by completing the stage either with your companion not recruited or with your companion dead`,
    conditions: {
      core: define(
        onStage(`Tsargem Island`),
        eq(ADDR.roster_current_hp(1), 0),
        winStage()
      )
    }
  });
  
  // Warren's Castle -----------
  set.addAchievement({
    title: `Expert Tutorialist`,
    id: 477957,
    points: 5,
    type: 'missable',
    description: `Complete Warren's Castle before dawn on the first day, having also found both buried treasures on the map`,
    conditions: measuredTimedMapControlChallenge(
      `Warren's Castle`,
      timingRequirement(1, 6),
      {controlType: 'BuriedTreasures'}
    )
  });

  // Charlom Border ------------
  set.addAchievement({
    title: `Usurping Usar's Domain`,
    id: 477958,
    points: 10,
    type: 'missable',
    description: `Complete the Charlom Border before midnight on the first day while controlling all cities and temples on the map`,
    conditions: {
      core: define(
        primeStageChallenge(`Charlom Border`),
        andNext(
          localCitiesControlled(`Charlom Border`),
          localTemplesControlled(`Charlom Border`)
        ),
        winStageTriggered(),
        resetStageChallenge(`Charlom Border`),
        resetIf(
          andNext(
            eq( ADDR.stage_clock_days,   0),
            gte(ADDR.stage_clock_hours,  0),
            lt( ADDR.stage_clock_hours, 12),
          )
        ),
        resetIf(gte(ADDR.stage_clock_days, 1)),
      )
    }
  });

  // Charlom District ----------
  set.addAchievement({
    title: `Estranged No Longer`,
    id: 481148,
    points: 10,
    type: 'missable',
    description: `Complete the Charlom District before dawn on the first day, having first recruited Canopus and Gilbald`,
    conditions: {
      core: define(
        primeStageChallenge(`Charlom District`),
        characterIsRecruited(`Canopus`).withLast({flag: 'Trigger'}),
        characterIsRecruited(`Gilbald`).withLast({flag: 'Trigger'}),
        winStageTriggered(),
        resetStageChallenge(`Charlom District`),
        resetIf(
          andNext(
            eq( ADDR.stage_clock_days,   0),
            gte(ADDR.stage_clock_hours,  6),
            lt( ADDR.stage_clock_hours, 12),
          )
        ),
        resetIf(gte(ADDR.stage_clock_days, 1)),
      )
    }
  });

  // Lake Jansenia -------------
  set.addAchievement({
    title: `Bark at the Moon`,
    id: 480408,
    points: 3,
    type: 'missable',
    description: `While fighting Sirius at Lake Jansenia, have a fighter in your army turned into a werewolf`,
    conditions: {
      core: define(
        onStage(`Lake Jansenia`),
        not(stageClear(`Lake Jansenia`)),
        inBattle(),
        neq(ADDR.in_combat_with(10), 0xFF)
      ),
      ...range(0, 100).reduce((acc, n) => (
        {
          ...acc,
          [`alt${n + 1}`]: define(
            eq(prev(ADDR.roster_werewolf(n)), 0),
            eq(ADDR.roster_werewolf(n), 1),
          )
        }
      ), {})
    }
  });

  // Pogrom Forest -------------

  // Deneb's Garden ------------

  // Slums of Xenobia ----------
  // TODO make sickos mode
  set.addAchievement({
    title: `Deftly Dispatching Debonair`,
    id: 483473,
    points: 10,
    type: 'missable',
    description: `Complete the Slums of Xenobia within one day while controlling all cities and temples on the map, and without using termites to destroy the city walls`,
    conditions: measuredTimedMapControlChallenge(
      `Slums of Xenobia`,
      timingRequirement(1),
      { complications: [resetIf(eq(ADDR.termite_flags(0), 1))] }
    )
  });

  set.addAchievement({
    title: `Budget Beast King`,
    id: 483558,
    points: 3,
    type: 'missable',
    description: `Hire Lyon the Beast King at a discounted rate`,
    conditions: {
      core: define(
        onStage(`Slums of Xenobia`),
        currentStageIsComplete(),
        stageStarted(),
        stageMapActive(),
        characterRecruited('Lyon')
      )
    }
  });

  set.addAchievement({
    title: `Symbol of Succession`,
    id: 483557,
    points: 1,
    description: `Obtain the Key of Destiny, the symbol of succession to the Xenobian throne`,
    conditions: {
      core: define(
        onStage(`Slums of Xenobia`),
        currentStageIsComplete(),
        stageStarted(),
        stageMapActive(),
        receivedItem(`Key of Destiny`)
      )
    }
  });

  // Island of Avalon ----------
  set.addAchievement({
    title: `Island of Avalon Underdogs`,
    id: 477970,
    points: 10,
    type: 'missable',
    description: `Complete the Island of Avalon without having any character above level 10 on the battlefield`,
    conditions: {
      core: define(
        primeStageChallenge(`Island of Avalon`),
        winStageTriggered(),
        resetStageChallenge(`Island of Avalon`),
        deployedCharactersRestriction(ADDR.swz_roster_level, '>', 10)
      )
    }
  });

  set.addAchievement({
    title: 'Toppling the Terror Knight',
    id: 480409,
    points: 5,
    type: 'missable',
    description: 'During the battle at the Island of Avalon, have a unit containing Ayesha deal the final blow to Gareth',
    conditions: bossKillCharacterRequirement(`Island of Avalon`, `Ayesha`)
  });

  // Kastolatian Sea -----------

  // Diaspora ------------------
  set.addAchievement({
    title: 'Battlefield Medicine',
    id: 483559,
    points: 5,
    type: 'missable',
    description: 'During the battle at Diaspora, retrieve a Golden Beehive for Portia',
    conditions: {
      core: define(
        onStage(`Diaspora`),
        not( currentStageIsComplete() ),
        stageStarted(),
        stageMapActive(),
        eq(prev(FLAGS.golden_beehive_quest), 0),
        eq(     FLAGS.golden_beehive_quest,  1)
      )
    }
  });

  // Eizensen District ---------
  set.addAchievement({
    title: 'Naughty Children Must Be Punished',
    id: 486940,
    points: 5,
    type: 'missable',
    description: 'During the battle at the Eizensen District, have a unit containing Deneb deal the final blow to Gob the Mad Halloween',
    conditions: bossKillCharacterRequirement(`Eizensen District`, `Deneb`)
  });

  // Valley of Kastro ----------

  // Galvian Peninsula ---------
  set.addAchievement({
    title: `A Friend's Final Gift`,
    id: 483560,
    points: 5,
    type: 'missable',
    description: `During the battle at the Galvian Peninsula obtain Durandal, the Deva Figaro's blade`,
    conditions: {
      core: define(
        onStage(`Galvian Peninsula`),
        not( currentStageIsComplete() ),
        stageStarted(),
        stageMapActive(),
        receivedItem(`Durandal`)
      )
    }
  });

  // Balmorian Ruins -----------
  set.addAchievement({
    title: 'Rejecting the Reign of Darkness',
    id: 483561,
    points: 5,
    type: 'missable',
    description: 'During the battle at the Balmorian Ruins, have a unit containing Saradin deal the final blow to Albireo',
    conditions: bossKillCharacterRequirement(`Balmorian Ruins`, `Saradin`)
  });

  // Seujit District -----------
  set.addAchievement({
    title: 'Heroic Haggler',
    id: 486928,
    points: 2,
    type: 'missable',
    description: 'Obtain the Demon Drake Horn for the best possible price',
    conditions: {
      core: define(
        onStage(`Seujit District`),
        not( currentStageIsComplete() ),
        stageStarted(),
        stageMapActive(),
        cond('AddSource', prev(ADDR.war_funds_upper), '*', 0x10000),
        cond('AddSource', prev(ADDR.war_funds_lower)),
        cond('SubSource', ADDR.war_funds_upper,       '*', 0x10000),
        cond('SubSource', ADDR.war_funds_lower),
        eq(0, 25000),
        receivedItem(`Demon Drake Horn`)
      )
    }
  });

  set.addAchievement({
    title: `An Army Can't March on an Empty Stomach`,
    id: 486929,
    points: 2,
    type: 'missable',
    description: `Strike a deal with Gospel the Death Dealer`,
    conditions: {
      core: define(
        onStage(`Seujit District`),
        stageStarted(),
        stageMapActive(),
        neq(FLAGS.killed_gospel, 1),
        winStage(),
      )
    }
  })

  set.addAchievement({
    title: `Heirloom Blade`,
    id: 486930,
    points: 5,
    type: 'missable',
    description: `Receive Porthos' Glaive as a reward for saving Eileen`,
    conditions: {
      core: define(
        onStage(`Seujit District`),
        stageStarted(),
        stageMapActive(),
        itemWasNotEquipped(`Porthos' Glaive`),
        receivedItem(`Porthos' Glaive`)
      )
    }
  })

  // Muspelm -------------------
  set.addAchievement({
    title: 'Junk Collector',
    id: 488849,
    points: 2,
    description: 'Obtain a Dream Crown and a Book of the Dead from the residents of Muspelm',
    conditions: {
      core: define(
        onStage(`Muspelm`),
        currentStageIsComplete(),
        stageStarted(),
        stageMapActive(),
        orNext(
          eq(prev(FLAGS.muspelm_crown), 0),
          eq(prev(FLAGS.muspelm_book), 0)
        ),
        andNext(
          eq(FLAGS.muspelm_crown, 1),
          eq(FLAGS.muspelm_book, 1)
        )
      )
    }
  })

  // Organa --------------------
  set.addAchievement({
    title: 'Savvy Seller',
    id: 483562,
    points: 3,
    type: 'missable',
    description: 'Sell the Moon Rose for the best possible price',
    conditions: {
      core: define(
        onStage(`Organa`),
        stageStarted(),
        cond('AddSource', ADDR.war_funds_upper,       '*', 0x10000),
        cond('AddSource', ADDR.war_funds_lower),
        cond('SubSource', prev(ADDR.war_funds_upper), '*', 0x10000),
        cond('SubSource', prev(ADDR.war_funds_lower)),
        eq(0, 100000),
        orNext(
          ...range(0, 63).map((n) => eq(prev(ADDR.inventory_item(n)), getItemID(`Moon Rose`)))
        ),
        andNext(
          ...range(0, 63).map((n) => neq(ADDR.inventory_item(n), getItemID(`Moon Rose`)))
        )
      )
    }
  });

  // Zargan District -----------

  // City of Malano ------------
  set.addAchievement({
    title: 'An Apropos End for Apros',
    id: 483563,
    points: 5,
    type: 'missable',
    description: 'During the battle at the City of Malano, have a unit contaning Rauny deal the final blow to Baron Apros',
    conditions: bossKillCharacterRequirement(`City of Malano`, `Rauny`)
  });

  // Permafrost ----------------
  set.addAchievement({
    title: `Sorrowful Sororicide`,
    id: 483564,
    points: 5,
    type: 'missable',
    description: 'During the battle at the Permafrost, have a unit containing Yushis deal the final blow to Mizar',
    conditions: bossKillCharacterRequirement(`Permafrost`, `Yushis`)
  });

  // Antalya -------------------

  // Antanjyl ------------------

  // Shangrila Temple ----------
  set.addAchievement({
    title: `Friend to Fellana's Faithful`,
    id: 486932,
    points: 10,
    type: 'missable',
    description: `Complete Shangrila Temple without killing any of the clerics or angels being used as human shields`,
    conditions: {
      core: define(
        primeStageChallenge(`Shangrila Temple`),
        winStageTriggered(),
        resetStageChallenge(`Shangrila Temple`),
        ...range(0, 60).map((n) => define(
          cond('OrNext',  ADDR.deployed_enemies_class(n),    '=',  getCharacterID('Cleric')),
          cond('AndNext', ADDR.deployed_enemies_class(n),    '=',  getCharacterID('Throne')),
          cond('AndNext', prev(ADDR.deployed_enemies_hp(n)), '!=', 0),
          cond('ResetIf', ADDR.deployed_enemies_hp(n),       '=',  0),
        ))
      )
    }
  });

  set.addAchievement({
    title: `Express Delivery`,
    id: 486933,
    points: 2,
    type: 'missable',
    description: `Receive a thoughtful gift from Iuria during the battle at Shangrila Temple`,
    conditions: {
      core: define(
        onStage(`Shangrila Temple`),
        stageStarted(),
        stageMapActive(),
        eq(prev(FLAGS.shangrila_iuria_item), 0),
        eq(FLAGS.shangrila_iuria_item, 1)
      )
    }
  });

  // Fort Alamut ---------------
  set.addAchievement({
    title: 'Whoa, Epic Fetch Quest!',
    id: 488850,
    points: 5,
    type: 'missable',
    description: 'Obtain The Saga, a book full of stories about numerous kings from many lands',
    conditions: {
      core: define(
        onStage(`Fort Alamut`),
        stageStarted(),
        stageMapActive(),
        receivedItem(`The Saga`)
      )
    }
  });

  // Dalmuhd Desert ------------

  // Ryhan Sea -----------------

  // Sigurd --------------------
  set.addAchievement({
    title: `Untrustworthy Trader`,
    id: 486934,
    points: 3,
    type: 'missable',
    description: `After accepting Toad's comission to fetch him the Dragon's Gem, find another interested party to trade it to instead`,
    conditions: {
      core: define(
        onStage(`Sigurd`),
        stageStarted(),
        stageMapActive(),
        eq(FLAGS.sigurd_toad_request, 1),
        eq(FLAGS.sigurd_received_gem, 1),
        eq(FLAGS.sigurd_sold_gem, 0),
        eq(prev(FLAGS.sigurd_traded_gem), 0),
        eq(FLAGS.sigurd_traded_gem, 1)
      )
    }
  });

  // Fort Shramana -------------

  // Kulyn Temple --------------

  // Thanos Sea ----------------
  set.addAchievement({
    title: `Helping History Repeat Itself`,
    id: 486935,
    points: 5,
    type: 'missable',
    description: `During the battle at the Thanos Sea, have a unit containing a character equipped with Porthos' Glaive land the final blow on Delmard`,
    conditions: bossKillEquippedItemRequirement(`Thanos Sea`, `Porthos' Glaive`)
  });

  set.addAchievement({
    title: `Ruchenbein's Reward`,
    id: 486931,
    points: 3,
    description: `Receive a reward for rescuing Ruchenbein I from Delmard's castle`,
    conditions: {
      core: define(
        onStage(`Thanos Sea`),
        stageStarted(),
        stageMapActive(),
        eq(prev(FLAGS.ruchenbein_reward), 0),
        eq(FLAGS.ruchenbein_reward, 1)
      )
    }
  });

  // City of Xandu -------------
  set.addAchievement({
    title: `From Liberators to Conquerors`,
    id: 486939,
    points: 10,
    type: 'missable',
    description: `Complete the City of Xandu within one day without experiencing any reputation loss`,
    conditions: {
      core: define(
        primeStageChallenge(`City of Xandu`),
        winStageTriggered(),
        resetStageChallenge(`City of Xandu`),
        ...timingRequirement(1)('reset'),
        resetIf(lt(ADDR.chaos_frame, prev(ADDR.chaos_frame)))
      )
    }
  });
  
  set.addAchievement({
    title: 'The Power of a Holy Knight',
    id: 488666,
    points: 5,
    type: 'missable',
    description: 'During the battle at the City of Xandu, have a unit containing Rauny deal the final blow to General Vinzalf',
    conditions: bossKillCharacterRequirement(`City of Xandu`, `Rauny`)
  });

  // Xytegenia -----------------
  set.addAchievement({
    title: `Terror Knight Toppled Tenfold`,
    id: 483565,
    points: 10,
    type: 'missable',
    description: 'Complete Xytegenia within two days, after first confronting Gareth and defeating all of his clones',
    conditions: {
      core: define(
        primeStageChallenge(`Xytegenia`),
        eq(FLAGS.xytegenia_gareth_conversation, 1),
        eq(ADDR.enemy_redeploy_counts(1), 0),
        ...range(0, 10).map((n) =>
          andNext(
            ...range(0, 5).map((i) => eq(ADDR.unit_membership_data(25 + n, i), 0xFF))
          ).withLast(
            {flag: 'OrNext'}
          ).also(neq(ADDR.deployed_enemies_mapping(n), 0x01))
        ),
        winStageTriggered(),
        resetStageChallenge(`Xytegenia`),
        ...timingRequirement(2)('reset')
      )
    }
  });

  set.addAchievement({
    title: `Felled by a Shameless Fool`,
    id: 488660,
    points: 5,
    type: 'missable',
    description: 'During the battle at Xytegenia, have a unit containing Debonair deal the final blow to Empress Endora',
    conditions: bossKillCharacterRequirement(`Xytegenia`, `Debonair`)
  });

  // Sharia Temple -------------
  set.addAchievement({
    title: `Racing to Rout Rashidi`,
    id: 486938,
    points: 25,
    type: 'missable',
    description: `Complete Sharia Temple within two days while controlling all cities and temples on the map, and without ever deploying a Princess or a Lich to the battlefield`,
    conditions: measuredTimedMapControlChallenge(
      `Sharia Temple`,
      timingRequirement(2),
      {
        complications: [
          deployedCharactersRestriction(ADDR.swz_roster_class, '=', getCharacterID(`Lich`)),
          deployedCharactersRestriction(ADDR.swz_roster_class, '=', getCharacterID(`Princess`))
        ]
      }
    )
  });

  set.addAchievement({
    title: `Cardless Conquest`,
    id: 486936,
    points: 5,
    description: `During the battle at Sharia Temple, do not use any tarot cards while fighting Gareth, Rashidi, and Diablo`,
    conditions: {
      core: define(
        stageStarted(),
        once(
          andNext(
            eq(ADDR.stage_boss_encountered, 0),
            eq(prev(ADDR.in_combat_with(10)), 0xFF),
            neq(ADDR.in_combat_with(10), 0xFF)
          )
        ),
        winStageTriggered(),
        resetStageChallenge(`Sharia Temple`),
        ...range(0, 14).map((n) => andNext(
          neq(ADDR.in_combat_with(10), 0xFF),
          neq(prev(ADDR.tarot_inventory(n)), 0xFF),
          eq(ADDR.tarot_inventory(n), 0xFF)
        ).withLast({flag: 'ResetIf'}))
      )
    }
  });

  // Dragon's Haven ------------
  set.addAchievement({
    title: `Defending Dragon's Haven`,
    id: 486923,
    points: 10,
    type: 'missable',
    description: `Complete Dragon's Haven within one day while controlling all cities and temples on the map`,
    conditions: measuredTimedMapControlChallenge(
      `Dragon's Haven`,
      timingRequirement(1)
    )
  });

  // Army Management -------------------------------------------
  const unitSets: {
    id: number,
    title: string,
    descriptionBase: string,
    classList: CharacterName[]
  }[] = [
    {
      title: "Promotions Expert: Fighter Classes",
      id: 486941,
      descriptionBase: "In your army have generic characters promoted to the highest rank of each class tree in the Fighter family",
      classList: [ "Paladin", "Black Knight", "Daimyo", "Shinobi", 
                   "Dragon Master", "Enchanter", "Lich" ],
    },
    {
      title: "Promotions Expert: Amazon Classes",
      id: 486942,
      descriptionBase: "In your army have generic characters promoted to the highest rank of each class tree in the Amazon family",
      classList: [ "Freya", "Bishop", "Witch", "Princess" ],
    },
    {
      title: "Promotions Expert: Dragon Classes",
      id: 486937,
      descriptionBase: "In your army have dragons promoted to the highest rank of each class tree",
      classList: [ "Death Bahamut", "Flarebrass", "Zombie Dragon" ],
    }
  ];

  unitSets.forEach((unitSet) => {
    const description = `${unitSet.descriptionBase}: ${commaSeparatedList(unitSet.classList)}`;
    set.addAchievement({
      id: unitSet.id,
      title: unitSet.title,
      points: 10,
      description,
      conditions: {
        core: define(
          inGame(),
          worldMapLoadProtection(),
          ...unitSet.classList.map((className) => orNext(
            ...range(0, 100).map((n) => eq(ADDR.roster_ids(n), getCharacterID(className)))
          ))
        ),
        ...unitSet.classList.reduce((acc, className, n) => ({
          ...acc,
          [`alt${n + 1}`]: define(
            ...range(0, 100).map((n) => neq(prev(ADDR.roster_ids(n)), getCharacterID(className)))
          )
        }), {})
      }
    })
  });

  // Liberation ------------------------------------------------
  const citySets: {id: number, title: string, stages: StageName[]}[] = [
    {
      id: 475054,
      title: "Liberating Xytegenia: Imperial Borderlands",
      stages: [ "Warren's Castle", "Charlom Border", "Charlom District", "Lake Jansenia",
                "Deneb's Garden", "Pogrom Forest", "Slums of Xenobia", "Island of Avalon" ],
    },
    {
      id: 475058,
      title: "Liberating Xytegenia: Advancing Through the Empire",
      stages: [ "Kastolatian Sea", "Diaspora", "Valley of Kastro", "Balmorian Ruins",
                "Galvian Peninsula", "City of Malano", "Permafrost", "Shangrila Temple" ],
    },
    {
      id: 475060,
      title: "Liberating Xytegenia: Heart of the Empire",
      stages: [ "Fort Alamut", "Dalmuhd Desert", "Fort Shramana", "Ryhan Sea",
                "Kulyn Temple", "City of Xandu", "Xytegenia", "Sharia Temple" ],
    },
    {
      id: 475061,
      title: "Liberating Xytegenia: Off the Beaten Path",
      stages: [ "Eizensen District", "Seujit District", "Muspelm", "Organa",
                "Zargan District", "Sigurd", "Antanjyl", "Thanos Sea" ],
    },
  ];

  citySets.forEach((citySet) => {
    const totalCities = citySet.stages.reduce((acc, stageName) =>
      acc + (stageData.find(({name}) => name === stageName)?.cities ?? 0),
      0
    );

    const altGroupConditions: ConditionBuilder[] = new Array();
    citySet.stages.forEach((stageName) => {
      const local  = citySet.stages.filter((name) => name === stageName);
      const global = citySet.stages.filter((name) => name !== stageName);

      const addresses: Condition.Value[] = new Array();
      local.forEach((name) => {
        const stageDatum = stageData.find(({name: datumName}) => name === datumName)!;
        range(2, 2 + stageDatum.cities).forEach(
          (n) => addresses.push(ADDR.local_cities_liberated(n))
        );
      });
      global.forEach((name) => {
        const stageDatum = stageData.find(({name: datumName}) => name === datumName)!;

        range(2, 2 + stageDatum.cities).forEach(
          (n) => addresses.push(ADDR.global_cities_liberated(stageDatum.id, n))
        );
      });

      altGroupConditions.push(
        define(
          andNext(
            onStageMap(),
            isStageID(stageData.find(({name}) => name === stageName)!.id),
            stageStarted()
          ).withLast({flag: 'MeasuredIf'}),
          define(
            ...addresses.map((addr) => cond('AddSource', prev(addr), '^', 1)),
            eq(0, totalCities - 1)
          ),
          define(
            ...addresses.map((addr) => cond('AddSource', addr, '^', 1)),
            cond('Measured', 0, '=', totalCities)
          ),
        )
      );
    });


    const alts = altGroupConditions.reduce((acc, conditions, n) => (
      {...acc, [`alt${n + 1}`]: conditions}
    ), {});

    const stageNames = citySet.stages.map((stageName, n) => {
      const stageDatum = stageData.find(({name}) => name === stageName)!;

      return (n !== citySet.stages.length - 1) ?
        `${stageDatum.article}${stageDatum.name}` :
        `and ${stageDatum.article}${stageDatum.name}`;
    }).join(', ');

    set.addAchievement({
      title: citySet.title,
      id: citySet.id,
      points: 10,
      description: `Liberate all cities in ${stageNames}`,
      conditions: {
        core: define(
          onStageMap(),
          stageMapActive(),
        ), 
        ...alts,
      }
    });
  });

  // ---------------------------
  const templeSets = [
    {
      id: 475055,
      title: "Defender of the Roshfel Faith",
      stages: stageData.filter(({name}) => 
        name !== "Tsargem Island" && name !== "Dragon's Haven"
      ).map(({name}) => name),
    }
  ];

  templeSets.forEach((templeSet) => {
    const totalTemples = templeSet.stages.reduce((acc, stageName) =>
      acc + (stageData.find(({name}) => name === stageName)?.temples ?? 0),
      0
    );

    const altGroupConditions: ConditionBuilder[] = new Array();
    templeSet.stages.forEach((stageName) => {
      const local  = templeSet.stages.filter((name) => name === stageName);
      const global = templeSet.stages.filter((name) => name !== stageName);

      const addresses: Condition.Value[] = new Array();
      local.forEach((name) => {
        const stageDatum = stageData.find(({name: datumName}) => name === datumName)!;

        range(0, stageDatum.temples).forEach(
          (n) => addresses.push(ADDR.local_temples_liberated(n))
        );
      });
      global.forEach((name) => {
        const stageDatum = stageData.find(({name: datumName}) => name === datumName)!;

        range(0, stageDatum.temples).forEach(
          (n) => addresses.push(ADDR.global_temples_liberated(stageDatum.id, n))
        );
      });

      // It is only possible to complete this achievement by liberating temples on the final map, so
      // to avoid trouble with the serialization limit other stages only need to display the measured
      // value, not check deltas to actually trigger
      if (stageName === "Sharia Temple") {
        altGroupConditions.push(
          define(
            andNext(
              onStageMap(),
              isStageID(stageData.find(({name}) => name === stageName)!.id),
              stageStarted()
            ).withLast({flag: 'MeasuredIf'}),
            define(
              ...addresses.map((addr) => cond('AddSource', prev(addr), '^', 1)),
              eq(0, totalTemples - 1)
            ),
            define(
              ...addresses.map((addr) => cond('AddSource', addr, '^', 1)),
              cond('Measured', 0, '=', totalTemples)
            ),
          )
        );
      } else {
        altGroupConditions.push(
          define(
            eq(0, 1), // Ensure it can't pop on stages other than Sharia Temple
            andNext(
              onStageMap(),
              isStageID(stageData.find(({name}) => name === stageName)!.id),
              stageStarted()
            ).withLast({flag: 'MeasuredIf'}),
            define(
              ...addresses.map((addr) => cond('AddSource', addr, '^', 1)),
              cond('Measured', 0, '=', totalTemples)
            ),
          )
        );
      }
    });


    const alts = altGroupConditions.reduce((acc, conditions, n) => (
      {...acc, [`alt${n + 1}`]: conditions}
    ), {});

    set.addAchievement({
      title: templeSet.title,
      id: templeSet.id,
      points: 10,
      description: `Liberate all Roshfel Temples in the Sacred Xytegenian Empire`,
      conditions: {
        core: define(
          onStageMap(),
          stageMapActive(),
        ), 
        ...alts,
      }
    });
  });
  

  // Treasure Hunting ------------------------------------------
  const hiddenItemAchievements: {id: number, stage: StageName}[] = [
    { id: 475009, stage: "Warren's Castle",   },
    { id: 475010, stage: "Charlom Border",    },
    { id: 475011, stage: "Charlom District",  },
    { id: 475012, stage: "Pogrom Forest",     },
    { id: 475013, stage: "Lake Jansenia",     },
    { id: 475014, stage: "Deneb's Garden",    },
    { id: 475015, stage: "Slums of Xenobia",  },
    { id: 475016, stage: "Island of Avalon",  },
    { id: 475017, stage: "Diaspora",          },
    { id: 475018, stage: "Galvian Peninsula", },
    { id: 475019, stage: "Valley of Kastro",  },
    { id: 475020, stage: "Balmorian Ruins",   },
    { id: 475021, stage: "City of Malano",    },
    { id: 475022, stage: "Permafrost",        },
    { id: 475023, stage: "Antalya",           },
    { id: 475024, stage: "Shangrila Temple",  },
    { id: 475025, stage: "Fort Alamut",       },
    { id: 475026, stage: "Dalmuhd Desert",    },
    { id: 475027, stage: "Ryhan Sea",         },
    { id: 475028, stage: "Fort Shramana",     },
    { id: 475029, stage: "Kulyn Temple",      },
    { id: 475030, stage: "City of Xandu",     },
    { id: 475031, stage: "Xytegenia",         },
    { id: 475032, stage: "Sharia Temple",     },
    { id: 475033, stage: "Muspelm",           },
    { id: 475034, stage: "Organa",            },
    { id: 475035, stage: "Sigurd",            },
    { id: 475036, stage: "Antanjyl",          },
    { id: 475037, stage: "Dragon's Haven",    },
    { id: 475038, stage: "Thanos Sea",        },
    { id: 475039, stage: "Seujit District",   },
    { id: 475040, stage: "Zargan District",   },
    { id: 475041, stage: "Eizensen District", },
    { id: 475042, stage: "Tsargem Island",    },
  ];

  hiddenItemAchievements.forEach(({id, stage}) => {
    const {article, name, indices} = hiddenItemsLookup.find(({name}) => name === stage)!;
    if (indices.length > 0) {
      set.addAchievement({
        title: `Treasure Hunter: ${name}`,
        id,
        points: 3,
        description: `Find all buried treasures in ${article}${name}`,
        conditions: {
          core: define(
            measuredIf(
              andNext(onStage(name), stageStarted())
            ),
            define(
              ...indices.map((n) => cond('AddSource', prev(ADDR.local_hidden_objects(n))))
            ).withLast({flag: '', cmp: '=', rvalue: {type: 'Value', value: indices.length - 1}}),
            define(
              ...indices.map((n) => cond('AddSource', ADDR.local_hidden_objects(n)))
            ).withLast({flag: 'Measured', cmp: '=', rvalue: {type: 'Value', value: indices.length}}),
          )
        }
      })
    }
  });

  // Endings ---------------------------------------------------
  endingData.forEach(({id, stageID, finalStage, name, title, points}) => {
    const names = typeof(name) === 'string' ? [name] : name;

    set.addAchievement({
      title,
      points,
      description: `Receive the ${names.join(' or ')} ending`,
      type: (name !== 'Fortune') ? 'win_condition' : undefined,
      conditions: {
        core: define(
          endingTransition(id, stageID, finalStage)
        )
      }
    });
  });

  // Justice ending has own logic
  set.addAchievement({
    title: `The Glow of Glory, or the Joy of Being Soaked in Blood?`,
    id: 479782,
    points: 5,
    description: `Receive the Justice ending`,
    conditions: {
      core: justiceEndingTransition(),
    }
  });

  // Recruitment -----------------------------------------------
  set.addAchievement({
    title: `Fighting Alongisde a Full Party`,
    id: 475056,
    points: 25,
    type: 'missable',
    description: `Recruit all special characters except Galf`,
    conditions: {
      core: define(
        notOnWorldMap(),
        stageMapActive(),
        measuredIf(
          andNext(
            inGame()
          )
        ),
        define(
          ...range(0, 99).map((n) => cond('AddSource', prev(ADDR.roster_ids(n)), '/', 0x63)),
          ...range(0, 99).map((n) => cond('SubSource', prev(ADDR.roster_ids(n)), '/', 0x7D)),
          eq(0, 16),
        ),
        define(
          ...range(0, 99).map((n) => cond('AddSource', ADDR.roster_ids(n), '/', 0x63)),
          ...range(0, 99).map((n) => cond('SubSource', ADDR.roster_ids(n), '/', 0x7D)),
          eq(0, 17),
        ).withLast({flag: 'Measured'})
      )
    }
  });

  // Collection ------------------------------------------------
  set.addAchievement({
    title: `Stones of the Apostles`,
    id: 486907,
    points: 10,
    type: 'missable',
    description: `Collect the Twelve Stones of the Apostles`,
    conditions: {
      core: define(
        notOnWorldMap(),
        stageMapActive(),
        measuredIf(
          andNext(
            inGame()
          )
        ),
        define(
          ...range(0, 63).map((n) => cond('AddSource', prev(ADDR.inventory_item(n)), '/', 0xBC)),
          ...range(0, 63).map((n) => cond('SubSource', prev(ADDR.inventory_item(n)), '/', 0xC8)),
          eq(0, 11),
        ),
        define(
          ...range(0, 63).map((n) => cond('AddSource', ADDR.inventory_item(n), '/', 0xBC)),
          ...range(0, 63).map((n) => cond('SubSource', ADDR.inventory_item(n), '/', 0xC8)),
          eq(0, 12),
        ).withLast({flag: 'Measured'})
      )
    }
  });

  set.addAchievement({
    title: `Divine Relics`,
    id: 486908,
    points: 10,
    type: 'missable',
    description: `Collect the Three Divine Relics: Brunhild, the Mystic Armband, and the Grail`,
    conditions: {
      core: define(
        onStageMap(),
        stageStarted(),
        stageMapActive()
      ),
      // No good way to add these values for a `Measured` display, so fake it with alt groups
      alt1: define(
        eq(0, 1),
        andNext( inGame() ).withLast({flag: 'MeasuredIf'}),
        haveEquippableItem(`Brunhild`).withLast({flag: 'MeasuredIf'}),
        itemIsNotInInventory(`Mystic Armband`).withLast({flag: 'MeasuredIf'}),
        itemIsNotInInventory(`Grail`).withLast({flag: 'MeasuredIf'}),
        cond('AddSource', 1),
        cond('Measured',  0, '=', 3)
      ),
      alt2: define(
        eq(0, 1),
        andNext( inGame() ).withLast({flag: 'MeasuredIf'}),
        doNotHaveEquippableItem(`Brunhild`).withLast({flag: 'MeasuredIf'}),
        itemIsInInventory(`Mystic Armband`).withLast({flag: 'MeasuredIf'}),
        itemIsNotInInventory(`Grail`).withLast({flag: 'MeasuredIf'}),
        cond('AddSource', 1),
        cond('Measured',  0, '=', 3)
      ),
      alt3: define(
        eq(0, 1),
        andNext( inGame() ).withLast({flag: 'MeasuredIf'}),
        doNotHaveEquippableItem(`Brunhild`).withLast({flag: 'MeasuredIf'}),
        itemIsNotInInventory(`Mystic Armband`).withLast({flag: 'MeasuredIf'}),
        itemIsInInventory(`Grail`).withLast({flag: 'MeasuredIf'}),
        cond('AddSource', 1),
        cond('Measured',  0, '=', 3)
      ),
      alt4: define(
        eq(0, 1),
        andNext( inGame() ).withLast({flag: 'MeasuredIf'}),
        haveEquippableItem(`Brunhild`).withLast({flag: 'MeasuredIf'}),
        itemIsInInventory(`Mystic Armband`).withLast({flag: 'MeasuredIf'}),
        itemIsNotInInventory(`Grail`).withLast({flag: 'MeasuredIf'}),
        cond('AddSource', 2),
        cond('Measured',  0, '=', 3)
      ),
      alt5: define(
        eq(0, 1),
        andNext( inGame() ).withLast({flag: 'MeasuredIf'}),
        haveEquippableItem(`Brunhild`).withLast({flag: 'MeasuredIf'}),
        itemIsNotInInventory(`Mystic Armband`).withLast({flag: 'MeasuredIf'}),
        itemIsInInventory(`Grail`).withLast({flag: 'MeasuredIf'}),
        cond('AddSource', 2),
        cond('Measured',  0, '=', 3)
      ),
      alt6: define(
        eq(0, 1),
        andNext( inGame() ).withLast({flag: 'MeasuredIf'}),
        doNotHaveEquippableItem(`Brunhild`).withLast({flag: 'MeasuredIf'}),
        itemIsInInventory(`Mystic Armband`).withLast({flag: 'MeasuredIf'}),
        itemIsInInventory(`Grail`).withLast({flag: 'MeasuredIf'}),
        cond('AddSource', 2),
        cond('Measured',  0, '=', 3)
      ),
      alt7: define(
        isStageID(`Kastolatian Sea`),
        andNext( inGame() ).withLast({flag: 'MeasuredIf'}),
        didNotHaveEquippableItem('Brunhild').withLast({flag: 'MeasuredIf'}),
        haveEquippableItem('Brunhild').withLast({flag: 'MeasuredIf'}),
        itemWasInInventory(`Mystic Armband`).withLast({flag: 'MeasuredIf'}),
        itemIsInInventory(`Mystic Armband`).withLast({flag: 'MeasuredIf'}),
        itemWasInInventory(`Grail`).withLast({flag: 'MeasuredIf'}),
        itemIsInInventory(`Grail`).withLast({flag: 'MeasuredIf'}),
        cond('AddSource', 3),
        cond('Measured',  0, '=', 3)
      ),
      alt8: define(
        isStageID(`Fort Shramana`),
        andNext( inGame() ).withLast({flag: 'MeasuredIf'}),
        hadEquippableItem('Brunhild').withLast({flag: 'MeasuredIf'}),
        haveEquippableItem('Brunhild').withLast({flag: 'MeasuredIf'}),
        itemWasNotInInventory(`Mystic Armband`).withLast({flag: 'MeasuredIf'}),
        itemIsInInventory(`Mystic Armband`).withLast({flag: 'MeasuredIf'}),
        itemWasInInventory(`Grail`).withLast({flag: 'MeasuredIf'}),
        itemIsInInventory(`Grail`).withLast({flag: 'MeasuredIf'}),
        cond('AddSource', 3),
        cond('Measured',  0, '=', 3)
      ),
      alt9: define(
        isStageID(`Kulyn Temple`),
        andNext( inGame() ).withLast({flag: 'MeasuredIf'}),
        hadEquippableItem('Brunhild').withLast({flag: 'MeasuredIf'}),
        haveEquippableItem('Brunhild').withLast({flag: 'MeasuredIf'}),
        itemWasInInventory(`Mystic Armband`).withLast({flag: 'MeasuredIf'}),
        itemIsInInventory(`Mystic Armband`).withLast({flag: 'MeasuredIf'}),
        itemWasNotInInventory(`Grail`).withLast({flag: 'MeasuredIf'}),
        itemIsInInventory(`Grail`).withLast({flag: 'MeasuredIf'}),
        cond('AddSource', 3),
        cond('Measured',  0, '=', 3)
      )
    }  
  });

  set.addAchievement({
    title: `Artifacts of Fellana`,
    id: 486909,
    points: 10,
    type: 'missable',
    description: `Collect the artifacts of the goddess Fellana: the Olden Orb, the Gem of Doun, the Gem of Truth, and the Tablet of Yaru`,
    conditions: {
      core: define(
        onStage(`Shangrila Temple`),
        stageStarted(),
        stageMapActive(),
        receivedItem(`Tablet of Yaru`),
      ),
      // No good way to add these values for a `Measured` display, so fake it with alt groups
      alt1: define(
        eq(1, 1)
      ),
      alt2: define(
        eq(0, 1),
        itemIsInInventory(`Olden Orb`).withLast({flag: 'MeasuredIf'}),
        itemIsNotInInventory(`Gem of Doun`).withLast({flag: 'MeasuredIf'}),
        itemIsNotInInventory(`Gem of Truth`).withLast({flag: 'MeasuredIf'}),
        cond('AddSource', 1),
        cond('Measured',  0, '=', 4)
      ),
      alt3: define(
        eq(0, 1),
        itemIsInInventory(`Gem of Doun`).withLast({flag: 'MeasuredIf'}),
        itemIsNotInInventory(`Olden Orb`).withLast({flag: 'MeasuredIf'}),
        itemIsNotInInventory(`Gem of Truth`).withLast({flag: 'MeasuredIf'}),
        cond('AddSource', 1),
        cond('Measured',  0, '=', 4)
      ),
      alt4: define(
        eq(0, 1),
        itemIsInInventory(`Gem of Truth`).withLast({flag: 'MeasuredIf'}),
        itemIsNotInInventory(`Olden Orb`).withLast({flag: 'MeasuredIf'}),
        itemIsNotInInventory(`Gem of Doun`).withLast({flag: 'MeasuredIf'}),
        cond('AddSource', 1),
        cond('Measured',  0, '=', 4)
      ),
      alt5: define(
        eq(0, 1),
        itemIsInInventory(`Olden Orb`).withLast({flag: 'MeasuredIf'}),
        itemIsInInventory(`Gem of Doun`).withLast({flag: 'MeasuredIf'}),
        itemIsNotInInventory(`Gem of Truth`).withLast({flag: 'MeasuredIf'}),
        cond('AddSource', 2),
        cond('Measured',  0, '=', 4)
      ),
      alt6: define(
        eq(0, 1),
        itemIsInInventory(`Gem of Doun`).withLast({flag: 'MeasuredIf'}),
        itemIsInInventory(`Gem of Truth`).withLast({flag: 'MeasuredIf'}),
        itemIsNotInInventory(`Olden Orb`).withLast({flag: 'MeasuredIf'}),
        cond('AddSource', 2),
        cond('Measured',  0, '=', 4)
      ),
      alt7: define(
        eq(0, 1),
        itemIsInInventory(`Olden Orb`).withLast({flag: 'MeasuredIf'}),
        itemIsInInventory(`Gem of Doun`).withLast({flag: 'MeasuredIf'}),
        itemIsInInventory(`Gem of Truth`).withLast({flag: 'MeasuredIf'}),
        cond('AddSource', 3),
        cond('Measured',  0, '=', 4)
      ),
    }
  });
}

export default makeAchievements;
