import { match } from 'ts-pattern';
import { Condition } from '@cruncheevos/core';

import {
  byte, word, dword,
  bit0, bit1, bit2, bit3, bit4, bit5, bit6, bit7,
} from '../../common/value.js';

// Wetlands
// - Morass
// - Mire
// - Fen
// - Bog

// Lakeshore
// - Strand

// Woodlands
// - Weald

// Mountain Range
// - Cordillera (series of ranges that are connected or part of larger mountain system)
// - Massif (compact group of connected mountains forming an independent portion of a range)
// - Highlands (mountainous region or elevated mountainous plateau)

// ---------------------------------------------------------------------------------------------------

export enum MusicID {
  snk_logo             = 0x7ac10000,
  brass_of_victory     = 0x7b970100,
  rout                 = 0x7bd90100,
  acquired_freedom     = 0x7cad0400,
  coma                 = 0x7c4e0200,
  schlieren            = 0x7c5d0300,
  rest_in_peace        = 0x7d380000,
  fortune_teller       = 0x7d6e0200,
  white_storm          = 0x7dbe0300,
  atlas                = 0x7deb0200,
  viking_spirits       = 0x7dec0300,
  dark_matter          = 0x7df10300,
  begining_of_the_tale = 0x7e2b0000,
  krypton              = 0x7e9d0300,
  neo_overture         = 0x7eb40300,
  revolt               = 0x7f0e0300,
  impregnable_defense  = 0x7f2d0300,
  billow_of_the_dark   = 0x7fc50a00,
  do_or_die            = 0x7fcf0a00,
  accretion_disk       = 0x7fe20300,
  overture             = 0x7fe30100,
  guerilla_war         = 0x7ff60a00,
}

// ---------------------------------------------------------------------------------------------------

export const stageNames: { id: number, article: string, name: string, title: string, music: MusicID }[] = [
  { id: 0x00, article:     ``, name: `Estrada's Manor`,   title: `The Quickening`,          music: MusicID.revolt              },
  { id: 0x01, article: `the `, name: `Grossmark`,         title: `Those Who Hunger`,        music: MusicID.revolt              },
  { id: 0x02, article:     ``, name: `Cape Satz`,         title: `[Cape Satz]`,             music: MusicID.revolt              },
  { id: 0x03, article: `the `, name: `Lichtfrost`,        title: `The Northern Kingdom`,    music: MusicID.white_storm         },
  { id: 0x04, article: `the `, name: `Lothen District`,   title: `The Fallen`,              music: MusicID.white_storm         },
  { id: 0x05, article: `the `, name: `Lit Isles`,         title: `The Necromancer`,         music: MusicID.white_storm         },
  { id: 0x06, article: `the `, name: `Nessa District`,    title: `[Nessa District]`,        music: MusicID.accretion_disk      },
  { id: 0x07, article: `the `, name: `Nordheim District`, title: `The Temptaion of Desire`, music: MusicID.accretion_disk      },
  { id: 0x08, article:     ``, name: `Megaholten`,        title: `Resolve`,                 music: MusicID.impregnable_defense },
  { id: 0x09, article:     ``, name: `Chagall Fen`,       title: `The Dark Knight`,         music: MusicID.accretion_disk      },
  { id: 0x0a, article: `the `, name: `Lego Archipelago`,  title: `Sorrow`,                  music: MusicID.viking_spirits      },
  { id: 0x0b, article: `the `, name: `Ahm Weald`,         title: `Gloom, Silence, and...`,  music: MusicID.impregnable_defense },
  { id: 0x0c, article:     ``, name: `Loch Laika`,        title: `White Night`,             music: MusicID.impregnable_defense },
  { id: 0x0d, article: `the `, name: `Chrono Massif`,     title: `Deep in the Mountains`,   music: MusicID.dark_matter         },
  { id: 0x0e, article: `the `, name: `Ayn Peninsula`,     title: `[Ayn Peninsula]`,         music: MusicID.revolt              },
  { id: 0x0f, article: `the `, name: `Wynd Dunes`,        title: `Of Flesh and Blood`,      music: MusicID.krypton             },
  { id: 0x10, article: `the `, name: `Freyja Isles`,      title: `The Samurai`,             music: MusicID.viking_spirits      },
  { id: 0x11, article: `the `, name: `Charlom District`,  title: `Charlom District`,        music: MusicID.revolt              },
  { id: 0x12, article:     ``, name: `Pogrom Forest`,     title: `Pogrom Forest`,           music: MusicID.white_storm         },
  { id: 0x13, article:     ``, name: `Lake Jansenia`,     title: `Lake Jansenia`,           music: MusicID.krypton             },
];

