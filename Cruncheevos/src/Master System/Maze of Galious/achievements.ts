import { AchievementSet, Condition, define, andNext, orNext, trigger, measuredIf, once, resetIf } from "@cruncheevos/core";
import { eq, neq, gt, gte, lt, lte, prev, cond } from "../../common/comparison.js";
import { ADDR, GameState, WorldNumber } from "./data.js";
import { byte, word } from "../../common/value.js";
import { range } from "../../common/util.js";

// ---------------------------------------------------------------------------------------------------

const pickupItems: {
  address: number, mapID: number, screenID: number,
  points: number, title: string,
  name: string, flavourText: string,
  id: number,
  commentary?: string,
}[] = [
  {
    address: 0x70, mapID: 0x01, screenID: 0x79, name: 'Arrow',
    points: 1, title: `Arrow`,
    id: 554828,
    flavourText: `Arrow`,
  },
  {
    address: 0x71, mapID: 0x01, screenID: 0x47, name: 'Ceramic Arrow',
    points: 2, title: `Armor Piercing Rounds`,
    id: 554829,
    flavourText: `Made of ceramic and will shoot through an enemy.`,
  },
  {
    address: 0x72, mapID: 0x01, screenID: 0x4f, name: 'Rolling Fire',
    points: 2, title: `Stop, Drop, and Roll`,
    id: 554830,
    flavourText: `Rotates around the floor the character is on.`,
  },
  {
    address: 0x73, mapID: 0x01, screenID: 0x93, name: 'Fire',
    points: 2, title: `Fire in the Hole`,
    id: 554831,
    flavourText: `Travels on the floor then goes down to the next floor.`,
  },
  // 0x74: Mine
  // 0x75: Magnifying glass
  // 0x76: Holy water (current world)
  // 0x77: Cape (current world)
  // 0x78: Magical rod (current world)
  // 0x79: Map (current world)
  {
    address: 0x7a, mapID: 0x01, screenID: 0x60, name: 'Cross',
    points: 5, title: `Not So Vital, Actually`,
    id: 554832,
    flavourText: `This item has a vital role in this adventure.`,
  },
  // 0x7b: Great key (current world)
  // 0x7c: Necklace 
  {
    address: 0x7d, mapID: 0x01, screenID: 0x32, name: 'Crown',
    points: 2, title: `...Uh?`,
    id: 554833,
    flavourText: `The characters do not lose any strength when touched by the enemy's 'Uh'.`,
  },
  {
    address: 0x7e, mapID: 0x01, screenID: 0x34, name: 'Helm',
    points: 2, title: `Not to Be Confused with the Helmet`,
    id: 554834,
    flavourText: `The character's do not lose any strength when touched by the enemy's 'ectoplasm'.`,
  },
  // 0x7f: Oar
  {
    address: 0x80, mapID: 0x01, screenID: 0x8d, name: 'Shoes',
    points: 2, title: `Fast Footwear`,
    id: 554835,
    flavourText: `Speeds up the pace at which the characters walk.`,
  },
  {
    address: 0x81, mapID: 0x03, screenID: 0x04, name: 'Decorative Doll',
    points: 2, title: `Aww, He's Just a Little Guy`,
    id: 554836,
    flavourText: `Represents the 'Bridge of Love'.`,
  },
  {
    address: 0x82, mapID: 0x01, screenID: 0x30, name: 'Robe',
    points: 2, title: `It Has 'L' and 'R' Stitched on the Sleeves`,
    id: 554837,
    flavourText: `You lose your sense of direction if you don't have this.`,
  },
  {
    address: 0x83, mapID: 0x01, screenID: 0x83, name: 'Bell',
    points: 2, title: `Ding-a-Ling`,
    id: 554838,
    flavourText: `Plays a strange melody when the gate to the world for the key that you are currently holding is near.`,
  },
  {
    address: 0x84, mapID: 0x01, screenID: 0x69, name: 'Halo',
    points: 1, title: `Angelic Glow`,
    id: 554839,
    flavourText: `Take you to where the God of Saving is no matter where you are when the RETURN key is pressed in the option menu. It will not work however, when battling with the Great Demon or other enemies.`,
  },
  {
    address: 0x85, mapID: 0x01, screenID: 0x4b, name: 'Candle',
    points: 2, title: `It Can't Hold a Candle to the Lamp`,
    id: 554840,
    flavourText: `Without this sometimes things that are there can't be seen...!?`,
  },
  {
    address: 0x86, mapID: 0x01, screenID: 0x11, name: 'Armor',
    points: 3, title: `Protects Against Shoots, Not Against Being Shot`,
    id: 554841,
    flavourText: `Not hurt when touched by 'Bamboo shoots'.`,
  },
  // 0x87: Carpet
  // 0x88: Helmet
  {
    address: 0x89, mapID: 0x01, screenID: 0x7b, name: 'Lamp',
    points: 2, title: `Genie Not Included`,
    id: 554842,
    flavourText: `Make the location where the Great Demon is hiding blink blue on the map in the option menu.`,
  },
  {
    address: 0x8a, mapID: 0x01, screenID: 0x28, name: 'Vase',
    points: 5, title: `Dance in This Place. Let's Praise Life Refills!`,
    id: 554843,
    flavourText: `Doubles the experience points gained.`,
  },
  {
    address: 0x8b, mapID: 0x01, screenID: 0x89, name: 'Pendant',
    points: 2, title: `Bringing Down the Walls`,
    id: 554844,
    flavourText: `Improves your swordsmanship?`,
  },
  {
    address: 0x8c, mapID: 0x01, screenID: 0x0d, name: 'Earrings',
    points: 3, title: `Archery Accessory`,
    id: 554845,
    flavourText: `If one of Aphrodite's things are worn, one of her talents can be used.`,
  },
  {
    address: 0x8d, mapID: 0x01, screenID: 0x42, name: 'Bracelet',
    points: 2, title: `Mighty Mine Layer`,
    id: 554846,
    flavourText: `This will allow use of one of Aphrodite's talents.`,
  },
  {
    address: 0x8e, mapID: 0x01, screenID: 0x23, name: 'Ring',
    points: 3, title: `That's Not Clear at All`,
    id: 554847,
    flavourText: `Makes things clear.`,
  },
  {
    address: 0x8f, mapID: 0x01, screenID: 0x0b, name: 'Bible',
    points: 3, title: `Illiteracy Check`,
    id: 554848,
    flavourText: `Something will happen when the CTRL key is pressed!`,
    commentary: `...but where's the CTRL key?`,
  },
  // 0x90: Harp
  {
    address: 0x91, mapID: 0x01, screenID: 0x8c, name: 'Triangle',
    points: 2, title: `Catching the Vapors`,
    id: 554849,
    flavourText: `The characters do not lose their strength when enveloped in the enemy's 'vapor'.`,
  },
  // 0x92: Trumpet shell
  {
    address: 0x93, mapID: 0x01, screenID: 0x13, name: 'Pitcher',
    points: 3, title: `Pour One Out with This`,
    id: 554850,
    flavourText: `The Fire enemies will not hurt you when you have this.`,
  },
  {
    address: 0x94, mapID: 0x01, screenID: 0x18, name: 'Sabre',
    points: 5, title: `Slicing and Dicing`,
    id: 554851,
    flavourText: `Doubles the damage dished out to the enemy.`,
  },
  {
    address: 0x95, mapID: 0x01, screenID: 0x2b, name: 'Dagger',
    points: 5, title: `It Doesn't Protect Against Rain`,
    id: 554852,
    flavourText: `Enemy problems? For fast relief use this item.`,
  },
  {
    address: 0x96, mapID: 0x01, screenID: 0x02, name: 'Feather',
    points: 3, title: `Fly with the Golden Wings?`,
    id: 554853,
    flavourText: `When a key 1-9 is pressed in the option window, you will be taken to the gate corresponding to that world. (But that gate must be open.)`,
  },
  // 0x97: Shields
  {
    address: 0x98, mapID: 0x01, screenID: 0x66, name: 'Bread and Water',
    points: 2, title: `Carboloading`,
    id: 554854,
    flavourText: `Gives you strength to push hard!`,
  },
  {
    address: 0x99, mapID: 0x01, screenID: 0x90, name: 'Salt',
    points: 2, title: `Gettin' Salty About It`,
    id: 554855,
    flavourText: `Certain shrines in the castle cannot be entered unless you are purified with salt.`,
  },
];

