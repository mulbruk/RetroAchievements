import {
  AchievementSet,
  define, andNext, once, resetIf, trigger
} from '@cruncheevos/core';

import { eq, neq, lt, prev, cond, lte, gte } from '../../common/comparison.js';
import { range, timeToFramesNTSC } from '../../common/util.js';

import { ADDR, GameState, SlideState } from './data.js';

export function makeAchievements(set: AchievementSet) {
  const progression: { id: number, levelID: number, boss: string, title: string }[] = [
    { id: 497113, levelID: 0x003, boss: `Jumbo`,    title: `Jumbo's Island` },
    { id: 497114, levelID: 0x103, boss: `Mushman`,  title: `Fungal Forest` },
    { id: 497115, levelID: 0x203, boss: `Spinky`,   title: `Sinking Sand Land` },
    { id: 497116, levelID: 0x303, boss: `Bigmouth`, title: `Cumulonimbus Land` },
    { id: 497117, levelID: 0x403, boss: `Badball`,  title: `Valley of Badball` },
  ];

  progression.forEach(({id, levelID, title}) =>
    set.addAchievement({
      title,
      id,
      points: 5,
      type: 'progression',
      description: `Complete world ${Math.round(levelID / 0x100) + 1}`,
      conditions: {
        core: define(
          eq(ADDR.level, levelID),
          eq(prev(ADDR.game_state), GameState.Gameplay),
          eq(ADDR.game_state, GameState.StageClear)
        )
      }
    })
  );

  set.addAchievement({
    title: `Tae Moo's Castle`,
    id: 497118,
    points: 10,
    type: 'win_condition',
    description: 'Complete world 6',
    conditions: {
      core: define(
        eq(ADDR.level, 0x505),
        eq(prev(ADDR.game_state), GameState.Gameplay),
        eq(ADDR.game_state, GameState.StageClear)
      )
    }
  });

  const oneCycles: { id: number, stageID: number[], state1: number, state2: number, bossName: string, points: number, title: string }[] = [
    { id: 497119, stageID: [0x003, 0x500], state1: 0x05, state2: 0x01, bossName: `Jumbo`,    points:  5, title: `Minimizing Jumbo` },
    { id: 497120, stageID: [0x103, 0x501], state1: 0x12, state2: 0x01, bossName: `Mushman`,  points: 10, title: `Tripping Up Mushman` },
    { id: 497121, stageID: [0x203, 0x502], state1: 0x16, state2: 0x01, bossName: `Spinky`,   points:  5, title: `Spanking Spinky` },
    { id: 497122, stageID: [0x303, 0x503], state1: 0x06, state2: 0x01, bossName: `Bigmouth`, points:  5, title: `Silencing Bigmouth` },
    { id: 497123, stageID: [0x403, 0x504], state1: 0x04, state2: 0x00, bossName: `Badball`,  points: 10, title: `Badball Buster` },
    { id: 497124, stageID: [0x505],        state1: 0x05, state2: 0x01, bossName: `Tae Moo`,  points: 10, title: `Trouncing Tae Moo` },
  ];

  oneCycles.forEach(({id, stageID, state1, state2, bossName, points, title}) =>
    set.addAchievement({
      title,
      id,
      points,
      description: `Defeat ${bossName} by the end of its first attack cycle`,
      conditions: {
        core: define(
          once(
            ...stageID.map(
              (id, n) => cond(n < (stageID.length - 1) ? 'OrNext' : 'AndNext', ADDR.level, '=', id)
            ),
            andNext(
              eq(prev(ADDR.game_state), GameState.StageStart),
              eq(ADDR.game_state, GameState.Gameplay)
            )
          ),
          trigger(
            andNext(
              eq(prev(ADDR.game_state), GameState.Gameplay),
              eq(ADDR.game_state, GameState.StageClear)
            )
          ),
          resetIf(
            andNext(
              eq(prev(ADDR.boss_action_state), state1),
              eq(ADDR.boss_action_state, state2)
            )
          ),
          resetIf(
            lte(ADDR.game_state, GameState.CharacterSelect),
            eq(ADDR.game_state, GameState.Dead),
            eq(ADDR.game_state, GameState.GameOver)
          ),
          resetIf(
            andNext(
              ...stageID.map((id) => neq(ADDR.level, id))
            )
          )
        )
      }
    })
  );

  set.addAchievement({
    title: `Slopeless Sliding`,
    id: 497126,
    points: 1,
    description: `Defeat an enemy by sliding into it while on level ground`,
    conditions: {
      core: define(
        once(
          andNext(
            eq(ADDR.slope, 0),
            eq(prev(ADDR.slide_state), SlideState.Standing),
            eq(ADDR.slide_state, SlideState.Sliding)
          ),
        ),
        resetIf(
          neq(ADDR.slope, 0),
          neq(ADDR.slide_state, SlideState.Sliding),
          andNext(
            neq(ADDR.game_state, GameState.Gameplay),
            neq(ADDR.game_state, GameState.Paused)
          )
        )
      ),
      ...range(0, 16).reduce((acc, n) => (
        {
          ...acc,
          [`alt${n + 1}`]: define(
            eq(prev(ADDR.enemy_hp(n)), 1),
            eq(ADDR.enemy_hp(n), 0),
          )
        }
      ), {})
    }
  });

  // Replaced with full-level version
  // set.addAchievement({
  //   title: `[Needs title] Stage 1-3 Schmovement`,
  //   points: 3,
  //   description: `Collect three keys in stage 1-3 with at least 275 seconds remaining on the clock`,
  //   conditions: {
  //     core: define(
  //       once(
  //         andNext(
  //           eq(ADDR.level, 0x002),
  //           eq(prev(ADDR.game_state), GameState.StageStart),
  //           eq(ADDR.game_state, GameState.Gameplay)
  //         )
  //       ),
  //       trigger(
  //         andNext(
  //           eq(prev(ADDR.keys), 2),
  //           eq(ADDR.keys, 1)
  //         )
  //       ),
  //       cond('AddSource', ADDR.timer_100, '*', 100),
  //       cond('AddSource', ADDR.timer_10,  '*',  10),
  //       cond('AddSource', ADDR.timer_1,   '*',   1),
  //       cond('ResetIf', 0, '<', 275),
  //       resetIf(
  //         neq(ADDR.level, 0x002)
  //       ),
  //       resetIf(
  //         andNext(
  //           neq(ADDR.game_state, GameState.Gameplay),
  //           neq(ADDR.game_state, GameState.Paused)
  //         )
  //       )
  //     )
  //   }
  // });

  set.addAchievement({
    title: `Schmovin' in 1-3`,
    id: 497128,
    points: 5,
    description: `Complete in stage 1-3 without going below 285 seconds remaining on the clock`,
    conditions: {
      core: define(
        once(
          andNext(
            eq(ADDR.level, 0x002),
            eq(prev(ADDR.game_state), GameState.StageStart),
            eq(ADDR.game_state, GameState.Gameplay)
          )
        ),
        trigger(
          andNext(
            eq(prev(ADDR.game_state), GameState.Gameplay),
            eq(ADDR.game_state, GameState.StageClear)
          )
        ),
        cond('AddSource', ADDR.timer_100, '*', 100),
        cond('AddSource', ADDR.timer_10,  '*',  10),
        cond('AddSource', ADDR.timer_1,   '*',   1),
        cond('ResetIf', 0, '<', 285),
        resetIf(
          neq(ADDR.level, 0x002)
        ),
        resetIf(
          andNext(
            neq(ADDR.game_state, GameState.Gameplay),
            neq(ADDR.game_state, GameState.Paused),
            neq(ADDR.game_state, GameState.StageClear)
          )
        )
      )
    }
  });

  // Scrapped idea: camera fine scrolling is too finicky
  // set.addAchievement({
  //   title: `[Needs title] 2-3 Scrolling`,
  //   points: 5,
  //   description: `Complete stage 2-3 without ever letting the screen scroll downwards`,
  //   conditions: {
  //     core: define(
  //       once(
  //         andNext(
  //           eq(ADDR.level, 0x0102),
  //           eq(prev(ADDR.game_state), GameState.StageStart),
  //           eq(ADDR.game_state, GameState.Gameplay)
  //         )
  //       ),
  //       trigger(
  //         andNext(
  //           eq(prev(ADDR.game_state), GameState.Gameplay),
  //           eq(ADDR.game_state, GameState.StageClear)
  //         )
  //       ),
  //       resetIf(
  //         lt(ADDR.camera_y, prev(ADDR.camera_y))
  //       ),
  //       resetIf(
  //         neq(ADDR.level, 0x0102)
  //       ),
  //       resetIf(
  //         andNext(
  //           neq(ADDR.game_state, GameState.Gameplay),
  //           neq(ADDR.game_state, GameState.Paused),
  //           neq(ADDR.game_state, GameState.StageClear)
  //         )
  //       )
  //     )
  //   }
  // });

  set.addAchievement({
    title: `Schmovin' in 2-3`,
    id: 497130,
    points: 10,
    description: `Complete stage 2-3 with at least 300 seconds remaining on the clock`,
    conditions: {
      core: define(
        once(
          andNext(
            eq(ADDR.level, 0x102),
            eq(prev(ADDR.game_state), GameState.StageStart),
            eq(ADDR.game_state, GameState.Gameplay)
          )
        ),
        trigger(
          cond('AddSource', ADDR.timer_100, '*', 100),
          cond('AddSource', ADDR.timer_10,  '*',  10),
          cond('AddSource', ADDR.timer_1,   '*',   1),
          cond('AndNext', 0, '>=', 300),
          andNext(
            eq(prev(ADDR.game_state), GameState.Gameplay),
            eq(ADDR.game_state, GameState.StageClear)
          )
        ),
        resetIf(
          cond('AddSource', ADDR.timer_100, '*', 100),
          cond('AddSource', ADDR.timer_10,  '*',  10),
          cond('AddSource', ADDR.timer_1,   '*',   1),
          cond('AndNext', 0, '<', 300),
          eq(ADDR.game_state, GameState.StageClear)
        ),
        resetIf(
          neq(ADDR.level, 0x102)
        ),
        resetIf(
          andNext(
            neq(ADDR.game_state, GameState.Gameplay),
            neq(ADDR.game_state, GameState.Paused),
            neq(ADDR.game_state, GameState.StageClear)
          )
        )
      )
    }
  });

  set.addAchievement({
    title: `Schmovin' in 3-2`,
    id: 497131,
    points: 5,
    description: `Complete stage 3-2 without going below 270 seconds remaining on the clock`,
    conditions: {
      core: define(
        once(
          andNext(
            eq(ADDR.level, 0x201),
            eq(prev(ADDR.game_state), GameState.StageStart),
            eq(ADDR.game_state, GameState.Gameplay)
          )
        ),
        trigger(
          andNext(
            eq(prev(ADDR.game_state), GameState.Gameplay),
            eq(ADDR.game_state, GameState.StageClear)
          )
        ),
        cond('AddSource', ADDR.timer_100, '*', 100),
        cond('AddSource', ADDR.timer_10,  '*',  10),
        cond('AddSource', ADDR.timer_1,   '*',   1),
        cond('ResetIf', 0, '<', 270),
        resetIf(
          neq(ADDR.level, 0x201)
        ),
        resetIf(
          andNext(
            neq(ADDR.game_state, GameState.Gameplay),
            neq(ADDR.game_state, GameState.Paused),
            neq(ADDR.game_state, GameState.StageClear)
          )
        )
      )
    }
  });

  set.addAchievement({
    title: `Plundering the Cumulus Coffers`,
    id: 497129,
    points: 1,
    description: `Collect all treasures from a secret stash in stage 4-1`,
    conditions: {
      core: define(
        // Bounding box for treasure cache
        ...range(0, 3).map((n) => andNext(
          gte(ADDR.player_x_coord, 0x0110),
          lte(ADDR.player_x_coord, 0x01cf),
          gte(ADDR.player_y_coord, 0xfd00),
          lte(ADDR.player_y_coord, 0xfd80),
          gte(prev(ADDR.item_type(n)), 0x01),
          lte(prev(ADDR.item_type(n)), 0x03),
          cond('AddHits', ADDR.item_type(n), '=', 0x80)
        )),
        // Bounding box for if rightmost hourglass gets knocked over the platform's edge
        ...range(0, 3).map((n) => andNext(
          gte(ADDR.player_x_coord, 0x0210),
          lte(ADDR.player_x_coord, 0x024f),
          gte(ADDR.player_y_coord, 0xff8f),
          lte(ADDR.player_y_coord, 0xffef),
          eq(prev(ADDR.item_type(n)), 0x01),
          cond('AddHits', ADDR.item_type(n), '=', 0x80)
        )),
        // Bounding box for if leftmost powerup gets knocked over the platform's edge
        ...range(0, 3).map((n) => andNext(
          gte(ADDR.player_x_coord, 0x00d0),
          lte(ADDR.player_x_coord, 0x011f),
          gte(ADDR.player_y_coord, 0xfe00),
          lte(ADDR.player_y_coord, 0xfe6f),
          eq(prev(ADDR.item_type(n)), 0x02),
          cond('AddHits', ADDR.item_type(n), '=', 0x80)
        )),
        cond('Measured', 0, '=', 1, 9),
        resetIf(
          neq(ADDR.level, 0x300),
          andNext(
            neq(ADDR.game_state, GameState.Gameplay),
            neq(ADDR.game_state, GameState.Paused)
          )
        )
      )
    }
  });

  set.addAchievement({
    title: `Schmovin' in 4-2`,
    id: 497132,
    points: 5,
    description: `Complete stage 4-2 without going below 270 seconds remaining on the clock`,
    conditions: {
      core: define(
        once(
          andNext(
            eq(ADDR.level, 0x301),
            eq(prev(ADDR.game_state), GameState.StageStart),
            eq(ADDR.game_state, GameState.Gameplay)
          )
        ),
        trigger(
          andNext(
            eq(prev(ADDR.game_state), GameState.Gameplay),
            eq(ADDR.game_state, GameState.StageClear)
          )
        ),
        cond('AddSource', ADDR.timer_100, '*', 100),
        cond('AddSource', ADDR.timer_10,  '*',  10),
        cond('AddSource', ADDR.timer_1,   '*',   1),
        cond('ResetIf', 0, '<', 270),
        resetIf(
          neq(ADDR.level, 0x301)
        ),
        resetIf(
          andNext(
            neq(ADDR.game_state, GameState.Gameplay),
            neq(ADDR.game_state, GameState.Paused),
            neq(ADDR.game_state, GameState.StageClear)
          )
        )
      )
    }
  });
  
  set.addAchievement({
    title: `Schmovin' in 5-1`,
    id: 497125,
    points: 5,
    description: `Complete stage 5-1 without taking damage and without going below 275 seconds remaining on the clock`,
    conditions: {
      core: define(
        once(
          andNext(
            eq(ADDR.level, 0x0400),
            eq(prev(ADDR.game_state), GameState.StageStart),
            eq(ADDR.game_state, GameState.Gameplay)
          )
        ),
        trigger(
          andNext(
            eq(prev(ADDR.game_state), GameState.Gameplay),
            eq(ADDR.game_state, GameState.StageClear)
          )
        ),
        cond('AddSource', ADDR.timer_100, '*', 100),
        cond('AddSource', ADDR.timer_10,  '*',  10),
        cond('AddSource', ADDR.timer_1,   '*',   1),
        cond('ResetIf', 0, '<', 275),
        resetIf(
          lt(ADDR.powerup_level, prev(ADDR.powerup_level))
        ),
        resetIf(
          neq(ADDR.level, 0x0400)
        ),
        resetIf(
          andNext(
            neq(ADDR.game_state, GameState.Gameplay),
            neq(ADDR.game_state, GameState.Paused),
            neq(ADDR.game_state, GameState.StageClear)
          )
        )
      )
    }
  });

  set.addAchievement({
    title: `Boss Rush Crushed`,
    id: 497133,
    points: 10,
    description: `Complete the world 6 boss rush without dying`,
    conditions: {
      core: define(
        trigger(
          andNext(
            eq(ADDR.level, 0x0505),
            eq(prev(ADDR.game_state), GameState.Gameplay),
            eq(ADDR.game_state, GameState.StageClear)
          )
        ),
        resetIf(
          andNext(
            neq(ADDR.game_state, GameState.StageStart),
            neq(ADDR.game_state, GameState.Gameplay),
            neq(ADDR.game_state, GameState.Paused),
            neq(ADDR.game_state, GameState.StageClear)
          )
        )
      ),
      alt1: once(
        andNext(
          eq(ADDR.game_state, GameState.StageStart),
          eq(prev(ADDR.level), 0x0403),
          eq(ADDR.level, 0x0500)
        )
      ),
      alt2: once(
        andNext(
          eq(ADDR.level, 0x0500),
          eq(prev(ADDR.game_state), GameState.CharacterSelect),
          eq(ADDR.game_state, GameState.StageStart)
        )
      )
    }
  });

  set.addAchievement({
    title: `Expeditious Adventurer`,
    id: 497127,
    points: 25,
    description: `Complete the game in under 24 minutes`,
    conditions: {
      core: define(
        andNext(
          eq(ADDR.level, 0x000),
          eq(prev(ADDR.game_state), GameState.CharacterSelect),
          once(eq(ADDR.game_state, GameState.StageStart))
        ),
        eq(ADDR.level, 0x505),
        eq(prev(ADDR.game_state), GameState.Gameplay),
        eq(ADDR.game_state, GameState.StageClear),
        andNext(
          eq(ADDR.level, 0x000),
          eq(prev(ADDR.game_state), GameState.CharacterSelect),
          once(eq(ADDR.game_state, GameState.StageStart)),
          cond('ResetIf', 1, '=', 1, timeToFramesNTSC({minutes: 24}))
        ),
        resetIf(
          eq(ADDR.game_state, GameState.BootLogos),
          eq(ADDR.game_state, GameState.TitleScreen),
          eq(ADDR.game_state, GameState.AttractMode)
        )
      )
    }
  });
}

export default makeAchievements;
