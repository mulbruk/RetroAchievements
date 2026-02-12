import {
  AchievementSet, Condition, ConditionBuilder,
  define, once, andNext, orNext, resetIf,
  trigger,
  measuredIf,
} from "@cruncheevos/core";
import { match } from "ts-pattern";
import { cond, prev, eq, neq, gt, gte, lt, lte, recall } from "../common/comparison.js";
import { range, strToDwordBE, timeToFramesNTSC, timeToMilliseconds } from "../common/util.js";
import { dword_be } from "../common/value.js";
import {Locale, FooBar, FLAGS, GAME_STATE, SYSTEM, LEMEZA, INVENTORY, FLAGS_EX} from "./data.js";

// ---------------------------------------------------------------------------------------------------

function titleID(locale: Locale) {
  return match(locale)
    .with('NA', () => strToDwordBE("WLME"))
    .with('EU', () => strToDwordBE("WLMP"))
    .with('JP', () => strToDwordBE("WLMJ"))
    .exhaustive();
}

function isRegion(locale: Locale) {
  return match(locale)
    .with('NA', () => eq(SYSTEM.title_id, strToDwordBE("WLME")))
    .with('EU', () => eq(SYSTEM.title_id, strToDwordBE("WLMP")))
    .with('JP', () => eq(SYSTEM.title_id, strToDwordBE("WLMJ")))
    .exhaustive();
}

function resetOnFairy(locale: Locale) {
  return define(
    cond('Remember', GAME_STATE.objects_array(locale), '&', 0x7fffffff),
    ...range(0, 256).map(n => define(
      cond('AndNext',    SYSTEM.title_id, '=', titleID(locale)),
      cond('AddAddress', recall()),
      cond('ResetIf',    dword_be(0x00),  '=', 0x801725ac),
      cond('Remember',   recall(),        '+', 828)
    ))
  );
}

type Location = { fieldID: number, roomID: number, screenID: number };
interface eventFlagAchievementData {
  title: string, description: string, points: number,
  flag: FooBar, before?: number, after?: number,
  location: Location | Location[],
}

function eventFlagTrigger(data: eventFlagAchievementData) {
  const { flag, before, after, location } = data;

  const packLocation = ({ fieldID, roomID, screenID }: Location) => 
    fieldID << 16 | roomID << 8 | screenID;

  const triggerLogic = (ll: Locale) => define(
    Array.isArray(location) ?
      orNext(...location.map(loc => eq(GAME_STATE.location(ll), packLocation(loc)))) :
      eq(GAME_STATE.location(ll), packLocation(location)),
    eq(prev(flag(ll)), before ?? 0),
    eq(flag(ll), after ?? 1),
  );

  return {
    core: define(
      eq(1, 1)
    ),
    alt1: define(
      orNext(
        isRegion('NA'),
        isRegion('EU'),
      ),
      triggerLogic('NA')
    ),
    alt2: define(
      isRegion('JP'),
      triggerLogic('JP')
    )
  }
}

