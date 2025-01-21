import {
  AchievementSet,
  define, andNext, orNext, once, resetIf
} from '@cruncheevos/core';

import { cond, prev, eq, neq, lt } from '../../common/comparison.js';
import { range } from '../../common/util.js';
import { FLOAT } from '../../common/value.js';

import { ADDR } from './data.js';

// ---------------------------------------------------------------------------------------------------

export function makeLeaderboards(set: AchievementSet) {
  range(0x01, 0x12).forEach((stageID) => {
      const endState = (stageID === 0x11) ? 0x85 : 0x82;

      set.addLeaderboard({
        title: `Stage ${stageID} Speedrun`,
        description: `Complete stage ${stageID} with the most time remaining`,
        lowerIsBetter: false,
        type: 'FIXED2',
        conditions: {
          start: define(
            eq(ADDR.level_id, stageID),
            eq(prev(ADDR.game_state), 0x00),
            eq(ADDR.game_state, endState),
            
            // Picodrive sometimes reports frame count as 0xFF, block leaderboard submission when
            // frame counter is out of range
            lt(ADDR.timer_frames, 60)
          ),
          cancel: define(
            eq(0, 1)
          ),
          submit: define(
            eq(1, 1)
          ),
          value: define(
            cond('AddSource', ADDR.timer_seconds, '*', 100),
            cond('AddSource', ADDR.timer_frames,  '*', FLOAT(1.666667)),
            cond('Measured',  0)
          )
        }
      })
    }
  );

  set.addLeaderboard({
    title: `The Speediest Super Boy`,
    description: `Complete the game as quickly as possible`,
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: define(
        once(
          andNext(
            eq(ADDR.game_state, 0xFF),
            eq(ADDR.level_id, 0x01),
          )
        ),
        eq(ADDR.game_state, 0x00),
        eq(prev(ADDR.level_id), 0x00),
        eq(ADDR.level_id, 0x01),
        resetIf(
          eq(ADDR.game_state, 0x83),
          andNext(
            neq(prev(ADDR.game_state), 0xFF),
            eq(ADDR.game_state, 0xFF)
          )
        )
      ),
      cancel: define(
        orNext(
          eq(ADDR.game_state, 0x83),
          eq(ADDR.game_state, 0xFF)
        )
      ),
      submit: define(
        eq(ADDR.level_id, 0x11),
        eq(prev(ADDR.game_state), 0x00),
        eq(ADDR.game_state, 0x85)
      ),
      value: define(
        cond('Measured', 1, '=', 1)
      )
    }
  });
}

export default makeLeaderboards;
