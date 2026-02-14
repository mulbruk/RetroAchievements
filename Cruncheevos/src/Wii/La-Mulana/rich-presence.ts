import { RichPresence, define, orNext } from '@cruncheevos/core';

import { cond, eq, neq, gt, gte, lt, lte } from '../../common/comparison.js';
import { byte, tbyte_be } from '../../common/value.js';
import { richPresenceLookup } from '../../common/rich-presence.js';

import { fieldData, FLAGS_EN, GAME_STATE_EN, roomData } from './data.js';

const combinedRoomIDs = roomData.map(({field, room, screen, name}) => ({
  screenID: field * 0x10000 + room * 0x100 + screen,
  name,
}));

const ANKH = ' ☥ ';
const amphisbaena: {state: number, icon: string}[] = [
  { state: 0x03, icon: '🐍' }
];
const sakit: {state: number, icon: string}[] = [
  { state: 0x03, icon: '🗿' }
];
const ellmac: {state: number, icon: string}[] = [
  { state: 0x03, icon: '🦖' }
];
const bahamut: {state: number, icon: string}[] = [
  { state: 0x03, icon: '🦈' }
];
const viy: {state: number, icon: string}[] = [
  { state: 0x03, icon: '👁️' }
];
const palenque: {state: number, icon: string}[] = [
  { state: 0x03, icon: '🛸' }
];
const baphomet: {state: number, icon: string}[] = [
  { state: 0x03, icon: '🐐' }
];
const tiamat: {state: number, icon: string}[] = [
  { state: 0x03, icon: '🧜' }
];

const wedge: {state: number, icon: string}[] = [
  { state: 0x04, icon: '✴️' }
  // { state: 0x04, icon: '𒀭' }
];

const mulbruk: {state: number, icon: string}[] = [
  { state: 0x00, icon: '💤' },
  { state: 0x01, icon: '💤' }
];
const philosopher: {state: number, icon: string}[] = [
  { state: 0x00, icon: '🪨' }
];
const fairies: {state: number, icon: string}[] = [
  { state: 0x00, icon: '📿' },
  { state: 0x01, icon: '📿' },
  { state: 0x02, icon: '🧚' }
];

