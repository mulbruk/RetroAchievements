import { AchievementSet, define, andNext, orNext } from '@cruncheevos/core';

import { prev, eq, neq } from '../../common/comparison.js';
import { range } from '../../common/util.js';
import { byte, word, bit3 } from '../../common/value.js';

// ---------------------------------------------------------------------------------------------------

const ADDR = {
  game_state: byte(0x0e42),

  // 0x8011: [8-bit] Slot loaded
  slot_loaded: byte(0x8011),

  character_appearance: (n: number) => byte(0x8030 + 0x4e + n * 0x68),

  // 0x9197: [8-bit] Map location
  map_location: byte(0x9197),

  // 0x93ba: Possible cutscene progression
  cutscene_progression: byte(0x93ba),

  // 0x93bc: Story progress
  story_progress: byte(0x93bc),

  // 0x93bd: Map/Battle
  map_id: byte(0x93bd),

  // 0x93c0: Active event script ID
  event_id: word(0x93c0),

  // 0x91ea: Flags
  bad_ending_flag: bit3(0x91ea),
}

function makeAchievements(set: AchievementSet) {
  set.addAchievement({
    id: 140414, badge: 503833,
    title: `Fairy Dust`,
    description: `Recruit Glycinnia`,
    type: 'missable', points: 5,
    conditions: {
      core: define(
        eq(ADDR.game_state, 0x10),
        eq(ADDR.slot_loaded, prev(ADDR.slot_loaded)),
        orNext(
          eq(ADDR.map_location, 0x00),
          eq(ADDR.map_location, 0x03),
          eq(ADDR.map_location, 0x07),
          eq(ADDR.map_location, 0x08),
          eq(ADDR.map_location, 0x0b),
          eq(ADDR.map_location, 0x0e)
        ),
        andNext(
          ...range(0, 32).map((n) => neq(prev(ADDR.character_appearance(n)), 0x0d))
        ),
        orNext(
          ...range(0, 32).map((n) => eq(ADDR.character_appearance(n), 0x0d))
        )
      )
    }
  });

  set.addAchievement({
    id: 140391, badge: 503808,
    title: `A Father's Job`,
    description: `Clear Belleza Fort and recruit Elrik`,
    type: 'missable', points: 5,
    conditions: {
      core: define(
        eq(ADDR.game_state, 0x10),
        eq(ADDR.slot_loaded, prev(ADDR.slot_loaded)),
        eq(ADDR.map_location, 0x15),

        andNext(
          ...range(0, 32).map((n) => neq(prev(ADDR.character_appearance(n)), 0x0a))
        ),
        orNext(
          ...range(0, 32).map((n) => eq(ADDR.character_appearance(n), 0x0a))
        )
      )
    }
  });

  set.addAchievement({
    id: 140401, badge: 503818,
    title: `Begone, Vile Creature!`,
    description: `Clear Rebananda Caverns again`,
    type: 'missable', points: 10,
    conditions: {
      core: define(
        eq(ADDR.game_state, 0x10),
        eq(ADDR.map_location, 0x17),
        eq(ADDR.map_id, 0x3f),
        eq(prev(ADDR.event_id), 0x0000),
        orNext(
          eq(ADDR.event_id, 0x00f4),
          eq(ADDR.event_id, 0x00f5)
        )
      )
    }
  });

  set.addAchievement({
    id: 140413, badge: 503842,
    title: `A Bad Omen`,
    description: `Witness the bad ending`,
    points: 2,
    conditions: {
      core: define(
        eq(prev(ADDR.story_progress), 0x06),
        eq(ADDR.story_progress, 0x07),
        eq(ADDR.map_id, 0x07),
        neq(ADDR.cutscene_progression, 0x20),
        eq(ADDR.bad_ending_flag, 1),
      )
    }
  });
}

export default makeAchievements;
