import { AchievementSet, define, andNext, orNext, once, resetIf } from '@cruncheevos/core';

import { cond, prev, eq, neq, gte, lte } from '../../common/comparison.js';
import { range } from '../../common/util.js';
import { constant } from '../../common/value.js';

import { ADDR, MusicID, stageNames } from './data.js';

// ---------------------------------------------------------------------------------------------------

function makeLeaderboards(set: AchievementSet) {
  set.addLeaderboard({
    title: `Shortest Campaign: Law Route`,
    description: `Complete the game on the law route with the fewest days elapsed on the in-game clock`,
    lowerIsBetter: true,
    type: 'VALUE',
    conditions: {
      start: define(
        eq(ADDR.stage_clear_flags(0x08), 1),
        eq(ADDR.stage_clear_flags(0x0c), 1),
        eq(ADDR.stage_id, 0x0c),
        eq(ADDR.game_clear, 0),
        neq(prev(ADDR.music_id), MusicID.neo_overture),
        eq(ADDR.music_id, MusicID.neo_overture)
      ),
      cancel: define(
        eq(0, 1)
      ),
      submit: define(
        eq(1, 1)
      ),
      value: define(
        cond('Measured', ADDR.campaign_length)
      )
    }
  });

  set.addLeaderboard({
    title: `Shortest Campaign: Chaos Route`,
    description: `Complete the game on the chaos route with the fewest days elapsed on the in-game clock`,
    lowerIsBetter: true,
    type: 'VALUE',
    conditions: {
      start: define(
        eq(ADDR.stage_clear_flags(0x07), 1),
        eq(ADDR.stage_clear_flags(0x0c), 1),
        eq(ADDR.stage_id, 0x0c),
        eq(ADDR.game_clear, 0),
        neq(prev(ADDR.music_id), MusicID.neo_overture),
        eq(ADDR.music_id, MusicID.neo_overture)
      ),
      cancel: define(
        eq(0, 1)
      ),
      submit: define(
        eq(1, 1)
      ),
      value: define(
        cond('Measured', ADDR.campaign_length)
      )
    }
  });

  range(0x00, 0x11).forEach((stageID) => {
    const datum = stageNames.find(n => n.id === stageID)!;
    const stageNameTitle = datum.name;
    const stageNameDesc  = `${datum.article}${datum.name}`;
    
    set.addLeaderboard({
      title: `Fastest Liberation: ${stageNameTitle}`,
      description: `Complete ${stageNameDesc} with as little time elapsed on the stage clock as possible`,
      lowerIsBetter: true,
      type: 'SECS',
      conditions: {
        start: define(
          neq(ADDR.music_id, MusicID.atlas),
          neq(ADDR.music_id, MusicID.coma),
          neq(ADDR.music_id, MusicID.rest_in_peace),
          eq(ADDR.stage_id, stageID),
          eq(prev(ADDR.stage_clear_flags(stageID)), 0),
          eq(ADDR.stage_clear_flags(stageID), 1),
          orNext(
            eq(ADDR.days_upper, 0x00),
            eq(ADDR.days_upper, 0xff),
          ),
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
            cond('Measured',   0xFFFFFFFF),
          ),
          alt1: define(
            cond('AndNext',    ADDR.days_upper,      '=',  0),
            cond('AndNext',    ADDR.days_lower,      '>=', 0),
            cond('MeasuredIf', ADDR.days_lower,      '<=', 3),
            cond('AddSource',  constant(4 * 24 * 60 * 60)),
            cond('SubSource',  ADDR.days_lower,      '*',  24 * 60 * 60),
            cond('SubSource',  ADDR.hours_remaining, '*',  60 * 60),
            cond('SubSource',  ADDR.ticks_remaining, '*',  20),
            cond('Measured',   0),
          ),
          alt2: define(
            cond('MeasuredIf', ADDR.days_upper,      '=',  0xff),
            cond('AddSource',  constant(260 * 24 * 60 * 60)),
            cond('SubSource',  ADDR.days_lower,      '*',  24 * 60 * 60),
            cond('SubSource',  ADDR.hours_remaining, '*',  60 * 60),
            cond('SubSource',  ADDR.ticks_remaining, '*',  20),
            cond('Measured',   0),
          )
        }
      }
    });

    if(stageID != 0x0c)
    set.addLeaderboard({
      title: `War Profiteer: ${stageNameTitle}`,
      description: `Complete ${stageNameDesc} and receive as much bonus money as possible`,
      type: 'VALUE',
      lowerIsBetter: false,
      conditions: {
        start: define(
          once(
            andNext(
              neq(ADDR.music_id, MusicID.atlas),
              neq(ADDR.music_id, MusicID.coma),
              eq(ADDR.stage_id, stageID),
              eq(prev(ADDR.stage_clear_flags(stageID)), 0),
              eq(ADDR.stage_clear_flags(stageID), 1),
            ),
          ),
          cond('SubSource', prev(ADDR.war_funds)),
          cond('',          ADDR.war_funds,     '>', 0),
          resetIf(
            eq(ADDR.music_id, MusicID.atlas),
            eq(ADDR.music_id, MusicID.begining_of_the_tale),
            eq(ADDR.music_id, MusicID.coma),
            eq(ADDR.music_id, MusicID.overture),
            eq(ADDR.music_id, MusicID.rest_in_peace),
            eq(ADDR.music_id, MusicID.snk_logo),
            neq(ADDR.save_slot, prev(ADDR.save_slot)),
            neq(ADDR.stage_id, stageID),
            eq(ADDR.stage_clear_flags(stageID), 0)
          )
        ),
        cancel: define(
          eq(0, 1)
        ),
        submit: define(
          eq(1, 1)
        ),
        value: define(
          cond('SubSource', prev(ADDR.war_funds)),
          cond('Measured',  ADDR.war_funds)
        )
      }
    });
  });
}

export default makeLeaderboards;
