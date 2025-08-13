import { define, RichPresence } from "@cruncheevos/core";

import { eq, neq, gt } from '../../common/comparison.js';
import { addrStr } from "../../common/rich-presence.js";

import { ADDR } from './data.js';

// ---------------------------------------------------------------------------------------------------

export function makeRichPresence() {
  return RichPresence({
    displays: ({ lookup, format, macro, tag }) => {
      const number_level = tag`Distance: ${macro.Number.at(addrStr(ADDR.level_high))}${macro.Number.at(addrStr(ADDR.level_low))}`;
      const difficulty   = tag`Difficulty: ${macro.Number.at(addrStr(ADDR.difficulty))}`;

      return [
        [
          define(
            eq(ADDR.coarse_state, 0x00000000)
          ),
          `Title screen`
        ],
        [
          define(
            neq(ADDR.coarse_state, 0x00000000),
            eq(ADDR.screen_id, 0x00),
            eq(ADDR.victory_flag, 0x01)
          ),
          `Ned has discovered what lies beyond 99`
        ],
        [
          define(
            neq(ADDR.coarse_state, 0x00000000),
            eq(ADDR.screen_id, 0x00),
            eq(ADDR.difficulty, 0xfe)
          ),
          `Ned is pondering what drill to attempt next • ${number_level}`
        ],
        [
          define(
            neq(ADDR.coarse_state, 0x00000000),
            eq(ADDR.screen_id, 0x00),
            neq(ADDR.difficulty, 0xfe)
          ),
          `Ned is nimbly jumping some barrels • ${number_level}`
        ],
        [
          define(
            neq(ADDR.coarse_state, 0x00000000),
            eq(ADDR.screen_id, 0x20)
          ),
          `Ned is drilling Name the Shapes • ${difficulty} • ${number_level}`
        ],
        [
          define(
            neq(ADDR.coarse_state, 0x00000000),
            eq(ADDR.screen_id, 0x06),
            eq(ADDR.mult_function, 0x0000)
          ),
          `Ned is drilling Multiplication Runthrough • ${difficulty} • ${number_level}`
        ],
        [
          define(
            neq(ADDR.coarse_state, 0x00000000),
            eq(ADDR.screen_id, 0x06),
            gt(ADDR.mult_function, 0x0000)
          ),
          `Ned is drilling Function Machine • ${difficulty} • ${number_level}`
        ],
        `Ned is nimbly nurturing his numeracy`
      ]
    },
  });
}

export default makeRichPresence;
