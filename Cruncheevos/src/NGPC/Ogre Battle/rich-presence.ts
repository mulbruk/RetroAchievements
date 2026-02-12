import { define, orNext,  ConditionBuilder, RichPresence } from '@cruncheevos/core';

import { cond, eq }   from '../../common/comparison.js';
import { range }      from '../../common/util.js';
import { byte, bit4 } from '../../common/value.js';
import { addrStr, richPresenceLookup, richPresencePluralize } from '../../common/rich-presence.js';

import { ADDR, stageNames, cityFlags, templeFlags, MusicID } from './data.js';

// ---------------------------------------------------------------------------------------------------
// Helper functions

function stagesCompleted() {
  return define(
    ...range(0x00, 0x11).map((n) => cond('AddSource', ADDR.stage_clear_flags(n)))
  ).withLast({flag: 'Measured'});
}

function endingID() {
  return define(
    cond('Measured', byte(0x1451), '&', 0b00111100)
  )
}

function citiesLiberatedOnMap(stageID: number) {
  if (stageID < 0x00 || stageID > 0x13) {
    throw new Error(`citiesLiberatedOnMap: Invalid stage ID: ${stageID}`);
  }

  const datum = cityFlags.find(n => n.id === stageID)!;
  return define(
    ...datum.flags.map(flag => cond('AddSource', flag))
  ).withLast({ flag: 'Measured' });

}

function citiesOnMap(stageID: number): number {
  if (stageID < 0x00 || stageID > 0x13) {
    throw new Error(`citiesOnMap: Invalid stage ID: ${stageID}`);
  }
  
  const datum = cityFlags.find(n => n.id === stageID)!;
  return datum.flags.length;
}

function templesLiberatedOnMap(stageID: number) {
  if (stageID < 0x00 || stageID > 0x13) {
    throw new Error(`templesLiberatedOnMap: Invalid stage ID: ${stageID}`);
  }

  const datum = templeFlags.find(n => n.id === stageID)!;
  return define(
    ...datum.flags.map(flag => cond('AddSource', flag))
  ).withLast({ flag: 'Measured' });

}

function templesOnMap(stageID: number): number {
  if (stageID < 0x00 || stageID > 0x13) {
    throw new Error(`templesOnMap: Invalid stage ID: ${stageID}`);
  }
  
  const datum = templeFlags.find(n => n.id === stageID)!;
  return datum.flags.length;
}

// ---------------------------------------------------------------------------------------------------
// Lookup tables

const cityCounts: { id: number, count: number }[] = range(0x00, 0x14).map(n => ({
  id: n, count: citiesOnMap(n),
}));

const templeCounts: { id: number, count: number }[] = range(0x00, 0x14).map(n => ({
  id: n, count: templesOnMap(n),
}));

const stageVerbs: { state: number, verb: string }[] = [
  { state: 0, verb: `Liberating` },
  { state: 1, verb: `Exploring`  },
];

const year: { id: number, year: string}[] = [
  { id: 0, year: `Imperial Year 15`},
  { id: 1, year: `Imperial Year 18`},
];

const gameComplete: { state: number, icon: string }[] = [
  { state: 0x00, icon: `⭐ ` },
  { state: 0xff, icon: ``    },
];

const endings: { id: number, ending: string }[] = [
  { id: 0b00000000, ending: `Lawful`          },
  { id: 0b00000100, ending: `Neutral`         },
  { id: 0b00001000, ending: `Lawful Neutral`  },
  { id: 0b00010000, ending: `Chaotic`         },
  { id: 0b00100000, ending: `Chaotic Neutral` },
];

// ---------------------------------------------------------------------------------------------------
// Rich presence

