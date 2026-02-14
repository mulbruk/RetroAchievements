import { AchievementSet, Condition, define } from '@cruncheevos/core';

import { cond, prev, eq, neq, lt, recall } from '../../common/comparison.js';
import { range } from '../../common/util.js';
import { dword_be, word_be } from '../../common/value.js';

import { FLAGS_EN, GAME_STATE_EN } from './data.js';

// ---------------------------------------------------------------------------------------------------

const bossData: { name: string, ankhFlag: Condition.Value, fieldID: number, roomID: number, screenID: number }[] = [
  { name: "Amphisbaena", ankhFlag: FLAGS_EN.ankh_amphisbaena, fieldID: 0x00, roomID: 0x08, screenID: 0x01 },
  { name: "Sakit",       ankhFlag: FLAGS_EN.ankh_sakit,       fieldID: 0x02, roomID: 0x08, screenID: 0x01 },
  { name: "Ellmac",      ankhFlag: FLAGS_EN.ankh_ellmac,      fieldID: 0x03, roomID: 0x08, screenID: 0x00 },
  { name: "Bahamut",     ankhFlag: FLAGS_EN.ankh_bahamut,     fieldID: 0x04, roomID: 0x04, screenID: 0x00 },
  { name: "Viy",         ankhFlag: FLAGS_EN.ankh_viy,         fieldID: 0x05, roomID: 0x08, screenID: 0x01 },
  { name: "Palenque",    ankhFlag: FLAGS_EN.ankh_palenque,    fieldID: 0x06, roomID: 0x09, screenID: 0x01 },
  { name: "Baphomet",    ankhFlag: FLAGS_EN.ankh_baphomet,    fieldID: 0x07, roomID: 0x04, screenID: 0x01 },
  { name: "Tiamat",      ankhFlag: FLAGS_EN.ankh_tiamat,      fieldID: 0x11, roomID: 0x09, screenID: 0x00 },
];