export const cityFlags: { id: number, flags: Condition.Value[] }[] = [
  // Estrada's Manor
  { id: 0x00, flags: [ bit1(0x1414), bit2(0x1414), bit3(0x1414) ] },
  // Grosse District
  {
    id: 0x01,
    flags: [
      bit5(0x1414), bit6(0x1414), bit7(0x1414),
      bit0(0x1415), bit1(0x1415), bit2(0x1415), bit3(0x1415), bit4(0x1415)
    ]
  },
  // Satz Peninsula 
  {
    id: 0x02,
    flags: [
      bit7(0x1415),
      bit0(0x1416), bit1(0x1416), bit2(0x1416), bit3(0x1416), bit4(0x1416), bit5(0x1416)
    ]
  },
  // Lichtfrost
  {
    id: 0x03,
    flags: [
      bit0(0x1417), bit1(0x1417), bit2(0x1417), bit3(0x1417), bit4(0x1417), bit5(0x1417), bit6(0x1417)
    ]
  },
  // Loden District
  {
    id: 0x04,
    flags: [
      bit0(0x1418), bit1(0x1418), bit2(0x1418), bit3(0x1418), bit4(0x1418), bit5(0x1418)
    ]
  },
  // Lit Islands
  {
    id: 0x05,
    flags: [
      bit0(0x1419), bit1(0x1419), bit2(0x1419), bit3(0x1419), bit4(0x1419)
    ]
  },
  // Nessa District
  {
    id: 0x06,
    flags: [
      bit1(0x141a), bit2(0x141a), bit3(0x141a), bit4(0x141a), bit5(0x141a), bit6(0x141a), bit7(0x141a),
      bit0(0x141b), bit1(0x141b), bit2(0x141b), bit3(0x141b), bit4(0x141b), bit5(0x141b), bit6(0x141b), bit7(0x141b),
    ]
  },
  // Norodom District
  {
    id: 0x07,
    flags: [
      bit2(0x141c), bit3(0x141c), bit4(0x141c), bit5(0x141c), bit6(0x141c), bit7(0x141c),
      bit0(0x141d), bit1(0x141d)
    ]
  },
  // Megaholten
  {
    id: 0x08,
    flags: [
      bit4(0x141d), bit5(0x141d), bit6(0x141d), bit7(0x141d),
      bit0(0x141e), bit1(0x141e), bit2(0x141e)
    ]
  },
  // Chagall Wetlands
  {
    id: 0x09,
    flags: [
      bit7(0x141e),
      bit0(0x141f), bit1(0x141f), bit2(0x141f), bit3(0x141f), bit4(0x141f), bit5(0x141f), bit6(0x141f), bit7(0x141f),
      bit0(0x1420), bit1(0x1420), bit2(0x1420), bit3(0x1420), bit4(0x1420), bit5(0x1420)
    ]
  },
  // Lego Archipelago
  {
    id: 0x0a,
    flags: [
      bit1(0x1421), bit2(0x1421), bit3(0x1421), bit4(0x1421), bit5(0x1421), bit6(0x1421), bit7(0x1421),
      bit0(0x1422), bit1(0x1422), bit2(0x1422), bit3(0x1422), bit4(0x1422), bit5(0x1422), bit6(0x1422), bit7(0x1422),
      bit0(0x1423), bit1(0x1423)
    ]
  },
  // Ahm Woodlands
  {
    id: 0x0b,
    flags: [
      bit6(0x1423), bit7(0x1423),
      bit0(0x1424), bit1(0x1424), bit2(0x1424), bit3(0x1424), bit4(0x1424), bit5(0x1424), bit6(0x1424), bit7(0x1424),
      bit0(0x1425), bit1(0x1425), bit2(0x1425), bit3(0x1425), bit4(0x1425)
    ]
  },
  // Laika Lakeshore
  {
    id: 0x0c,
    flags: [
      bit1(0x1426), bit2(0x1426), bit3(0x1426), bit4(0x1426), bit5(0x1426), bit6(0x1426), bit7(0x1426),
      bit0(0x1427), bit1(0x1427), bit2(0x1427), bit3(0x1427), bit4(0x1427), bit5(0x1427), bit6(0x1427), bit7(0x1427),
      bit0(0x1428), bit1(0x1428), bit2(0x1428)
    ]
  },
  // Chrono Range
  {
    id: 0x0d,
    flags: [
      bit4(0x1428), bit5(0x1428), bit6(0x1428), bit7(0x1428),
      bit0(0x1429), bit1(0x1429)
    ]
  },
  // Ayn Peninsula
  {
    id: 0x0e,
    flags: [
      bit3(0x1429), bit4(0x1429), bit5(0x1429), bit6(0x1429), bit7(0x1429),
      bit0(0x142a), bit1(0x142a)
    ]
  },
  // Wind Dunes
  {
    id: 0x0f,
    flags: [
      bit4(0x142a), bit5(0x142a), bit6(0x142a), bit7(0x142a),
      bit0(0x142b), bit1(0x142b), bit2(0x142b), bit3(0x142b), bit4(0x142b), bit5(0x142b), bit6(0x142b)
    ]
  },
  // Freyja Archipelago
  {
    id: 0x10,
    flags: [
      bit2(0x142c), bit3(0x142c), bit4(0x142c), bit5(0x142c), bit6(0x142c), bit7(0x142c),
      bit0(0x142d), bit1(0x142d), bit2(0x142d), bit3(0x142d), bit4(0x142d)
    ]
  },
  // Charlom District
  {
    id: 0x11,
    flags: [
      bit0(0x142e), bit1(0x142e), bit2(0x142e), bit3(0x142e), bit4(0x142e), bit5(0x142e), bit6(0x142e)
    ]
  },
  // Pogrom Forest
  {
    id: 0x12,
    flags: [
      bit2(0x142f), bit3(0x142f), bit4(0x142f), bit5(0x142f), bit6(0x142f), bit7(0x142f),
      bit0(0x1430), bit1(0x1430)
    ]
  },
  // Lake Jansenia
  {
    id: 0x13,
    flags: [
      bit5(0x1430), bit6(0x1430), bit7(0x1430),
      bit0(0x1431), bit1(0x1431), bit2(0x1431)
    ]
  },
];

