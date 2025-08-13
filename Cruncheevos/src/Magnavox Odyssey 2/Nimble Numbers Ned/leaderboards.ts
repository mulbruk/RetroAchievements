import { define, AchievementSet } from '@cruncheevos/core';

import { cond, prev, eq, neq } from '../../common/comparison.js';

import { ADDR } from './data.js';

// ---------------------------------------------------------------------------------------------------

export function makeLeaderboards(set: AchievementSet) {
  set.addLeaderboard({
    title: `Fastest Mathlete`,
    description: `Reach 100 as quickly as possible`,
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: define(
        eq(prev(ADDR.coarse_state), 0x00000000),
        eq(ADDR.num_correct, 0x05)
      ),
      cancel: define(
        eq(ADDR.coarse_state, 0x00000000),
      ),
      submit: define(
        eq(ADDR.screen_id, 0x00),
        eq(prev(ADDR.victory_flag), 0x00),
        eq(ADDR.victory_flag, 0x01)
      ),
      value: define(
        eq(1, 1)
      )
    }
  });

  set.addLeaderboard({
    title: `Nice!`,
    description: `The correct answer was 69`,
    lowerIsBetter: false,
    type: 'VALUE',
    conditions: {
      start: define(
        neq(prev(ADDR.coarse_state), 0x00000000),
        eq(ADDR.screen_id, 0x06),
        eq(ADDR.numeric_input(10000), 0x00),
        eq(ADDR.numeric_input( 1000), 0x00),
        eq(ADDR.numeric_input(  100), 0x00),
        eq(ADDR.numeric_input(   10), 0x06),
        eq(ADDR.numeric_input(    1), 0x09),
        cond('AddSource', ADDR.num_correct),
        cond('SubSource', prev(ADDR.num_correct)),
        eq(0, 1)
      ),
      cancel: define(
        eq(0, 1),
      ),
      submit: define(
        eq(1, 1)
      ),
      value: define(
        cond('Measured', 69)
      )
    }
  });
}

export default makeLeaderboards;
