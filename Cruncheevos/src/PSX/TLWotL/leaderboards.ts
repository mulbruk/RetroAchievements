import { define, AchievementSet, once, andNext, orNext, resetIf } from '@cruncheevos/core';

import { cond, prev, not, eq, neq, gt } from '../../common/comparison.js';
import { range } from '../../common/util.js';

import { SYSTEM, EVENT_FLAGS, PLAYER, PLAYER_UNITS } from './data.js';

// ---------------------------------------------------------------------------------------------------

function makeLeaderboards(set: AchievementSet) {
  set.addLeaderboard({
    title: `Focused on the Hustle and Grind`,
    description: `Most times using Focus in a single battle`,
    lowerIsBetter: false,
    type: 'VALUE',
    conditions: {
      start: {
        core: define(
          neq(SYSTEM.world_map_overlay, 0x70735f73),
          eq(SYSTEM.battle_active, 0x01),
        ),
        ...range(0, 5).reduce((acc, n) => ({
          ...acc,
          [`alt${n + 1}`]: define(
            eq(PLAYER.ability_used(n), 0x92),
            eq(prev(PLAYER.action_taken(n)), 0),
            eq(PLAYER.action_taken(n), 1),
            orNext(
              eq(PLAYER.skillset_used(n), 0x05),
              eq(PLAYER.skillset_used(n), 0x19),
              eq(PLAYER.skillset_used(n), 0x1a),
              eq(PLAYER.skillset_used(n), 0x1b),
            )
          )
        }), {})
      },
      cancel: {
        core: define(
          eq(1, 1)
        ),
        alt1: define(
          eq(prev(SYSTEM.world_map_overlay), 0x70735f73),
          
        ),
        alt2: define(
          eq(SYSTEM.current_event, 0x190),
        ),
        alt3: define(
          orNext(
            eq(SYSTEM.event_id, 0x000),
            gt(SYSTEM.event_id, 0x1ff),
          )
        )
      },
      submit: define(
        neq(prev(SYSTEM.battle_active), 0x01),
        neq(prev(SYSTEM.world_map_overlay), 0x70735f73),
        eq(SYSTEM.world_map_overlay, 0x70735f73),
      ),
      value: define(
        ...range(0, 5).map((n) => orNext(
          eq(PLAYER.skillset_used(n), 0x05),
          eq(PLAYER.skillset_used(n), 0x19),
          eq(PLAYER.skillset_used(n), 0x1a),
          eq(PLAYER.skillset_used(n), 0x1b),
        ).andNext(
          eq(SYSTEM.battle_active, 0x01),
          eq(PLAYER.ability_used(n), 0x92),
          eq(prev(PLAYER.action_taken(n)), 0),
          eq(PLAYER.action_taken(n), 1)
        ).withLast({ flag: 'AddHits' })),
        cond('Measured', 0, '=', 1),
        resetIf(eq(prev(SYSTEM.world_map_overlay), 0x70735f73)),
        resetIf(eq(SYSTEM.current_event, 0x190)),
        resetIf(
          orNext(
            eq(SYSTEM.event_id, 0x000),
            gt(SYSTEM.event_id, 0x1ff),
          )
        )
      ),
    }
  });

  set.addLeaderboard({
    title: `Manifesting the Amphibian Grindset`,
    description: `Most times using the attack command while turned into a toad in a single battle`,
    lowerIsBetter: false,
    type: 'VALUE',
    conditions: {
      start: {
        core: define(
          neq(SYSTEM.world_map_overlay, 0x70735f73),
          eq(SYSTEM.battle_active, 0x01),
        ),
        ...range(0, 5).reduce((acc, n) => ({
          ...acc,
          [`alt${n + 1}`]: define(
            eq(PLAYER.is_toad(n), 1),
            eq(PLAYER.skillset_used(n), 0x01),
            eq(PLAYER.ability_used(n), 0x00),
            eq(prev(PLAYER.action_taken(n)), 0),
            eq(PLAYER.action_taken(n), 1),
          )
        }), {})
      },
      cancel: {
        core: define(
          eq(1, 1)
        ),
        alt1: define(
          eq(prev(SYSTEM.world_map_overlay), 0x70735f73),
          
        ),
        alt2: define(
          eq(SYSTEM.current_event, 0x190),
        ),
        alt3: define(
          orNext(
            eq(SYSTEM.event_id, 0x000),
            gt(SYSTEM.event_id, 0x1ff),
          )
        )
      },
      submit: define(
        neq(prev(SYSTEM.battle_active), 0x01),
        neq(prev(SYSTEM.world_map_overlay), 0x70735f73),
        eq(SYSTEM.world_map_overlay, 0x70735f73),
      ),
      value: define(
        ...range(0, 5).map((n) => andNext(
          eq(SYSTEM.battle_active, 0x01),
          eq(PLAYER.is_toad(n), 1),
          eq(PLAYER.skillset_used(n), 0x01),
          eq(PLAYER.ability_used(n), 0x00),
          eq(prev(PLAYER.action_taken(n)), 0),
          eq(PLAYER.action_taken(n), 1)
        ).withLast({ flag: 'AddHits' })),
        cond('Measured', 0, '=', 1),
        resetIf(eq(prev(SYSTEM.world_map_overlay), 0x70735f73)),
        resetIf(eq(SYSTEM.current_event, 0x190)),
        resetIf(
          orNext(
            eq(SYSTEM.event_id, 0x000),
            gt(SYSTEM.event_id, 0x1ff),
          )
        )
      ),
    }
  });

  set.addLeaderboard({
    title: `Mom Says It's My Turn To Play in the Degenerator Trap`,
    description: `Most levels down in a single battle`,
    lowerIsBetter: false,
    type: 'VALUE',
    conditions: {
      start: {
        core: define(
          neq(SYSTEM.world_map_overlay, 0x70735f73),
          eq(SYSTEM.battle_active, 0x01),
        ),
        ...range(0, 5).reduce((acc, n) => ({
          ...acc,
          [`alt${n + 1}`]: define(
            eq(prev(PLAYER.level_down(n)), 0),
            eq(PLAYER.level_down(n), 1),
          )
        }), {})
      },
      cancel: {
        core: define(
          eq(1, 1)
        ),
        alt1: define(
          eq(prev(SYSTEM.world_map_overlay), 0x70735f73),
          
        ),
        alt2: define(
          eq(SYSTEM.current_event, 0x190),
        ),
        alt3: define(
          orNext(
            eq(SYSTEM.event_id, 0x000),
            gt(SYSTEM.event_id, 0x1ff),
          )
        )
      },
      submit: define(
        neq(prev(SYSTEM.battle_active), 0x01),
        neq(prev(SYSTEM.world_map_overlay), 0x70735f73),
        eq(SYSTEM.world_map_overlay, 0x70735f73),
      ),
      value: define(
        ...range(0, 5).map((n) => andNext(
          eq(SYSTEM.battle_active, 0x01),
          eq(prev(PLAYER.level_down(n)), 0),
          eq(PLAYER.level_down(n), 1)
        ).withLast({ flag: 'AddHits' })),
        cond('Measured', 0, '=', 1),
        resetIf(eq(prev(SYSTEM.world_map_overlay), 0x70735f73)),
        resetIf(eq(SYSTEM.current_event, 0x190)),
        resetIf(
          orNext(
            eq(SYSTEM.event_id, 0x000),
            gt(SYSTEM.event_id, 0x1ff),
          )
        )
      ),
    }
  });
}

export default makeLeaderboards;