export const templeFlags: { id: number, flags: Condition.Value[] }[] = [
  // Estrada's Manor
  { id: 0x00, flags: [ bit0(0x1414) ] },
  // Grosse District
  { id: 0x01, flags: [ bit4(0x1414) ] },
  // Satz Peninsula 
  { id: 0x02, flags: [ bit5(0x1415), bit6(0x1415) ] },
  // Lichtfrost
  { id: 0x03, flags: [ bit6(0x1416), bit7(0x1416) ] },
  // Loden District
  { id: 0x04, flags: [ bit7(0x1417) ] },
  // Lit Islands
  { id: 0x05, flags: [ bit6(0x1418), bit7(0x1418) ] },
  // Nessa District
  { id: 0x06, flags: [ bit5(0x1419), bit6(0x1419), bit7(0x1419), bit0(0x141a) ] },
  // Norodom District
  { id: 0x07, flags: [ bit0(0x141c), bit1(0x141c) ] },
  // Megaholten
  { id: 0x08, flags: [ bit2(0x141d), bit3(0x141d) ] },
  // Chagall Wetlands
  { id: 0x09, flags: [ bit3(0x141e), bit4(0x141e), bit5(0x141e), bit6(0x141e) ] },
  // Lego Archipelago
  { id: 0x0a, flags: [ bit6(0x1420), bit7(0x1420), bit0(0x1421) ] },
  // Ahm Woodlands
  { id: 0x0b, flags: [ bit2(0x1423), bit3(0x1423), bit4(0x1423), bit5(0x1423) ] },
  // Laika Lakeshore
  { id: 0x0c, flags: [ bit5(0x1425), bit6(0x1425), bit7(0x1425), bit0(0x1426) ] },
  // Chrono Range
  { id: 0x0d, flags: [ bit3(0x1428) ] },
  // Ayn Peninsula
  { id: 0x0e, flags: [ bit2(0x1429) ] },
  // Wind Dunes
  { id: 0x0f, flags: [ bit2(0x142a), bit3(0x142a) ] },
  // Freyja Archipelago
  { id: 0x10, flags: [ bit7(0x142b), bit0(0x142c), bit1(0x142c) ] },
  // Charlom District
  { id: 0x11, flags: [ bit5(0x142d), bit6(0x142d), bit7(0x142d) ] },
  // Pogrom Forest
  { id: 0x12, flags: [ bit7(0x142e), bit0(0x142e), bit1(0x142e) ] },
  // Lake Jansenia
  { id: 0x13, flags: [ bit2(0x1430), bit3(0x1430), bit4(0x1430) ] },
];