function makeRichPresence() {
  const Days = richPresencePluralize('Days', 'day', 'days', ADDR.campaign_length);
  
  const GameComplete = richPresenceLookup(
    'GameComplete',
    gameComplete, 'state', 'icon',
    { defaultAt: ADDR.game_clear },
  );

  const Year = richPresenceLookup(
    'Year',
    year, 'id', 'year',
    { defaultAt: bit4(0x1457) },
  );

  const StageArticle = richPresenceLookup(
    'StageArticle',
    stageNames, 'id', 'article',
    { defaultAt: byte(0x1472) },
  );

  const StageName = richPresenceLookup(
    'StageName',
    stageNames, 'id', 'name',
    { defaultAt: byte(0x1472), defaultValue: 'Unknown Stage' },
  );

  const StageVerb = richPresenceLookup(
    'StageVerb',
    stageVerbs, 'state', 'verb',
  );

  const CityCounts = richPresenceLookup(
    'CityCounts',
    cityCounts, 'id', 'count',
    { defaultAt: byte(0x1472) },
  );

  const TempleCounts = richPresenceLookup(
    'TempleCounts',
    templeCounts, 'id', 'count',
    { defaultAt: byte(0x1472) },
  );

  const Ending = richPresenceLookup(
    'Ending',
    endings, 'id', 'ending',
    { defaultAt: endingID() },
  );

  return RichPresence({
    lookupDefaultParameters: { keyFormat: 'hex', compressRanges: false },
    lookup: {
      Days,
      GameComplete,
      Year,
      StageArticle,
      StageName,
      StageVerb,
      CityCounts,
      TempleCounts,
      Ending,
    },
    displays: ({ lookup, format, macro, tag }) => {
      const year       = tag`${lookup.Year}`;
      const regions    = tag`Regions liberated: ${macro.Number.at(stagesCompleted())}`;
      const reputation = tag`Reputation: ${macro.Number.at(addrStr(ADDR.chaos_frame))}`;
      const campaign   = tag`Campaign length: ${macro.Number.at(addrStr(ADDR.campaign_length))} ${lookup.Days}`;

      const citiesLiberated  = (n: number) => tag`Cities: ${macro.Number.at(citiesLiberatedOnMap(n))}/${lookup.CityCounts}`;
      const templesLiberated = (n: number) => tag`Temples: ${macro.Number.at(templesLiberatedOnMap(n))}/${lookup.TempleCounts}`;

      const postGame = tag`${lookup.GameComplete}`;

      return [
        [orNext(
          eq(ADDR.music_id, MusicID.snk_logo),
          eq(ADDR.music_id, MusicID.begining_of_the_tale),
          eq(ADDR.music_id, MusicID.overture),
        ), `Title screen ~ The Age of Xytegenia ~`],

        [
          define( eq(ADDR.music_id, MusicID.fortune_teller) ),
          tag`Consulting the seer Warren on matters of destiny`
        ],

        [
          define (eq(ADDR.music_id, MusicID.coma) ),
          tag`Managing save data`
        ],

        [
          define(
            eq(ADDR.music_id, MusicID.atlas),
            orNext(eq(ADDR.stage_id, 0x07), eq(ADDR.stage_clear_flags(0x07), 1)),
          ),
          tag`${postGame}${year}: Chaos • World map • ${reputation} • ${regions} • ${campaign}`
        ],
        [
          define(
            eq(ADDR.music_id, MusicID.atlas),
            orNext(eq(ADDR.stage_id, 0x08), eq(ADDR.stage_clear_flags(0x08), 1)),
          ),
          tag`${postGame}${year}: Law • World map • ${reputation} • ${regions} • ${campaign}`
        ],
        [
          define( eq(ADDR.music_id, MusicID.atlas) ),
          tag`${postGame}${year} • World map • ${reputation} • ${regions} • ${campaign}`
        ],

        [
          define(
            eq(ADDR.stage_id, 0x0c),
            eq(ADDR.stage_clear_flags(0x0c), 1),
            eq(ADDR.game_clear, 0xff)
          ),
          tag`Ending and credits • ${lookup.Ending} • ${reputation} • ${campaign}`
        ],
        [
          define( eq(ADDR.music_id, MusicID.neo_overture) ),
          tag`Ending and credits • ${lookup.Ending} • ${reputation} • ${campaign}`
        ],
        
        ...range(0x00, 0x11).map<[ConditionBuilder, string]>(stageID => [
          define(
            eq(ADDR.stage_id, stageID),
            orNext(eq(ADDR.stage_id, 0x07), eq(ADDR.stage_clear_flags(0x07), 1)),
          ),
          tag`${postGame}${year}: Chaos • ${lookup.StageVerb.at(addrStr(ADDR.stage_clear_flags(stageID)))} ${lookup.StageArticle}${lookup.StageName} • ${citiesLiberated(stageID)} • ${templesLiberated(stageID)} • ${reputation} • ${regions} • ${campaign}`
        ]),
        ...range(0x00, 0x11).map<[ConditionBuilder, string]>(stageID => [
          define(
            eq(ADDR.stage_id, stageID),
            orNext(eq(ADDR.stage_id, 0x08), eq(ADDR.stage_clear_flags(0x08), 1)),
          ),
          tag`${postGame}${year}: Law • ${lookup.StageVerb.at(addrStr(ADDR.stage_clear_flags(stageID)))} ${lookup.StageArticle}${lookup.StageName} • ${citiesLiberated(stageID)} • ${templesLiberated(stageID)} • ${reputation} • ${regions} • ${campaign}`
        ]),
        ...range(0x00, 0x11).map<[ConditionBuilder, string]>(stageID => [
          define( eq(ADDR.stage_id, stageID) ),
          tag`${postGame}${year} • ${lookup.StageVerb.at(addrStr(ADDR.stage_clear_flags(stageID)))} ${lookup.StageArticle}${lookup.StageName} • ${citiesLiberated(stageID)} • ${templesLiberated(stageID)} • ${reputation} • ${regions} • ${campaign}`
        ]),

        ...range(0x11, 0x14).map<[ConditionBuilder, string]>(stageID => [
          define(
            eq(ADDR.stage_id, stageID),
            orNext(eq(ADDR.stage_id, 0x07), eq(ADDR.stage_clear_flags(0x07), 1)),
          ),
          tag`${postGame}${year}: Chaos • Exploring ${lookup.StageArticle}${lookup.StageName} • ${citiesLiberated(stageID)} • ${templesLiberated(stageID)} • ${reputation} • ${regions} • ${campaign}`
        ]),
        ...range(0x11, 0x14).map<[ConditionBuilder, string]>(stageID => [
          define(
            eq(ADDR.stage_id, stageID),
            orNext(eq(ADDR.stage_id, 0x08), eq(ADDR.stage_clear_flags(0x08), 1)),
          ),
          tag`${postGame}${year}: Law • Exploring ${lookup.StageArticle}${lookup.StageName} • ${citiesLiberated(stageID)} • ${templesLiberated(stageID)} • ${reputation} • ${regions} • ${campaign}`
        ]),

        'Ogre Battle Gaiden: The Prince of Xenobia'
      ]
    }
  });
}

export default makeRichPresence;
