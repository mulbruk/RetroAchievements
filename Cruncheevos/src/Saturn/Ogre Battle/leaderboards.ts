import { define, AchievementSet, once, andNext, resetIf } from '@cruncheevos/core';

import { cond, prev, not, eq, gt } from '../../common/comparison.js';
import { range } from '../../common/util.js';
import { constant } from '../../common/value.js';

import {
  mainProgramLoaded, isGameState,
  isStageID, onStage, stageMapActive, stageStarted, winStage,
  endingTransition, mainEndingTransition
} from './accessors.js';
import { ADDR, stageData } from './data.js';

// ---------------------------------------------------------------------------------------------------

function makeLeaderboards(set: AchievementSet) {
  stageData.forEach(({name: stageName, article}) => {
    const stageNameTitle = (stageName === 'Permafrost') ? `The ${stageName}` : stageName;
    const stageNameDesc  = `${article}${stageName}`;
    
    set.addLeaderboard({
      title: `Fastest Liberation: ${stageNameTitle}`,
      description: `Complete ${stageNameDesc} with as little time elapsed on the stage clock as possible`,
      lowerIsBetter: true,
      type: 'MINUTES',
      conditions: {
        start: define(
          onStage(stageName),
          stageMapActive(),
          stageStarted(),
          winStage(),
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
            cond('Measured',   0xFFFFFFFF)
          ),
          alt1: define(
            cond('MeasuredIf', ADDR.stage_clock_hours, '>=', 12),
            cond('AddSource',  ADDR.stage_clock_days,  '*',  24 * 60),
            cond('SubSource',  constant(12 * 60)),
            cond('AddSource',  ADDR.stage_clock_hours, '*',  60),
            cond('Measured',   ADDR.stage_clock_minutes)
          ),
          alt2: define(
            cond('MeasuredIf', ADDR.stage_clock_hours, '<', 12),
            cond('AddSource',  ADDR.stage_clock_days,  '*', 24 * 60),
            cond('AddSource',  constant(12 * 60)),
            cond('AddSource',  ADDR.stage_clock_hours, '*', 60),
            cond('Measured',   ADDR.stage_clock_minutes)
          )
        }
      }
    });

    set.addLeaderboard({
      title: `War Profiteer: ${stageNameTitle}`,
      description: `Complete ${stageNameDesc} and receive as much bonus money as possible`,
      type: 'VALUE',
      lowerIsBetter: false,
      conditions: {
        start: define(
          stageMapActive(),
          andNext(
            once(
              stageStarted(),
              winStage()
            )
          ).also(
            cond('AddSource', ADDR.war_funds_upper,       '*', 0x10000),
            cond('AddSource', ADDR.war_funds_lower),
            cond('SubSource', prev(ADDR.war_funds_upper), '*', 0x10000),
            cond('SubSource', prev(ADDR.war_funds_lower)),
            gt(0, 0)
          ),
          resetIf(
            not( mainProgramLoaded() ),
            andNext(
              not( isGameState(0x06) ),
              not( isGameState(0x62) )
            ),
            not( isStageID(stageName) )
          )
        ),
        cancel: define(
          eq(0, 1)
        ),
        submit: define(
          eq(1, 1)
        ),
        value: define(
          cond('AddSource', ADDR.war_funds_upper,       '*', 0x10000),
          cond('AddSource', ADDR.war_funds_lower),
          cond('SubSource', prev(ADDR.war_funds_upper), '*', 0x10000),
          cond('SubSource', prev(ADDR.war_funds_lower)),
          cond('Measured',  0)
        )
      }
    });

  });

  set.addLeaderboard({
    title: `Shortest Campaign: Canon Ending`,
    description: `Finish the main campaign with the World ending and all characters recruited except Galf with the fewest days elapsed on the in-game clock`,
    lowerIsBetter: true,
    type: 'VALUE',
    conditions: {
      start: define(
        define(
          ...range(0, 99).map((n) => cond('AddSource', ADDR.roster_ids(n), '/', 0x63)),
          ...range(0, 99).map((n) => cond('SubSource', ADDR.roster_ids(n), '/', 0x7D)),
          eq(0, 17),
        ),
        endingTransition(0x00, 0x25, `Sharia Temple`)
      ),
      cancel: define(
        eq(0, 1)
      ),
      submit: define(
        eq(1, 1)
      ),
      value: define(
        cond('Measured', ADDR.campaign_length)
      ),
    }
  });

  set.addLeaderboard({
    title: `Shortest Campaign: Any Ending`,
    description: `Finish the main campaign with the fewest days elapsed on the in-game clock`,
    lowerIsBetter: true,
    type: 'VALUE',
    conditions: {
      start: mainEndingTransition(),
      cancel: define(
        eq(0, 1)
      ),
      submit: define(
        eq(1, 1)
      ),
      value: define(
        cond('Measured', ADDR.campaign_length)
      ),
    }
  });
}

export default makeLeaderboards;
