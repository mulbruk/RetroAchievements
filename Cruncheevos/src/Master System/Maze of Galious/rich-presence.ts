import { ConditionBuilder, RichPresence, define, orNext } from "@cruncheevos/core";
import { cond, prev, not, eq, neq, lt, gte, gt, recall, lte } from "../../common/comparison.js";
import { ADDR, GameState } from "./data.js";
import { bit4, bit5, bit6, bit7, byte } from "../../common/value.js";
import { range } from "../../common/util.js";
import { addrStr, richPresenceLookup } from "../../common/rich-presence.js";

// ---------------------------------------------------------------------------------------------------

const dungeonWater: { flag: number, symbol: string }[] = [
  { flag: 0, symbol: `·` },
  { flag: 1, symbol: `💦` },
] as const;

const dungeonCape: { flag: number, symbol: string }[] = [
  { flag: 0, symbol: `·` },
  { flag: 1, symbol: `🧣` },
] as const;

const dungeonWand: { flag: number, symbol: string }[] = [
  { flag: 0, symbol: `·` },
  { flag: 1, symbol: `🪄` },
] as const;

const dungeonMap: { flag: number, symbol: string }[] = [
  { flag: 0, symbol: `·` },
  { flag: 1, symbol: `🗺️` },
] as const;

function makeRichPresence() {
  const Water = richPresenceLookup(
    'HolyWater',
    dungeonWater, 'flag', 'symbol',
  );

  const Cape = richPresenceLookup(
    'Cape',
    dungeonCape, 'flag', 'symbol',
  );

  const Wand = richPresenceLookup(
    'Rod',
    dungeonWand, 'flag', 'symbol',
  );

  const Map = richPresenceLookup(
    'Map',
    dungeonMap, 'flag', 'symbol',
  );


  return RichPresence({
    format: {},
    lookup: {
      Water, Cape, Wand, Map,
    },
    displays: ({ lookup, format, macro, tag }) => {
      const inventoryCount = tag`${macro.Number.at(
        define(
          define(
            ...range(0, 6).map((n) =>
              cond('AddSource', byte(0x0070 + n))
            ),
          ),
          cond('AddSource', byte(0x0070 + 10)),
          define(
            ...range(12, 41).map((n) =>
              cond('AddSource', byte(0x0070 + n))
            )
          ).withLast({'flag': 'Measured'})
        )
      )}`;

      const worldsCleared = tag`${macro.Number.at(
        define(
          cond('AddSource', ADDR.world_boss_dead(1)),
          cond('AddSource', ADDR.world_boss_dead(2)),
          cond('AddSource', ADDR.world_boss_dead(3)),
          cond('AddSource', ADDR.world_boss_dead(4)),
          cond('AddSource', ADDR.world_boss_dead(5)),
          cond('AddSource', ADDR.world_boss_dead(6)),
          cond('AddSource', ADDR.world_boss_dead(7)),
          cond('AddSource', ADDR.world_boss_dead(8)),
          cond('AddSource', ADDR.world_boss_dead(9)),
          cond('AddSource', ADDR.world_boss_dead(10)),
        ).withLast({'flag': 'Measured'})
      )}`;

      const items  = tag`Items: ${inventoryCount}/38`;
      const worlds = tag`Worlds cleared: ${worldsCleared}/10`;

      const dungeonItems = (n: number) => tag`[${lookup.Water.at(addrStr(bit5(0x0063 + n)))}${lookup.Cape.at(addrStr(bit6(0x0063 + n)))}${lookup.Wand.at(addrStr(bit7(0x0063 + n)))}${lookup.Map.at(addrStr(bit4(0x0063 + n)))}]`;

      return [
        [
          orNext(
            eq(ADDR.game_state, GameState.Boot),
            eq(ADDR.game_state, GameState.TitleScreen),
            eq(ADDR.game_state, GameState.AttractMode),
          ),
          `Popolon went into Mt. Atos to rescue Aphrodite kidnapped by Hudnos. But it was a trap made by Galious!`
        ],
        [
          define(
            eq(ADDR.game_state, GameState.Ending)
          ),
          `Epilogue and credits`
        ],
        [
          define(
            eq(ADDR.map_id, 0x01),
          ),
          `Castle Greek • ${items} • ${worlds}`
        ],
        ...range(0, 10).map<[ConditionBuilder, string]>((n) => {
          return [
            define( eq(ADDR.map_id, n + 2) ),
            `World ${n + 1} ${dungeonItems(n)} • ${items} • ${worlds}`
          ]
        }),
        'Bootleg Maze of Galious!'
      ]
    },
  });
}

export default makeRichPresence;