function makeLeaderboards(set: AchievementSet) {
  bossData.forEach(({ name, ankhFlag, fieldID, roomID, screenID }) => {
    set.addLeaderboard({
      title: `${name} Quick Kill`,
      description: `Defeat ${name} as quickly as possible`,
      lowerIsBetter: true,
      type: 'FRAMES',
      conditions: {
        start: define(
          eq(GAME_STATE_EN.field_id,  fieldID),
          eq(GAME_STATE_EN.room_id,   roomID),
          eq(GAME_STATE_EN.screen_id, screenID),
          eq(prev(ankhFlag), 1),
          eq(ankhFlag, 2)
        ),
        cancel: define(
          cond('OrNext',     GAME_STATE_EN.field_id,   '!=', fieldID),
          cond('OrNext',     GAME_STATE_EN.room_id,    '!=', roomID),
          cond('OrNext',     GAME_STATE_EN.screen_id,  '!=', screenID),
          cond('OrNext',     GAME_STATE_EN.music_id,   '=',  0x2c),
          cond('AndNext',    GAME_STATE_EN.lemeza_ptr, '!=', 0x00),
          cond('AddAddress', GAME_STATE_EN.lemeza_ptr, '&',  0x7fffffff),
          cond('',           dword_be(0x204),          '=',  0x00)
        ),
        submit: define(
          cond('AndNext',    GAME_STATE_EN.lemeza_ptr, '!=', 0x00),
          cond('AddAddress', GAME_STATE_EN.lemeza_ptr, '&',  0x7fffffff),
          cond('',           dword_be(0x204),          '>',  0x00),
          eq(prev(ankhFlag), 2),
          eq(ankhFlag, 3)
        ),
        value: define(
          cond('Measured', 0, '=', 0)
        )
      }
    })
  });

  set.addLeaderboard({
    title: `Mom Quick Kill`,
    description: `Defeat the Mother as quickly as possible`,
    lowerIsBetter: true,
    type: 'FRAMES',
    conditions: {
      start: define(
        eq(GAME_STATE_EN.field_id,  0x12),
        eq(GAME_STATE_EN.room_id,   0x03),
        eq(GAME_STATE_EN.screen_id, 0x00),
        lt(prev(FLAGS_EN.ankh_mother), 2),
        eq(FLAGS_EN.ankh_mother, 2)
      ),
      cancel: define(
        cond('OrNext',     GAME_STATE_EN.field_id,   '!=', 0x12),
        cond('OrNext',     GAME_STATE_EN.room_id,    '!=', 0x03),
        cond('OrNext',     GAME_STATE_EN.screen_id,  '!=', 0x00),
        cond('OrNext',     GAME_STATE_EN.music_id,   '=',  0x2c),
        cond('AndNext',    GAME_STATE_EN.lemeza_ptr, '!=', 0x00),
        cond('AddAddress', GAME_STATE_EN.lemeza_ptr, '&',  0x7fffffff),
        cond('',           dword_be(0x204),       '=',  0x00)
      ),
      submit: define(
        cond('AndNext',    GAME_STATE_EN.lemeza_ptr,    '!=', 0x00),
        cond('AddAddress', GAME_STATE_EN.lemeza_ptr,    '&',  0x7fffffff),
        cond('',           dword_be(0x204),             '>',  0x00),
        cond('AndNext',    GAME_STATE_EN.inventory_ptr, '!=', 0x00),
        cond('AddAddress', GAME_STATE_EN.inventory_ptr, '&',  0x7fffffff),
        cond('',           prev(word_be(0xa8)),         '=',  0x00),
        cond('AndNext',    GAME_STATE_EN.inventory_ptr, '!=', 0x00),
        cond('AddAddress', GAME_STATE_EN.inventory_ptr, '&',  0x7fffffff),
        cond('',           word_be(0xa8),               '=',  0x01),
      ),
      value: define(
        cond('Measured', 0, '=', 0)
      )
    }
  })

  set.addLeaderboard({
    title: `Fastest Archaeologist`,
    description: `Complete the game with the lowest elapsed in-game time`,
    lowerIsBetter: true,
    type: 'SECS',
    conditions: {
      start: define(
        // Thoth's Room
        eq(GAME_STATE_EN.field_id,    0x03),
        eq(GAME_STATE_EN.room_id,     0x03),
        eq(GAME_STATE_EN.screen_id,   0x00),
        // Verify all guardians defeated to block laptop glitch shenanigans
        eq(FLAGS_EN.ankh_amphisbaena, 0x03),
        eq(FLAGS_EN.ankh_sakit,       0x03),
        eq(FLAGS_EN.ankh_ellmac,      0x03),
        eq(FLAGS_EN.ankh_bahamut,     0x03),
        eq(FLAGS_EN.ankh_viy,         0x03),
        eq(FLAGS_EN.ankh_palenque,    0x03),
        eq(FLAGS_EN.ankh_baphomet,    0x03),
        eq(FLAGS_EN.ankh_tiamat,      0x03),
        eq(FLAGS_EN.mother_defeated,  0x01),
        // Since we're using a music trigger for timing, ensure laptop is closed to block the edge
        // case of using Enga Musica to play 'Run toward the sun' immediately before escaping
        eq(GAME_STATE_EN.msx_open, 0x00),
        // CONGRATULATIONS!
        neq(prev(GAME_STATE_EN.music_id), 0x2b),
        eq(GAME_STATE_EN.music_id, 0x2b)
      ),
      cancel: define(
        eq(0, 1)
      ),
      submit: define(
        eq(1, 1)
      ),
      value: define(
        cond('Measured', GAME_STATE_EN.in_game_time, '/', 1000)
      )
    }
  });

  set.addLeaderboard({
    title: `Escape Artist`,
    description: `Escape the ruins with as much time possible remaining on the timer`,
    lowerIsBetter: false,
    type: 'MILLISECS',
    conditions: {
      start: define(
        // Thoth's Room
        eq(GAME_STATE_EN.field_id,    0x03),
        eq(GAME_STATE_EN.room_id,     0x03),
        eq(GAME_STATE_EN.screen_id,   0x00),
        // Verify all guardians defeated to block laptop glitch shenanigans
        eq(FLAGS_EN.ankh_amphisbaena, 0x03),
        eq(FLAGS_EN.ankh_sakit,       0x03),
        eq(FLAGS_EN.ankh_ellmac,      0x03),
        eq(FLAGS_EN.ankh_bahamut,     0x03),
        eq(FLAGS_EN.ankh_viy,         0x03),
        eq(FLAGS_EN.ankh_palenque,    0x03),
        eq(FLAGS_EN.ankh_baphomet,    0x03),
        eq(FLAGS_EN.ankh_tiamat,      0x03),
        eq(FLAGS_EN.mother_defeated,  0x01),
        // Trigger when Mulbruk's escape sequence dialogue starts
        eq(GAME_STATE_EN.scanner_or_talking, 1),
        eq(prev(GAME_STATE_EN.script_card_id), 0x02f1),
        eq(GAME_STATE_EN.script_card_id, 0x039d),
      ),
      cancel: define(
        eq(0, 1)
      ),
      submit: define(
        eq(1, 1)
      ),
      value: {
        core: define(
          cond('MeasuredIf', 0, '=', 1),
          cond('Measured',   0x00000000),
        ),
        ...range(0, 20).reduce((acc, n) => ({
          ...acc,
          [`alt${n + 1}`]: define(
              cond('MeasuredIf', GAME_STATE_EN.global_objects, '!=', 0x00000000),
              cond('Remember',   GAME_STATE_EN.global_objects, '&',  0x7fffffff),

              ...range(0, n).map(_n => define(
                cond('AddAddress', recall()),
                cond('MeasuredIf', dword_be(0x2f4),            '!=', 0x00000000),
                cond('AddAddress', recall()),
                cond('Remember',   dword_be(0x2f4),            '&',  0x7fffffff),
              )),
              
              cond('AddAddress', recall()),
              cond('MeasuredIf', dword_be(0x00),               '=',  0x8022a350),
              cond('AddAddress', recall()),
              cond('AddSource',  dword_be(0xf0),               '*',  6000),
              cond('AddAddress', recall()),
              cond('AddSource',  dword_be(0xf4),               '*',  100),
              cond('AddAddress', recall()),
              cond('AddSource',  dword_be(0xf8)),
              cond('Measured',   0x00),
          )
        }), {}),
      }
    }
  });
}

export default makeLeaderboards;
