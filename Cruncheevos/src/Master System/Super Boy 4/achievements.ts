import {
  AchievementSet,
  define, andNext, once, resetIf, measuredIf, trigger
} from '@cruncheevos/core';

import { eq, neq, gt, lt, prev, prior, cond } from '../../common/comparison.js';
import { range } from '../../common/util.js';

import { ADDR } from './data.js';

// ---------------------------------------------------------------------------------------------------

export function makeAchievements(set: AchievementSet) {
  const progression: { stageID: number, id: number, title: string }[] = [
    { id: 490092, stageID: 0x04, title: `Yoshi's Island`,     },
    { id: 490093, stageID: 0x08, title: `Booser's Castle`,    },
    { id: 490094, stageID: 0x0C, title: `Boss Bass Basin`,    },
    { id: 490095, stageID: 0x10, title: `Forest of Illusion`, },
  ];

  progression.forEach(({stageID, id, title}) =>
    set.addAchievement({
      title,
      id,
      points: 5,
      type: 'progression',
      description: `Complete stages ${stageID - 3} to ${stageID}`,
      conditions: {
        core: define(
          eq(ADDR.level_id, stageID),
          eq(prev(ADDR.game_state), 0x00),
          eq(ADDR.game_state, 0x82),
          // Picodrive handles input state memory incorrectly
          // Uncomment if the need to block Picodrive ever arises
          // eq(prev(ADDR.input_state), 0x01),
          // eq(ADDR.input_state, 0x00)
        )
      }
    })
  );

  set.addAchievement({
    title: `Thank You Princess! But Our Mario Is in Another Game`,
    id: 490096,
    points: 10,
    type: 'win_condition',
    description: `Defeat Wart and rescue Princess Toadstool`,
    conditions: {
      core: define(
        eq(ADDR.level_id, 0x11),
        eq(prev(ADDR.game_state), 0x00),
        eq(ADDR.game_state, 0x85),
        // eq(prev(ADDR.input_state), 0x01),
        // eq(ADDR.input_state, 0x00)
      )
    }
  });

  const smallChallenges: { startStageID: number, endStageID: number, id: number, title: string }[] = [
    { id: 490097, startStageID: 0x01, endStageID: 0x04, title: `Small Super Boy vs. Yoshi's Island`         },
    { id: 490098, startStageID: 0x05, endStageID: 0x08, title: `Small Super Boy vs. Booser's Castle`        },
    { id: 490099, startStageID: 0x09, endStageID: 0x0C, title: `Small Super Boy vs. Boss Bass Basin`        },
    { id: 490100, startStageID: 0x0D, endStageID: 0x10, title: `Small Super Boy vs. Forest of Illusion` },
  ];

  smallChallenges.forEach(({startStageID, endStageID, id, title}) => {
    const alt1StateConditions = (startStageID === 1) ?
      andNext(eq(prior(ADDR.game_state), 0xFF), eq(ADDR.game_state, 0x00)) :
      define(eq(ADDR.game_state, 0x82));

    set.addAchievement({
      title,
      id,
      points: 5,
      description: `Complete stages ${startStageID} to ${endStageID} without ever being under the effects of a powerup`,
      conditions: {
        core: define(
          trigger(
            eq(ADDR.level_id, endStageID),
            andNext(
              eq(prev(ADDR.game_state), 0x00),
              eq(ADDR.game_state, 0x82)
            ),
            // andNext(
            //   eq(prev(ADDR.input_state), 0x01),
            //   eq(ADDR.input_state, 0x00)
            // )
          ),
          resetIf(
            andNext(
              neq(ADDR.game_state, 0x00),
              neq(ADDR.game_state, 0x81),
              neq(ADDR.game_state, 0x82),
            ),
            lt(ADDR.level_id, startStageID),
            gt(ADDR.level_id, endStageID),
            gt(ADDR.powerup_state, 0x00),
          )
        ),
        alt1: once(
          andNext(
            alt1StateConditions,
            eq(prev(ADDR.level_id), startStageID - 1),
            eq(ADDR.level_id, startStageID),
            eq(ADDR.powerup_state, 0x00),
          )
        ),
        alt2: once(
          andNext(
            eq(prev(ADDR.game_state), 0x81),
            eq(ADDR.game_state, 0x00),
            eq(ADDR.level_id, startStageID),
            eq(ADDR.powerup_state, 0x00),
          )
        )
      }
    })
  });

  const pacifistChallenges: { stageID: number, points: number, id: number, title: string }[] = [
    { id: 490103, stageID: 0x03, points:  5, title: `Keepin' It Cool with the Koopas` },
    { id: 490104, stageID: 0x05, points:  5, title: `No Bone to Pick with Dry Bones`},
    { id: 490105, stageID: 0x0C, points:  5, title: `Big Chillin' with Boss Bass`},
    { id: 490101, stageID: 0x10, points: 10, title: `Friend to All Forest Creatures`}
  ];

  pacifistChallenges.forEach(({stageID, id, points, title}) => 
    set.addAchievement({
      title,
      id,
      points,
      description: `Complete stage ${stageID} without harming any enemies`,
      conditions: {
        core: define(
          trigger(
            eq(ADDR.level_id, stageID),
            andNext(
              eq(prev(ADDR.game_state), 0x00),
              eq(ADDR.game_state, 0x82)
            ),
            // andNext(
            //   eq(prev(ADDR.input_state), 0x01),
            //   eq(ADDR.input_state, 0x00)
            // )
          ),
          resetIf(
            andNext(
              neq(ADDR.game_state, 0x00),
              neq(ADDR.game_state, 0x81),
              neq(ADDR.game_state, 0x82),
            ),
            neq(ADDR.level_id, stageID),
            // Koopas
            ...range(0, 8).map((n) => 
              andNext(
                eq(prev(ADDR.enemy_state(n)), 0x81),
                eq(ADDR.enemy_state(n), 0x0D)
              )
            ),
            // Cannonballs
            ...range(0, 8).map((n) => 
              andNext(
                eq(prev(ADDR.enemy_state(n)), 0x8C),
                eq(ADDR.enemy_state(n), 0x6E),
                eq(ADDR.bounce_state, 0x01)
              )
            ),
            // Buzzy Beetles
            ...range(0, 8).map((n) => 
              andNext(
                eq(prev(ADDR.enemy_state(n)), 0x91),
                eq(ADDR.enemy_state(n), 0x1B)
              )
            ),
            // Dry Bones
            ...range(0, 8).map((n) => 
              andNext(
                eq(prev(ADDR.enemy_state(n)), 0x93),
                eq(ADDR.enemy_state(n), 0x1C)
              )
            ),
            // Generic enemy death state
            ...range(0, 8).map((n) => 
              andNext(
                neq(prev(ADDR.enemy_state(n)), 0xF0),
                eq(ADDR.enemy_state(n), 0xF0)
              )
            )
          )
        ),
        alt1: once(
          andNext(
            eq(ADDR.game_state, 0x82),
            eq(prev(ADDR.level_id), stageID - 1),
            eq(ADDR.level_id, stageID)
          )
        ),
        alt2: once(
          andNext(
            eq(prev(ADDR.game_state), 0x81),
            eq(ADDR.game_state, 0x00),
            eq(ADDR.level_id, stageID)
          )
        )
      }
    })
  );

  set.addAchievement({
    title: `The Forest Mushrooms Beware`,
    id: 490102,
    points: 5,
    type: 'missable',
    description: `On stage 14, defeat 4 Paramushrooms without touching the ground`,
    conditions: {
      core: define(
        measuredIf(
          eq(ADDR.level_id, 0x0E)
        ),
        ...range(0, 8).map((n) =>
          andNext(
            eq(prev(ADDR.enemy_state(n)), 0x8F),
            eq(ADDR.enemy_state(n), 0x70)
          ).withLast({flag: 'AddHits'})
        ),
        cond('Measured', 0x00, '=', 0x01, 4),
        resetIf(
          neq(ADDR.game_state, 0x00),
          neq(ADDR.level_id, 0x0E),
          eq(ADDR.player_state, 0x04)
        ),
        resetIf(
          andNext(
            ...range(0, 8).map((n) =>
              neq(ADDR.enemy_state(n), 0xF0)
            ),
            eq(prev(ADDR.player_state), 0x00)
          )
        )
      )
    }
  });

  set.addAchievement({
    title: `Speedy Super Boy`,
    id: 490106,
    points: 25,
    description: `Complete the game in under 15 minutes`,
    conditions: {
      core: define(
        andNext(
          eq(prior(ADDR.game_state), 0xFF),
          eq(ADDR.game_state, 0x00),
          eq(prev(ADDR.level_id), 0x00),
          once(eq(ADDR.level_id, 0x01))
        ),
        eq(ADDR.level_id, 0x11),
        eq(prev(ADDR.game_state), 0x00),
        eq(ADDR.game_state, 0x85),
        // eq(prev(ADDR.input_state), 0x01),
        // eq(ADDR.input_state, 0x00),
        andNext(
          eq(prior(ADDR.game_state), 0xFF),
          eq(ADDR.game_state, 0x00),
          eq(prev(ADDR.level_id), 0x00),
          once(eq(ADDR.level_id, 0x01)),
          cond('ResetIf', 1, '>=', 1, 15 * 60 * 60)
        ),
        resetIf(
          eq(ADDR.game_state, 0x83),
          eq(ADDR.game_state, 0xFF)
        )
      )
    }
  });
}

export default makeAchievements;
