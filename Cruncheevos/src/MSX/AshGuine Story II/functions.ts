import { define } from '@cruncheevos/core';

import { cond, prev, eq, neq } from '../../common/comparison.js';

import { ADDR } from './data.js';

// ---------------------------------------------------------------------------------------------------

export function isGameplay() {
  return define(
    // eq(ADDR.game_state_1, 0x01),
    eq(ADDR.game_state_2, 0x00)
  );
}

export function isntGameplay() {
  return define(
    // neq(ADDR.game_state_1, 0x01),
    neq(ADDR.game_state_2, 0x00)
  );
}

export function elapsedIGT() {
  return define(
    cond('AddSource', 0x800 * 4 * 9),
    cond('SubSource', ADDR.days_remaining, '*', 0x2000),
    cond('AddSource', ADDR.suns_rotations,        '*', 0x800),
    cond('AddSource', ADDR.suns_partial_rotation, '*',  0x80),
    cond('AddSource', ADDR.frames, '&', 0x7F),
    cond('Measured',  0)
  );
}
