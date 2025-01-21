import { RichPresence, define, orNext } from "@cruncheevos/core";

import { eq } from "../../common/comparison.js";
import { addrStr, richPresenceLookup } from "../../common/rich-presence.js";

import { ADDR } from "./data.js";

// ---------------------------------------------------------------------------------------------------

const levelData: { stageID: number, world: string }[] = [
  { stageID: 0x01, world: `Yoshi's Island`  },
  { stageID: 0x02, world: `Yoshi's Island`  },
  { stageID: 0x03, world: `Yoshi's Island`  },
  { stageID: 0x04, world: `Yoshi's Island`  },
  { stageID: 0x05, world: `Booser's Castle` },
  { stageID: 0x06, world: `Booser's Castle` },
  { stageID: 0x07, world: `Booser's Castle` },
  { stageID: 0x08, world: `Booser's Castle` },
  { stageID: 0x09, world: `Boss Bass Basin` },
  { stageID: 0x0A, world: `Boss Bass Basin` },
  { stageID: 0x0B, world: `Boss Bass Basin` },
  { stageID: 0x0C, world: `Boss Bass Basin` },
  { stageID: 0x0D, world: `the Forest of Illusion` },
  { stageID: 0x0E, world: `the Forest of Illusion` },
  { stageID: 0x0F, world: `the Forest of Illusion` },
  { stageID: 0x10, world: `the Forest of Illusion` },
  { stageID: 0x11, world: `battle with Wart` }
];

function isTitleScreen() {
  return orNext(
    eq(ADDR.game_state, 0xFF),
    eq(ADDR.game_state, 0x83),
    eq(ADDR.level_id, 0x00)
  );
}

function isEnding() {
  return define(
    eq(ADDR.game_state, 0x85)
  );
}

function inGame() {
  return orNext(
    eq(ADDR.game_state, 0x00),
    eq(ADDR.game_state, 0x81),
    eq(ADDR.game_state, 0x82)
  );
}

function makeRichPresence() {
  const World = richPresenceLookup(
    'World',
    levelData, 'stageID', 'world',
    { defaultAt: ADDR.level_id, defaultValue: 'an indeterminate state' }
  );

  return RichPresence({
    lookupDefaultParameters: { keyFormat: 'hex', compressRanges: true },
    lookup: {
      World
    },
    displays: ({ lookup, format, macro, tag }) => {
      const world = tag`${lookup.World}`;
      const stage = tag`Stage ${macro.Number.at(addrStr(ADDR.level_id))}`;
      const lives = tag`Lives: ${macro.Number.at(addrStr(ADDR.lives))}`;

      return [
        [isTitleScreen(), 'Title Screen'],
        [isEnding(), 'Ending and credits'],
        [inGame(), tag`Super Boy is in ${world} • ${stage} • ${lives}`],
        'Super Boy is in Dinosaur Land'
      ];
    }
  });
}

export default makeRichPresence;
