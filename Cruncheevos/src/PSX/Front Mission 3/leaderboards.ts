import { AchievementSet, define } from '@cruncheevos/core';

import { cond, prev, eq, gt } from '../../common/comparison.js';

import { ADDR } from './data.js';
import { range } from '../../common/util.js';

// ---------------------------------------------------------------------------------------------------

function makeLeaderboards(set: AchievementSet) {
  set.addLeaderboard({
    title: `Fastest Completion - DHZ Route`,
    description: `Finish the DHZ route with the lowest in-game time on a fresh save file `,
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: define(
        eq(ADDR.route, 0x3),
        eq(ADDR.progression_state, 0xBF),
        eq(prev(ADDR.scene_id), 0x1FF),
        eq(ADDR.scene_id, 0x1FD),
        ...range(0, 96).map((n) =>
          define(
            cond('AddSource', ADDR.emma_battle_skills(n)),
            cond('AddSource', ADDR.dennis_battle_skills(n)),
            cond('AddSource', ADDR.yun_battle_skills(n)),
            cond('AddSource', ADDR.jose_battle_skills(n)),
            cond('AddSource', ADDR.li_battle_skills(n)),
            cond('AddSource', ADDR.linny_battle_skills(n)),
            cond('AddSource', ADDR.marcus_battle_skills(n)),
          )
        ),
        eq(0, 0),
      ),
      cancel: define(
        eq(0, 1)
      ),
      submit: define(
        eq(1, 1)
      ),
      value: define(
        cond('Measured', ADDR.igt)
      )
    }
  });

  set.addLeaderboard({
    title: `Fastest Completion - USN Route`,
    description: `Finish the USN route with the lowest in-game time on a fresh save file `,
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: define(
        eq(ADDR.route, 0x2),
        eq(ADDR.progression_state, 0x73),
        eq(prev(ADDR.scene_id), 0x1FF),
        eq(ADDR.scene_id, 0x1FD),
        ...range(0, 96).map((n) =>
          define(
            cond('AddSource', ADDR.alisa_battle_skills(n)),
            cond('AddSource', ADDR.liu_battle_skills(n)),
            cond('AddSource', ADDR.miho_battle_skills(n)),
            cond('AddSource', ADDR.pham_battle_skills(n)),
            cond('AddSource', ADDR.lan_battle_skills(n)),
            cond('AddSource', ADDR.mayer_battle_skills(n)),
          )
        ),
        eq(0, 0),
      ),
      cancel: define(
        eq(0, 1)
      ),
      submit: define(
        eq(1, 1)
      ),
      value: define(
        cond('Measured', ADDR.igt)
      )
    }
  });

  set.addLeaderboard({
    title: `Fastest Completion - New Game+`,
    description: `Finish both the DHZ and USN routes with the lowest in-game time on a save file that carries over completion data from one route to the other`,
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: define(
        eq(ADDR.route, 0x2),
        eq(ADDR.progression_state, 0x73),
        eq(prev(ADDR.scene_id), 0x1FF),
        eq(ADDR.scene_id, 0x1FD),
        ...range(0, 96).map((n) =>
          define(
            cond('AddSource', ADDR.emma_battle_skills(n)),
            cond('AddSource', ADDR.dennis_battle_skills(n)),
            cond('AddSource', ADDR.yun_battle_skills(n)),
            cond('AddSource', ADDR.jose_battle_skills(n)),
            cond('AddSource', ADDR.li_battle_skills(n)),
            cond('AddSource', ADDR.linny_battle_skills(n)),
            cond('AddSource', ADDR.marcus_battle_skills(n)),
          )
        ),
        gt(0, 1),
        ...range(0, 96).map((n) =>
          define(
            cond('AddSource', ADDR.alisa_battle_skills(n)),
            cond('AddSource', ADDR.liu_battle_skills(n)),
            cond('AddSource', ADDR.miho_battle_skills(n)),
            cond('AddSource', ADDR.pham_battle_skills(n)),
            cond('AddSource', ADDR.lan_battle_skills(n)),
            cond('AddSource', ADDR.mayer_battle_skills(n)),
          )
        ),
        gt(0, 1),
      ),
      cancel: define(
        eq(0, 1)
      ),
      submit: define(
        eq(1, 1)
      ),
      value: define(
        cond('Measured', ADDR.igt)
      )
    }
  });
}

export default makeLeaderboards;