export const treasureFlags: { id: number, flags: Condition.Value[] }[] = [
  // Estrada's Manor
  { id: 0x00, flags: [ bit1(0x143a), bit1(0x143c) ] },
  // Grosse District
  { id: 0x01, flags: [ bit2(0x143a), bit3(0x143a) ] },
  // Satz Peninsula 
  { id: 0x02, flags: [ bit4(0x143a) ] },
  // Lichtfrost
  { id: 0x03, flags: [ bit5(0x143a), bit6(0x143a) ] },
  // Loden District
  { id: 0x04, flags: [ bit0(0x143b), bit1(0x143b), bit2(0x143b) ] },
  // Lit Islands
  { id: 0x05, flags: [ bit3(0x143b), bit4(0x143b), bit5(0x143b) ] },
  // Nessa District
  { id: 0x06, flags: [ bit6(0x143b), bit7(0x143b) ] },
  // Norodom District
  { id: 0x07, flags: [ ] },
  // Megaholten
  { id: 0x08, flags: [ bit0(0x143c) ] },
  // Chagall Wetlands
  { id: 0x09, flags: [ bit2(0x143c), bit3(0x143c) ] },
  // Lego Archipelago
  { id: 0x0a, flags: [ bit4(0x143c), bit5(0x143c) ] },
  // Ahm Woodlands
  { id: 0x0b, flags: [ bit6(0x143c), bit7(0x143c) ] },
  // Laika Lakeshore
  { id: 0x0c, flags: [ bit0(0x143d), bit1(0x143d), bit2(0x143d) ] },
  // Chrono Range
  { id: 0x0d, flags: [ bit3(0x143d), bit7(0x143d) ] },
  // Ayn Peninsula
  { id: 0x0e, flags: [ bit4(0x143d) ] },
  // Wind Dunes
  { id: 0x0f, flags: [ bit5(0x143d) ] },
  // Freyja Archipelago
  { id: 0x10, flags: [ bit6(0x143d) ] },
  // Charlom District
  { id: 0x11, flags: [ ] },
  // Pogrom Forest
  { id: 0x12, flags: [ ] },
  // Lake Jansenia
  { id: 0x13, flags: [ ] },
];



export const ADDR = {
  save_slot: byte(0x5af),

  war_funds: dword(0x068e),

  chaos_frame:     byte(0x0694),
  campaign_length: byte(0x0696),
  game_clear:      byte(0x0699),

  endings: byte(0x1451),
  chapter: bit4(0x1457),

  stage_clear_flags: (n: number) => match(n)
    .with(0x00, () => bit0(0x146e))
    .with(0x01, () => bit1(0x146e))
    .with(0x02, () => bit2(0x146e))
    .with(0x03, () => bit3(0x146e))
    .with(0x04, () => bit4(0x146e))
    .with(0x05, () => bit5(0x146e))
    .with(0x06, () => bit6(0x146e))
    .with(0x07, () => bit7(0x146e))
    .with(0x08, () => bit0(0x146f))
    .with(0x09, () => bit1(0x146f))
    .with(0x0a, () => bit2(0x146f))
    .with(0x0b, () => bit3(0x146f))
    .with(0x0c, () => bit4(0x146f))
    .with(0x0d, () => bit5(0x146f))
    .with(0x0e, () => bit6(0x146f))
    .with(0x0f, () => bit7(0x146f))
    .with(0x10, () => bit0(0x1470))
    .otherwise(() => { throw new Error(`Invalid stage id: ${n}`); }),

  stage_id: byte(0x1472),

  music_id: dword(0x1b2c),

  ticks_remaining: byte(0x2080),
  hours_remaining: byte(0x2081),
  days_remaining:  word(0x2082),
  days_lower:      byte(0x2082),
  days_upper:      byte(0x2083),
};
