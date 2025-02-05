import { RichPresence, define, andNext, orNext } from "@cruncheevos/core";

import { eq, neq, gte, gt, lt, lte, cond } from "../../common/comparison.js";
import { addrStr, richPresenceLookup } from "../../common/rich-presence.js";

import { ADDR } from "./data.js";

// ---------------------------------------------------------------------------------------------------

const bossData: { world: number, name: string }[] = [
  { world: 0x00, name: `Jumbo`    },
  { world: 0x01, name: `Mushman`  },
  { world: 0x02, name: `Spinky`   },
  { world: 0x03, name: `Bigmouth` },
  { world: 0x04, name: `Badball`  },
  { world: 0x05, name: `Tae Moo`  },
];

const characterData: { id: number, name: string }[] = [
  { id: 0x00, name: 'Koko' },
  { id: 0x01, name: 'Suzi' },
];

const zeroIndexed: { n: number, val: string }[] = [
  { n: 0x00, val: '1' },
  { n: 0x01, val: '2' },
  { n: 0x02, val: '3' },
  { n: 0x03, val: '4' },
  { n: 0x04, val: '5' },
  { n: 0x05, val: '6' },
];

const keysData: { levelID: number, keyCount: number }[] = [
  { levelID: 0x0000, keyCount: 3 },
  { levelID: 0x0001, keyCount: 4 },
  { levelID: 0x0002, keyCount: 4 },
  
  { levelID: 0x0100, keyCount: 3 },
  { levelID: 0x0101, keyCount: 4 },
  { levelID: 0x0102, keyCount: 4 },
  
  { levelID: 0x0200, keyCount: 4 },
  { levelID: 0x0201, keyCount: 4 },
  { levelID: 0x0202, keyCount: 4 },
  
  { levelID: 0x0300, keyCount: 4 },
  { levelID: 0x0301, keyCount: 4 },
  { levelID: 0x0302, keyCount: 2 },
  
  { levelID: 0x0400, keyCount: 6 },
  { levelID: 0x0401, keyCount: 5 },
  { levelID: 0x0402, keyCount: 5 },
]

function isTitleScreen() {
  return define(
    lte(ADDR.game_state, 0x04)
  );
}

function isInGame() {
  return andNext(
    gte(ADDR.game_state, 0x05),
    lte(ADDR.game_state, 0x09)
  );
}

function isGameOver() {
  return orNext(
    eq(ADDR.game_state, 0x0a),
    eq(ADDR.game_state, 0x0b)
  );
}

function isEnding() {
  return define(
    eq(ADDR.game_state, 0x0c)
  );
}

function isRestTime() {
  return define(
    eq(ADDR.game_state, 0x0d)
  );
}

function isBossStage() {
  return andNext(
    lt(ADDR.world, 0x05),
    eq(ADDR.stage, 0x03)
  );
}

function isBossRush() {
  return define(
    eq(ADDR.world, 0x05)
  )
}

// ---------------------------------------------------------------------------------------------------

function makeRichPresence() {
  const BossName = richPresenceLookup(
    'BossName',
    bossData, 'world', 'name'
  );

  const CharacterName = richPresenceLookup(
    'CharacterName',
    characterData, 'id', 'name',
    { defaultAt: ADDR.character }
  );

  const KeyTotal = richPresenceLookup(
    'KeyTotal',
    keysData, 'levelID', 'keyCount',
    { defaultAt: ADDR.level }
  );

  const ZeroIndexed = richPresenceLookup(
    'ZeroIndexed',
    zeroIndexed, 'n', 'val'
  );

  return RichPresence({
    lookupDefaultParameters: { keyFormat: 'hex', compressRanges: true },
    lookup: {
      BossName,
      CharacterName,
      KeyTotal,
      ZeroIndexed,
    },
    displays: ({ lookup, format, macro, tag }) => {
      const character = tag`${lookup.CharacterName}`;
      const stage = tag`${lookup.ZeroIndexed.at(addrStr(ADDR.world))}-${lookup.ZeroIndexed.at(addrStr(ADDR.stage))}`;
      const lives = tag`Lives: ${macro.Number.at(addrStr(ADDR.lives))}`;

      return [
        [isTitleScreen(), 'Title Screen'],
        [isEnding(), 'Ending and credits'],
        [isGameOver(), tag`${character} is contemplating the fleetingness of life`],
        [isRestTime(), tag`${character} is enjoying a moment of respite before returning to ${stage} • Nintendo reminds you to avoid excessive play • Take a 10 to 15 minute break every hour, even if you don't think you need it`],
        [
          andNext(isInGame(), isBossStage()),
          tag`${character} is locked in mortal struggle with ${lookup.BossName.at(addrStr(ADDR.world))} • Stage ${stage} • ${lives}`
        ],
        [
          andNext(isInGame(), isBossRush()),
          tag`${character} is locked in mortal struggle with ${lookup.BossName.at(addrStr(ADDR.stage))} • Stage ${stage} • ${lives}`
        ],
        [
          isInGame(),
          tag`${character} is adventuring in stage ${stage} • Keys remaining: ${macro.Number.at(addrStr(ADDR.keys))} of ${lookup.KeyTotal} • ${lives}`
        ],
        'Koko is adventuring'
      ];
    }
  });
}

export default makeRichPresence;
