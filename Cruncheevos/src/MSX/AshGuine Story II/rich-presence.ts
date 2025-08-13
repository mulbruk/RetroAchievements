import { define, RichPresence } from "@cruncheevos/core";

import { eq, neq, gt } from '../../common/comparison.js'
import {
  addrStr, richPresenceLookup
} from "../../common/rich-presence.js";

import { ADDR } from "./data.js";
import { isGameplay, isntGameplay } from "./functions.js";

// ---------------------------------------------------------------------------------------------------

const stageDescriptions: { id: number, description: string }[] = [
  { id: 0x11, description: `fighting his way out of the Underground Temple` },
  { id: 0x01, description: `fighting his way out of the Underground Temple` },
  { id: 0x02, description: `journeying through the Mountainous Region` },
  { id: 0x03, description: `traversing the Equatorial Ring` },
  { id: 0x04, description: `slinking through the Subterranean Passage` },
  { id: 0x05, description: `ascending the Tower of Maid Sante` },
  { id: 0x06, description: `storming Gizemahl Castle` },
  { id: 0x07, description: `storming Gizemahl Castle` },
];

function makeRichPresence() {
  const StageDescription = richPresenceLookup(
    'StageDescription',
    stageDescriptions, 'id', 'description',
    { defaultAt: ADDR.stage, defaultValue: `` }
  );
  
  return RichPresence({
    format: {},
    lookupDefaultParameters: { keyFormat: 'hex', compressRanges: false },
    lookup: {
      StageDescription,
    },
    displays: ({ lookup, format, macro, tag }) => {
      const level = `Level ${macro.Number.at(addrStr(ADDR.level(100)))}${macro.Number.at(addrStr(ADDR.level(10)))}${macro.Number.at(addrStr(ADDR.level(1)))}`
      const lives = `Lives: ${macro.Number.at(addrStr(ADDR.lives))}`;

      return [
        [
          define(isntGameplay(), eq(ADDR.non_gameplay_state, 0x04)),
          `Ashguine is reminiscing on his backstory`
        ],
        [
          define(isntGameplay(), eq(ADDR.non_gameplay_state, 0xff), eq(ADDR.stage, 0x55)),
          `Ashguine is reminiscing on his backstory`
        ],
        [
          define(isntGameplay(), eq(ADDR.non_gameplay_state, 0xff)),
          `Ashguine is drifting through the void of space in a prolonged sleep`
        ],
        [
          define(isGameplay(), gt(ADDR.stage, 0x07)),
          tag`Ashguine is enjoying a moment of calm`
        ],
        [
          define(isGameplay(), gt(ADDR.lives, 0)),
          tag`Ashguine is ${lookup.StageDescription} • ${level} • ${lives}`
        ],
        [
          define(isGameplay(), eq(ADDR.lives, 0)),
          tag`Ashguine is straddling the border of life and death`
        ],
        `Ashguine is suffering from the curse of iron pipe`
      ]
    },
  });
}

export default makeRichPresence;
