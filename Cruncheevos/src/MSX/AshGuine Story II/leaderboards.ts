import { define, andNext, AchievementSet, orNext } from '@cruncheevos/core';

import { cond, prev, eq, gt, neq, lt } from '../../common/comparison.js';

import { ADDR } from './data.js';
import { elapsedIGT, isGameplay } from './functions.js';

// ---------------------------------------------------------------------------------------------------

const stageData: { stageID: number, nextID: number }[] = [
  { stageID: 0x01, nextID: 0x02 },
  { stageID: 0x02, nextID: 0x03 },
  { stageID: 0x03, nextID: 0x04 },
  { stageID: 0x04, nextID: 0x05 },
  { stageID: 0x05, nextID: 0x06 },
  { stageID: 0x06, nextID: 0x07 },
];


function makeLeaderboards(set: AchievementSet) {

// Scrapped: IGT does not function properly because only full days remaining gets reset between stages

//   stageData.forEach(({stageID, nextID}) =>
//     set.addLeaderboard({
//       title: `Stage ${stageID} Speedrun`,
//       description: `Complete stage ${stageID} as quickly as possible`,
//       lowerIsBetter: true,
//       type: 'FRAMES',
//       conditions: {
//         start: define(
//           // eq(ADDR.game_state_1, 0x01),
//           eq(ADDR.game_state_2, 0x00),
//           eq(prev(ADDR.stage), stageID),
//           eq(ADDR.stage, nextID)
//         ),
//         cancel: define(
//           eq(0, 1)
//         ),
//         submit: define(
//           eq(1, 1)
//         ),
//         value: elapsedIGT()
//       }
//     })
//   );

  set.addLeaderboard({
    title: `Low Level Lizardman`,
    description: `Complete the game with Ashguine's level being as low as possible`,
    lowerIsBetter: true,
    type: 'VALUE',
    conditions: {
      start: define(
        eq(ADDR.game_state_2, 0x00),
        eq(prev(ADDR.stage), 0x06),
        eq(ADDR.stage, 0x07),
      ),
      cancel: define(
        eq(0, 1)
      ),
      submit: define(
        eq(1, 1)
      ),
      value: define(
        cond('AddSource', ADDR.level(100), '*', 100),
        cond('AddSource', ADDR.level( 10), '*',  10),
        cond('Measured',  ADDR.level(  1))
      )
    }
  });

  set.addLeaderboard({
    title: `Boss 1 Quick Kill`,
    description: `Defeat the boss of stage 1 as quickly as possible`,
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: andNext(
        isGameplay(),
        eq(ADDR.stage, 0x01),
        eq(ADDR.collision_id, 0xa5),
        eq(ADDR.room_id, 0xad),
        eq(ADDR.enemy_id(0), 0x04),
        eq(prev(ADDR.enemy_state(0)), 0x00),
        eq(ADDR.enemy_state(0), 0x01)
      ),
      cancel: orNext(
        neq(ADDR.game_state_2, 0x00),
        neq(ADDR.stage, 0x01),
        neq(ADDR.collision_id, 0xa5),
        neq(ADDR.room_id, 0xad),
        lt(ADDR.lives, prev(ADDR.lives))
      ),
      submit: define(
        eq(ADDR.enemy_id(0), 0x04),
        eq(prev(ADDR.enemy_state(0)), 0x01),
        gt(ADDR.enemy_state(0), 0x01)
      ),
      value: define(
        eq(1, 1)
      )
    }
  });

  set.addLeaderboard({
    title: `Boss 2 Quick Kill`,
    description: `Defeat the boss of stage 2 as quickly as possible`,
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: andNext(
        isGameplay(),
        eq(ADDR.stage, 0x02),
        eq(ADDR.collision_id, 0xa6),
        eq(ADDR.room_id, 0x79),
        eq(ADDR.enemy_id(0), 0x07),
        eq(ADDR.enemy_id(1), 0x07),
        eq(ADDR.enemy_id(2), 0x08),
        eq(prev(ADDR.enemy_state(0)), 0x00),
        eq(prev(ADDR.enemy_state(2)), 0x00),
        eq(prev(ADDR.enemy_state(3)), 0x00),
        eq(ADDR.enemy_state(0), 0x01),
        eq(ADDR.enemy_state(1), 0x01),
        eq(ADDR.enemy_state(2), 0x01)
      ),
      cancel: orNext(
        neq(ADDR.game_state_2, 0x00),
        neq(ADDR.stage, 0x02),
        neq(ADDR.collision_id, 0xa6),
        neq(ADDR.room_id, 0x79),
        lt(ADDR.lives, prev(ADDR.lives))
      ),
      submit: define(
        eq(ADDR.enemy_id(2), 0x08),
        lt(prev(ADDR.enemy_hp(2)), 0x0a),
        orNext(
          eq(ADDR.enemy_hp(2), 0x00),
          gt(ADDR.enemy_hp(2), 0xf0)
        )
      ),
      value: define(
        eq(1, 1)
      )
    }
  });

  set.addLeaderboard({
    title: `Boss 3 Quick Kill`,
    description: `Defeat the boss of stage 3 as quickly as possible`,
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: andNext(
        isGameplay(),
        eq(ADDR.stage, 0x03),
        eq(ADDR.collision_id, 0xad),
        eq(ADDR.room_id, 0x02),
        eq(ADDR.enemy_id(0), 0x06),
        eq(prev(ADDR.enemy_state(0)), 0x00),
        eq(ADDR.enemy_state(0), 0x01)
      ),
      cancel: orNext(
        neq(ADDR.game_state_2, 0x00),
        neq(ADDR.stage, 0x03),
        neq(ADDR.collision_id, 0xad),
        neq(ADDR.room_id, 0x02),
        lt(ADDR.lives, prev(ADDR.lives))
      ),
      submit: define(
        eq(prev(ADDR.enemy_id(0)), 0x06),
        eq(prev(ADDR.enemy_state(0)), 0x01),
        eq(ADDR.enemy_id(0), 0x00),
        gt(ADDR.enemy_state(0), 0x01)
      ),
      value: define(
        eq(1, 1)
      )
    }
  });

  set.addLeaderboard({
    title: `Boss 4 Quick Kill`,
    description: `Defeat the boss of stage 4 as quickly as possible`,
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: andNext(
        isGameplay(),
        eq(ADDR.stage, 0x04),
        eq(ADDR.collision_id, 0xa5),
        eq(ADDR.room_id, 0x79),
        eq(ADDR.enemy_id(0), 0x08),
        eq(prev(ADDR.enemy_state(0)), 0x00),
        eq(ADDR.enemy_state(0), 0x01)
      ),
      cancel: orNext(
        neq(ADDR.game_state_2, 0x00),
        neq(ADDR.stage, 0x04),
        neq(ADDR.collision_id, 0xa5),
        neq(ADDR.room_id, 0x79),
        lt(ADDR.lives, prev(ADDR.lives))
      ),
      submit: define(
        eq(prev(ADDR.enemy_id(0)), 0x08),
        eq(prev(ADDR.enemy_state(0)), 0x01),
        eq(ADDR.enemy_id(0), 0x00),
        gt(ADDR.enemy_state(0), 0x01)
      ),
      value: define(
        eq(1, 1)
      )
    }
  });

  set.addLeaderboard({
    title: `Boss 5 Quick Kill`,
    description: `Defeat the boss of stage 5 as quickly as possible`,
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: andNext(
        isGameplay(),
        eq(ADDR.stage, 0x05),
        eq(ADDR.collision_id, 0xa5),
        eq(ADDR.room_id, 0xfb),
        eq(ADDR.enemy_id(0), 0x07),
        eq(ADDR.enemy_id(1), 0x07),
        eq(ADDR.enemy_id(2), 0x07),
        eq(ADDR.enemy_id(3), 0x07),
        eq(prev(ADDR.enemy_state(0)), 0x00),
        eq(prev(ADDR.enemy_state(1)), 0x00),
        eq(prev(ADDR.enemy_state(2)), 0x00),
        eq(prev(ADDR.enemy_state(3)), 0x00),
        eq(ADDR.enemy_state(0), 0x01),
        eq(ADDR.enemy_state(1), 0x01),
        eq(ADDR.enemy_state(2), 0x01),
        eq(ADDR.enemy_state(3), 0x01)
      ),
      cancel: orNext(
        neq(ADDR.game_state_2, 0x00),
        neq(ADDR.stage, 0x05),
        neq(ADDR.collision_id, 0xa5),
        neq(ADDR.room_id, 0xfb),
        lt(ADDR.lives, prev(ADDR.lives))
      ),
      submit: {
        core: define(
          eq(1, 1)
        ),
        alt1: define(
          andNext(
            eq(prev(ADDR.enemy_state(0)), 0xfe),
            eq(prev(ADDR.enemy_state(1)), 0x00),
            eq(prev(ADDR.enemy_state(2)), 0x00),
            eq(prev(ADDR.enemy_state(3)), 0x00),
          ),
          andNext(
            eq(ADDR.enemy_state(0), 0xff),
            eq(ADDR.enemy_state(1), 0x00),
            eq(ADDR.enemy_state(2), 0x00),
            eq(ADDR.enemy_state(3), 0x00)
          )
        ), 
        alt2: define(
          andNext(
            eq(prev(ADDR.enemy_state(0)), 0x00),
            eq(prev(ADDR.enemy_state(1)), 0xfe),
            eq(prev(ADDR.enemy_state(2)), 0x00),
            eq(prev(ADDR.enemy_state(3)), 0x00),
          ),
          andNext(
            eq(ADDR.enemy_state(0), 0x00),
            eq(ADDR.enemy_state(1), 0xff),
            eq(ADDR.enemy_state(2), 0x00),
            eq(ADDR.enemy_state(3), 0x00)
          )
        ), 
        alt3: define(
          andNext(
            eq(prev(ADDR.enemy_state(0)), 0x00),
            eq(prev(ADDR.enemy_state(1)), 0x00),
            eq(prev(ADDR.enemy_state(2)), 0xfe),
            eq(prev(ADDR.enemy_state(3)), 0x00),
          ),
          andNext(
            eq(ADDR.enemy_state(0), 0x00),
            eq(ADDR.enemy_state(1), 0x00),
            eq(ADDR.enemy_state(2), 0xff),
            eq(ADDR.enemy_state(3), 0x00)
          )
        ), 
        alt4: define(
          andNext(
            eq(prev(ADDR.enemy_state(0)), 0x00),
            eq(prev(ADDR.enemy_state(1)), 0x00),
            eq(prev(ADDR.enemy_state(2)), 0x00),
            eq(prev(ADDR.enemy_state(3)), 0xfe),
          ),
          andNext(
            eq(ADDR.enemy_state(0), 0x00),
            eq(ADDR.enemy_state(1), 0x00),
            eq(ADDR.enemy_state(2), 0x00),
            eq(ADDR.enemy_state(3), 0xff)
          )
        )
      },
      value: define(
        eq(1, 1)
      )
    }
  });

  set.addLeaderboard({
    title: `Banutracus Quick Kill`,
    description: `Defeat the boss of stage 6 as quickly as possible`,
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: define(
        isGameplay(),
          eq(ADDR.stage, 0x06),
          eq(ADDR.collision_id, 0xa5),
          eq(ADDR.room_id, 0x8a),
          eq(ADDR.enemy_id(0), 0x06),
          eq(prev(ADDR.enemy_state(0)), 0x00),
          eq(ADDR.enemy_state(0), 0x01)
      ),
      cancel: orNext(
        neq(ADDR.game_state_2, 0x00),
        neq(ADDR.stage, 0x06),
        neq(ADDR.collision_id, 0xa5),
        neq(ADDR.room_id, 0x8a),
        lt(ADDR.lives, prev(ADDR.lives))
      ),
      submit: define(
        eq(prev(ADDR.enemy_id(0)), 0x06),
        eq(prev(ADDR.enemy_state(0)), 0x01),
        eq(ADDR.enemy_id(0), 0x06),
        gt(ADDR.enemy_state(0), 0x01)
      ),
      value: define(
        eq(1, 1)
      )
    }
  });
}

export default makeLeaderboards;