function makeAchievements(set: AchievementSet) {
  // Progression -----------------------------------------------
  const progressionAchievements: eventFlagAchievementData[] = [
    {
      title: `[Needs title] Wake Mulbruk`,
      description: `[Needs description]`,
      points: 1,
      flag: FLAGS.woke_mulbruk, before: 1, after: 2,
      location: { fieldID: 0x03, roomID: 0x03, screenID: 0x00 }
    },
    {
      title: `[Needs title] Learn Ancient La-Mulanese`,
      description: `Read the palaeographies and learn ancient La-Mulanese`,
      points: 5,
      flag: FLAGS.ancient_la_mulanese,
      location: [
        { fieldID: 0x09, roomID: 0x09, screenID: 0x00 },
        { fieldID: 0x0e, roomID: 0x03, screenID: 0x00 },
        { fieldID: 0x0f, roomID: 0x00, screenID: 0x00 },
        { fieldID: 0x12, roomID: 0x09, screenID: 0x00 },
      ]
    },
    {
      title: `[Needs title] Collect the Medicine of the Mind`,
      description: `[Needs description]`,
      points: 3,
      flag: FLAGS.filled_vessel,
      location: { fieldID: 0x0e, roomID: 0x07, screenID: 0x01 }
    },
    {
      title: `[Needs title] Remove the Final Obstacle`,
      description: `[Needs description]`,
      points: 2,
      flag: FLAGS.final_obstacle,
      location: { fieldID: 0x12, roomID: 0x05, screenID: 0x00 }
    },
    {
      title: `[Needs title] Defeat Sakit`,
      description: `[Needs description]`,
      points: 3,
      flag: FLAGS.ankh_sakit, before: 2, after: 3,
      location: { fieldID: 0x02, roomID: 0x08, screenID: 0x01 }
    },
    {
      title: `[Needs title] Defeat Bahamut`,
      description: `[Needs description]`,
      points: 5,
      flag: FLAGS.ankh_bahamut, before: 2, after: 3,
      location: { fieldID: 0x04, roomID: 0x04, screenID: 0x00 }
    },
    {
      title: `[Needs title] Defeat Baphomet`,
      description: `[Needs description]`,
      points: 5,
      flag: FLAGS.ankh_baphomet, before: 2, after: 3,
      location: { fieldID: 0x07, roomID: 0x04, screenID: 0x01 }
    },
    {
      title: `[Needs title] Defeat Tiamat`,
      description: `[Needs description]`,
      points: 10,
      flag: FLAGS.ankh_tiamat, before: 2, after: 3,
      location: { fieldID: 0x11, roomID: 0x09, screenID: 0x00 }
    },
  ];

  progressionAchievements.forEach((data) => {
    const { title, description, points } = data;
    
    set.addAchievement({
      title, description, points, type: 'progression',
      conditions: eventFlagTrigger(data)
    });
  });

  set.addAchievement({
    title: `Run Toward the Sun`,
    description: `Escape the ruins`,
    points: 25,
    type: 'win_condition',
    conditions: {
      core: define( eq(1, 1) ),
      alt1: define(
        orNext(
          isRegion('NA'),
          isRegion('EU'),
        ),
        // Thoth's Room
        eq(GAME_STATE.field_id('NA'),    0x03),
        eq(GAME_STATE.room_id('NA'),     0x03),
        eq(GAME_STATE.screen_id('NA'),   0x00),
        // Verify all guardians defeated to block laptop glitch shenanigans
        eq(FLAGS.ankh_amphisbaena('NA'), 0x03),
        eq(FLAGS.ankh_sakit('NA'),       0x03),
        eq(FLAGS.ankh_ellmac('NA'),      0x03),
        eq(FLAGS.ankh_bahamut('NA'),     0x03),
        eq(FLAGS.ankh_viy('NA'),         0x03),
        eq(FLAGS.ankh_palenque('NA'),    0x03),
        eq(FLAGS.ankh_baphomet('NA'),    0x03),
        eq(FLAGS.ankh_tiamat('NA'),      0x03),
        eq(FLAGS.mother_defeated('NA'),  0x01),
        // Since we're using a music trigger for timing, ensure laptop is closed to block the edge
        // case of using Enga Musica to play 'Run toward the sun' immediately before escaping
        eq(GAME_STATE.msx_open('NA'), 0x00),
        // CONGRATULATIONS!
        neq(prev(GAME_STATE.music_id('NA')), 0x2b),
        eq(GAME_STATE.music_id('NA'), 0x2b)
      ),
      alt2: define(
        isRegion('JP'),
        // Thoth's Room
        eq(GAME_STATE.field_id('JP'),    0x03),
        eq(GAME_STATE.room_id('JP'),     0x03),
        eq(GAME_STATE.screen_id('JP'),   0x00),
        // Verify all guardians defeated to block laptop glitch shenanigans
        eq(FLAGS.ankh_amphisbaena('JP'), 0x03),
        eq(FLAGS.ankh_sakit('JP'),       0x03),
        eq(FLAGS.ankh_ellmac('JP'),      0x03),
        eq(FLAGS.ankh_bahamut('JP'),     0x03),
        eq(FLAGS.ankh_viy('JP'),         0x03),
        eq(FLAGS.ankh_palenque('JP'),    0x03),
        eq(FLAGS.ankh_baphomet('JP'),    0x03),
        eq(FLAGS.ankh_tiamat('JP'),      0x03),
        eq(FLAGS.mother_defeated('JP'),  0x01),
        // Since we're using a music trigger for timing, ensure laptop is closed to block the edge
        // case of using Enga Musica to play 'Run toward the sun' immediately before escaping
        eq(GAME_STATE.msx_open('JP'), 0x00),
        // CONGRATULATIONS!
        neq(prev(GAME_STATE.music_id('JP')), 0x2b),
        eq(GAME_STATE.music_id('JP'), 0x2b)
      ),
    }
  });

  // Collection (inventory) ------------------------------------
  const collectionAchievements: eventFlagAchievementData[] = [
    {
      title: `[Needs title] Origin Seal`,
      description: `Collect the Origin Seal`,
      points: 0,
      flag: FLAGS.origin_seal, before: 1, after: 2,
      location: { fieldID: 0x04, roomID: 0x05, screenID: 0x00 }
    },
    {
      title: `[Needs title] Life Seal`,
      description: `Collect the Life Seal`,
      points: 0,
      flag: FLAGS.life_seal, before: 1, after: 2,
      location: { fieldID: 0x06, roomID: 0x06, screenID: 0x00 }
    },
    {
      title: `[Needs title] MSX2`,
      description: `Collect the Mobile Super X2. Perfect for playing Maze of Galious!`,
      points: 0,
      flag: FLAGS.msx2, before: 1, after: 2,
      location: { fieldID: 0x01, roomID: 0x02, screenID: 0x00 }
    },
    {
      title: `[Needs title] Shell Horn`,
      description: `Collect the Shell Horn`,
      points: 0,
      flag: FLAGS.shell_horn, before: 1, after: 2,
      location: [
        { fieldID: 0x01, roomID: 0x04, screenID: 0x01 },
        { fieldID: 0x04, roomID: 0x03, screenID: 0x03 }
      ]
    },
    {
      title: `[Needs title] Holy Grail`,
      description: `Collect the Holy Grail`,
      points: 0,
      flag: FLAGS.holy_grail, before: 1, after: 2,
      location: { fieldID: 0x00, roomID: 0x04, screenID: 0x01 }
    },
    {
      title: `[Needs title] Crucifix`,
      description: `Collect the Crucifix`,
      points: 0,
      flag: FLAGS.crucifix, before: 1, after: 2,
      location: { fieldID: 0x00, roomID: 0x01, screenID: 0x01 }
    },
    {
      title: `[Needs title] Grapple Claw`,
      description: `Collect the Grapple Claw`,
      points: 0,
      flag: FLAGS.grapple_claw, before: 1, after: 2,
      location: { fieldID: 0x0c, roomID: 0x00, screenID: 0x00 }
    },
    {
      title: `[Needs title] Eye of Truth`,
      description: `Collect the Eye of Truth`,
      points: 0,
      flag: FLAGS.eye_of_truth, before: 1, after: 2,
      location: { fieldID: 0x0d, roomID: 0x03, screenID: 0x01 }
    },
    {
      title: `[Needs title] Scalesphere`,
      description: `Collect the Scalesphere`,
      points: 0,
      flag: FLAGS.scalesphere, before: 1, after: 2,
      location: { fieldID: 0x04, roomID: 0x03, screenID: 0x00 }
    },
    {
      title: `[Needs title] Treasures`,
      description: `Collect Mr. Slushfund's hidden treasures `,
      points: 0,
      flag: FLAGS.treasures, before: 1, after: 2,
      location: { fieldID: 0x00, roomID: 0x00, screenID: 0x00 }
    },
    {
      title: `[Needs title] Plane Model`,
      description: `Collect the Plane Model`,
      points: 0,
      flag: FLAGS.plane_model, before: 1, after: 2,
      location: { fieldID: 0x0d, roomID: 0x06, screenID: 0x00 }
    },
    {
      title: `[Needs title] Feather`,
      description: `Collect the Feather`,
      points: 0,
      flag: FLAGS.feather, before: 1, after: 2,
      location: { fieldID: 0x01, roomID: 0x00, screenID: 0x00 }
    },
    {
      title: `[Needs title] Fairy Clothes`,
      description: `Collect the Fairy Clothes`,
      points: 0,
      flag: FLAGS.fairy_clothes, before: 1, after: 2,
      location: { fieldID: 0x0a, roomID: 0x06, screenID: 0x00 }
    },
    {
      title: `[Needs title] Hermes' Boots`,
      description: `Collect Hermes' Boots`,
      points: 0,
      flag: FLAGS.hermes_boots, before: 1, after: 2,
      location: { fieldID: 0x02, roomID: 0x06, screenID: 0x00 }
    },
    {
      title: `[Needs title] Twin Statue`,
      description: `Collect the Twin Statue`,
      points: 0,
      flag: FLAGS.twin_statue, before: 1, after: 2,
      location: { fieldID: 0x08, roomID: 0x03, screenID: 0x00 }
    },
    {
      title: `[Needs title] Perfume`,
      description: `Collect the Perfume`,
      points: 0,
      flag: FLAGS.perfume, before: 1, after: 2,
      location: { fieldID: 0x0f, roomID: 0x02, screenID: 0x00 }
    },
    {
      title: `[Needs title] Dimensional Key`,
      description: `Collect the Dimensional Key`,
      points: 0,
      flag: FLAGS.dimensional_key, before: 1, after: 2,
      location: { fieldID: 0x10, roomID: 0x02, screenID: 0x01 }
    },
    {
      title: `[Needs title] Chain Whip`,
      description: `Collect the Chain Whip`,
      points: 0,
      flag: FLAGS.chain_whip,
      location: { fieldID: 0x05, roomID: 0x03, screenID: 0x00 }
    },
    {
      title: `[Needs title] Knife`,
      description: `Collect the Knife`,
      points: 0,
      flag: FLAGS.knife,
      location: { fieldID: 0x03, roomID: 0x01, screenID: 0x02 }
    },
    {
      title: `[Needs title] Katana`,
      description: `Collect the Katana`,
      points: 0,
      flag: FLAGS.katana,
      location: { fieldID: 0x07, roomID: 0x0b, screenID: 0x02 }
    },
    {
      title: `[Needs title] Shuriken`,
      description: `Collect the Shuriken`,
      points: 0,
      flag: FLAGS.shuriken,
      location: { fieldID: 0x00, roomID: 0x02, screenID: 0x00 }
    },
    {
      title: `[Needs title] Earth Spears`,
      description: `Collect the Earth Spears`,
      points: 0,
      flag: FLAGS.earth_spear,
      location: { fieldID: 0x0e, roomID: 0x00, screenID: 0x00 }
    },
    {
      title: `[Needs title] Bomb`,
      description: `Collect the Bomb`,
      points: 0,
      flag: FLAGS.bomb,
      location: { fieldID: 0x0b, roomID: 0x06, screenID: 0x00 }
    },
    {
      title: `[Needs title] Chakram`,
      description: `Collect the Chakram`,
      points: 0,
      flag: FLAGS.chakram,
      location: { fieldID: 0x06, roomID: 0x04, screenID: 0x00 }
    },
    {
      title: `[Needs title] Angel Shield`,
      description: `Collect the Angel Shield`,
      points: 0,
      flag: FLAGS.angel_shield, before: 0, after: 2,
      location: [
        { fieldID: 0x11, roomID: 0x08, screenID: 0x00 },
        { fieldID: 0x0b, roomID: 0x00, screenID: 0x00 },
      ]
    },
    {
      title: `[Needs title] Djed Pillar`,
      description: `Collect the Djed Pillar`,
      points: 0,
      flag: FLAGS.djed_pillar, before: 1, after: 2,
      location: { fieldID: 0x0e, roomID: 0x08, screenID: 0x00 }
    },
    {
      title: `Take That!`,
      description: `Collect the Magatama Jewel. Time to break the Mother's Psyche-Locks?`,
      points: 0,
      flag: FLAGS.magatama_jewel, before: 1, after: 2,
      location: { fieldID: 0x11, roomID: 0x09, screenID: 0x00 }
    },
    {
      title: `[Needs title] Lamp of Time`,
      description: `Collect the Lamp of Time`,
      points: 0,
      flag: FLAGS.lamp_of_time, before: 1, after: 2,
      location: { fieldID: 0x07, roomID: 0x06, screenID: 0x01 }
    },
    // {
    //   title: `[Needs title] Dragon Bone`,
    //   description: `Collect the Dragon Bone`,
    //   points: 0,
    //   flag: FLAGS.dragon_bone, before: 1, after: 2, // TODO fix
    //   location: { fieldID: 0x07, roomID: 0x03, screenID: 0x02 }
    // },
    {
      title: `[Needs title] Vessel`,
      description: `Collect the Vessel`,
      points: 0,
      flag: FLAGS.vessel, before: 1, after: 2,
      location: { fieldID: 0x0f, roomID: 0x01, screenID: 0x01 }
    },
    {
      title: `[Needs title] Key of Eternity`,
      description: `Collect the Key of Eternity`,
      points: 0,
      flag: FLAGS.key_of_eternity, before: 1, after: 2,
      location: { fieldID: 0x0a, roomID: 0x02, screenID: 0x02 }
    },
    {
      title: `[Needs title] Talisman`,
      description: `Collect the Talisman`,
      points: 0,
      flag: FLAGS.talisman, before: 0, after: 2,
      location: { fieldID: 0x03, roomID: 0x04, screenID: 0x02 }
    },
    {
      title: `[Needs title] Mulana Talisman`,
      description: `Collect the Mulana Talisman`,
      points: 0,
      flag: FLAGS.mulana_talisman, before: 1, after: 2,
      location: { fieldID: 0x01, roomID: 0x02, screenID: 0x01 }
    },
  ];

  collectionAchievements.forEach((data) => {
    const { title, description, points } = data;
    
    set.addAchievement({
      title, description, points,
      conditions: eventFlagTrigger(data)
    });
  });

  set.addAchievement({
    title: `[Needs title] Buckler`,
    description: `Collect the Buckler`,
    points: 1,
    conditions: {
      core: define( eq(1, 1) ),
      alt1: define(
        orNext(
          isRegion('NA'),
          isRegion('EU'),
        ),
        neq(prev(GAME_STATE.field_id('NA')), 0xff),
        eq(GAME_STATE.field_id('NA'), 0x01),
        eq(GAME_STATE.room_id('NA'),  0x02),
        eq(GAME_STATE.screen_id('NA'),0x01),
        cond('',           GAME_STATE.inventory_ptr('NA'), '!=', 0x00),
        cond('AddAddress', GAME_STATE.inventory_ptr('NA'), '&',  0x7fffffff),
        cond('',           prev(INVENTORY.buckler),        '=',  0),
        cond('AddAddress', GAME_STATE.inventory_ptr('NA'), '&',  0x7fffffff),
        cond('',           INVENTORY.buckler,              '=',  1),
      ),
      alt2: define(
        isRegion('JP'),
        neq(prev(GAME_STATE.field_id('JP')), 0xff),
        eq(GAME_STATE.field_id('JP'), 0x01),
        eq(GAME_STATE.room_id('JP'),  0x02),
        eq(GAME_STATE.screen_id('JP'),0x01),
        cond('',           GAME_STATE.inventory_ptr('JP'), '!=', 0x00),
        cond('AddAddress', GAME_STATE.inventory_ptr('JP'), '&',  0x7fffffff),
        cond('',           prev(INVENTORY.buckler),        '=',  0),
        cond('AddAddress', GAME_STATE.inventory_ptr('JP'), '&',  0x7fffffff),
        cond('',           INVENTORY.buckler,              '=',  1),
      )
    }
  });

  set.addAchievement({
    title: `[Needs title] Dragon Bone`,
    description: `Collect the Dragon Bone`,
    points: 1,
    conditions: {
      core: define( eq(1, 1) ),
      alt1: define(
        orNext(
          isRegion('NA'),
          isRegion('EU'),
        ),
        neq(prev(GAME_STATE.field_id('NA')), 0xff),
        eq(GAME_STATE.field_id('NA'), 0x07),
        eq(GAME_STATE.room_id('NA'),  0x0c),
        eq(GAME_STATE.screen_id('NA'),0x02),
        cond('',           GAME_STATE.inventory_ptr('NA'), '!=', 0x00),
        cond('AddAddress', GAME_STATE.inventory_ptr('NA'), '&',  0x7fffffff),
        cond('',           prev(INVENTORY.dragon_bone),    '=',  0),
        cond('AddAddress', GAME_STATE.inventory_ptr('NA'), '&',  0x7fffffff),
        cond('',           INVENTORY.dragon_bone,          '>=', 1),
      ),
      alt2: define(
        isRegion('JP'),
        neq(prev(GAME_STATE.field_id('JP')), 0xff),
        eq(GAME_STATE.field_id('JP'), 0x07),
        eq(GAME_STATE.room_id('JP'),  0x0c),
        eq(GAME_STATE.screen_id('JP'),0x02),
        cond('',           GAME_STATE.inventory_ptr('JP'), '!=', 0x00),
        cond('AddAddress', GAME_STATE.inventory_ptr('JP'), '&',  0x7fffffff),
        cond('',           prev(INVENTORY.dragon_bone),    '=',  0),
        cond('AddAddress', GAME_STATE.inventory_ptr('JP'), '&',  0x7fffffff),
        cond('',           INVENTORY.dragon_bone,          '>=', 1),
      )
    }
  });

  // Collection (other) ----------------------------------------
  set.addAchievement({
    title: `[Needs title] Xelpud Show and Tell`,
    description: `Receive "helpful" advice from Xelpud about all use items`,
    points: 5,
    type: 'missable',
    conditions: {
      core: define( eq(1, 1) ),
      alt1: define(
        measuredIf(
          orNext(
            isRegion('NA'),
            isRegion('EU'),
          )
        ),
        eq(GAME_STATE.location('NA'), 0x010201),
        ...range(0, 15).map(n =>
          cond('AddSource', prev(FLAGS_EX.item_conversation(n)('NA'))),
        ),
        cond('AddSource', prev(FLAGS_EX.hand_scanner_conversation('NA'))),
        cond('AddSource', prev(FLAGS_EX.diary_conversation('NA')), '/', 3),
        cond('AddSource', prev(FLAGS_EX.mulana_talisman_conversation('NA'))),
        eq(0, 16),
        ...range(0, 15).map(n =>
          cond('AddSource', FLAGS_EX.item_conversation(n)('NA')),
        ),
        cond('AddSource', FLAGS_EX.hand_scanner_conversation('NA')),
        cond('AddSource', FLAGS_EX.diary_conversation('NA'), '/', 3),
        cond('AddSource', FLAGS_EX.mulana_talisman_conversation('NA')),
        cond('Measured', 0, '=', 17)
      ),
      alt2: define(
        measuredIf(
          isRegion('JP'),
        ),
        eq(GAME_STATE.location('JP'), 0x010201),
        ...range(0, 15).map(n =>
          cond('AddSource', prev(FLAGS_EX.item_conversation(n)('JP'))),
        ),
        cond('AddSource', prev(FLAGS_EX.hand_scanner_conversation('JP'))),
        cond('AddSource', prev(FLAGS_EX.diary_conversation('JP')), '/', 3),
        cond('AddSource', prev(FLAGS_EX.mulana_talisman_conversation('JP'))),
        eq(0, 16),
        ...range(0, 15).map(n =>
          cond('AddSource', FLAGS_EX.item_conversation(n)('JP')),
        ),
        cond('AddSource', FLAGS_EX.hand_scanner_conversation('JP')),
        cond('AddSource', FLAGS_EX.diary_conversation('JP'), '/', 3),
        cond('AddSource', FLAGS_EX.mulana_talisman_conversation('JP')),
        cond('Measured', 0, '=', 17)
      ),
    }
  });
  
  set.addAchievement({
    title: `The Cartography Zome`,
    description: `Collect all maps`,
    points: 10,
    type: 'missable',
    conditions: {
      core: define( eq(1, 1) ),
      alt1: define(
        measuredIf(
          orNext(
            isRegion('NA'),
            isRegion('EU'),
          ),
          neq(GAME_STATE.field_id('NA'), 0xff),
        ),
        ...range(0, 17).map((n) =>
          cond('AddSource', prev(FLAGS_EX.map(n)('NA')), '/', 2)
        ),
        eq(0, 16),
        ...range(0, 17).map((n) =>
          cond('AddSource', FLAGS_EX.map(n)('NA'), '/', 2)
        ),
        cond('Measured', 0, '=', 17),
      ),
      alt2: define(
        measuredIf(
          isRegion('JP'),
          neq(GAME_STATE.field_id('JP'), 0xff),
        ),
        ...range(0, 17).map((n) =>
          cond('AddSource', prev(FLAGS_EX.map(n)('JP')), '/', 2)
        ),
        eq(0, 16),
        ...range(0, 17).map((n) =>
          cond('AddSource', FLAGS_EX.map(n)('JP'), '/', 2)
      ),
        cond('Measured', 0, '=', 17),
      )
    }
  });
  
  set.addAchievement({
    title: `I Need a Better Spam Filter`,
    description: `Receive all of Xelpud's emails`,
    points: 10,
    type: 'missable',
    conditions: {
      core: define( eq(1, 1) ),
      alt1: define(
        measuredIf(
          orNext(
            isRegion('NA'),
            isRegion('EU'),
          ),
          neq(GAME_STATE.field_id('NA'), 0xff),
        ),
        eq(prev(FLAGS.email_counter('NA')), 43),
        define(
          eq(FLAGS.email_counter('NA'), 44),
        ).withLast({ flag: 'Measured'} )
      ),
      alt2: define(
        measuredIf(
          isRegion('JP'),
          neq(GAME_STATE.field_id('JP'), 0xff),
        ),
        eq(prev(FLAGS.email_counter('JP')), 43),
        define(
          eq(FLAGS.email_counter('JP'), 44),
        ).withLast({ flag: 'Measured'} )
      )
    }
  });

  set.addAchievement({
    title: `Download More RAM`,
    description: `Collect all utility software`,
    points: 10,
    conditions: {
      core: define( eq(1, 1) ),
      alt1: define(
        measuredIf(
          orNext(
            isRegion('NA'),
            isRegion('EU'),
          ),
          neq(GAME_STATE.field_id('NA'), 0xff),
        ),
        cond('AddSource', prev(FLAGS_EX.software(0)('NA')),  '/', 2),
        cond('AddSource', prev(FLAGS_EX.software(1)('NA'))),
        cond('AddSource', prev(FLAGS_EX.software(2)('NA')),  '/', 2),
        cond('AddSource', prev(FLAGS_EX.software(3)('NA')),  '/', 2),
        cond('AddSource', prev(FLAGS_EX.software(4)('NA')),  '/', 2),
        cond('AddSource', prev(FLAGS_EX.software(5)('NA'))),
        cond('AddSource', prev(FLAGS_EX.software(6)('NA'))),
        cond('AddSource', prev(FLAGS_EX.software(7)('NA'))),
        cond('AddSource', prev(FLAGS_EX.software(8)('NA'))),
        cond('AddSource', prev(FLAGS_EX.software(9)('NA'))),
        cond('AddSource', prev(FLAGS_EX.software(10)('NA'))),
        cond('', 0, '=', 10),
        cond('AddSource', FLAGS_EX.software(0)('NA'),  '/', 2),
        cond('AddSource', FLAGS_EX.software(1)('NA')),
        cond('AddSource', FLAGS_EX.software(2)('NA'),  '/', 2),
        cond('AddSource', FLAGS_EX.software(3)('NA'),  '/', 2),
        cond('AddSource', FLAGS_EX.software(4)('NA'),  '/', 2),
        cond('AddSource', FLAGS_EX.software(5)('NA')),
        cond('AddSource', FLAGS_EX.software(6)('NA')),
        cond('AddSource', FLAGS_EX.software(7)('NA')),
        cond('AddSource', FLAGS_EX.software(8)('NA')),
        cond('AddSource', FLAGS_EX.software(9)('NA')),
        cond('AddSource', FLAGS_EX.software(10)('NA')),
        cond('Measured', 0, '=', 11),
      ),
      alt2: define(
        measuredIf(
          isRegion('JP'),
          neq(GAME_STATE.field_id('JP'), 0xff),
        ),
        cond('AddSource', prev(FLAGS_EX.software(0)('JP')),  '/', 2),
        cond('AddSource', prev(FLAGS_EX.software(1)('JP'))),
        cond('AddSource', prev(FLAGS_EX.software(2)('JP')),  '/', 2),
        cond('AddSource', prev(FLAGS_EX.software(3)('JP')),  '/', 2),
        cond('AddSource', prev(FLAGS_EX.software(4)('JP')),  '/', 2),
        cond('AddSource', prev(FLAGS_EX.software(5)('JP'))),
        cond('AddSource', prev(FLAGS_EX.software(6)('JP'))),
        cond('AddSource', prev(FLAGS_EX.software(7)('JP'))),
        cond('AddSource', prev(FLAGS_EX.software(8)('JP'))),
        cond('AddSource', prev(FLAGS_EX.software(9)('JP'))),
        cond('AddSource', prev(FLAGS_EX.software(10)('JP'))),
        cond('', 0, '=', 10),
        cond('AddSource', FLAGS_EX.software(0)('JP'),  '/', 2),
        cond('AddSource', FLAGS_EX.software(1)('JP')),
        cond('AddSource', FLAGS_EX.software(2)('JP'),  '/', 2),
        cond('AddSource', FLAGS_EX.software(3)('JP'),  '/', 2),
        cond('AddSource', FLAGS_EX.software(4)('JP'),  '/', 2),
        cond('AddSource', FLAGS_EX.software(5)('JP')),
        cond('AddSource', FLAGS_EX.software(6)('JP')),
        cond('AddSource', FLAGS_EX.software(7)('JP')),
        cond('AddSource', FLAGS_EX.software(8)('JP')),
        cond('AddSource', FLAGS_EX.software(9)('JP')),
        cond('AddSource', FLAGS_EX.software(10)('JP')),
        cond('Measured', 0, '=', 11),
      )
    }
  });
  
  set.addAchievement({
    title: `[Needs title] Fairy Points`,
    description: `Visit all fairy points`,
    points: 5,
    type: 'missable',
    conditions: {
      core: define( eq(1, 1) ),
      alt1: define(
        measuredIf(
          orNext(
            isRegion('NA'),
            isRegion('EU'),
          ),
          neq(GAME_STATE.field_id('NA'), 0xff),
        ),
        eq(prev(FLAGS.fairies_counter('NA')), 8),
        define(
          eq(FLAGS.fairies_counter('NA'), 9),
        ).withLast({ flag: 'Measured'} )
      ),
      alt2: define(
        measuredIf(
          isRegion('JP'),
          neq(GAME_STATE.field_id('JP'), 0xff),
        ),
        eq(prev(FLAGS.fairies_counter('JP')), 8),
        define(
          eq(FLAGS.fairies_counter('JP'), 9),
        ).withLast({ flag: 'Measured'} )
      )
    }
  });
  
  set.addAchievement({
    title: `[Needs title] Mr Fishman's Shop`,
    description: `[Needs description]`,
    points: 3,
    type: 'missable',
    conditions: {
      core: define( eq(1, 1) ),
      alt1: define(
        orNext(
          isRegion('NA'),
          isRegion('EU'),
        ),
        eq(GAME_STATE.location('NA'), 0x040303),
        eq(prev(FLAGS.gyonin_primed('NA')), 0),
        eq(FLAGS.gyonin_primed('NA'), 1),
      ),
      alt2: define(
        isRegion('JP'),
        eq(GAME_STATE.location('JP'), 0x040303),
        eq(prev(FLAGS.gyonin_primed('JP')), 0),
        eq(FLAGS.gyonin_primed('JP'), 1),
      )
    }
  });

  set.addAchievement({
    title: `Bombs Away!`,
    description: `Reveal an unusual shortcut to the Graveyard of the Giants grail tablet`,
    points: 1,
    conditions: {
      core: define( eq(1, 1) ),
      alt1: define(
        orNext(
          isRegion('NA'),
          isRegion('EU'),
        ),
        eq(GAME_STATE.location('NA'), 0x0b0403),
        eq(prev(FLAGS.graveyard_shortcut('NA')), 0),
        eq(FLAGS.graveyard_shortcut('NA'), 1),
      ),
      alt2: define(
        isRegion('JP'),
        eq(GAME_STATE.location('JP'), 0x0b0403),
        eq(prev(FLAGS.graveyard_shortcut('JP')), 0),
        eq(FLAGS.graveyard_shortcut('JP'), 1),
      )
    }
  });

  // Subbosses -------------------------------------------------
  const subBossAchievements: eventFlagAchievementData[] = [
    {
      title: `[Needs title] Defeat Peryton`,
      description: `[Needs description]`,
      points: 2,
      flag: FLAGS.peryton,
      location: { fieldID: 0x07, roomID: 0x10, screenID: 0x00 }
    },
    {
      title: `[Needs title] Defeat Ox-Head and Horse-Face`,
      description: `[Needs description]`,
      points: 2,
      flag: FLAGS.gozu_and_mezu,
      location: { fieldID: 0x06, roomID: 0x01, screenID: 0x00 }
    },
    {
      title: `[Needs title] Defeat Beelzebub`,
      description: `[Needs description]`,
      points: 2,
      flag: FLAGS.beelzebub,
      location: { fieldID: 0x12, roomID: 0x07, screenID: 0x01 }
    },
  ];

  subBossAchievements.forEach((data) => {
    const { title, description, points } = data;
    
    set.addAchievement({
      title, description, points,
      conditions: eventFlagTrigger(data)
    });
  });

  // Subboss challenges ----------------------------------------
  const subBossChallenges: {
      title: string, description: string, points: number, id?: number,
      fieldID: number, roomID: number, screenID: number,
      bossFlag: FooBar, flagBefore?: number, flagAfter?: number,
      resetLogic: (ll: Locale) => ConditionBuilder,
  }[] = [
    {
      title: `[Needs title] Defeat Hekatonheires in the Dark`,
      description: `[Needs description]`,
      points: 3,
      fieldID: 0x06, roomID: 0x04, screenID: 0x00,
      bossFlag: FLAGS.hekatonkheires,
      flagBefore: 1, flagAfter: 2,
      resetLogic: (ll: Locale) => define(
        resetIf(
          andNext(
            isRegion(ll),
            eq(FLAGS.extinction_lights_permanent(ll), 1),
          )
        ),
        resetIf(
          andNext(
            isRegion(ll),
            eq(FLAGS.extinction_lights_temporary(ll), 1),
          )
        ),
      ),
    },

    {
      title: `Time Flies`,
      description: `Defeat Zu without using the Lamp of Time`,
      points: 3,
      fieldID: 0x07, roomID: 0x05, screenID: 0x00,
      bossFlag: FLAGS.zu,
      resetLogic: (ll: Locale) => resetIf(
        andNext(
          isRegion(ll),
          eq(GAME_STATE.lamp_active(ll), 1),
        )
      ),
    },

    {
      title: `[Needs title] Defeat Mushnahhu without taking damage`,
      description: `[Needs description]`,
      points: 3,
      fieldID: 0x11, roomID: 0x08, screenID: 0x01,
      bossFlag: FLAGS.mushnahhu,
      resetLogic: (ll: Locale) => define(
        cond('AndNext',    SYSTEM.title_id,           '=',  titleID(ll)),
        cond('AndNext',    GAME_STATE.lemeza_ptr(ll), '!=', 0x00),
        cond('AddAddress', GAME_STATE.lemeza_ptr(ll), '&',  0x7fffffff),
        cond('ResetIf',    LEMEZA.health,             '<',  prev(LEMEZA.health))
      ),
    },

  ];

  function subBossChallenge(opts: {
      fieldID: number, roomID: number, screenID: number,
      bossFlag: FooBar, flagBefore?: number, flagAfter?: number,
      resetLogic: (ll: Locale) => ConditionBuilder,
  }) {
    const { 
      fieldID, roomID, screenID,
      bossFlag, flagBefore, flagAfter,
      resetLogic
    } = opts;
    const location    = (fieldID << 16) | (roomID << 8) | screenID;
    const room_screen = (roomID << 8) | screenID;

    return (ll: Locale) => define(
      once(
        andNext(
          isRegion(ll),
          eq(bossFlag(ll), 0),
          eq(prev(GAME_STATE.field_id(ll)), fieldID),
          eq(GAME_STATE.field_id(ll), fieldID),
          neq(prev(GAME_STATE.room_screen(ll)), room_screen),
          eq(GAME_STATE.room_screen(ll), room_screen),
        )
      ),
      trigger(
        andNext(
          eq(prev(bossFlag(ll)), flagBefore ?? 0),
          eq(bossFlag(ll), flagAfter ?? 1),
        )
      ),
      resetLogic(ll),
      resetIf(
        andNext(
          isRegion(ll),
          neq(GAME_STATE.location(ll), location)
        )
      ),
      resetIf( 
        andNext(
          isRegion(ll),
          eq(GAME_STATE.music_id(ll), 0x2c) // Game over music
        )
      ),
      cond('AndNext',    SYSTEM.title_id,           '=',  titleID(ll)),
      cond('AndNext',    GAME_STATE.lemeza_ptr(ll), '!=', 0x00),
      cond('AddAddress', GAME_STATE.lemeza_ptr(ll), '&',  0x7fffffff),
      cond('ResetIf',    LEMEZA.health,             '=',  0x00)
    );
  }

  subBossChallenges.forEach((data) => {
    const { title, description, points } = data;
    
    set.addAchievement({
      title, description, points,
      type: 'missable',
      conditions: {
        core: define( eq(1, 1) ),
        alt1: subBossChallenge(data)('NA'),
        alt2: subBossChallenge(data)('EU'),
        alt3: subBossChallenge(data)('JP'),
      }
    })
  });

  // Challenges ------------------------------------------------
  const aimAndShootLogic = (ll: Locale) => define(
    isRegion(ll),
    once(
      andNext(
        isRegion(ll),
        eq(FLAGS.aim_and_shoot(ll), 0),
        eq(prev(GAME_STATE.field_id(ll)), 0x03),
        eq(GAME_STATE.field_id(ll), 0x03),
        neq(prev(GAME_STATE.room_screen(ll)), 0x0102),
        eq(GAME_STATE.room_screen(ll), 0x0102),
      )
    ),
    trigger(
      andNext(
        lt(prev(FLAGS.aim_and_shoot(ll)), 2),
        eq(FLAGS.aim_and_shoot(ll), 2)
      )
    ),
    resetIf(
      andNext(
        isRegion(ll),
        eq(GAME_STATE.subweapon_used(ll), 0x08)
      )
    ),
    resetIf(
      andNext(
        isRegion(ll),
        neq(GAME_STATE.location(ll), 0x030102)
      )
    ),
  );
  
  set.addAchievement({
    title: `[Needs title] Aim and Shoot`,
    description: `Complete the "Aim and Shoot" puzzle without throwing any shuriken`,
    points: 0,
    type: 'missable',
    conditions: {
      core: define( eq(1, 1) ),
      alt1: aimAndShootLogic('NA'),
      alt2: aimAndShootLogic('EU'),
      alt3: aimAndShootLogic('JP'),
    }
  });

  set.addAchievement({
    title: `[Needs title] Fast Flail Whip`,
    description: `Collect the flail whip after defeating only one guardian`,
    points: 10,
    type: 'missable',
    conditions: {
      core: define( eq(1, 1) ),
      alt1: define(
        orNext(
          isRegion('NA'),
          isRegion('EU'),
        ),
        eq(GAME_STATE.field_id('NA'),    0x0d),
        eq(GAME_STATE.room_id('NA'),     0x05),
        eq(GAME_STATE.screen_id('NA'),   0x00),
        eq(FLAGS.guardians_defeated('NA'), 1),
        eq(prev(FLAGS.flail_whip('NA')), 0),
        eq(FLAGS.flail_whip('NA'), 1),
      ),
      alt2: define(
        isRegion('JP'),
        eq(GAME_STATE.field_id('JP'),    0x0d),
        eq(GAME_STATE.room_id('JP'),     0x05),
        eq(GAME_STATE.screen_id('JP'),   0x00),
        eq(FLAGS.guardians_defeated('JP'), 1),
        eq(prev(FLAGS.flail_whip('JP')), 0),
        eq(FLAGS.flail_whip('JP'), 1),
      ),
    }
  });
  
  set.addAchievement({
    title: `[Needs title] All Characters Ending`,
    description: `Complete the game with all possible characters appearing in the ending sequence`,
    points: 50,
    type: 'missable',
    conditions: {
      core: define( eq(1, 1) ),
      alt1: define(
        orNext(
          isRegion('NA'),
          isRegion('EU'),
        ),
        // Thoth's Room
        eq(GAME_STATE.field_id('NA'),    0x03),
        eq(GAME_STATE.room_id('NA'),     0x03),
        eq(GAME_STATE.screen_id('NA'),   0x00),
        // Verify all guardians defeated to block laptop glitch shenanigans
        eq(FLAGS.ankh_amphisbaena('NA'), 0x03),
        eq(FLAGS.ankh_sakit('NA'),       0x03),
        eq(FLAGS.ankh_ellmac('NA'),      0x03),
        eq(FLAGS.ankh_bahamut('NA'),     0x03),
        eq(FLAGS.ankh_viy('NA'),         0x03),
        eq(FLAGS.ankh_palenque('NA'),    0x03),
        eq(FLAGS.ankh_baphomet('NA'),    0x03),
        eq(FLAGS.ankh_tiamat('NA'),      0x03),
        eq(FLAGS.mother_defeated('NA'),  0x01),
        // Since we're using a music trigger for timing, ensure laptop is closed to block the edge
        // case of using Enga Musica to play 'Run toward the sun' immediately before escaping
        eq(GAME_STATE.msx_open('NA'), 0x00),
        // Alsedana requires all Sorbs
        eq(FLAGS.orb_count('NA'), 10),
        // Skeleton requires all software, Giltoriyo requires La-Mulana, Fobos requires Enga Musica
        eq(FLAGS_EX.software(0)('NA'),  2),
        eq(FLAGS_EX.software(1)('NA'),  1),
        eq(FLAGS_EX.software(2)('NA'),  2),
        eq(FLAGS_EX.software(3)('NA'),  2),
        eq(FLAGS_EX.software(4)('NA'),  2),
        eq(FLAGS_EX.software(5)('NA'),  1),
        eq(FLAGS_EX.software(6)('NA'),  1),
        eq(FLAGS_EX.software(7)('NA'),  1),
        eq(FLAGS_EX.software(8)('NA'),  1),
        eq(FLAGS_EX.software(9)('NA'),  1),
        eq(FLAGS_EX.software(10)('NA'), 1),
        eq(FLAGS_EX.software(11)('NA'), 2),
        eq(FLAGS_EX.software(12)('NA'), 2),
        eq(FLAGS_EX.software(13)('NA'), 2),
        eq(FLAGS_EX.software(14)('NA'), 2),
        eq(FLAGS_EX.software(15)('NA'), 2),
        eq(FLAGS_EX.software(16)('NA'), 2),
        eq(FLAGS_EX.software(17)('NA'), 1),
        eq(FLAGS_EX.software(18)('NA'), 2),
        eq(FLAGS_EX.software(19)('NA'), 2),
        // Weapon fairy requires all fairy points
        eq(FLAGS.fairies_counter('NA'), 9),
        // Treasure fairy requires all coin chests
        eq(FLAGS.coin_chests('NA'), 28),
        // Key fairy requires all key fairy checks
        eq(FLAGS.key_fairy_checks('NA'), 4),
        // Freyja requires all items
        ...range( 0, 11).map(n => eq(FLAGS_EX.equip_item(n)('NA'), 2)),
        eq(FLAGS_EX.equip_item(11)('NA'), 1),
        ...range(12, 14).map(n => eq(FLAGS_EX.equip_item(n)('NA'), 2)),
        ...range(15, 18).map(n => eq(FLAGS_EX.equip_item(n)('NA'), 2)),
        ...range(19, 20).map(n => eq(FLAGS_EX.equip_item(n)('NA'), 2)),
        eq(FLAGS_EX.equip_item(11)('NA'), 1),
        ...range(21, 24).map(n => eq(FLAGS_EX.equip_item(n)('NA'), 2)),
        eq(FLAGS_EX.equip_item(24)('NA'), 1),
        ...range(25, 29).map(n => eq(FLAGS_EX.equip_item(n)('NA'), 2)),
        eq(FLAGS.msx2('NA'), 2),
        gt(FLAGS.flail_whip('NA'), 0),
        gt(FLAGS.knife('NA'), 0),
        gt(FLAGS.axe('NA'), 0),
        gt(FLAGS.katana('NA'), 0),
        gt(FLAGS.shuriken('NA'), 0),
        gt(FLAGS.rolly_boys('NA'), 0),
        gt(FLAGS.earth_spear('NA'), 0),
        gt(FLAGS.flare_gun('NA'), 0),
        gt(FLAGS.bomb('NA'), 0),
        gt(FLAGS.chakram('NA'), 0),
        gt(FLAGS.caltrops('NA'), 0),
        gt(FLAGS.pistol('NA'), 0),
        gt(FLAGS.angel_shield('NA'), 0),
        // Nebur requires all maps
        ...range(0, 17).map(n => eq(FLAGS_EX.map(n)('NA'), 2)),
        // Gyonin requires shop purchase
        eq(FLAGS.gyonin_primed('NA'), 1),
        // Sacrificial maiden requires all Xelpud emails
        eq(FLAGS.email_counter('NA'), 44),
        // Mother requires hard mode
        eq(FLAGS.hard_mode_activated('NA'), 1),
        // Naramura requires all developer rooms
        eq(FLAGS.naramura_room('NA'), 1),
        eq(FLAGS.duplex_room('NA'), 1),
        eq(FLAGS.samieru_room('NA'), 1),
        // Samaranta, Argus, and Rusalii have speedrun requirements
        lt(GAME_STATE.in_game_time('NA'), timeToMilliseconds({ hours: 10 })),
        // CONGRATULATIONS!
        neq(prev(GAME_STATE.music_id('NA')), 0x2b),
        eq(GAME_STATE.music_id('NA'), 0x2b)
      ),
      alt2: define(
        isRegion('JP'),
        // Thoth's Room
        eq(GAME_STATE.field_id('JP'),    0x03),
        eq(GAME_STATE.room_id('JP'),     0x03),
        eq(GAME_STATE.screen_id('JP'),   0x00),
        // Verify all guardians defeated to block laptop glitch shenanigans
        eq(FLAGS.ankh_amphisbaena('JP'), 0x03),
        eq(FLAGS.ankh_sakit('JP'),       0x03),
        eq(FLAGS.ankh_ellmac('JP'),      0x03),
        eq(FLAGS.ankh_bahamut('JP'),     0x03),
        eq(FLAGS.ankh_viy('JP'),         0x03),
        eq(FLAGS.ankh_palenque('JP'),    0x03),
        eq(FLAGS.ankh_baphomet('JP'),    0x03),
        eq(FLAGS.ankh_tiamat('JP'),      0x03),
        eq(FLAGS.mother_defeated('JP'),  0x01),
        // Since we're using a music trigger for timing, ensure laptop is closed to block the edge
        // case of using Enga Musica to play 'Run toward the sun' immediately before escaping
        eq(GAME_STATE.msx_open('JP'), 0x00),
        // Alsedana requires all Sorbs
        eq(FLAGS.orb_count('JP'), 10),
        // Skeleton requires all software, Giltoriyo requires La-Mulana, Fobos requires Enga Musica
        eq(FLAGS_EX.software(0)('JP'),  2),
        eq(FLAGS_EX.software(1)('JP'),  1),
        eq(FLAGS_EX.software(2)('JP'),  2),
        eq(FLAGS_EX.software(3)('JP'),  2),
        eq(FLAGS_EX.software(4)('JP'),  2),
        eq(FLAGS_EX.software(5)('JP'),  1),
        eq(FLAGS_EX.software(6)('JP'),  1),
        eq(FLAGS_EX.software(7)('JP'),  1),
        eq(FLAGS_EX.software(8)('JP'),  1),
        eq(FLAGS_EX.software(9)('JP'),  1),
        eq(FLAGS_EX.software(10)('JP'), 1),
        eq(FLAGS_EX.software(11)('JP'), 2),
        eq(FLAGS_EX.software(12)('JP'), 2),
        eq(FLAGS_EX.software(13)('JP'), 2),
        eq(FLAGS_EX.software(14)('JP'), 2),
        eq(FLAGS_EX.software(15)('JP'), 2),
        eq(FLAGS_EX.software(16)('JP'), 2),
        eq(FLAGS_EX.software(17)('JP'), 1),
        eq(FLAGS_EX.software(18)('JP'), 2),
        eq(FLAGS_EX.software(19)('JP'), 2),
        // Weapon fairy requires all fairy points
        eq(FLAGS.fairies_counter('JP'), 9),
        // Treasure fairy requires all coin chests
        eq(FLAGS.coin_chests('JP'), 28),
        // Key fairy requires all key fairy checks
        eq(FLAGS.key_fairy_checks('JP'), 4),
        // Freyja requires all items
        ...range( 0, 11).map(n => eq(FLAGS_EX.equip_item(n)('JP'), 2)),
        eq(FLAGS_EX.equip_item(11)('JP'), 1),
        ...range(12, 14).map(n => eq(FLAGS_EX.equip_item(n)('JP'), 2)),
        ...range(15, 18).map(n => eq(FLAGS_EX.equip_item(n)('JP'), 2)),
        ...range(19, 20).map(n => eq(FLAGS_EX.equip_item(n)('JP'), 2)),
        eq(FLAGS_EX.equip_item(11)('JP'), 1),
        ...range(21, 24).map(n => eq(FLAGS_EX.equip_item(n)('JP'), 2)),
        eq(FLAGS_EX.equip_item(24)('JP'), 1),
        ...range(25, 29).map(n => eq(FLAGS_EX.equip_item(n)('JP'), 2)),
        eq(FLAGS.msx2('JP'), 2),
        gt(FLAGS.flail_whip('JP'), 0),
        gt(FLAGS.knife('JP'), 0),
        gt(FLAGS.axe('JP'), 0),
        gt(FLAGS.katana('JP'), 0),
        gt(FLAGS.shuriken('JP'), 0),
        gt(FLAGS.rolly_boys('JP'), 0),
        gt(FLAGS.earth_spear('JP'), 0),
        gt(FLAGS.flare_gun('JP'), 0),
        gt(FLAGS.bomb('JP'), 0),
        gt(FLAGS.chakram('JP'), 0),
        gt(FLAGS.caltrops('JP'), 0),
        gt(FLAGS.pistol('JP'), 0),
        gt(FLAGS.angel_shield('JP'), 0),
        // Nebur requires all maps
        ...range(0, 17).map(n => eq(FLAGS_EX.map(n)('JP'), 2)),
        // Gyonin requires shop purchase
        eq(FLAGS.gyonin_primed('JP'), 1),
        // Sacrificial maiden requires all Xelpud emails
        eq(FLAGS.email_counter('JP'), 44),
        // Mother requires hard mode
        eq(FLAGS.hard_mode_activated('JP'), 1),
        // Naramura requires all developer rooms
        eq(FLAGS.naramura_room('JP'), 1),
        eq(FLAGS.duplex_room('JP'), 1),
        eq(FLAGS.samieru_room('JP'), 1),
        // Samaranta, Argus, and Rusalii have speedrun requirements
        lt(GAME_STATE.in_game_time('JP'), timeToMilliseconds({ hours: 10 })),
        // CONGRATULATIONS!
        neq(prev(GAME_STATE.music_id('JP')), 0x2b),
        eq(GAME_STATE.music_id('JP'), 0x2b)
      ),
    }
  });

  set.addAchievement({
    title: `Argus Recognizes Your Skills`,
    description: `Complete the game in under 20 hours on the in-game clock`,
    points: 25,
    type: 'missable',
    conditions: {
      core: define( eq(1, 1) ),
      alt1: define(
        orNext(
          isRegion('NA'),
          isRegion('EU'),
        ),
        // Thoth's Room
        eq(GAME_STATE.field_id('NA'),    0x03),
        eq(GAME_STATE.room_id('NA'),     0x03),
        eq(GAME_STATE.screen_id('NA'),   0x00),
        // Verify all guardians defeated to block laptop glitch shenanigans
        eq(FLAGS.ankh_amphisbaena('NA'), 0x03),
        eq(FLAGS.ankh_sakit('NA'),       0x03),
        eq(FLAGS.ankh_ellmac('NA'),      0x03),
        eq(FLAGS.ankh_bahamut('NA'),     0x03),
        eq(FLAGS.ankh_viy('NA'),         0x03),
        eq(FLAGS.ankh_palenque('NA'),    0x03),
        eq(FLAGS.ankh_baphomet('NA'),    0x03),
        eq(FLAGS.ankh_tiamat('NA'),      0x03),
        eq(FLAGS.mother_defeated('NA'),  0x01),
        // Since we're using a music trigger for timing, ensure laptop is closed to block the edge
        // case of using Enga Musica to play 'Run toward the sun' immediately before escaping
        eq(GAME_STATE.msx_open('NA'), 0x00),
        // Gotta go fast
        lt(GAME_STATE.in_game_time('NA'), timeToMilliseconds({ hours: 20 })),
        // CONGRATULATIONS!
        neq(prev(GAME_STATE.music_id('NA')), 0x2b),
        eq(GAME_STATE.music_id('NA'), 0x2b)
      ),
      alt2: define(
        isRegion('JP'),
        // Thoth's Room
        eq(GAME_STATE.field_id('JP'),    0x03),
        eq(GAME_STATE.room_id('JP'),     0x03),
        eq(GAME_STATE.screen_id('JP'),   0x00),
        // Verify all guardians defeated to block laptop glitch shenanigans
        eq(FLAGS.ankh_amphisbaena('JP'), 0x03),
        eq(FLAGS.ankh_sakit('JP'),       0x03),
        eq(FLAGS.ankh_ellmac('JP'),      0x03),
        eq(FLAGS.ankh_bahamut('JP'),     0x03),
        eq(FLAGS.ankh_viy('JP'),         0x03),
        eq(FLAGS.ankh_palenque('JP'),    0x03),
        eq(FLAGS.ankh_baphomet('JP'),    0x03),
        eq(FLAGS.ankh_tiamat('JP'),      0x03),
        eq(FLAGS.mother_defeated('JP'),  0x01),
        // Since we're using a music trigger for timing, ensure laptop is closed to block the edge
        // case of using Enga Musica to play 'Run toward the sun' immediately before escaping
        eq(GAME_STATE.msx_open('JP'), 0x00),
        // Gotta go fast
        lt(GAME_STATE.in_game_time('JP'), timeToMilliseconds({ hours: 20 })),
        // CONGRATULATIONS!
        neq(prev(GAME_STATE.music_id('JP')), 0x2b),
        eq(GAME_STATE.music_id('JP'), 0x2b)
      ),
    }
  });
  
  
  set.addAchievement({
    title: `Sphereless Challenger`,
    description: `Complete the game without collecting any sacred orbs`,
    points: 50,
    type: 'missable',
    conditions: {
      core: define( eq(1, 1) ),
      alt1: define(
        orNext(
          isRegion('NA'),
          isRegion('EU'),
        ),
        // Thoth's Room
        eq(GAME_STATE.field_id('NA'),    0x03),
        eq(GAME_STATE.room_id('NA'),     0x03),
        eq(GAME_STATE.screen_id('NA'),   0x00),
        // Verify all guardians defeated to block laptop glitch shenanigans
        eq(FLAGS.ankh_amphisbaena('NA'), 0x03),
        eq(FLAGS.ankh_sakit('NA'),       0x03),
        eq(FLAGS.ankh_ellmac('NA'),      0x03),
        eq(FLAGS.ankh_bahamut('NA'),     0x03),
        eq(FLAGS.ankh_viy('NA'),         0x03),
        eq(FLAGS.ankh_palenque('NA'),    0x03),
        eq(FLAGS.ankh_baphomet('NA'),    0x03),
        eq(FLAGS.ankh_tiamat('NA'),      0x03),
        eq(FLAGS.mother_defeated('NA'),  0x01),
        // Since we're using a music trigger for timing, ensure laptop is closed to block the edge
        // case of using Enga Musica to play 'Run toward the sun' immediately before escaping
        eq(GAME_STATE.msx_open('NA'), 0x00),
        // Utterly orbless behaviour
        eq(FLAGS.orb_count('NA'), 0x00),
        // CONGRATULATIONS!
        neq(prev(GAME_STATE.music_id('NA')), 0x2b),
        eq(GAME_STATE.music_id('NA'), 0x2b)
      ),
      alt2: define(
        isRegion('JP'),
        // Thoth's Room
        eq(GAME_STATE.field_id('JP'),    0x03),
        eq(GAME_STATE.room_id('JP'),     0x03),
        eq(GAME_STATE.screen_id('JP'),   0x00),
        // Verify all guardians defeated to block laptop glitch shenanigans
        eq(FLAGS.ankh_amphisbaena('JP'), 0x03),
        eq(FLAGS.ankh_sakit('JP'),       0x03),
        eq(FLAGS.ankh_ellmac('JP'),      0x03),
        eq(FLAGS.ankh_bahamut('JP'),     0x03),
        eq(FLAGS.ankh_viy('JP'),         0x03),
        eq(FLAGS.ankh_palenque('JP'),    0x03),
        eq(FLAGS.ankh_baphomet('JP'),    0x03),
        eq(FLAGS.ankh_tiamat('JP'),      0x03),
        eq(FLAGS.mother_defeated('JP'),  0x01),
        // Since we're using a music trigger for timing, ensure laptop is closed to block the edge
        // case of using Enga Musica to play 'Run toward the sun' immediately before escaping
        eq(GAME_STATE.msx_open('JP'), 0x00),
        // Utterly orbless behaviour
        eq(FLAGS.orb_count('JP'), 0x00),
        // CONGRATULATIONS!
        neq(prev(GAME_STATE.music_id('JP')), 0x2b),
        eq(GAME_STATE.music_id('JP'), 0x2b)
      ),
    }
  });

  // Boss challenges -------------------------------------------
  const bossChallenges: {
    title: string, description: string, points: number, id?: number,
    fieldID: number, roomID: number, screenID: number, ankhFlag: FooBar,
    customTrigger?: (ll: Locale) => ConditionBuilder,
    resetLogic:     (ll: Locale) => ConditionBuilder,
  }[] = [
    {
      title: `Lamphisbaena`,
      description: `Defeat Amphisbaena without using any weapons or fairies`,
      points: 5,
      fieldID: 0x00, roomID: 0x08, screenID: 0x01, ankhFlag: FLAGS.ankh_amphisbaena,
      resetLogic: (ll: Locale) => define(
        resetIf(
          andNext(
            isRegion(ll),
            neq(GAME_STATE.weapon_used(ll), 0x00)
          )
        ),
        resetIf(
          andNext(
            isRegion(ll),
            gte(GAME_STATE.subweapon_used(ll), 0x08), // Shuriken
            lte(GAME_STATE.subweapon_used(ll), 0x0f)  // Pistol
          )
        ),
        resetOnFairy(ll)
      )
    },

    {
      title: `Sakit to Me`,
      description: `Defeat Sakit without ever leaving the floor of the boss arena`,
      points: 10,
      fieldID: 0x02, roomID: 0x08, screenID: 0x01, ankhFlag: FLAGS.ankh_sakit,
      resetLogic: (ll: Locale) => define(
        // Ladder, jump, and knockback states
        cond('AndNext',    SYSTEM.title_id,           '=',  titleID(ll)),
        cond('AddSource',  GAME_STATE.boss_state(ll), '&',  0x0f),
        cond('AndNext',    0,                         '=',  0x04),
        cond('AndNext',    GAME_STATE.lemeza_ptr(ll), '!=', 0x00),
        cond('AddAddress', GAME_STATE.lemeza_ptr(ll), '&',  0x7fffffff),
        cond('AndNext',    LEMEZA.move_state,         '>=', 0x02),
        cond('AddAddress', GAME_STATE.lemeza_ptr(ll), '&',  0x7fffffff),
        cond('ResetIf',    LEMEZA.move_state,         '<=', 0x09),
      )
    },

    {
      title: `Lazy Lizard`,
      description: `Defeat Ellmac without ever pressing left or right, and without using the gun`,
      points: 0,
      fieldID: 0x03, roomID: 0x08, screenID: 0x00, ankhFlag: FLAGS.ankh_ellmac,
      resetLogic: (ll: Locale) => define(
        cond('AndNext',    SYSTEM.title_id,           '=', titleID(ll)),
        cond('AddSource',  GAME_STATE.boss_state(ll), '&', 0x0f),
        cond('AndNext',    0,                         '=', 0x04),
        cond('AndNext',    GAME_STATE.paused(ll),     '=', 0),
        cond('AndNext',    GAME_STATE.msx_open(ll),   '=', 0),
        cond('AddAddress', SYSTEM.input_index(ll),    '*', 4),
        cond('AddSource',  SYSTEM.input_buffer(ll),   '&', 0b1100),
        cond('ResetIf',    0,                         '>', 0),

        resetIf(
          andNext(
            isRegion(ll),
            eq(GAME_STATE.subweapon_used(ll), 0x0f), // Pistol

          )
        )
      )
    },

    {
      title: `Don't Jump the Shark`,
      description: `Defeat Bahamut without jumping`,
      points: 10,
      fieldID: 0x04, roomID: 0x04, screenID: 0x00, ankhFlag: FLAGS.ankh_bahamut,
      resetLogic: (ll: Locale) => define(
        // Jump states
        cond('AndNext',    SYSTEM.title_id,           '=',  titleID(ll)),
        cond('AddSource',  GAME_STATE.boss_state(ll), '&',  0x0f),
        cond('AndNext',    0,                         '=',  0x04),
        cond('AndNext',    GAME_STATE.lemeza_ptr(ll), '!=', 0x00),
        cond('AddAddress', GAME_STATE.lemeza_ptr(ll), '&',  0x7fffffff),
        cond('ResetIf',    LEMEZA.move_state,         '=',  0x05),

        cond('AndNext',    SYSTEM.title_id,           '=',  titleID(ll)),
        cond('AddSource',  GAME_STATE.boss_state(ll), '&',  0x0f),
        cond('AndNext',    0,                         '=',  0x04),
        cond('AndNext',    GAME_STATE.lemeza_ptr(ll), '!=', 0x00),
        cond('AddAddress', GAME_STATE.lemeza_ptr(ll), '&',  0x7fffffff),
        cond('ResetIf',    LEMEZA.move_state,         '=',  0x06),
      )
    },

    // TODO Viy challenge

    {
      title: `All I Need Is Two Pixels!`,
      description: `Defeat Palenque using only the knife`,
      points: 10, id: 548638,
      fieldID: 0x06, roomID: 0x09, screenID: 0x01, ankhFlag: FLAGS.ankh_palenque,
      resetLogic: (ll: Locale) => define(
        resetIf(
          andNext(
            isRegion(ll),
            neq(GAME_STATE.weapon_used(ll), 0x00), // Unarmed
            neq(GAME_STATE.weapon_used(ll), 0x04)  // Knife
          )
        ),
        resetIf(
          andNext(
            isRegion(ll),
            gte(GAME_STATE.subweapon_used(ll), 0x08), // Shuriken
            lte(GAME_STATE.subweapon_used(ll), 0x0f)  // Pistol
          )
        ),
        resetIf(
          andNext(
            isRegion(ll),
            eq(prev(GAME_STATE.boss_state(ll)), 0x00)
          )
        ),
        resetOnFairy(ll)
      )
    },

    {
      title: `[Needs title] Baphomet Challenge`,
      description: `Defeat Baphomet without leaving the bounds of the center platform`,
      points: 5,
      fieldID: 0x07, roomID: 0x04, screenID: 0x01, ankhFlag: FLAGS.ankh_baphomet,
      resetLogic: (ll: Locale) => define(
        cond('AndNext',    SYSTEM.title_id,           '=',  titleID(ll)),
        cond('AddSource',  GAME_STATE.boss_state(ll), '&',  0x0f),
        cond('AndNext',    0,                         '=',  0x04),
        cond('AndNext',    GAME_STATE.lemeza_ptr(ll), '!=', 0x00),
        cond('AddAddress', GAME_STATE.lemeza_ptr(ll), '&',  0x7fffffff),
        cond('ResetIf',    LEMEZA.x,                  '<=', 70.0),

        cond('AndNext',    SYSTEM.title_id,           '=',  titleID(ll)),
        cond('AddSource',  GAME_STATE.boss_state(ll), '&',  0x0f),
        cond('AndNext',    0,                         '=',  0x04),
        cond('AndNext',    GAME_STATE.lemeza_ptr(ll), '!=', 0x00),
        cond('AddAddress', GAME_STATE.lemeza_ptr(ll), '&',  0x7fffffff),
        cond('ResetIf',    LEMEZA.x,                  '>=', 530.0),

        cond('AndNext',    SYSTEM.title_id,           '=',  titleID(ll)),
        cond('AddSource',  GAME_STATE.boss_state(ll), '&',  0x0f),
        cond('AndNext',    0,                         '=',  0x04),
        cond('AndNext',    GAME_STATE.lemeza_ptr(ll), '!=', 0x00),
        cond('AddAddress', GAME_STATE.lemeza_ptr(ll), '&',  0x7fffffff),
        cond('ResetIf',    LEMEZA.y,                  '>=', 320.0),
      )
    },

    {
      title: `Grounded By Mommy`,
      description: `Defeat Tiamat without jumping on any floating platforms`,
      points: 10,
      fieldID: 0x11, roomID: 0x09, screenID: 0x00, ankhFlag: FLAGS.ankh_tiamat,
      resetLogic: (ll: Locale) => define(
        cond('AndNext',    SYSTEM.title_id,           '=',  titleID(ll)),
        cond('AddSource',  GAME_STATE.boss_state(ll), '&',  0x0f),
        cond('AndNext',    0,                         '=',  0x04),
        cond('AndNext',    GAME_STATE.lemeza_ptr(ll), '!=', 0x00),
        cond('AddAddress', GAME_STATE.lemeza_ptr(ll), '&',  0x7fffffff),
        cond('AndNext',    LEMEZA.move_state,         '=',  0x01),
        cond('AddAddress', GAME_STATE.lemeza_ptr(ll), '&',  0x7fffffff),
        cond('AndNext',    LEMEZA.x,                  '<=', 135.0),
        cond('AddAddress', GAME_STATE.lemeza_ptr(ll), '&',  0x7fffffff),
        cond('ResetIf',    LEMEZA.y,                  '<=', 232.0),

        cond('AndNext',    SYSTEM.title_id,           '=',  titleID(ll)),
        cond('AddSource',  GAME_STATE.boss_state(ll), '&',  0x0f),
        cond('AndNext',    0,                         '=',  0x04),
        cond('AndNext',    GAME_STATE.lemeza_ptr(ll), '!=', 0x00),
        cond('AddAddress', GAME_STATE.lemeza_ptr(ll), '&',  0x7fffffff),
        cond('AndNext',    LEMEZA.move_state,         '=',  0x01),
        cond('AddAddress', GAME_STATE.lemeza_ptr(ll), '&',  0x7fffffff),
        cond('AndNext',    LEMEZA.x,                  '>=', 470.0),
        cond('AddAddress', GAME_STATE.lemeza_ptr(ll), '&',  0x7fffffff),
        cond('ResetIf',    LEMEZA.y,                  '<=', 232.0),
      )
    },

    {
      title: `[Needs title] Mother Challenge`,
      description: `Defeat the Mother and collect the Secret Treasure of Life in less than [TIME LIMIT TBD]`,
      points: 10,
      fieldID: 0x12, roomID: 0x03, screenID: 0x00, ankhFlag: FLAGS.ankh_mother,
      customTrigger: (ll: Locale) => define(
        cond('AndNext',    GAME_STATE.inventory_ptr(ll),    '!=', 0x00),
        cond('AddAddress', GAME_STATE.inventory_ptr(ll),    '&',  0x7fffffff),
        cond('AndNext',    prev(INVENTORY.secret_treasure), '=',  0x00),
        cond('AddAddress', GAME_STATE.inventory_ptr(ll),    '&',  0x7fffffff),
        cond('',           INVENTORY.secret_treasure,       '=',  0x01),
      ),
      resetLogic: (ll: Locale) => define(
        cond('AndNext', SYSTEM.title_id,       '=', titleID(ll)),
        cond('ResetIf', FLAGS.ankh_mother(ll), '=', 2, timeToFramesNTSC({ minutes: 3 })),
      )
    }
  ];

  bossChallenges.forEach(({
    title, description, points, id,
    fieldID, roomID, screenID, ankhFlag,
    resetLogic, customTrigger
  }) => {
    const challengeLogic = (ll: Locale) => define(
      // Region check
      isRegion(ll),

      // Priming
      once(
        andNext(
          eq(GAME_STATE.field_id(ll),  fieldID),
          eq(GAME_STATE.room_id(ll),   roomID),
          eq(GAME_STATE.screen_id(ll), screenID),
          lt(prev(ankhFlag(ll)), 2),
          eq(ankhFlag(ll), 2),
        )
      ),
      
      // Trigger
      (
        customTrigger?.(ll) ?? andNext(
          eq(prev(ankhFlag(ll)), 2),
          eq(ankhFlag(ll), 3)
        )
      ).withLast({flag: 'Trigger'}),
      
      // Challenge-specific resets
      resetLogic(ll),
      
      // Default resets
      resetIf( 
        andNext(
          isRegion(ll),
          neq(GAME_STATE.field_id(ll),  fieldID)
        )
      ),
      resetIf( 
        andNext(
          isRegion(ll),
          neq(GAME_STATE.room_id(ll),   roomID)
        )
      ),
      resetIf( 
        andNext(
          isRegion(ll),
          neq(GAME_STATE.screen_id(ll), screenID) 
        )
      ),
      resetIf( 
        andNext(
          isRegion(ll),
          eq(GAME_STATE.music_id(ll),   0x2c) // Game over music
        )
      ),
      cond('AndNext',    SYSTEM.title_id,           '=',  titleID(ll)),
      cond('AndNext',    GAME_STATE.lemeza_ptr(ll), '!=', 0x00),
      cond('AddAddress', GAME_STATE.lemeza_ptr(ll), '&',  0x7fffffff),
      cond('ResetIf',    LEMEZA.health,             '=',  0x00)
    );

    set.addAchievement({
      title, description, points, id,
      conditions: {
        core: define(
          eq(1, 1)
        ),
        alt1: challengeLogic('NA'),
        alt2: challengeLogic('EU'),
        alt3: challengeLogic('JP'),
      }
    })
  });
}

export default makeAchievements;
