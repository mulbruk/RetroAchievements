import { AchievementSet, define, andNext, orNext, resetIf } from "@cruncheevos/core";

import { cond, prev, eq, neq } from "../../common/comparison.js";
import { range } from "../../common/util.js";
import { byte } from "../../common/value.js";

import { ADDR, GameState } from "./data.js";
import { screenTransitions } from "./screen-transitions.js";

// ---------------------------------------------------------------------------------------------------
function makeLeaderboards(set: AchievementSet) {
  set.addLeaderboard({
    title: `Routing Castle Greek`,
    description: `Collect as many items as possible from Castle Greek and then unlock World 1, without passing through any given pair of screen transitions more than two times`,
    lowerIsBetter: false,
    type: 'VALUE',
    conditions: {
      start: define(
        eq(prev(ADDR.game_state), GameState.TitleScreen),
        eq(ADDR.game_state, GameState.GameStart),
        eq(ADDR.game_substate, 0x00),
      ),
      cancel: {
        core: define(
          eq(1, 1),
        ),
        alt1: orNext(
          eq(ADDR.game_state, GameState.Boot),
          eq(ADDR.game_state, GameState.TitleScreen),
          eq(ADDR.game_state, GameState.AttractMode),
          eq(ADDR.game_state, GameState.GameOver),
        ),
        alt2: define(
          eq(prev(ADDR.world_unlocked(1)), 1)
        ),
        alt3: define(
          eq(0, 1),
          resetIf(
            eq(ADDR.game_state, GameState.Boot),
            eq(ADDR.game_state, GameState.TitleScreen),
            eq(ADDR.game_state, GameState.AttractMode),
            eq(ADDR.game_state, GameState.GameOver),
            eq(prev(ADDR.world_unlocked(1)), 1),
          ),
        ),
        ...screenTransitions.reduce((acc, [x, y], n) => (
          {
            ...acc,
            [`alt${4 * n + 4}`]: define(
              cond('AndNext', prev(ADDR.screen_id), '=', x),
              cond('',        ADDR.screen_id,       '=', y, 3),
            ),
            [`alt${4 * n + 5}`]: define(
              cond('AndNext', prev(ADDR.screen_id), '=', x),
              cond('',        ADDR.screen_id,       '=', y, 2),
              cond('AndNext', prev(ADDR.screen_id), '=', y),
              cond('',        ADDR.screen_id,       '=', x, 1),
            ),
            [`alt${4 * n + 6}`]: define(
              cond('AndNext', prev(ADDR.screen_id), '=', y),
              cond('',        ADDR.screen_id,       '=', x, 2),
              cond('AndNext', prev(ADDR.screen_id), '=', x),
              cond('',        ADDR.screen_id,       '=', y, 1),
            ),
            [`alt${4 * n + 7}`]: define(
              cond('AndNext', prev(ADDR.screen_id), '=', y),
              cond('',        ADDR.screen_id,       '=', x, 3),
            ),
          }
        ), {}),
      },
      submit: define(
        eq(ADDR.game_state, GameState.Gameplay),
        eq(ADDR.map_id, 1),
        eq(prev(ADDR.world_unlocked(1)), 0),
        eq(ADDR.world_unlocked(1), 1),
      ),
      value: define(
        ...range(0, 6).map((n) =>
          cond('AddSource', byte(0x70 + n))
        ),
        ...range(10, 42).map((n) =>
          cond('AddSource', byte(0x70 + n))
        ),
        cond('AddSource', ADDR.world_unlocked(1)),
        cond('Measured',  0),
      )
    }
  });

  range(1, 11).forEach((world) => {
    set.addLeaderboard({
      title: `World ${world} Quick Kill`,
      description: `Defeat the Great Demon in World ${world} as quickly as possible`,
      lowerIsBetter: true,
      type: 'FRAMES',
      conditions: {
        start: define(
          eq(ADDR.map_id, world + 1),
          eq(ADDR.world_boss_dead(world), 0),
          eq(prev(ADDR.game_state), GameState.Gameplay),
          eq(ADDR.game_state, GameState.BossStart),
        ),
        cancel: orNext(
          eq(ADDR.game_state, GameState.AttractMode),
          eq(ADDR.game_state, GameState.Boot),
          eq(ADDR.game_state, GameState.Ending),
          eq(ADDR.game_state, GameState.GameOver),
          eq(ADDR.game_state, GameState.TitleScreen),
          neq(ADDR.map_id, world + 1),
        ),
        submit: define(
          eq(ADDR.map_id, world + 1),
          eq(ADDR.game_state, GameState.BossDefeat),
          eq(prev(ADDR.world_boss_dead(world)), 0),
          eq(ADDR.world_boss_dead(world), 1),
        ),
        value: define(
          cond('Measured', 0, '=', 0),
        ),
      }
    });
  });
}

export default makeLeaderboards;
