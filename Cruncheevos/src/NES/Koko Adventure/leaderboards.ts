import { AchievementSet, define, orNext } from '@cruncheevos/core';

import { cond, prev, eq } from '../../common/comparison.js';
import { range } from '../../common/util.js';
import { FLOAT } from '../../common/value.js';

import { ADDR, GameState } from './data.js';

export function makeLeaderboards(set: AchievementSet) {
  range(0, 5).forEach((world) =>
    range(0, 3).forEach((stage) => {
      const levelName = `${world + 1}-${stage + 1}`;
      const levelID = world * 0x100 + stage;

      set.addLeaderboard({
        title: `Stage ${levelName} Speedrun`,
        description: `Complete stage ${levelName} with the most time remaining`,
        lowerIsBetter: false,
        type: 'FIXED2',
        conditions: {
          start: define(
            eq(ADDR.level, levelID),
            eq(prev(ADDR.game_state), GameState.Gameplay),
            eq(ADDR.game_state, GameState.StageClear)
          ),
          cancel: define(
            eq(0, 1)
          ),
          submit: define(
            eq(1, 1)
          ),
          value: define(
            cond('AddSource', ADDR.timer_100,    '*', 10000),
            cond('AddSource', ADDR.timer_10,     '*',  1000),
            cond('AddSource', ADDR.timer_1,      '*',   100),
            cond('AddSource', ADDR.timer_frames, '*', FLOAT(1.666667)),
            cond('Measured',  0)
          )
        }
      })
    })
  );
  
  set.addLeaderboard({
    title:`Athletic Adventurer`,
    description: `Complete the game as quickly as possible`,
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: define(
        eq(ADDR.level, 0x000),
        eq(prev(ADDR.game_state), GameState.CharacterSelect),
        eq(ADDR.game_state, GameState.StageStart)
      ),
      cancel: orNext(
        eq(ADDR.game_state, GameState.BootLogos),
        eq(ADDR.game_state, GameState.TitleScreen),
        eq(ADDR.game_state, GameState.AttractMode)
      ),
      submit: define(
        eq(ADDR.level, 0x505),
        eq(prev(ADDR.game_state), GameState.Gameplay),
        eq(ADDR.game_state, GameState.StageClear)
      ),
      value: define(
        cond('Measured', 1, '=', 1)
      )
    }
  });
}

export default makeLeaderboards;