const shopItems: {
  address: number, mapID: number, screenID: number, shrineID: number,
  gameState?: GameState,
  priorValue?: number, heldValue?: number,
  points: number, title: string,
  name: string, flavourText: string,
  id: number,
  commentary?: string,
}[] = [
  {
    address: 0x74, mapID: 0x01, screenID: 0x73, shrineID: 0x02, name: 'Mine',
    points: 2, title: `In Violation of the Anti-Personnel Mine Ban Convention`,
    id: 554856,
    flavourText: `A mine. This is a powerful weapon and the characters can get hurt from it also, so be careful.`,
  },
  {
    address: 0x75, mapID: 0x01, screenID: 0x8f, shrineID: 0x04, name: 'Magnifying Glass',
    points: 1, title: `Do Not Look at the Sun with It`,
    id: 554857,
    flavourText: `Important for finding spells carved on tombstones.`,
  },
  {
    address: 0x7c, mapID: 0x01, screenID: 0x20, shrineID: 0x0b, name: 'Necklace',
    points: 2, title: `Dolling up Popolon`,
    id: 554858,
    flavourText: `Will it make Popolon look lady-like if he wears this?`,
  },
  {
    address: 0x7f, mapID: 0x06, screenID: 0x12, shrineID: 0x0c, name: 'Oar',
    gameState: GameState.DemeterShrine,
    points: 2, title: `Don't Find Yourself up the Creek Without This`,
    id: 554859,
    flavourText: `Allows you to walk in certain areas.`,
  },
  {
    address: 0x87, mapID: 0x09, screenID: 0x15, shrineID: 0x0d, name: 'Carpet',
    gameState: GameState.DemeterShrine,
    points: 2, title: `It Really Ties the Room Together`,
    id: 554860,
    flavourText: `Over fire and under water...!`,
  },
  {
    address: 0x88, mapID: 0x01, screenID: 0x0a, shrineID: 0x0a, name: 'Helmet',
    points: 2, title: `Distinct from the Helm`,
    id: 554861,
    flavourText: `You will want this.`,
  },
  {
    address: 0x90, mapID: 0x01, screenID: 0x05, shrineID: 0x06, name: 'Harp',
    points: 2, title: `Rock Out with This`,
    id: 554862,
    flavourText: `Makes things easier. Aphrodite will especially appreciate this.`,
  },
  {
    address: 0x92, mapID: 0x01, screenID: 0x37, shrineID: 0x07, name: 'Trumpet Shell',
    points: 2, title: `Woolooloo?`,
    id: 554863,
    flavourText: `Will this make Aphrodite look more masculine if she holds this?`,
  },
  {
    address: 0x97, mapID: 0x01, screenID: 0x8f, shrineID: 0x04, name: 'Bronze Shield',
    points: 2, title: `Basic Buckler`,
    id: 554864,
    flavourText: `Blocks the shots from the minor demons.`,
  },
  {
    address: 0x97, mapID: 0x01, screenID: 0x41, shrineID: 0x05, name: 'Silver Shield',
    points: 3, title: `Enhanced Escutcheon`,
    priorValue: 0x01, heldValue: 0x02,
    id: 554865,
    flavourText: `Blocks shots from minor and middle demons.`,
  },
  {
    address: 0x97, mapID: 0x01, screenID: 0x04, shrineID: 0x09, name: 'Gold Shield',
    points: 5, title: `Advanced Aegis`,
    priorValue: 0x02, heldValue: 0x03,
    id: 554866,
    flavourText: `Blocks all shots from all demons. However, this does not protect you from Galious' attack.`,
  },
];

