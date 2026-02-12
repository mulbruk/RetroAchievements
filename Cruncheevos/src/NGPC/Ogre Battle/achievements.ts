import { AchievementSet, define, andNext, orNext, resetIf, trigger } from '@cruncheevos/core';

import { cond, prev, eq, neq, gt, gte, lt, lte } from '../../common/comparison.js';
import { range } from '../../common/util.js';

import { ADDR, cityFlags, MusicID, stageNames, templeFlags, treasureFlags } from './data.js';

// ---------------------------------------------------------------------------------------------------

function makeAchievements(set: AchievementSet) {
  // Progression -----------------------------------------------
  set.addAchievement({
    title: `The Prince of Xenobia`,
    points: 5,
    type: 'progression',
    description: `Read Banya's letter and discover the truth of Tristan's origins`,
    conditions: define(
      eq(ADDR.stage_clear_flags(0x03), 1),
      eq(ADDR.stage_id, 0x00),
      eq(ADDR.music_id, MusicID.revolt),
      gt(ADDR.chapter, prev(ADDR.chapter)),
    )
  });

  set.addAchievement({
    title: `[Needs title] Defeat Baldur`,
    points: 25,
    type: 'progression',
    description: `Defeat Baldur at Loch Laika`,
    conditions: define(
      // Basic save protection
      eq(ADDR.save_slot, prev(ADDR.save_slot)),
      // Using music ID for game state (lol)
      neq(ADDR.music_id, MusicID.snk_logo),
      neq(ADDR.music_id, MusicID.begining_of_the_tale),
      neq(ADDR.music_id, MusicID.overture),
      neq(ADDR.music_id, MusicID.fortune_teller),
      neq(ADDR.music_id, MusicID.coma),
      neq(ADDR.music_id, MusicID.atlas),
      neq(ADDR.music_id, MusicID.rest_in_peace),
      neq(ADDR.music_id, MusicID.neo_overture),

      eq(ADDR.stage_id, 0x0c),
      gt(ADDR.stage_clear_flags(0x0c), prev(ADDR.stage_clear_flags(0x0c))),
    )
  });

  set.addAchievement({
    title: `[Needs title] Lawful Ending`,
    points: 5,
    type: 'win_condition',
    description: `Receive the Lawful ending`,
    conditions: define(
      eq(ADDR.stage_id, 0x0c),
      eq(ADDR.stage_clear_flags(0x0c), 1),
      neq(prev(ADDR.music_id), MusicID.neo_overture),
      eq(ADDR.music_id, MusicID.neo_overture),
      cond('AddSource', ADDR.endings, '&', 0b00111100),
      cond('',          0,            '=', 0b00000000),
    )
  });

  set.addAchievement({
    title: `[Needs title] Lawful Neutral Ending`,
    points: 5,
    type: 'win_condition',
    description: `Receive the Lawful Neutral ending`,
    conditions: define(
      eq(ADDR.stage_id, 0x0c),
      eq(ADDR.stage_clear_flags(0x0c), 1),
      neq(prev(ADDR.music_id), MusicID.neo_overture),
      eq(ADDR.music_id, MusicID.neo_overture),
      cond('AddSource', ADDR.endings, '&', 0b00111100),
      cond('',          0,            '=', 0b00001000),
    )
  });

  set.addAchievement({
    title: `[Needs title] Neutral Ending`,
    points: 5,
    type: 'win_condition',
    description: `Receive the Neutral ending`,
    conditions: define(
      eq(ADDR.stage_id, 0x0c),
      eq(ADDR.stage_clear_flags(0x0c), 1),
      neq(prev(ADDR.music_id), MusicID.neo_overture),
      eq(ADDR.music_id, MusicID.neo_overture),
      cond('AddSource', ADDR.endings, '&', 0b00111100),
      cond('',          0,            '=', 0b00000100),
    )
  });

  set.addAchievement({
    title: `[Needs title] Chaotic Neutral Ending`,
    points: 5,
    type: 'win_condition',
    description: `Receive the Chaotic Neutral ending`,
    conditions: define(
      eq(ADDR.stage_id, 0x0c),
      eq(ADDR.stage_clear_flags(0x0c), 1),
      neq(prev(ADDR.music_id), MusicID.neo_overture),
      eq(ADDR.music_id, MusicID.neo_overture),
      cond('AddSource', ADDR.endings, '&', 0b00111100),
      cond('',          0,            '=', 0b00100000),
    )
  });

  set.addAchievement({
    title: `[Needs title] Chaotic Ending`,
    points: 5,
    type: 'win_condition',
    description: `Receive the Chaotic ending`,
    conditions: define(
      eq(ADDR.stage_id, 0x0c),
      eq(ADDR.stage_clear_flags(0x0c), 1),
      neq(prev(ADDR.music_id), MusicID.neo_overture),
      eq(ADDR.music_id, MusicID.neo_overture),
      cond('AddSource', ADDR.endings, '&', 0b00111100),
      cond('',          0,            '=', 0b00010000),
    )
  });

  // Stages ----------------------------------------------------
  // Nordheim: Cannot enter one Roshfel temple without completing map and doing sidequest
  const timedStages = [...range(0x00, 0x0c), ...range(0x0d, 0x11)]
  timedStages.forEach((stageID) => {
    const stageRecord   = stageNames.find((n) => n.id === stageID)!;
    const citiesRecord  = cityFlags.find((n) => n.id === stageID)!;
    const templesRecord = templeFlags.find((n) => n.id === stageID)!;

    set.addAchievement({
      title: `${stageRecord.title}`,
      points: 0,
      description: `Complete ${stageRecord.article}${stageRecord.name} within two days while controlling all cities and temples on the map`,
      conditions: define(
        // Priming logic
        cond('OrNext',     prev(ADDR.music_id), '=',  MusicID.overture),
        cond('AndNext',    prev(ADDR.music_id), '=',  MusicID.atlas),
        cond('AndNext',    ADDR.stage_id,       '=',  stageID),
        cond('AndNext',    ADDR.days_remaining, '>',  1),
        cond('AndNext',    ADDR.days_remaining, '<=', 3),
        cond('MeasuredIf', ADDR.music_id,       '=',  stageRecord.music, 1),

        // Measured logic
        ...range(0, citiesRecord.flags.length - 1).map((n) =>
          cond('AddSource', citiesRecord.flags[n])
        ),
        ...range(0, templesRecord.flags.length).map((n) =>
          cond('AddSource', templesRecord.flags[n])
        ),
        cond('Measured', 0, '=', citiesRecord.flags.length - 1 + templesRecord.flags.length),

        // Trigger logic
        trigger(
          neq(prev(ADDR.music_id), MusicID.overture),
          eq(prev(ADDR.stage_clear_flags(stageID)), 0),
          eq(ADDR.stage_clear_flags(stageID), 1),
        ),

        // Reset logic
        resetIf(
          eq(ADDR.music_id, MusicID.snk_logo),
          eq(ADDR.music_id, MusicID.begining_of_the_tale),
          eq(ADDR.music_id, MusicID.overture),
          eq(ADDR.music_id, MusicID.fortune_teller),
          eq(ADDR.music_id, MusicID.coma),
          eq(ADDR.music_id, MusicID.atlas),
          eq(ADDR.music_id, MusicID.rest_in_peace),
          eq(ADDR.music_id, MusicID.neo_overture),
          neq(ADDR.stage_id, 0x00),
          lte(ADDR.days_remaining, 1),
          gt(ADDR.days_remaining, 3),
        )
      )
    });
  });

  // Sidequests ------------------------------------------------
  // Silver Doll (State 1 - Estrada's Manor AFTER completing Stage 4)
  // Thunder Stone (Stage 2 - Grossmark)
  // Recruit Bakim (Bonus Stage 1 - Chrono Massif)
  // Stage 7 (Lit Islands) - Collect Silver Rod
  // Stage 7 (Lit Islands) - Trade White Cross for Kusanagi Blade
  // Stage 7 (Lit Islands) - Upgrade Silver Rod to Holy Rod
  // Recruit Goldy (Stage 8 - Nessa District)
  // Ice Axe (Nessa District - CF >= 70)
  // White Goddess Idol (Stage 2 - Grossmark after completing Chagall Fen)
  // Rainbow Choker (Stage 3 - Satz Peninsula AFTER completing Chagall Fen)
  // Wind Dunes - Receive Dream Crown, Archangel's Feather, or Blood Spell
  // Complete Ahm Weald without losing Aquarius
  // Recruit Orozov
  // Recruit Gloth
  // Brynhildr
  // Recruit Kiros
  // Recruit Hayato
  // Freyja Archipelago - Get Shield Bow (CF >= 75)
  // Freyja Archipelago - Get White Lange (unit ALI >= 75)
  // Recruit Yorcliffe
  // Recruit Grant (Megaholten)
  // Rainbow Choker

  // Postgame --------------------------------------------------
  // Liberate all cities in Free Battle Area #1
  // Liberate all cities in Free Battle Area #2
  // Liberate all cities in Free Battle Area #3
  
  // Recruit the Lord
  // Recruit Lanselot
  // Recruit Warren
  // Recruit Gilbert
  // Recruit Canopus
  // Receive Bond for the Future

  // Recruit Deneb
  // Recruit Ashe
  // Recruit Lyon
  // Recruit Ares

  // Recruit a Gungnir
  // Recruit a Trooper
  
  // Recruit a Light Priest?
  // Recruit a Chaos Priest?
  // Recruit an Arc Samurai?

  // Treasure hunting ------------------------------------------
  range(0x00, 0x13).forEach((n) => {
    const stageRecord = stageNames.find((record) => record.id === n)!;
    const flagsRecord = treasureFlags.find((record) => record.id === n)!;
    if (flagsRecord.flags.length > 0) {
      set.addAchievement({
        title: `Treasure Hunter: ${stageRecord.name}`,
        points: 2,
        description: `Find all buried treasures in ${stageRecord.article}${stageRecord.name}`,
        conditions: define(
          // Basic save protection
          eq(ADDR.save_slot, prev(ADDR.save_slot)),
          // Using music ID for game state (lol)
          andNext(
            neq(ADDR.music_id, MusicID.snk_logo),
            neq(ADDR.music_id, MusicID.begining_of_the_tale),
            neq(ADDR.music_id, MusicID.overture),
            neq(ADDR.music_id, MusicID.fortune_teller),
            neq(ADDR.music_id, MusicID.coma),
            neq(ADDR.music_id, MusicID.atlas),
            neq(ADDR.music_id, MusicID.rest_in_peace),
            neq(ADDR.music_id, MusicID.neo_overture),
          ).withLast({flag: 'MeasuredIf'}),
          cond('MeasuredIf', ADDR.stage_id, '=', n),

          ...flagsRecord.flags.map((flag) => cond('AddSource', prev(flag))),
          cond('', 0, '=', flagsRecord.flags.length - 1),
          ...flagsRecord.flags.map((flag) => cond('AddSource', flag)),
          cond('Measured', 0, '=', flagsRecord.flags.length),
        )
      });
    }
  });
}

export default makeAchievements;
