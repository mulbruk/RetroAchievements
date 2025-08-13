import {
  AchievementSet,
  define, andNext, once, trigger,
  resetIf,
} from '@cruncheevos/core';

import { prev, eq, neq, gt, lt, gte } from '../../common/comparison.js';

import { ADDR } from './data.js';

// ---------------------------------------------------------------------------------------------------

function makeAchievements(set: AchievementSet) { 
  set.addAchievement({
    title: `Is This a Trapezoid?`,
    points: 1,
    description: `Complete 'Name the Shapes!' without making any mistakes on any difficulty level`,
    conditions: {
      core: define(
        neq(ADDR.coarse_state, 0x00000000),
        eq(ADDR.screen_id, 0x20),
        eq(prev(ADDR.num_correct), 0x04),
        eq(ADDR.num_correct, 0x05)
      )
    }
  });

  set.addAchievement({
    title: `Euclid's Understudy`,
    points: 3,
    description: `Complete 'Name the Shapes!' without making any mistakes on difficulty level 5`,
    conditions: {
      core: define(
        neq(ADDR.coarse_state, 0x00000000),
        eq(ADDR.screen_id, 0x20),
        eq(ADDR.difficulty, 0x05),
        eq(prev(ADDR.num_correct), 0x04),
        eq(ADDR.num_correct, 0x05)
      )
    }
  });

  set.addAchievement({
    title: `Go Forth and Multiply`,
    points: 1,
    description: `Complete 'Multiplication Runthrough' without making any mistakes on any difficulty level`,
    conditions: {
      core: define(
        neq(ADDR.coarse_state, 0x00000000),
        eq(ADDR.screen_id, 0x06),
        eq(ADDR.mult_function, 0x0000),
        eq(ADDR.error_count, 0x00),
        lt(prev(ADDR.num_correct), 0x05),
        eq(ADDR.num_correct, 0x05)
      )
    }
  });

  set.addAchievement({
    title: `Pythagoras' Pupil`,
    points: 3,
    description: `Complete 'Multiplication Runthrough' without making any mistakes on difficulty level 5`,
    conditions: {
      core: define(
        neq(ADDR.coarse_state, 0x00000000),
        eq(ADDR.screen_id, 0x06),
        eq(ADDR.mult_function, 0x0000),
        eq(ADDR.difficulty, 0x05),
        eq(ADDR.error_count, 0x00),
        lt(prev(ADDR.num_correct), 0x05),
        eq(ADDR.num_correct, 0x05)
      )
    }
  });

  set.addAchievement({
    title: `The Round Number Goes in the Square Hole`,
    points: 1,
    description: `Complete 'Function Machine' without making any mistakes on any difficulty level`,
    conditions: {
      core: define(
        neq(ADDR.coarse_state, 0x00000000),
        eq(ADDR.screen_id, 0x06),
        gt(ADDR.mult_function, 0x0000),
        eq(ADDR.error_count, 0x00),
        lt(prev(ADDR.num_correct), 0x05),
        eq(ADDR.num_correct, 0x05)
      )
    }
  });

  set.addAchievement({
    title: `Al-Khwarizmi's Apprentice`,
    points: 3,
    description: `Complete 'Function Machine' without making any mistakes on difficulty level 5`,
    conditions: {
      core: define(
        neq(ADDR.coarse_state, 0x00000000),
        eq(ADDR.screen_id, 0x06),
        gt(ADDR.mult_function, 0x0000),
        eq(ADDR.difficulty, 0x05),
        eq(ADDR.error_count, 0x00),
        lt(prev(ADDR.num_correct), 0x05),
        eq(ADDR.num_correct, 0x05)
      )
    }
  });

  set.addAchievement({
    title: `Novice Mathlete`,
    points: 3,
    type: 'progression',
    description: `Reach 25`,
    conditions: {
      core: define(
        neq(prev(ADDR.coarse_state), 0x00000000),
        neq(ADDR.coarse_state, 0x00000000),
        eq(ADDR.screen_id, 0x00),
        lt(prev(ADDR.number_level), 0x25),
        gte(ADDR.number_level, 0x25)
      )
    }
  });

  set.addAchievement({
    title: `Bronze Mathlete`,
    points: 3,
    type: 'progression',
    description: `Reach 50`,
    conditions: {
      core: define(
        neq(prev(ADDR.coarse_state), 0x00000000),
        neq(ADDR.coarse_state, 0x00000000),
        eq(ADDR.screen_id, 0x00),
        lt(prev(ADDR.number_level), 0x50),
        gte(ADDR.number_level, 0x50)
      )
    }
  });

  set.addAchievement({
    title: `Silver Mathlete`,
    points: 3,
    type: 'progression',
    description: `Reach 75`,
    conditions: {
      core: define(
        neq(prev(ADDR.coarse_state), 0x00000000),
        neq(ADDR.coarse_state, 0x00000000),
        eq(ADDR.screen_id, 0x00),
        lt(prev(ADDR.number_level), 0x75),
        gte(ADDR.number_level, 0x75)
      )
    }
  });
  
  set.addAchievement({
    title: `Gold Mathlete`,
    points: 5,
    type: 'win_condition',
    description: `Discover what lies beyond 99. Bonus credit: Solve the Riemann hypothesis and post your proof on the game's forum page`,
    conditions: {
      core: define(
        neq(prev(ADDR.coarse_state), 0x00000000),
        neq(ADDR.coarse_state, 0x00000000),
        eq(ADDR.screen_id, 0x00),
        eq(prev(ADDR.victory_flag), 0x00),
        eq(ADDR.victory_flag, 0x01)
      )
    }
  });

  set.addAchievement({
    title: `Track and Fields Medalist`,
    points: 10,
    description: `Complete the game without making any mistakes on math drills and without failing any barrel jump events. All math drills must be completed on difficulty level 5`,
    conditions: {
      core: define(
        once(
          andNext(
            eq(prev(ADDR.coarse_state), 0x00000000),
            neq(ADDR.coarse_state, 0x00000000)
          )
        ),
        trigger(
          eq(ADDR.screen_id, 0x00),
          eq(prev(ADDR.victory_flag), 0x00),
          eq(ADDR.victory_flag, 0x01)
        ),
        resetIf(
          eq(ADDR.coarse_state, 0x00000000)
        ),
        resetIf(
          andNext(
            eq(prev(ADDR.screen_id), 0x00),
            eq(ADDR.screen_id, 0x06),
            lt(ADDR.difficulty, 0x05)
          )
        ),
        resetIf(
          andNext(
            eq(prev(ADDR.screen_id), 0x00),
            eq(ADDR.screen_id, 0x20),
            lt(ADDR.difficulty, 0x05)
          )
        ),
        resetIf(
          andNext(
            eq(prev(ADDR.screen_id), 0x06),
            eq(ADDR.screen_id, 0x00),
            lt(ADDR.difficulty, 0x05)
          )
        ),
        resetIf(
          andNext(
            eq(prev(ADDR.screen_id), 0x20),
            eq(ADDR.screen_id, 0x00),
            lt(ADDR.difficulty, 0x05)
          )
        ),
        resetIf(
          andNext(
            eq(ADDR.screen_id, 0x00),
            neq(ADDR.difficulty, 0xfe),
            lt(prev(ADDR.ned_state), 0x07),
            gte(ADDR.ned_state, 0x07)
          )
        ),
        resetIf(
          andNext(
            eq(ADDR.screen_id, 0x06),
            eq(prev(ADDR.error_count), 0x00),
            gt(ADDR.error_count, 0x00)
          )
        ),
        resetIf(
          andNext(
            eq(ADDR.screen_id, 0x20),
            eq(prev(ADDR.voice_sample_related), 0xff),
            eq(ADDR.voice_sample_related, 0x01),
            eq(ADDR.num_correct, prev(ADDR.num_correct))
          )
        )
      )
    }
  });
}

export default makeAchievements;