const progressionData: {
  world: WorldNumber, bossName: string,
  points: number, id: number, title: string,
}[] = [
  {
    world: 1, bossName: `Bony Dragon`,
    points: 5, id: 554813, title: `YOMAR`,
  },
  {
    world: 2, bossName: `Sea Anemone`,
    points: 5, id: 554814, title: `ELOHIM`,
  },
  {
    world: 3, bossName: `Elusive Dragon`,
    points: 5, id: 554815, title: `HAHAKLA`,
  },
  {
    world: 4, bossName: `Jump Slime`,
    points: 5, id: 554816, title: `BARECHET`,
  },
  {
    world: 5, bossName: `Donra`,
    points: 5, id: 554817, title: `HEOTYMEO`,
  },
  {
    world: 6, bossName: `Arlyane`,
    points: 5, id: 554818, title: `LEPHA`,
  },
  {
    world: 7, bossName: `Big Lips`,
    points: 5, id: 554819, title: `NAWABRA`,
  },
  {
    world: 8, bossName: `Monster`,
    points: 5, id: 554820, title: `ASCHER`,
  },
  {
    world: 9, bossName: `King Dragon`,
    points: 5, id: 554821, title: `XYWOLEH`,
  },
];

function makeAchievements(set: AchievementSet) {
  // Progression -----------------------------------------------
  progressionData.forEach(({world, bossName, points, id, title}) => {
    const description = `Defeat ${bossName} and take back World ${world}`;

    set.addAchievement({
      title, description, points, id,
      type: 'progression',
      conditions: {
        core: define(
          eq(ADDR.game_state, GameState.BossDefeat),
          eq(ADDR.map_id, world + 1),
          eq(prev(ADDR.world_boss_dead(world)), 0),
          eq(ADDR.world_boss_dead(world), 1),
        )
      }
    });
  });

  set.addAchievement({
    title: `See You in the Maze of Demons!`,
    description: `Defeat Galious and rescue the baby Pampas`,
    points: 25,
    id: 554822,
    type: 'win_condition',
    conditions: {
      core: define(
        eq(ADDR.game_state, GameState.Ending),
        eq(ADDR.map_id, 0x0b),
        eq(ADDR.world_boss_dead(10), 1),
        eq(prev(ADDR.game_substate), 0x04),
        eq(ADDR.game_substate, 0x05),
      )
    }
  });

  // Collection ------------------------------------------------
  set.addAchievement({
    title: `Souvenir Collector`,
    description: `Collect the map, holy water, cape, and magical rod in each world`,
    points: 10,
    id: 554823, 
    conditions: {
      core: define(
        eq(ADDR.game_state, GameState.Gameplay),
        neq(ADDR.map_id, 0),
        neq(ADDR.map_id, 1),
        ...range(1, 10).map((n: number) => {
          const world = n as any as WorldNumber;
          return define(
            cond('AddSource', prev(ADDR.world_have_map(world))),
            cond('AddSource', prev(ADDR.world_have_water(world))),
            cond('AddSource', prev(ADDR.world_have_cape(world))),
            cond('AddSource', prev(ADDR.world_have_rod(world))),
          )
        }),
        cond('AddSource', prev(ADDR.world_have_water(10))),
        cond('AddSource', prev(ADDR.world_have_cape(10))),
        cond('AddSource', prev(ADDR.world_have_rod(10))),
        eq(0, 38),
        ...range(1, 10).map((n: number) => {
          const world = n as any as WorldNumber;
          return define(
            cond('AddSource', ADDR.world_have_map(world)),
            cond('AddSource', ADDR.world_have_water(world)),
            cond('AddSource', ADDR.world_have_cape(world)),
            cond('AddSource', ADDR.world_have_rod(world)),
          )
        }),
        cond('AddSource', ADDR.world_have_water(10)),
        cond('AddSource', ADDR.world_have_cape(10)),
        cond('AddSource', ADDR.world_have_rod(10)),
        cond('Measured',  0, '=', 39),
        measuredIf(
          andNext(
            neq(ADDR.game_state, GameState.TitleScreen),
            neq(ADDR.game_state, GameState.AttractMode),
          )
        ),
      )
    }
  });

  set.addAchievement({
    title: `A Stickler for Form`,
    description: `In a single playthrough, read all ten tablets inscribed with the incantations to summon the Great Demons`,
    points: 5,
    id: 554827, 
    conditions: {
      core: define(
        ...range(0, 10).map((n) => 
          once(
            andNext(
              eq(ADDR.map_id, n + 2),
              eq(ADDR.game_state, GameState.ReadTablet),
              eq(ADDR.tablet_id, n + 1),
              eq(prev(ADDR.game_substate), 0x00),
              eq(ADDR.game_substate, 0x01),
            ),
          ),
        ),
        resetIf(
          eq(ADDR.game_state, GameState.Boot),
          eq(ADDR.game_state, GameState.TitleScreen),
          eq(ADDR.game_state, GameState.AttractMode),
          eq(ADDR.game_state, GameState.GameOver),
          eq(ADDR.game_state, GameState.Ending),
        ),
      )
    }
  });

  pickupItems.forEach((
    {address, mapID, screenID, name, points, title, id, flavourText, commentary}
  ) => {
    const descriptionBase = `Obtain the ${name.toLowerCase()}: "${flavourText}"`;
    const descriptionExt  = commentary ? ` ${commentary}` : ``;
    const description     = descriptionBase + descriptionExt;
    
    set.addAchievement({
      title, description, points, id,
      conditions: {
        core: define(
          eq(ADDR.game_state, GameState.Gameplay),
          eq(ADDR.map_id, mapID),
          eq(ADDR.screen_id, screenID),
          eq(prev(byte(address)), 0),
          eq(byte(address), 1),
        )
      }
    });
  });

  shopItems.forEach((
    {address, mapID, screenID, shrineID, gameState, priorValue, heldValue, name, points, title, id, flavourText, commentary}
  ) => {
    const descriptionBase = `Obtain the ${name.toLowerCase()}: "${flavourText}"`;
    const descriptionExt  = commentary ? ` ${commentary}` : ``;
    const description     = descriptionBase + descriptionExt;
    
    set.addAchievement({
      title, description, points, id,
      conditions: {
        core: define(
          eq(ADDR.game_state, gameState ?? GameState.Shrine),
          eq(ADDR.map_id, mapID),
          eq(ADDR.screen_id, screenID),
          eq(ADDR.shrine_id, shrineID),
          eq(prev(byte(address)), priorValue ?? 0),
          eq(byte(address), heldValue ?? 1),
        )
      }
    });
  });

  set.addAchievement({
    title: `Popolon's Poppin' Off`,
    description: `Increase Popolon's vitality to the maximum, making him more powerful than the UI can handle`,
    points: 5,
    id: 554825, 
    type: 'missable',
    conditions: {
      core: define(
        orNext(
          eq(ADDR.game_state, GameState.Gameplay),
          eq(ADDR.game_state, GameState.GreatKey),
        ),
        eq(prev(ADDR.popolon_max_hp), 0x40),
        eq(ADDR.popolon_max_hp, 0x48),
      )
    }
  });

  set.addAchievement({
    title: `Aphrodite's Doin' Alrighty`,
    description: `Increase Aphrodite's vitality to the maximum, making her more powerful than the UI can handle`,
    points: 5,
    id: 554826, 
    type: 'missable',
    conditions: {
      core: define(
        orNext(
          eq(ADDR.game_state, GameState.Gameplay),
          eq(ADDR.game_state, GameState.GreatKey),
        ),
        eq(prev(ADDR.aphrodite_max_hp), 0x40),
        eq(ADDR.aphrodite_max_hp, 0x48),
      )
    }
  });

  // Challenges ------------------------------------------------
  // Castle Greek --------------
  // const startItems = [...range( 0,  6), ...range(10, 14), ...range(15, 16),
  //   ...range(17, 21), ...range(23, 25), ...range(27, 36), ...range(37, 41),
  // ];

  const startItems = [
     0, // Arrow
     1, // Ceramic arrow
     2, // Rolling fire
     3, // Fire
     4, // Mine
     5, // Magnifying glass
    10, // Cross
    11, // Great Key
    12, // Necklace
    13, // Crown
    14, // Helm
    16, // Shoes
    18, // Robe
    19, // Bell
    20, // Halo
    21, // Candle
    22, // Armour
    24, // Helmet
    25, // Lamp
    27, // Pendant
    28, // Earrings
    29, // Bracelet
    30, // Ring
    31, // Bible
    32, // Harp
    33, // Triangle
    34, // Trumpet Shell
    35, // Pitcher
    37, // Dagger
    38, // Feather
    39, // Shield (1-3)
    40, // Bread and water
    41, // Salt
  ]
  
  set.addAchievement({
    title: `Loaded to Bear`,
    description: `Collect every possible item from Castle Greek before unlocking World 1`,
    points: 10,
    type: 'missable',
    conditions: {
      core: define(
        measuredIf(
          neq(ADDR.game_state, GameState.Boot),
          neq(ADDR.game_state, GameState.AttractMode),
          neq(ADDR.game_state, GameState.GameOver),
          neq(ADDR.game_state, GameState.Ending),
          neq(prev(ADDR.world_unlocked(1)), 1),
        ),
        ...startItems.map((n) => 
          cond('AddSource', prev(byte(0x0070 + n)))
        ),
        cond('', 0, '=', 34),
        ...startItems.map((n) => 
          cond('AddSource', byte(0x0070 + n))
        ),
        cond('AddSource', ADDR.world_unlocked(1)),
        cond('Measured', 0, '=', 35),
      )
    }
  });
  
  set.addAchievement({
    title: `Fae Pact`,
    description: `Summon a fairy`,
    points: 3,
    id: 554949,
    conditions: {
      core: define(
        eq(ADDR.game_state, GameState.Gameplay),
        eq(ADDR.map_id, 0x01),
        orNext(
          eq(ADDR.screen_id, 0x19),
          eq(ADDR.screen_id, 0x5b),
          eq(ADDR.screen_id, 0x6e),
        ),
        eq(prev(ADDR.fairy_flag), 0),
        eq(ADDR.fairy_flag, 1),
      ),
    }
  });

  set.addAchievement({
    title: `Slime Climb`,
    description: `In Castle Greek, defeat 16 ascending red slimes in a row without letting any escape through the top of the screen`,
    id: 554824,
    points: 5,
    conditions: {
      core: define(
        measuredIf(
          eq(ADDR.map_id, 0x01),
          eq(ADDR.screen_id, 0x5f),
        ),
        ...range(0, 18).map((n) => define(
          cond('AndNext', prev(ADDR.enemy_id(n)), '=', 0x38),
          cond('AddHits', ADDR.enemy_id(n),       '=', 0x5b),
        )),
        ...range(0, 18).map((n) => define(
          cond('OrNext',  ADDR.enemy_hp(n),       '=', 0x00),
          cond('AndNext', ADDR.enemy_hp(n),       '>', 0xf0),
          cond('AndNext', prev(ADDR.enemy_hp(n)), '=', 0x01),
          cond('AddHits', ADDR.enemy_id(n),       '=', 0x38),
        )),
        ...range(0, 18).map((n) => define(
          cond('OrNext',  ADDR.enemy_hp(n),       '=', 0x00),
          cond('AndNext', ADDR.enemy_hp(n),       '>', 0xf0),
          cond('AndNext', prev(ADDR.enemy_id(n)), '=', 0x38),
          cond('AddHits', ADDR.enemy_id(n),       '=', 0x00),
        )),
        cond('Measured', 0, '=', 1, 16),
        ...range(0, 18).map((n) => resetIf(
          andNext(
            eq(prev(ADDR.enemy_id(n)), 0x38),
            eq(ADDR.enemy_id(n), 0x00),
            eq(ADDR.enemy_hp(n), 1),
          )
        )),
        resetIf(
          neq(ADDR.map_id, 0x01),
          neq(ADDR.screen_id, 0x5f),
          eq(ADDR.game_state, GameState.Boot),
          eq(ADDR.game_state, GameState.TitleScreen),
          eq(ADDR.game_state, GameState.AttractMode),
          eq(ADDR.game_state, GameState.GameOver),
          eq(ADDR.game_state, GameState.Ending),
        ),
      )
    }
  });

  // World 1 -------------------
  set.addAchievement({
    title: `Hey! Do a Boneless!`,
    description: `Defeat Bony Dragon without taking any damage`,
    points: 10,
    id: 554930,
    type: 'missable',
    conditions: {
      core: define(
        once(
          andNext(
            eq(ADDR.map_id,    0x02),
            eq(ADDR.screen_id, 0x0d),
            eq(prev(ADDR.game_state), GameState.Gameplay),
            eq(ADDR.game_state, GameState.BossStart),
          ),
        ),
        trigger(
          eq(prev(ADDR.world_boss_dead(1)), 0),
          eq(ADDR.world_boss_dead(1), 1),
        ),
        resetIf(
          lt(ADDR.aphrodite_hp, prev(ADDR.aphrodite_hp)),
          lt(ADDR.popolon_hp, prev(ADDR.popolon_hp)),
        ),
        resetIf(
          eq(ADDR.game_state, GameState.Boot),
          eq(ADDR.game_state, GameState.TitleScreen),
          eq(ADDR.game_state, GameState.AttractMode),
          eq(ADDR.game_state, GameState.CharOut),
          eq(ADDR.game_state, GameState.GameOver),
          eq(ADDR.game_state, GameState.Ending),
          neq(ADDR.map_id, 0x02),
          neq(ADDR.screen_id, 0x0d),
        ),
      )
    }
  });

  // World 2 -------------------
  set.addAchievement({
    title: `Now You Sea Anemone, Now You Don't`,
    description: `Defeat Sea Anemone without falling in the water at the bottom of the arena`,
    points: 10,
    id: 554934,
    type: 'missable',
    conditions: {
      core: define(
        once(
          andNext(
            eq(ADDR.map_id,    0x03),
            eq(ADDR.screen_id, 0x09),
            eq(prev(ADDR.game_state), GameState.Gameplay),
            eq(ADDR.game_state, GameState.BossStart),
          ),
        ),
        trigger(
          eq(prev(ADDR.world_boss_dead(2)), 0),
          eq(ADDR.world_boss_dead(2), 1),
        ),
        resetIf(
          gt(ADDR.player_y_coord, 0xa0),
        ),
        resetIf(
          eq(ADDR.game_state, GameState.Boot),
          eq(ADDR.game_state, GameState.TitleScreen),
          eq(ADDR.game_state, GameState.AttractMode),
          // eq(ADDR.game_state, GameState.CharOut),
          eq(ADDR.game_state, GameState.GameOver),
          eq(ADDR.game_state, GameState.Ending),
          neq(ADDR.map_id, 0x03),
          neq(ADDR.screen_id, 0x09),
        ),
      ),
    }
  });

  // set.addAchievement({
  //   title: `Now You Sea Anemone, Now You Don't`,
  //   description: `Defeat Sea Anemone by the end of its second attack cycle`,
  //   points: 10,
  //   id: 554934,
  //   type: 'missable',
  //   conditions: {
  //     core: define(
  //       once(
  //         andNext(
  //           eq(ADDR.map_id,    0x03),
  //           eq(ADDR.screen_id, 0x09),
  //           eq(prev(ADDR.game_state), GameState.Gameplay),
  //           eq(ADDR.game_state, GameState.BossStart),
  //         ),
  //       ),
  //       trigger(
  //         eq(prev(ADDR.world_boss_dead(2)), 0),
  //         eq(ADDR.world_boss_dead(2), 1),
  //       ),
  //       resetIf(
  //         cond('AndNext', prev(ADDR.boss_action_state), '=', 0x02),
  //         cond('ResetIf', ADDR.boss_action_state,       '=', 0x00, 2),
  //       ),
  //       resetIf(
  //         eq(ADDR.game_state, GameState.Boot),
  //         eq(ADDR.game_state, GameState.TitleScreen),
  //         eq(ADDR.game_state, GameState.AttractMode),
  //         eq(ADDR.game_state, GameState.CharOut),
  //         eq(ADDR.game_state, GameState.GameOver),
  //         eq(ADDR.game_state, GameState.Ending),
  //         neq(ADDR.map_id, 0x03),
  //         neq(ADDR.screen_id, 0x09),
  //       ),
  //     ),
  //   }
  // });

  // World 3 -------------------
  set.addAchievement({
    title: `Not-So-Elusive Dragon`,
    description: `Defeat Elusive Dragon before the first time it retreats from the arena`,
    points: 10,
    id: 554932,
    type: 'missable',
    conditions: {
      core: define(
        once(
          andNext(
            eq(ADDR.map_id,    0x04),
            eq(ADDR.screen_id, 0x0d),
            eq(prev(ADDR.game_state), GameState.Gameplay),
            eq(ADDR.game_state, GameState.BossStart),
          ),
        ),
        trigger(
          eq(prev(ADDR.world_boss_dead(3)), 0),
          eq(ADDR.world_boss_dead(3), 1),
        ),
        resetIf(
          andNext(
            eq(prev(ADDR.boss_action_state), 0x04),
            eq(ADDR.boss_action_state, 0x05),
          ),
        ),
        resetIf(
          eq(ADDR.game_state, GameState.Boot),
          eq(ADDR.game_state, GameState.TitleScreen),
          eq(ADDR.game_state, GameState.AttractMode),
          eq(ADDR.game_state, GameState.CharOut),
          eq(ADDR.game_state, GameState.GameOver),
          eq(ADDR.game_state, GameState.Ending),
          neq(ADDR.map_id, 0x04),
          neq(ADDR.screen_id, 0x0d),
        ),
      )
    }
  });

  // World 4 -------------------
  set.addAchievement({
    title: `White Knights Can't Jump`,
    description: `Defeat Jump Slime without jumping`,
    points: 10,
    type: 'missable',
    conditions: {
      core: define(
        once(
          andNext(
            eq(ADDR.map_id,    0x05),
            eq(ADDR.screen_id, 0x0e),
            eq(prev(ADDR.game_state), GameState.Gameplay),
            eq(ADDR.game_state, GameState.BossStart),
          ),
        ),
        trigger(
          eq(prev(ADDR.world_boss_dead(4)), 0),
          eq(ADDR.world_boss_dead(4), 1),
        ),
        // resetIf(
        //   lt(ADDR.aphrodite_hp, prev(ADDR.aphrodite_hp)),
        //   lt(ADDR.popolon_hp, prev(ADDR.popolon_hp)),
        // ),
        resetIf(
          eq(ADDR.player_movement_state, 0x01),
        ),
        resetIf(
          eq(ADDR.game_state, GameState.Boot),
          eq(ADDR.game_state, GameState.TitleScreen),
          eq(ADDR.game_state, GameState.AttractMode),
          // eq(ADDR.game_state, GameState.CharOut),
          eq(ADDR.game_state, GameState.GameOver),
          eq(ADDR.game_state, GameState.Ending),
          neq(ADDR.map_id, 0x05),
          neq(ADDR.screen_id, 0x0e),
        ),
      )
    }
  });

  // World 5 -------------------
  set.addAchievement({
    title: `Because Swords Are Fun`,
    description: `Defeat Donra using only the sword`,
    points: 10,
    type: 'missable',
    conditions: {
      core: define(
        once(
          andNext(
            eq(ADDR.map_id,    0x06),
            eq(ADDR.screen_id, 0x11),
            eq(prev(ADDR.game_state), GameState.Gameplay),
            eq(ADDR.game_state, GameState.BossStart),
          ),
        ),
        trigger(
          eq(prev(ADDR.world_boss_dead(5)), 0),
          eq(ADDR.world_boss_dead(5), 1),
        ),
        // resetIf(
        //   lt(ADDR.ammo, prev(ADDR.ammo)),
        // ),
        ...range(0, 6).map((n) =>
          resetIf(
            neq(word(0x0542 + n * 0x20), 0)
          )
        ),
        resetIf(
          eq(ADDR.game_state, GameState.Boot),
          eq(ADDR.game_state, GameState.TitleScreen),
          eq(ADDR.game_state, GameState.AttractMode),
          // eq(ADDR.game_state, GameState.CharOut),
          eq(ADDR.game_state, GameState.GameOver),
          eq(ADDR.game_state, GameState.Ending),
          neq(ADDR.map_id, 0x06),
          neq(ADDR.screen_id, 0x11),
        ),
      )
    }
  })
  
  // World 6 -------------------
  set.addAchievement({
    title: `Raining Destruction from on High`,
    description: `Defeat Arlyane without ever descending below the top platforms in the arena`,
    points: 10,
    id: 554933,
    type: 'missable',
    conditions: {
      core: define(
        once(
          andNext(
            eq(ADDR.map_id,    0x07),
            eq(ADDR.screen_id, 0x0d),
            eq(prev(ADDR.game_state), GameState.Gameplay),
            eq(ADDR.game_state, GameState.BossStart),
          ),
        ),
        trigger(
          eq(prev(ADDR.world_boss_dead(6)), 0),
          eq(ADDR.world_boss_dead(6), 1),
        ),
        resetIf(
          gt(ADDR.player_y_coord, 0x40),
        ),
        resetIf(
          eq(ADDR.game_state, GameState.Boot),
          eq(ADDR.game_state, GameState.TitleScreen),
          eq(ADDR.game_state, GameState.AttractMode),
          // eq(ADDR.game_state, GameState.CharOut),
          eq(ADDR.game_state, GameState.GameOver),
          eq(ADDR.game_state, GameState.Ending),
          neq(ADDR.map_id, 0x07),
          neq(ADDR.screen_id, 0x0d),
        ),
      )
    }
  });

  // World 7 -------------------
  set.addAchievement({
    title: `Holding It In`,
    description: `Complete World 7 without having Popolon or Aphrodite take any bathroom breaks for free heals`,
    points: 10,
    type: 'missable',
    conditions: {
      core: define(
        once(
          andNext(
            eq(ADDR.game_state, GameState.Gameplay),
            eq(prev(ADDR.world_unlocked(7)), 0),
            eq(ADDR.world_unlocked(7), 1),
          )
        ),
        trigger(
          eq(prev(ADDR.world_boss_dead(7)), 0),
          eq(ADDR.world_boss_dead(7), 1),
        ),
        resetIf(
          eq(ADDR.game_state, GameState.Paused),
        )
      )
    }
  });

  // World 8 -------------------
  set.addAchievement({
    title: `Right My from Left My Tell Can't I`,
    description: `Complete World 8 without having the robe in your inventory`,
    points: 10,
    id: 554929,
    type: 'missable',
    conditions: {
      core: define(
        neq(ADDR.game_state, GameState.TitleScreen),
        neq(ADDR.game_state, GameState.AttractMode),
        eq(ADDR.map_id, 0x09),
        eq(ADDR.inventory_robe, 0x00),
        neq(prev(ADDR.world_boss_dead(8)), 1),
        trigger(
          eq(prev(ADDR.world_boss_dead(8)), 0),
          eq(ADDR.world_boss_dead(8), 1),
        )
      )
    }
  });
  
  // World 9 -------------------
  // set.addAchievement({
  //   title: `A Good Sense of Direction`,
  //   description: `Complete World 9 without visiting any screen more than once`,
  //   points: 10,
  //   type: 'missable',
  //   conditions: {
  //     core: define(
  //       once(
  //         andNext(
  //           eq(prev(ADDR.world_unlocked(9)), 0),
  //           eq(ADDR.world_unlocked(9), 1),
  //         )
  //       ),
  //       trigger(
  //         eq(ADDR.map_id, 10),
  //         eq(ADDR.game_state, GameState.BossDefeat),
  //         andNext(
  //           eq(prev(ADDR.world_boss_dead(9)), 0),
  //           eq(ADDR.world_boss_dead(9), 1),
  //         )
  //       ),
  //       ...range(0, 28).map((n) =>
  //         andNext(
  //           eq(ADDR.map_id, 0x0a),
  //           neq(prev(ADDR.screen_id), n),
  //           resetIf(
  //             cond('ResetIf', ADDR.screen_id, '=', n, 2)
  //           )
  //         )
  //       ),
  //       resetIf(
  //         eq(ADDR.game_state, GameState.Boot),
  //         eq(ADDR.game_state, GameState.TitleScreen),
  //         eq(ADDR.game_state, GameState.AttractMode),
  //         eq(ADDR.game_state, GameState.GameOver),
  //         eq(ADDR.game_state, GameState.Ending),
  //       ),
  //     )
  //   }
  // });

  set.addAchievement({
    title: `A Good Sense of Direction`,
    description: `Complete World 9 without visiting any screen more than once`,
    points: 10,
    type: 'missable',
    conditions: {
      core: define(
        once(
          andNext(
            eq(ADDR.world_boss_dead(9), 0),
            eq(prev(ADDR.map_id), 0x01),
            eq(ADDR.map_id, 0x0a),
            eq(prev(ADDR.screen_id), 0x6c),
            eq(ADDR.screen_id, 0x01),
          )
        ),
        trigger(
          eq(ADDR.map_id, 10),
          eq(ADDR.game_state, GameState.BossDefeat),
          andNext(
            eq(prev(ADDR.world_boss_dead(9)), 0),
            eq(ADDR.world_boss_dead(9), 1),
          )
        ),
        resetIf(
          neq(ADDR.map_id, 0x0a)
        ),
        ...range(0, 28).map((n) =>
          andNext(
            eq(ADDR.map_id, 0x0a),
            neq(prev(ADDR.screen_id), n),
            resetIf(
              cond('ResetIf', ADDR.screen_id, '=', n, 2)
            )
          )
        ),
        resetIf(
          eq(ADDR.game_state, GameState.Boot),
          eq(ADDR.game_state, GameState.TitleScreen),
          eq(ADDR.game_state, GameState.AttractMode),
          eq(ADDR.game_state, GameState.GameOver),
          eq(ADDR.game_state, GameState.Ending),
        ),
      )
    }
  });

  // World 10 ------------------
  set.addAchievement({
    title: `The HAMALECH Manoeuvre`,
    description: `Defeat Galious without having the cross in your inventory`,
    points: 10,
    id: 554931,
    type: 'missable',
    conditions: {
      core: define(
        neq(ADDR.game_state, GameState.TitleScreen),
        neq(ADDR.game_state, GameState.AttractMode),
        eq(ADDR.map_id, 0x0b),
        eq(ADDR.inventory_cross, 0),
        neq(prev(ADDR.world_boss_dead(10)), 1),
        trigger(
          eq(prev(ADDR.world_boss_dead(10)), 0),
          eq(ADDR.world_boss_dead(10), 1),
        )
      )
    }
  });

  // Didactic zero pointers ------------------------------------
  set.addAchievement({
    title: `This Won't Help Me: I Can't Type!`,
    description: `Receive a save password from Demeter`,
    points: 0,
    id: 554946,
    conditions: {
      core: define(
        eq(ADDR.game_state, GameState.Shrine),
        eq(ADDR.map_id, 0x01),
        eq(ADDR.screen_id, 0x48),
        eq(ADDR.shrine_id, 0x01),
        eq(prev(ADDR.shrine_state), 0x01),
        eq(ADDR.shrine_state, 0x02),
      )
    }
  });

  set.addAchievement({
    title: `The Secret Treasure of Life?`,
    description: `Receive a full heal for Popolon and/or Aphrodite without filling their EXP bar, collecting a Great Key, or using a fairy. (Displayed health will not update until damage is taken)`,
    points: 0,
    id: 554947,
    conditions: {
      core: define(
        orNext(
          eq(ADDR.game_state, GameState.Gameplay),
          eq(ADDR.game_state, GameState.Paused),
        ),
      ),
      alt1: define(
        orNext(
          eq(prev(ADDR.aphrodite_hp_ticks),  0x00),
          gte(prev(ADDR.aphrodite_hp_ticks), 0x80),
        ),
        orNext(
          eq(ADDR.aphrodite_hp_ticks,  0x00),
          gte(ADDR.aphrodite_hp_ticks, 0x80),
        ),
        gt(ADDR.aphrodite_hp, prev(ADDR.aphrodite_hp)),
      ),
      alt2: define(
        orNext(
          eq(prev(ADDR.popolon_hp_ticks),  0x00),
          gte(prev(ADDR.popolon_hp_ticks), 0x80),
        ),
        orNext(
          eq(ADDR.popolon_hp_ticks,  0x00),
          gte(ADDR.popolon_hp_ticks, 0x80),
        ),
        gt(ADDR.popolon_hp, prev(ADDR.popolon_hp)),
      )
    }
  });

  // set.addAchievement({
  //   title: `Are My Pockets Full of Holes?`,
  //   description: `With a single action, consume more than the expected amount of subweapon ammunition, money, or keys`,
  //   points: 0,
  //   conditions: {
  //     core: define(
  //       neq(ADDR.game_state, GameState.TitleScreen),
  //       neq(ADDR.game_state, GameState.AttractMode),
  //       neq(ADDR.game_state, GameState.Ending),
  //     ),
  //     alt1: define(
  //       eq(prev(ADDR.ammo_lsb), 0xbf),
  //       neq(prev(ADDR.ammo), 0x00bf),
  //       trigger(
  //         lt(ADDR.ammo, prev(ADDR.ammo)),
  //       ),
  //     ),
  //     alt2: define(
  //       eq(prev(ADDR.money_lsb), 0xbf),
  //       neq(prev(ADDR.money), 0x00bf),
  //       trigger(
  //         lt(ADDR.money, prev(ADDR.money)),
  //       ),
  //     ),
  //     alt3: define(
  //       eq(prev(ADDR.keys_lsb), 0xbf),
  //       neq(prev(ADDR.money), 0x00bf),
  //       trigger(
  //         lt(ADDR.keys, prev(ADDR.keys)),
  //       ),
  //     )
  //   }
  // });

  set.addAchievement({
    title: `Is Q*Bert Inserted in Slot 2?`,
    description: `From a single item pickup, receive more than the expected amount of subweapon ammuntion, money, or keys`,
    points: 0,
    id: 554948,
    conditions: {
      core: define(
        neq(ADDR.game_state, GameState.TitleScreen),
        neq(ADDR.game_state, GameState.AttractMode),
        neq(ADDR.game_state, GameState.Ending),
      ),
      alt1: define(
        eq(prev(ADDR.ammo_lsb), 0xbf),
        trigger(
          gt(ADDR.ammo, prev(ADDR.ammo)),
        ),
      ),
      alt2: define(
        eq(prev(ADDR.money_lsb), 0xbf),
        trigger(
          gt(ADDR.money, prev(ADDR.money)),
        ),
      ),
      alt3: define(
        eq(prev(ADDR.keys_lsb), 0xbf),
        trigger(
          gt(ADDR.keys, prev(ADDR.keys)),
        ),
      )
    }
  });

  // set.addAchievement({
  //   title: `Underflow Expert`,
  //   description: `[TODO]`,
  //   points: 0,
  //   conditions: {
  //     core: define(
  //       neq(ADDR.game_state, GameState.TitleScreen),
  //       neq(ADDR.game_state, GameState.AttractMode),
  //       neq(ADDR.game_state, GameState.Ending),
  //     ),
  //     alt1: define(
  //       eq(prev(ADDR.ammo), 0x00bf),
  //       trigger(
  //         eq(ADDR.ammo, 0x9958),
  //       ),
  //     ),
  //     alt2: define(
  //       eq(prev(ADDR.money), 0x00bf),
  //       trigger(
  //         eq(ADDR.money, 0x9958),
  //       ),
  //     ),
  //     alt3: define(
  //       eq(prev(ADDR.keys), 0x00bf),
  //       trigger(
  //         eq(ADDR.keys, 0x9958),
  //       ),
  //     )
  //   }
  // });
}

export default makeAchievements;