function makeRichPresence() {
  const FieldName = richPresenceLookup(
    'FieldName',
    fieldData, 'field', 'fieldName',
    { defaultAt: byte(0x363fd0) },
  );

  const ScreenName = richPresenceLookup(
    'ScreenName',
    combinedRoomIDs, 'screenID', 'name',
    {
      compressRanges: false,
      defaultAt: tbyte_be(0x363fd0),
    },
  );

  // Guardian obliteration lookups
  const Amphisbaena = richPresenceLookup(
    'Amphisbaena', amphisbaena, 'state', 'icon',
    { defaultValue: ANKH, defaultAt: FLAGS_EN.ankh_amphisbaena }
  );
  const Sakit = richPresenceLookup(
    'Sakit', sakit, 'state', 'icon',
    { defaultValue: ANKH, defaultAt: FLAGS_EN.ankh_sakit }
  );
  const Ellmac = richPresenceLookup(
    'Ellmac', ellmac, 'state', 'icon',
    { defaultValue: ANKH, defaultAt: FLAGS_EN.ankh_ellmac }
  );
  const Bahamut = richPresenceLookup(
    'Bahamut', bahamut, 'state', 'icon',
    { defaultValue: ANKH, defaultAt: FLAGS_EN.ankh_bahamut }
  );
  const Viy = richPresenceLookup(
    'Viy', viy, 'state', 'icon',
    { defaultValue: ANKH, defaultAt: FLAGS_EN.ankh_viy }
  );
  const Palenque = richPresenceLookup(
    'Palenque', palenque, 'state', 'icon',
    { defaultValue: ANKH, defaultAt: FLAGS_EN.ankh_palenque }
  );
  const Baphomet = richPresenceLookup(
    'Baphomet', baphomet, 'state', 'icon',
    { defaultValue: ANKH, defaultAt: FLAGS_EN.ankh_baphomet }
  );
  const Tiamat = richPresenceLookup(
    'Tiamat', tiamat, 'state', 'icon',
    { defaultValue: ANKH, defaultAt: FLAGS_EN.ankh_tiamat }
  );

  // Wedge lookups
  const LAMULANA = richPresenceLookup(
    'LAMULANA', wedge, 'state', 'icon',
    { defaultValue: amphisbaena[0].icon, defaultAt: FLAGS_EN.wedge_1 }
  );
  const ABUTO = richPresenceLookup(
    'ABUTO', wedge, 'state', 'icon',
    { defaultValue: sakit[0].icon, defaultAt: FLAGS_EN.wedge_2 }
  );
  const WEDJET = richPresenceLookup(
    'WEDJET', wedge, 'state', 'icon',
    { defaultValue: ellmac[0].icon, defaultAt: FLAGS_EN.wedge_3 }
  );
  const BAHRUN = richPresenceLookup(
    'BAHRUN', wedge, 'state', 'icon',
    { defaultValue: bahamut[0].icon, defaultAt: FLAGS_EN.wedge_4 }
  );
  const VIY = richPresenceLookup(
    'VIY', wedge, 'state', 'icon',
    { defaultValue: viy[0].icon, defaultAt: FLAGS_EN.wedge_5 }
  );
  const MU = richPresenceLookup(
    'MU', wedge, 'state', 'icon',
    { defaultValue: palenque[0].icon, defaultAt: FLAGS_EN.wedge_6 }
  );
  const SABBAT = richPresenceLookup(
    'SABBAT', wedge, 'state', 'icon',
    { defaultValue: baphomet[0].icon, defaultAt: FLAGS_EN.wedge_7 }
  );
  const MARDUK = richPresenceLookup(
    'MARDUK', wedge, 'state', 'icon',
    { defaultValue: tiamat[0].icon, defaultAt: FLAGS_EN.wedge_8 }
  );

  // Philosopher lookups
  const FAIRIES = richPresenceLookup(
    'FAIRIES', fairies, 'state', 'icon',
    { defaultValue: fairies[0].icon, defaultAt: FLAGS_EN.woke_fairies }
  );
  const MULBRUK = richPresenceLookup(
    'MULBRUK', mulbruk, 'state', 'icon',
    { defaultValue: '🥱', defaultAt: FLAGS_EN.woke_mulbruk }
  );
  const ALSEDANA = richPresenceLookup(
    'ALSEDANA', philosopher, 'state', 'icon',
    { defaultValue: ' 死', defaultAt: FLAGS_EN.woke_alsedana }
  );
  const GILTORIYO = richPresenceLookup(
    'GILTORIYO', philosopher, 'state', 'icon',
    { defaultValue: ' 生', defaultAt: FLAGS_EN.woke_giltoriyo }
  );
  const SAMARANTA = richPresenceLookup(
    'SAMARANTA', philosopher, 'state', 'icon',
    { defaultValue: ' 力', defaultAt: FLAGS_EN.woke_samaranta }
  );
  const FOBOS = richPresenceLookup(
    'FOBOS', philosopher, 'state', 'icon',
    { defaultValue: ' 智', defaultAt: FLAGS_EN.woke_fobos }
  );

  // ⛓️
  // ⚖️
  // 𓊽
  // 🥂
  // 🍷
  // 🟥
  // 🟨
  // 🟩

  return RichPresence({
    format: {
      IGT: 'SECS',
    },
    lookupDefaultParameters: { keyFormat: 'hex', compressRanges: false },
    lookup: {
      FieldName,
      ScreenName,

      Amphisbaena,
      Sakit,
      Ellmac,
      Bahamut,
      Viy,
      Palenque,
      Baphomet,
      Tiamat,

      LAMULANA,
      ABUTO,
      WEDJET,
      BAHRUN,
      VIY,
      MU,
      SABBAT,
      MARDUK,

      FAIRIES,
      MULBRUK,
      ALSEDANA,
      GILTORIYO,
      SAMARANTA,
      FOBOS,
    },
    displays: ({ lookup, format, macro, tag }) => {
      const playTime = tag`${format.IGT.at(
        define(
          cond('AddSource', GAME_STATE_EN.in_game_time, '/', 1000),
          cond('Measured', 0)
        )
      )}`;

      // const awakenings = tag`[${lookup.FAIRIES}${lookup.MULBRUK}${lookup.ALSEDANA}${lookup.GILTORIYO}${lookup.SAMARANTA}${lookup.FOBOS}]`;
      const guardians  = tag`[${lookup.Amphisbaena}${lookup.Sakit}${lookup.Ellmac}${lookup.Bahamut}${lookup.Viy}${lookup.Palenque}${lookup.Baphomet}${lookup.Tiamat}]`;
      const wedges     = tag`[${lookup.LAMULANA}${lookup.ABUTO}${lookup.WEDJET}${lookup.BAHRUN}${lookup.VIY}${lookup.MU}${lookup.SABBAT}${lookup.MARDUK}]`;

      return [
        [
          define( eq(GAME_STATE_EN.field_id, 0xff), eq(GAME_STATE_EN.music_id, 0x00) ),
          "Descending unto this place she came from the sky, one unto this world..."
        ],
        [
          define( eq(GAME_STATE_EN.field_id, 0xff), eq(GAME_STATE_EN.music_id, 0x01) ),
          "That is the day that humanity was born. And when they angered her, they were destroyed. After several ages of destruction, the story begins..."
        ],
        [
          define( eq(GAME_STATE_EN.field_id, 0xff), eq(GAME_STATE_EN.music_id, 0x02) ),
          "Finally I reached La-Mulana. The Adventure starts here!"
        ],
        [
          define( eq(GAME_STATE_EN.field_id, 0xff), eq(GAME_STATE_EN.music_id, 0x2c) ),
          "GAME OVER"
        ],
        [
          define( eq(GAME_STATE_EN.field_id, 0xff) ),
          "La-Mulana"
        ],

        [
          define( neq(GAME_STATE_EN.field_id, 0xff), lt(FLAGS_EN.guardians_defeated, 8) ),
          tag`${lookup.FieldName} - ${lookup.ScreenName} • ${guardians} • ${playTime}`
        ],
        [
          define( neq(GAME_STATE_EN.field_id, 0xff), gte(FLAGS_EN.guardians_defeated, 8) ),
          tag`${lookup.FieldName} - ${lookup.ScreenName} • ${wedges} • ${playTime}`
        ],
       
        "When a puzzle takes too long? You must whip it! Fighting a boss that seems too strong? You must whip it! A bat looked at you wrong? You must whip it! I say whip it, whip it good! I say whip it, whip it good!"
      ]
    }
  });
}

export default makeRichPresence;
