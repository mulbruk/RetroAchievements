import { AchievementSet, andNext, Condition, ConditionBuilder, define, once, orNext, resetIf, trigger } from "@cruncheevos/core";

import { cond, prev, eq, neq, gt, gte, lt, lte } from "../../common/comparison.js";
import { range } from "../../common/util.js";

import { Job, SYSTEM, UNITS, PLAYER_UNITS, EVENT_FLAGS, SOUND_NOVELS, ENEMY } from "./data.js";

// ---------------------------------------------------------------------------------------------------

function eventTrigger(opts: { prev: number, next: number, progression?: number, location?: number }) {
  return define(
    neq(SYSTEM.world_map_overlay, 0x70735f73),
    eq(SYSTEM.event_replay, 0),
    ( 
      opts.location ? 
      eq(SYSTEM.location_id, opts.location) :
      eq(prev(SYSTEM.location_id), SYSTEM.location_id)
    ),
    (
      opts.progression ?
      eq(SYSTEM.progression, opts.progression) :
      eq(prev(SYSTEM.progression), SYSTEM.progression)
    ),
    eq(prev(SYSTEM.event_id), opts.prev),
    eq(SYSTEM.event_id, opts.next),
  )
}

function progressionTrigger(opts: { prev: number, next: number, event?: number, location?: number }) {
  return define(
    neq(SYSTEM.world_map_overlay, 0x70735f73),
    eq(SYSTEM.event_replay, 0),
    ( 
      opts.location ? 
      eq(SYSTEM.location_id, opts.location) :
      eq(prev(SYSTEM.location_id), SYSTEM.location_id)
    ),
    (
      opts.event ?
      eq(SYSTEM.event_id, opts.event) :
      eq(prev(SYSTEM.event_id), SYSTEM.event_id)
    ),
    eq(prev(SYSTEM.progression), opts.prev),
    eq(SYSTEM.progression, opts.next),
  )
}

function eventFlagTrigger(opts: { flag: Condition.Value, event?: number, location?: number, mixin?: ConditionBuilder }) {
  return define(
    neq(SYSTEM.world_map_overlay, 0x70735f73),
    eq(SYSTEM.event_replay, 0),
    eq(prev(SYSTEM.progression), SYSTEM.progression),
    ( 
      opts.location ? 
      eq(SYSTEM.location_id, opts.location) :
      eq(prev(SYSTEM.location_id), SYSTEM.location_id)
    ),
    (
      opts.event ?
      eq(SYSTEM.event_id, opts.event) :
      eq(prev(SYSTEM.event_id), SYSTEM.event_id)
    ),
    opts.mixin ?? define(),
    eq(prev(opts.flag), 0),
    eq(opts.flag, 1),
 );
}

function noFuture() {
  return define(
    cond('AddSource', SYSTEM.difficulty, '&', 0b00000110),
    cond('',          0,                 '=', 0x06)
  );
}

function makeAchievements(set: AchievementSet) {
  // Progression -----------------------------------------------
  const progressionAchievements: { title: string, description: string, hardTitle: string, hardDescription: string, hardPoints?: number, conditions: ConditionBuilder }[] = [
    {
      title: `It's a Hard Life`,
      description: `Defeat Milleuda at Brigand's Den`,
      hardTitle: `No Future: Brigand's Den`,
      hardDescription: `Complete events at Brigand's Den in Chapter 1 on No Future difficulty`,
      conditions: eventTrigger({ prev: 0x111, next: 0x112, location: 0x11, progression: 0x08 })
    },
    {
      title: `Leaving Home Ain't Easy`,
      description: `Defeat Argath at Ziekden Fortress`,
      hardTitle: `No Future: Ziekden Fortress`,
      hardDescription: `Complete events at Ziekden Fortress in Chapter 1 on No Future difficulty`,
      conditions: progressionTrigger({ prev: 0x0d, next: 0x0e, location: 0x0f, event: 0x11a })
    },
    {
      title: `Under Pressure`,
      description: `Rescue Besrodio from the Baert Company`,
      hardTitle: `No Future: The Clockwork City of Goug`,
      hardDescription: `Complete events at The Clockwork City of Goug in Chapter 2 on No Future difficulty`,
      conditions: progressionTrigger({ prev: 0x18, next: 0x19, location: 0x0b, event: 0x12b})
    },
    {
      title: `Fat Bottomed Ghouls`,
      description: `Defeat Cúchulainn, the Impure`,
      hardTitle: `No Future: Lionel Castle`,
      hardDescription: `Complete events at Lionel Castle in Chapter 2 on No Future difficulty`,
      conditions: eventTrigger({ prev: 0x135, next: 0x136, location: 0x03, progression: 0x1d })
    },
    {
      title: `In the Lap of the Gods`,
      description: `Defeat the Knights Templar at Orbonne Monastery and receive the Scriptures of Germonique`,
      hardTitle: `No Future: Orbonne Monastery`,
      hardDescription: `Complete events at Orbonne Monastery in Chapter 3 on No Future difficulty`,
      conditions: progressionTrigger({ prev: 0x22, next: 0x23, location: 0x12, event: 0x143 })
    },
    {
      title: `The Miracle`,
      description: `Defeat Marquis Elmdorre on the rooftop of Riovanes Castle and bear witness to the aftermath`,
      hardTitle: `No Future: Riovanes Castle`,
      hardDescription: `Complete events at Riovanes Castle in Chapter 3 on No Future difficulty`,
      hardPoints: 25,
      conditions: eventTrigger({ prev: 0x152, next: 0x154, location: 0x01, progression: 0x28 })
    },
    {
      title: `I Want to Break Free`,
      description: `Rescue Cidolfus Orlandeau from Fort Bessalat`,
      hardTitle: `No Future: Fort Bessalat`,
      hardDescription: `Complete events at Fort Bessalat in Chapter 4 on No Future difficulty`,
      conditions: eventTrigger({ prev: 0x164, next: 0x165, location: 0x15, progression: 0x2e })
    },
    {
      title: `Calling All Ghouls`,
      description: `Defeat Zalera, the Death Seraph`,
      hardTitle: `No Future: Limberry Castle`,
      hardDescription: `Complete events at Limberry Castle in Chapter 4 on No Future difficulty`,
      conditions: eventTrigger({ prev: 0x16d, next: 0x16e, location: 0x04, progression: 0x31 })
    },
    {
      title: `Another One Bites the Dust`,
      description: `Bear witness the death of High Confessor Funebris`,
      hardTitle: `No Future: Mullonde Cathedral`,
      hardDescription: `Complete events at Mullonde Cathedral in Chapter 4 on No Future difficulty`,
      conditions: progressionTrigger({ prev: 0x34, next: 0x35, location: 0x10, event: 0x178 })
    },
    {
      title: `Somebody to Love`,
      description: `Defeat Ultima, the High Seraph`,
      hardTitle: `No Future: The Necrohol of Mullonde`,
      hardDescription: `Complete events at the Necrohol of Mullonde in Chapter 4 on No Future difficulty`,
      hardPoints: 25,
      conditions: eventTrigger({ prev: 0x17f, next: 0x180, location: 0x14, progression: 0x35 })
    },
  ];

  progressionAchievements.forEach(({title, description, conditions}) =>
    set.addAchievement({
      title, description,
      type: 'progression', points: 10,
      conditions: {
        core: conditions
      }
    })
  );

  const additionalNoFuture: { title: string, description: string, points?: number, conditions: ConditionBuilder }[] = [
    {
      title: `No Future: Eagrose Castle`,
      description: `Complete events at Eagrose Castle in Chapter 4 on No Future difficulty`,
      conditions: progressionTrigger({ prev: 0x33, next: 0x34, location: 0x12, event: 0x173 })
    },
    {
      title: `No Future: Monastery Vaults`,
      description: `Complete events at the Orbonne Monastery Vaults in Chapter 4 on No Future difficulty`,
      conditions: eventTrigger({ prev: 0x17a, next: 0x17b, location: 0x14, progression: 0x35 })
    },  
  ];

  progressionAchievements.forEach(({hardTitle, hardDescription, hardPoints, conditions}) =>
    set.addAchievement({
      title: hardTitle, description: hardDescription,
      points: hardPoints ?? 10,
      conditions: {
        core: define(
          noFuture(),
          conditions,
        )
      }
    })
  );

  additionalNoFuture.forEach(({title, description, points, conditions}) =>
    set.addAchievement({
      title: title, description: description,
      points: points ?? 10,
      conditions: {
        core: define(
          noFuture(),
          conditions,
        )
      }
    })
  );

  set.addAchievement({
    title: `The Lion War of the Lions`,
    description: `Complete the game`,
    type: 'win_condition',
    points: 25,
    conditions: {
      core: define(
        eq(SYSTEM.event_replay, 0),
        eq(SYSTEM.location_id, 0x02),
        eq(SYSTEM.event_id, 0x180),
        eq(prev(SYSTEM.progression), 0x35),
        eq(SYSTEM.progression, 0x63),
        eq(prev(EVENT_FLAGS.ending_funeral), 0),
        eq(EVENT_FLAGS.ending_funeral, 1),
      )
    }
  });

  // Sidequests ------------------------------------------------
  const sidequests: { title: string, description: string, id?: number, points: number, conditions: ConditionBuilder }[] = [
    {
      title: `Reinforcements? I Am the Reinforcements`,
      description: `Come to the aid of Ashley Riot at Zeklaus Desert`,
      points: 5,
      conditions: eventTrigger({ prev: 0x141, next: 0x142, location: 0x1c })
    },
    {
      title: `[Needs title] Balthier battle`,
      description: `Assist Balthier in defeating the bandits in the Slums of Dorter`,
      points: 5,
      conditions: eventFlagTrigger({ flag: EVENT_FLAGS.balthier_battle, location: 0x09, event: 0x191 })
    },
    {
      title: `[Needs title] Agrias's Birthday`,
      description: `[Needs description] Complete Agrias' birthday event`,
      points: 1,
      conditions: eventFlagTrigger({ flag: EVENT_FLAGS.agrias_birthday, event: 0x197, mixin: define(eq(SYSTEM.month, 0x06), eq(SYSTEM.day, 0x16)) })
    },
    {
      title: `[Needs title] Gollund Colliery sidequest`,
      description: `[Needs description] Complete events at Gollund Colliery`,
      points: 10,
      conditions: eventFlagTrigger({ flag: EVENT_FLAGS.gollund_colliery, location: 0x08, event: 0x18e })
    },
    {
      title: `Machines`,
      description: `Activate Construct 8`,
      points: 1,
      conditions: eventFlagTrigger({ flag: EVENT_FLAGS.activate_construct_8, location: 0x0b, event: 0x184 })
    },
    {
      title: `[Needs title] Nelveska Temple sidequest`,
      description: `[Needs description] Complete events at Nelveska Temple`,
      points: 5,
      conditions: eventFlagTrigger({ flag: EVENT_FLAGS.nelveska_temple, location: 0x17, event: 0x18f })
    },
    {
      title: `[Needs title] Nelveska Temple - Reis is restored`,
      description: `[Needs description] Restore Reis to human form`,
      points: 1,
      conditions: eventFlagTrigger({ flag: EVENT_FLAGS.restored_reis_to_human, location: 0x17, event: 0x190 })
    },
    {
      title: `[Needs title] Sal Ghidos - Cloud battle`,
      description: `Assist Cloud in defeating the thieves at Sal Ghidos`,
      points: 5,
      conditions: eventFlagTrigger({ flag: EVENT_FLAGS.cloud_battle, location: 0x0e, event: 0x187, mixin: define(eq(EVENT_FLAGS.purchased_flower, 1)) })
    },
    {
      title: `[Needs title] Lionel's Liege Lord sidequest`,
      description: `[Needs description] Complete the Lionel's Liege Lord sidequest`,
      points: 10,
      conditions: eventFlagTrigger({ flag: EVENT_FLAGS.lionel_liege_lord, location: 0x03, event: 0x199 })
    },
    {
      title: `[Needs title] Disorder in the Order sidequest`,
      description: `[Needs description] Complete the Disorder in the Order sidequest`,
      points: 5,
      conditions: eventFlagTrigger({ flag: EVENT_FLAGS.disorder_in_the_order, location: 0x11, event: 0x19a })
    },
    {
      title: `[Needs title] Cletienne battle`,
      description: `[Needs description] Defeat Cletienne at Dorter`,
      points: 5,
      conditions: eventFlagTrigger({ flag: EVENT_FLAGS.cletienne_dorter_battle, location: 0x09, event: 0x193 })
    },
  ];

  sidequests.forEach(({title, description, id, points, conditions}) =>
    set.addAchievement({
      title, description, id, points,
      conditions: {
        core: conditions
      }
    })
  );

  // Midlight's Deep -------------------------------------------
  set.addAchievement({
    title: `Zodiarkaeologist`,
    points: 25,
    description: `Excavate all buried treasures in Midlight's Deep`,
    conditions: {
      core: define(
        neq(SYSTEM.world_map_overlay, 0x70735f73),
        eq(prev(SYSTEM.progression), SYSTEM.progression),
        eq(prev(SYSTEM.event_id), SYSTEM.event_id),
        eq(SYSTEM.location_id, 0x16),
        orNext(
          ...range(0x69, 0x69 + 10).map((mapID) => define(
            eq(SYSTEM.map_id, mapID)
          ))
        ),
        ...range(0x69, 0x69 + 10).map((mapID) => define(
          cond('AddSource', prev(SYSTEM.buried_treasure(mapID, 0))),
          cond('AddSource', prev(SYSTEM.buried_treasure(mapID, 1))),
          cond('AddSource', prev(SYSTEM.buried_treasure(mapID, 2))),
          cond('AddSource', prev(SYSTEM.buried_treasure(mapID, 3))),
        )),
        cond('', 0, '=', 39),
        ...range(0x69, 0x69 + 10).map((mapID) => define(
          cond('AddSource', SYSTEM.buried_treasure(mapID, 0)),
          cond('AddSource', SYSTEM.buried_treasure(mapID, 1)),
          cond('AddSource', SYSTEM.buried_treasure(mapID, 2)),
          cond('AddSource', SYSTEM.buried_treasure(mapID, 3)),
        )),
        cond('Measured', 0, '=', 40),
      )
    }
  });

  set.addAchievement({
    title: `The Night Comes Down`,
    points: 25,
    description: `Complete all floors of Midlight's Deep and defeat Elidibus`,
    conditions: {
      core: define(
        neq(SYSTEM.world_map_overlay, 0x70735f73),
        eq(prev(SYSTEM.progression), SYSTEM.progression),
        eq(SYSTEM.event_id, 0x182),
        eq(SYSTEM.location_id, 0x16),
        cond('AddSource', prev(EVENT_FLAGS.midlights_deep_floors)),
        cond('AddSource', prev(EVENT_FLAGS.midlights_deep_exit)),
        cond('', 0, '=', 9),
        cond('AddSource', EVENT_FLAGS.midlights_deep_floors),
        cond('AddSource', EVENT_FLAGS.midlights_deep_exit),
        cond('Measured', 0, '=', 10),
      )
    }
  });

  set.addAchievement({
    title: `No Future: Midlight's Deep`,
    points: 10,
    description: `Defeat Elidibus in Midlight's Deep on No Future difficulty`,
    conditions: {
      core: define(
        noFuture(),
        neq(SYSTEM.world_map_overlay, 0x70735f73),
        eq(prev(SYSTEM.progression), SYSTEM.progression),
        eq(SYSTEM.event_id, 0x182),
        eq(SYSTEM.location_id, 0x16),
        eq(prev(EVENT_FLAGS.midlights_deep_exit), 0),
        eq(EVENT_FLAGS.midlights_deep_exit, 1),
      )
    }
  });

  // Level restriction challenges ------------------------------
  // Chapter 1: Level 10
  // Chapter 2: Level 20
  // Chapter 3: Level 30
  // Chapter 5: Level 50?

  // Challenges ------------------------------------------------
  // Chapter 1 -----------------
  // ! Elect to save Argath and complete battle at Mandalia Plain
  
  // Dorter: I Guess We Must Fight. Eaaagggghh!! (Complete without Delita or Argath falling in battle?)
  // Zeklaus Desert: Sand Ra-a-a-ats?
  // Lenalian Plateau or Windmill Flats: ???

  set.addAchievement({
    title: `At the Hands of Milksop Rabble-Rousers`,
    points: 10,
    type: 'missable',
    description: `Defeat Argath at Ziekden Fortress after enticing all of his forces to turn traitor against him`,
    conditions: {
      core: define(
        andNext(
          neq(SYSTEM.world_map_overlay, 0x70735f73),
          eq(SYSTEM.event_replay, 0),
          eq(SYSTEM.progression, 0x0d),
          eq(SYSTEM.location_id, 0x0f),
          neq(prev(SYSTEM.event_id), 0x119),
          eq(SYSTEM.event_id, 0x119),
        ).withLast({ hits: 1}),

        trigger(
          eq(ENEMY.enticed(4), 1),
          eq(ENEMY.enticed(5), 1),
          eq(ENEMY.enticed(7), 1),
          eq(ENEMY.enticed(9), 1),
          eq(ENEMY.enticed(10), 1),
        ),
        trigger(
          andNext(
            eq(prev(SYSTEM.event_id), 0x119),
            eq(SYSTEM.event_id, 0x11a),
          )
        ),

        // TODO change from HP check to crystalized/treasure box flags
        resetIf(
          andNext(
            eq(SYSTEM.battle_active, 0x01),
            neq(ENEMY.enticed(4), 1),
            gt(prev(ENEMY.hp(0)), 0),
            eq(ENEMY.hp(0), 0),
          )
        ),
        resetIf(
          andNext(
            eq(SYSTEM.battle_active, 0x01),
            neq(ENEMY.enticed(5), 1),
            gt(prev(ENEMY.hp(0)), 0),
            eq(ENEMY.hp(0), 0),
          )
        ),
        resetIf(
          andNext(
            eq(SYSTEM.battle_active, 0x01),
            neq(ENEMY.enticed(7), 1),
            gt(prev(ENEMY.hp(0)), 0),
            eq(ENEMY.hp(0), 0),
          )
        ),
        resetIf(
          andNext(
            eq(SYSTEM.battle_active, 0x01),
            neq(ENEMY.enticed(9), 1),
            gt(prev(ENEMY.hp(0)), 0),
            eq(ENEMY.hp(0), 0),
          )
        ),
        resetIf(
          andNext(
            eq(SYSTEM.battle_active, 0x01),
            neq(ENEMY.enticed(10), 1),
            gt(prev(ENEMY.hp(0)), 0),
            eq(ENEMY.hp(0), 0),
          )
        ),
        
        resetIf(
          eq(SYSTEM.world_map_overlay, 0x70735f73),
          neq(SYSTEM.progression, 0x0d),
          neq(SYSTEM.location_id, 0x0f),
          andNext(
            neq(SYSTEM.event_id, 0x119),
            neq(SYSTEM.event_id, 0x11a),
          ),
          eq(prev(SYSTEM.event_id), 0x11a),
          eq(SYSTEM.current_event, 0x190),
        ),
      )
    }
  });

  // Chapter 2 -----------------
  // ! Collect all buried treasures and complete battle at Dorter
    // Map ID: 0x1f
  
  // ! Elect to save Boco and complete battle at Araguay Woods
  
  // set.addAchievement({
  //   title: `Animals Have No God!`,
  //   points: 1,
  //   description: `Poach Boco`,
  //   conditions: {
  //     core: define(
  //       // Priming
  //       andNext(
  //         neq(SYSTEM.world_map_overlay, 0x70735f73),
  //         eq(SYSTEM.event_replay, 0),
  //         eq(SYSTEM.progression, 0x10),
  //         eq(SYSTEM.location_id, 0x20),
  //         neq(prev(SYSTEM.event_id), 0x11e),
  //         eq(SYSTEM.event_id, 0x11e),
  //       ).withLast({ hits: 1}),

  //       // Trigger
  //       trigger(
  //         andNext(
  //           neq(prev(SYSTEM.world_map_overlay), 0x70735f73),
  //           eq(SYSTEM.world_map_overlay, 0x70735f73),
  //         )
  //       ),
        
  //       // Challenge-specific logic
  //       trigger(
  //         andNext(
  //           eq(prev(ENEMY.poached(0)), 0),
  //           eq(ENEMY.poached(0), 1)
  //         ).withLast({ hits: 1}),
  //       ),

  //       // Reset
  //       resetIf(
  //         eq(prev(SYSTEM.world_map_overlay), 0x70735f73),
  //         neq(SYSTEM.progression, 0x10),
  //         neq(SYSTEM.location_id, 0x20),
  //         neq(SYSTEM.event_id, 0x11e),
  //         eq(SYSTEM.current_event, 0x190),
  //       ),
  //     )
  //   }
  // });

  // ! Zeirchele Falls: Don't know what's going on, but it's in the contract! (Defeat all other enemies before Gaffgarion)
    // Gaffgarion: Slot 10, Generics: Slots 5-9
  
    // ! Elect to save Mustadio and complete battle at Zaland
  
  // Belias Swale: I'm Protecting Agrias! Geronimo!
  
  // ! Golgollada Gallows: Hang On in There (Defeat all other enemies before Gaffgarion)
    // Gaffgaion: Slot 1, Generics: Slots 2-8
  
    // ! Lionel Castle: I find dead men rout more easily (Don't open gate, defeat all other enemies before Gaffgarion)
    // Gaffgarion: Slot 1, Generics: Slots 2-7

  // Chapter 3 -----------------
  // Lesalia: ??? (Defeat Zalmour while he's under effect of Atheist?)
  //  Slot 2: Zalmour

  // Monastery Vaults: ???
  // Yardrow: ???
  
  // ! Riovanes: Wiegraf with restrictions
  
  // ! Riovanes: Wiegraf with restrictions (No Future mode)

  // ! Collect all buried treasures and complete battle at Riovanes Rooftop
    // Map ID: 0x05
  
  // Chapter 4 -----------------
  // ! Zeltennia: Tough. Don't Blame Us. Blame Yourself or God.
  //   Slot 1: Delita, Slot 2: Zalmour
  // Delita index = 5?
  set.addAchievement({
    title: `Tough. Don't Blame Us. Blame Yourself or God`,
    points: 10,
    type: 'missable',
    description: `During the battle at Zeltennia Cathedral, allow Delita to land the killing blow on Confessor Zalmour`,
    conditions: {
      core: define(
        andNext(
          neq(SYSTEM.world_map_overlay, 0x70735f73),
          eq(SYSTEM.event_replay, 0),
          eq(SYSTEM.progression, 0x2c),
          eq(SYSTEM.location_id, 0x05),
          neq(prev(SYSTEM.event_id), 0x15c),
          eq(SYSTEM.event_id, 0x15c),
        ).withLast({ hits: 1}),

        trigger(
          andNext(
            eq(prev(SYSTEM.event_id), 0x15c),
            eq(SYSTEM.event_id, 0x15d),
          )
        ),

        // TODO Delita has counterattack, need to account for that
        resetIf(
          andNext(
            eq(SYSTEM.battle_active, 0x01),
            neq(SYSTEM.active_unit_index, 0x05),
            gt(prev(ENEMY.hp(1)), 0),
            eq(ENEMY.hp(1), 0),
          )
        ),
        
        resetIf(
          eq(SYSTEM.world_map_overlay, 0x70735f73),
          neq(SYSTEM.progression, 0x2c),
          neq(SYSTEM.location_id, 0x05),
          andNext(
            neq(SYSTEM.event_id, 0x15c),
            neq(SYSTEM.event_id, 0x15d),
          ),
          eq(prev(SYSTEM.event_id), 0x15d),
          eq(SYSTEM.current_event, 0x190),
        ),
      )
    }
  });

  
  // Beddha Sandwaste: ???
  
  set.addAchievement({
    title: `[Needs title] Fort Bessalat pacifist challenge`,
    points: 10,
    type: 'missable',
    description: `Open the sluice gates at Fort Bessalat without defeating any enemies`,
    conditions: {
      core: define(
        andNext(
          neq(SYSTEM.world_map_overlay, 0x70735f73),
          eq(SYSTEM.event_replay, 0),
          eq(SYSTEM.progression, 0x2e),
          eq(SYSTEM.location_id, 0x15),
          neq(prev(SYSTEM.event_id), 0x163),
          eq(SYSTEM.event_id, 0x163),
        ).withLast({ hits: 1}),

        trigger(
          andNext(
            eq(prev(SYSTEM.event_id), 0x163),
            eq(SYSTEM.event_id, 0x164),
          )
        ),

        ...range(0, 8).map(n => 
          resetIf(
            andNext(
              eq(SYSTEM.battle_active, 0x01),
              gt(prev(ENEMY.hp(n)), 0),
              eq(ENEMY.hp(n), 0),
            )
          )
        ),
        
        resetIf(
          eq(SYSTEM.world_map_overlay, 0x70735f73),
          neq(SYSTEM.progression, 0x2e),
          neq(SYSTEM.location_id, 0x15),
          andNext(
            neq(SYSTEM.event_id, 0x163),
            neq(SYSTEM.event_id, 0x164),
          ),
          eq(prev(SYSTEM.event_id), 0x164),
          eq(SYSTEM.current_event, 0x190),
        ),
      )
    }
  });

  
  // ! Limberry: Learn Ultima on Ramza
  
  // Limberry vs Argath: ???
  // Eagrose: Defeat Dycedarg's Elder Brother!
  // Mullonde Cathedral: ???
  // Monastery Vaults / Necohol of Mullonde: ???
  // Monastery Vaults / Necohol of Mullonde: ???

  // Chapter 4 Sidequests ------
  // Gollund Colliery: ???
 
  // ! Lionel's Liege Lord: Steal item from each of Bremondt's sugar babies

  // ! Disorder in the Order: Ensure every enemy unit is silenced when they are killed
  
  // ! Nelveska Temple: Collect all buried treasures and complete the battle
    // Map ID: 0x46
  // ! Nelveska Temple: Collect all rare buried treasures and complete the battle

  // Minor Challenges ----------
  // Collect the Invisibility Cloak
  // Collect the Materia Blade
  // Learn a -ja spell by being hit by it
  
  // Obtain a Septiéme through poaching
  // Obtain a Stoneshooter through poaching
  // Obtain a Ribbon through poaching

  // Poach Boco

  // Special Random Encounters ---------------------------------
  const specialEncounters: { locationID: number, mapID: number, eventID: number, title?: string, location: string, descriptor: string }[] = [
    { 
      locationID: 0x20, mapID: 0x50, eventID: 0x6b,
      // TODO needs title
      location: `Araguay Woods`,
      descriptor: `a group of ninjas`
    },
    { 
      locationID: 0x25, mapID: 0x54, eventID: 0x33,
      title: `Poacher's Paradise`,
      location: `Balias Tor`,
      descriptor: `eight or nine behemoths, dragons, and hydras`
    },
    { 
      locationID: 0x21, mapID: 0x51, eventID: 0x5e,
      // TODO needs title
      location: `Grogh Heights`,
      descriptor: `eleven monks`
    },
    { 
      locationID: 0x1d, mapID: 0x4d, eventID: 0x34,
      title: `A Calculated Manoeuvre`,
      location: `Lenalian Plateau`,
      descriptor: `five arithmeticians`
    },
    { 
      locationID: 0x2a, mapID: 0x5a, eventID: 0x6a,
      title: `Any More Harsh Words May Mean Your Life!`,
      location: `Mount Germinas`,
      descriptor: `a group of chemists and orators`
    },
    { 
      locationID: 0x1f, mapID: 0x4f, eventID: 0x6c,
      title: `Seven Samurai`,
      location: `The Yuguewood`,
      descriptor: `seven samurai`
    },
    { 
      locationID: 0x23, mapID: 0x53, eventID: 0x32,
      // TODO needs title
      location: `Zeirchele Falls`,
      descriptor: `three high level spellcasters`
    },
    { 
      locationID: 0x1c, mapID: 0x4c, eventID: 0x9c,
      title: `The House of Asterion`,
      location: `Zeklaus Desert`,
      descriptor: `a knight and a minotaur`
    },
  ];
  
  specialEncounters.forEach(({ locationID, mapID, eventID, title, location, descriptor}) =>
    set.addAchievement({
      title: title ?? `[Needs title] ${location} Special Encounter`,
      points: 5,
      description: `[Needs description] Complete a special encounter with ${descriptor} at ${location}`,
      conditions: {
        core: define(
          once(
            andNext(
              eq(SYSTEM.location_id, locationID),
              eq(SYSTEM.map_id, mapID),
              neq(SYSTEM.world_map_overlay, 0x70735f73),
              neq(prev(SYSTEM.event_id), eventID),
              eq(SYSTEM.event_id, eventID),
            )
          ),
          andNext(
            neq(prev(SYSTEM.world_map_overlay), 0x70735f73),
            eq(SYSTEM.world_map_overlay, 0x70735f73),
          ).withLast({flag: 'Trigger'}),
          resetIf(
            neq(SYSTEM.location_id, locationID),
            neq(SYSTEM.map_id, mapID),
            neq(SYSTEM.event_id, eventID),
            eq(SYSTEM.current_event, 0x190),
          )

        )
      }
    })
  );

  // Errands ---------------------------------------------------
  set.addAchievement({
    title: `I Got a Good Feeling`,
    points: 1,
    description: `Complete an errand`,
    conditions: {
      core: define(
        eq(SYSTEM.world_map_overlay, 0x70735f73),
        gte(SYSTEM.progression, 0x10),
        eq(SYSTEM.errands_enabled, 1),
        ...range(0, 96).map((n) => cond('AddSource', prev(SYSTEM.errands_undertaken(n)))),
        ...range(0, 96).map((n) => cond('SubSource', SYSTEM.errands_undertaken(n))),
        eq(0, 1),
        ...range(0, 96).map((n) => cond('AddSource', prev(SYSTEM.errands_completed(n)))),
        eq(0, 0),
        ...range(0, 96).map((n) => cond('AddSource', SYSTEM.errands_completed(n))),
        eq(0, 1),
      )
    }
  });

  set.addAchievement({
    title: `The Stars Were with Us from the Outset`,
    points: 25,
    description: `Complete all errands`,
    conditions: {
      core: define(
        eq(SYSTEM.world_map_overlay, 0x70735f73),
        gte(SYSTEM.progression, 0x10),
        eq(SYSTEM.errands_enabled, 1),
        ...range(0, 96).map((n) => cond('AddSource', prev(SYSTEM.errands_undertaken(n)))),
        ...range(0, 96).map((n) => cond('SubSource', SYSTEM.errands_undertaken(n))),
        eq(0, 1),
        ...range(0, 96).map((n) => cond('AddSource', prev(SYSTEM.errands_completed(n)))),
        eq(0, 96),
        ...range(0, 96).map((n) => cond('AddSource', SYSTEM.errands_completed(n))),
        cond('Measured', 0, '=', 96),
      )
    }
  });

  set.addAchievement({
    title: `This Is the Way!`,
    points: 1,
    description: `Collect an artefact while running an errand`,
    conditions: {
      core: define(
        eq(SYSTEM.world_map_overlay, 0x70735f73),
        gte(SYSTEM.progression, 0x10),
        eq(SYSTEM.errands_enabled, 1),
        ...range(0, 96).map((n) => cond('AddSource', prev(SYSTEM.errands_undertaken(n)))),
        ...range(0, 96).map((n) => cond('SubSource', SYSTEM.errands_undertaken(n))),
        eq(0, 1),
        ...range(1, 32).map((n) => cond('AddSource', prev(SYSTEM.artefact(n)))),
        eq(0, 0),
        ...range(1, 32).map((n) => cond('AddSource', SYSTEM.artefact(n))),
        eq(0, 1),
      )
    }
  });

  set.addAchievement({
    title: `Master Treasure Hunter`,
    points: 10,
    description: `Collect all artefacts received from running errands`,
    conditions: {
      core: define(
        eq(SYSTEM.world_map_overlay, 0x70735f73),
        gte(SYSTEM.progression, 0x10),
        eq(SYSTEM.errands_enabled, 1),
        ...range(0, 96).map((n) => cond('AddSource', prev(SYSTEM.errands_undertaken(n)))),
        ...range(0, 96).map((n) => cond('SubSource', SYSTEM.errands_undertaken(n))),
        eq(0, 1),
        ...range(1, 32).map((n) => cond('AddSource', prev(SYSTEM.artefact(n)))),
        eq(0, 30),
        ...range(1, 32).map((n) => cond('AddSource', SYSTEM.artefact(n))),
        cond('Measured', 0, '=', 31),
      )
    }
  });

  set.addAchievement({
    title: `At Last, Our Eyes Fell Upon a Wonder of the Ancient World!`,
    points: 1,
    description: `Discover a wonder while running an errand`,
    conditions: {
      core: define(
        eq(SYSTEM.world_map_overlay, 0x70735f73),
        gte(SYSTEM.progression, 0x10),
        eq(SYSTEM.errands_enabled, 1),
        ...range(0, 96).map((n) => cond('AddSource', prev(SYSTEM.errands_undertaken(n)))),
        ...range(0, 96).map((n) => cond('SubSource', SYSTEM.errands_undertaken(n))),
        eq(0, 1),
        ...range(1, 16).map((n) => cond('AddSource', prev(SYSTEM.wonder(n)))),
        eq(0, 0),
        ...range(1, 16).map((n) => cond('AddSource', SYSTEM.wonder(n))),
        eq(0, 1),
      )
    }
  });

  set.addAchievement({
    title: `Master Adventurer`,
    points: 10,
    description: `Discover all wonders found while running errands`,
    conditions: {
      core: define(
        eq(SYSTEM.world_map_overlay, 0x70735f73),
        gte(SYSTEM.progression, 0x10),
        eq(SYSTEM.errands_enabled, 1),
        ...range(0, 96).map((n) => cond('AddSource', prev(SYSTEM.errands_undertaken(n)))),
        ...range(0, 96).map((n) => cond('SubSource', SYSTEM.errands_undertaken(n))),
        eq(0, 1),
        ...range(0, 16).map((n) => cond('AddSource', prev(SYSTEM.wonder(n)))),
        eq(0, 15),
        ...range(0, 16).map((n) => cond('AddSource', SYSTEM.wonder(n))),
        cond('Measured', 0, '=', 16),
      )
    }
  });

  // Sound Novels ----------------------------------------------
  set.addAchievement({
    title: `[Needs title] Scriptures of Germonique`,
    points: 1,
    description: `Read the Scriptures of Germonique`,
    conditions: {
      core: define(
        eq(SYSTEM.world_map_overlay, 0x70735f73),
        gte(SYSTEM.progression, 0x23),
        eq(SYSTEM.scriptures, 1),
        eq(prev(SOUND_NOVELS.germonique_page), 0x24),
        eq(SOUND_NOVELS.germonique_page, 0x25),
      )
    }
  });

  set.addAchievement({
    title: `And the Legend Lives On!`,
    points: 5,
    description: `Read Mesa's Musings and find the treasure of Caimsunhama`,
    conditions: {
      core: define(
        eq(SYSTEM.world_map_overlay, 0x70735f73),
        eq(prev(SYSTEM.progression), SYSTEM.progression),
        eq(SYSTEM.artefact(18), 1),
        eq(prev(SOUND_NOVELS.mesas_musings_page), 0xb1),
        eq(SOUND_NOVELS.mesas_musings_page, 0xef), 
      )
    }
  });

  set.addAchievement({
    title: `A Certain Man's Gambling`,
    points: 5,
    description: `Read Nanai's Histories and bring Tango and Lucilda's story to a happy conclusion`,
    conditions: {
      core: define(
        eq(SYSTEM.world_map_overlay, 0x70735f73),
        eq(prev(SYSTEM.progression), SYSTEM.progression),
        eq(SYSTEM.artefact(19), 1),
        eq(prev(SOUND_NOVELS.nanais_histories_page), 0xf6),
        eq(SOUND_NOVELS.nanais_histories_page, 0x100),
      )
    }
  });

  // Veil of Wiyu
  // Veil of Wiyu challenge

  // Rendevous -------------------------------------------------
  const rendevousData: { eventID: number, title: string }[] = [
    { eventID: 0x19b, title: `Chocobo Defense`     },
    { eventID: 0x19c, title: `Chicken Race`        },
    { eventID: 0x19d, title: `Treasure Hunt`       },
    { eventID: 0x19e, title: `Teioh`               },
    { eventID: 0x19f, title: `Lost Heirloom`       },
    { eventID: 0x1a0, title: `The Fete`            },
    { eventID: 0x1a1, title: `Desert Minefield`    },
    { eventID: 0x1a2, title: `Littering`           },
    { eventID: 0x1a3, title: `Shades of the Past`  },
    { eventID: 0x1a4, title: `The Knights Templar` },
    { eventID: 0x1a8, title: `All-Star Melee`      },
    { eventID: 0x1a9, title: `The Guarded Temple`  },
    { eventID: 0x1aa, title: `Nightmares`          },
    { eventID: 0x1ab, title: `Brave Story`         },
    { eventID: 0x1b4, title: `An Ill Wind`         },
    // { eventID: 0x1b7, title: `Mirror Match`        },
    { eventID: 0x1b8, title: `Of Vagrants`         },
    { eventID: 0x1b9, title: `Be a Beta`           },
  ];

  const treasureWheelID = 0x1b6;

  rendevousData.forEach(({eventID, title}) => 
    set.addAchievement({
      title: `Rendevous: ${title}`,
      points: 5,
      description: `Complete the rendevous mission "${title}"`,
      conditions: {
        core: eventTrigger({ prev: eventID, next: treasureWheelID })
      }
    })
  );

  const mirrorMatchData: { rankArabic: number, rankRoman: string, points: number, flag: Condition.Value, }[] = [
    { rankArabic: 1, rankRoman:   `I`, points: 1, flag: EVENT_FLAGS.mirror_match_rank_1 },
    { rankArabic: 2, rankRoman:  `II`, points: 3, flag: EVENT_FLAGS.mirror_match_rank_2 },
    { rankArabic: 3, rankRoman: `III`, points: 5, flag: EVENT_FLAGS.mirror_match_rank_3 },
    { rankArabic: 4, rankRoman:  `IV`, points: 10, flag: EVENT_FLAGS.mirror_match_rank_4 },
  ];

  mirrorMatchData.forEach(({rankArabic, rankRoman, points, flag}) =>
    set.addAchievement({
      title: `Rendevous: Mirror Match ${rankRoman}`,
      description: `Complete a rank ${rankArabic} Mirror Match battle for the first time`,
      points: points,
      conditions: {
        core: define(
          neq(SYSTEM.world_map_overlay, 0x70735f73),
          eq(prev(SYSTEM.progression), SYSTEM.progression),
          eq(prev(SYSTEM.event_id), SYSTEM.event_id),
          eq(SYSTEM.event_id, 0x1b7),
          eq(prev(flag), 0),
          eq(flag, 1),
        )
      }
    })
  );

  set.addAchievement({
    title: `Gimme the Prize`,
    description: `Complete a treasure wheel event for the first time`,
    points: 1,
    conditions: {
      core: define(
        eq(prev(SYSTEM.location_id), SYSTEM.location_id),
        eq(prev(SYSTEM.progression), SYSTEM.progression),
        eq(prev(SYSTEM.event_id), SYSTEM.event_id),
        eq(SYSTEM.event_id, 0x1b6),
        neq(prev(SYSTEM.world_map_overlay), 0x70735f73),
        eq(SYSTEM.world_map_overlay, 0x70735f73),
      )
    }
  });

  // Job Mastery -----------------------------------------------
  set.addAchievement({
    title: `Fundaments-alist`,
    points: 5,
    description: `Master the Squire job on any generic character`,
    conditions: {
      core: define(
        neq(SYSTEM.progression, 0x00),
        neq(SYSTEM.map_id, 0x00),
      ),
      ...range(0, 20).reduce((acc, n) => ({
        ...acc,
        [`alt${n + 1}`]: define(
          eq(SYSTEM.world_map_overlay, 0x70735f73),
          eq(UNITS.identity(n), prev(UNITS.identity(n))),
          eq(UNITS.name_id(n),  prev(UNITS.name_id(n))),
          gte(UNITS.name_id(n), 0x078),
          lte(UNITS.name_id(n), 0x2ff),
          lt(prev(UNITS.unlocked_skills(n, Job.Squire)), 0xf000fc),
          eq(UNITS.unlocked_skills(n, Job.Squire), 0xf000fc)
        )
      }), {}),
      ...range(0, 5).reduce((acc, n) => ({
        ...acc,
        [`alt${n + 21}`]: define(
          neq(SYSTEM.world_map_overlay, 0x70735f73),
          eq(SYSTEM.battle_active, 1),
          eq(PLAYER_UNITS.identity(n), prev(PLAYER_UNITS.identity(n))),
          eq(PLAYER_UNITS.name_id(n),  prev(PLAYER_UNITS.name_id(n))),
          gte(PLAYER_UNITS.name_id(n), 0x078),
          lte(PLAYER_UNITS.name_id(n), 0x2ff),
          lt(prev(PLAYER_UNITS.unlocked_skills(n, Job.Squire)), 0xf000fc),
          eq(PLAYER_UNITS.unlocked_skills(n, Job.Squire), 0xf000fc)
        )
      }), {}),
    }
  });

  const basicJobs: { jobName: string, jobID: Job, bonusSkills: boolean, flags: number, title?: string }[] = [
    { jobName: `Chemist`,       jobID: Job.Chemist,       bonusSkills: false, flags: 0xfffcf8, title: `Balming Mission` },
    { jobName: `Knight`,        jobID: Job.Knight,        bonusSkills: false, flags: 0xff00f0 },
    { jobName: `Archer`,        jobID: Job.Archer,        bonusSkills: false, flags: 0xff00f8 },
    { jobName: `Monk`,          jobID: Job.Monk,          bonusSkills: true,  flags: 0xff80f8 },
    { jobName: `White Mage`,    jobID: Job.WhiteMage,     bonusSkills: false, flags: 0xfffec0 },
    { jobName: `Black Mage`,    jobID: Job.BlackMage,     bonusSkills: false, flags: 0xffffc0 },
    { jobName: `Time Mage`,     jobID: Job.TimeMage,      bonusSkills: true,  flags: 0xfff0fc },
    { jobName: `Summoner`,      jobID: Job.Summoner,      bonusSkills: true,  flags: 0xffffe0 },
    { jobName: `Thief`,         jobID: Job.Thief,         bonusSkills: true,  flags: 0xff80fc, title: `Stealin'` },
    { jobName: `Orator`,        jobID: Job.Orator,        bonusSkills: false, flags: 0xffc0f0, title: `Your Words Are Harsh!` },
    { jobName: `Mystic`,        jobID: Job.Mystic,        bonusSkills: false, flags: 0xfffcf0 },
    { jobName: `Geomancer`,     jobID: Job.Geomancer,     bonusSkills: false, flags: 0xfff0f0 },
    { jobName: `Dragoon`,       jobID: Job.Dragoon,       bonusSkills: false, flags: 0xfff0e0 },
    { jobName: `Samurai`,       jobID: Job.Samurai,       bonusSkills: false, flags: 0xffc0f8 },
    { jobName: `Ninja`,         jobID: Job.Ninja,         bonusSkills: false, flags: 0xfff0f0 },
    { jobName: `Arithmetician`, jobID: Job.Arithmetician, bonusSkills: false, flags: 0xff00f8, title: `Mathemagician` },
  ];

  basicJobs.forEach(({jobName, jobID, flags, bonusSkills, title}) => {
    set.addAchievement({
      title: title ?? `[Needs title] ${jobName} Mastery`,
      points: 5,
      description: `Master the ${jobName} job on any character`,
      conditions: {
        core: define(
          neq(SYSTEM.progression, 0x00),
          neq(SYSTEM.map_id, 0x00),
        ),
        ...range(0, 20).reduce((acc, n) => ({
          ...acc,
          [`alt${n + 1}`]: define(
            (
              bonusSkills ?
              define(
                cond('AndNext', SYSTEM.world_map_overlay, '!=', 0x70735f73),
                cond('OrNext',  SYSTEM.event_id,          '=',  0x1c3), // Depths of Murond
                cond('',        SYSTEM.world_map_overlay, '=',  0x70735f73),
              ) :
              eq(SYSTEM.world_map_overlay, 0x70735f73)
            ),
            eq(UNITS.identity(n), prev(UNITS.identity(n))),
            eq(UNITS.name_id(n),  prev(UNITS.name_id(n))),
            gte(UNITS.name_id(n), 0x000),
            lte(UNITS.name_id(n), 0x2ff),
            lt(prev(UNITS.unlocked_skills(n, jobID)), flags),
            eq(UNITS.unlocked_skills(n, jobID), flags)
          )
        }), {}),
        ...range(0, 5).reduce((acc, n) => ({
          ...acc,
          [`alt${n + 21}`]: define(
            neq(SYSTEM.world_map_overlay, 0x70735f73),
            eq(SYSTEM.battle_active, 1),
            eq(PLAYER_UNITS.identity(n), prev(PLAYER_UNITS.identity(n))),
            eq(PLAYER_UNITS.name_id(n),  prev(PLAYER_UNITS.name_id(n))),
            gte(PLAYER_UNITS.name_id(n), 0x000),
            lte(PLAYER_UNITS.name_id(n), 0x2ff),
            lt(prev(PLAYER_UNITS.unlocked_skills(n, jobID)), flags),
            eq(PLAYER_UNITS.unlocked_skills(n, jobID), flags)
          )
        }), {}),
      }
    });
  });

  // Need special handling: Bard, Dancer, Dark Knight, Mime
  set.addAchievement({
    title: `Sheer Harp Attack`,
    points: 5,
    description: `Master the Bard job on any character`,
    conditions: {
      core: define(
        neq(SYSTEM.progression, 0x00),
        neq(SYSTEM.map_id, 0x00),
      ),
      ...range(0, 20).reduce((acc, n) => ({
        ...acc,
        [`alt${n + 1}`]: define(
          eq(SYSTEM.world_map_overlay, 0x70735f73),
          eq(UNITS.identity(n), prev(UNITS.identity(n))),
          eq(UNITS.name_id(n),  prev(UNITS.name_id(n))),
          gte(UNITS.name_id(n), 0x000),
          lte(UNITS.name_id(n), 0x1ff),
          eq(UNITS.is_male(n), 1),
          lt(prev(UNITS.unlocked_skills(n, Job.Bard)), 0xfe00f0),
          eq(UNITS.unlocked_skills(n, Job.Bard), 0xfe00f0)
        )
      }), {}),
      ...range(0, 5).reduce((acc, n) => ({
        ...acc,
        [`alt${n + 21}`]: define(
          neq(SYSTEM.world_map_overlay, 0x70735f73),
          eq(SYSTEM.battle_active, 1),
          eq(PLAYER_UNITS.identity(n), prev(PLAYER_UNITS.identity(n))),
          eq(PLAYER_UNITS.name_id(n),  prev(PLAYER_UNITS.name_id(n))),
          gte(PLAYER_UNITS.name_id(n), 0x000),
          lte(PLAYER_UNITS.name_id(n), 0x1ff),
          eq(PLAYER_UNITS.is_male(n), 1),
          lt(prev(PLAYER_UNITS.unlocked_skills(n, Job.Bard)), 0xfe00f0),
          eq(PLAYER_UNITS.unlocked_skills(n, Job.Bard), 0xfe00f0)
        )
      }), {}),
    }
  });

  set.addAchievement({
    title: `The Gillionaire Waltz`,
    points: 5,
    description: `Master the Dancer job on any character`,
    conditions: {
      core: define(
        neq(SYSTEM.progression, 0x00),
        neq(SYSTEM.map_id, 0x00),
      ),
      ...range(0, 20).reduce((acc, n) => ({
        ...acc,
        [`alt${n + 1}`]: define(
          eq(SYSTEM.world_map_overlay, 0x70735f73),
          eq(UNITS.identity(n), prev(UNITS.identity(n))),
          eq(UNITS.name_id(n),  prev(UNITS.name_id(n))),
          gte(UNITS.name_id(n), 0x000),
          orNext(
            lte(UNITS.name_id(n), 0x0ff),
            gte(UNITS.name_id(n), 0x200)
          ),
          lte(UNITS.name_id(n), 0x2ff),
          eq(UNITS.is_female(n), 1),
          lt(prev(UNITS.unlocked_skills(n, Job.Dancer)), 0xfe00f0),
          eq(UNITS.unlocked_skills(n, Job.Dancer), 0xfe00f0)
        )
      }), {}),
      ...range(0, 5).reduce((acc, n) => ({
        ...acc,
        [`alt${n + 21}`]: define(
          neq(SYSTEM.world_map_overlay, 0x70735f73),
          eq(SYSTEM.battle_active, 1),
          eq(PLAYER_UNITS.identity(n), prev(PLAYER_UNITS.identity(n))),
          eq(PLAYER_UNITS.name_id(n),  prev(PLAYER_UNITS.name_id(n))),
          gte(PLAYER_UNITS.name_id(n), 0x000),
          orNext(
            lte(PLAYER_UNITS.name_id(n), 0x0ff),
            gte(PLAYER_UNITS.name_id(n), 0x200)
          ),
          lte(PLAYER_UNITS.name_id(n), 0x1ff),
          eq(PLAYER_UNITS.is_female(n), 1),
          lt(prev(PLAYER_UNITS.unlocked_skills(n, Job.Dancer)), 0xfe00f0),
          eq(PLAYER_UNITS.unlocked_skills(n, Job.Dancer), 0xfe00f0)
        )
      }), {}),
    }
  });

  set.addAchievement({
    title: `[Needs title] Dark Knight Mastery`,
    points: 5,
    description: `Master the Dark Knight job on any character`,
    conditions: {
      core: define(
        neq(SYSTEM.progression, 0x00),
        neq(SYSTEM.map_id, 0x00),
      ),
      ...range(0, 20).reduce((acc, n) => ({
        ...acc,
        [`alt${n + 1}`]: define(
          eq(SYSTEM.world_map_overlay, 0x70735f73),
          eq(UNITS.identity(n), prev(UNITS.identity(n))),
          eq(UNITS.name_id(n),  prev(UNITS.name_id(n))),
          gte(UNITS.name_id(n), 0x000),
          orNext(
            lte(UNITS.name_id(n), 0x0ff),
            gte(UNITS.name_id(n), 0x200)
          ),
          lte(UNITS.name_id(n), 0x2ff),
          eq(UNITS.is_female(n), 1),
          lt(prev(UNITS.unlocked_skills(n, Job.DarkKnightF)), 0xf800e0),
          eq(UNITS.unlocked_skills(n, Job.DarkKnightF), 0xf800e0)
        )
      }), {}),
      ...range(0, 20).reduce((acc, n) => ({
        ...acc,
        [`alt${n + 21}`]: define(
          eq(SYSTEM.world_map_overlay, 0x70735f73),
          eq(UNITS.identity(n), prev(UNITS.identity(n))),
          eq(UNITS.name_id(n),  prev(UNITS.name_id(n))),
          gte(UNITS.name_id(n), 0x000),
          gte(UNITS.name_id(n), 0x000),
          lte(UNITS.name_id(n), 0x1ff),
          eq(UNITS.is_male(n), 1),
          lt(prev(UNITS.unlocked_skills(n, Job.DarkKnightM)), 0xf800e0),
          eq(UNITS.unlocked_skills(n, Job.DarkKnightM), 0xf800e0)
        )
      }), {}),
      ...range(0, 5).reduce((acc, n) => ({
        ...acc,
        [`alt${n + 41}`]: define(
          neq(SYSTEM.world_map_overlay, 0x70735f73),
          eq(SYSTEM.battle_active, 1),
          eq(PLAYER_UNITS.identity(n), prev(PLAYER_UNITS.identity(n))),
          eq(PLAYER_UNITS.name_id(n),  prev(PLAYER_UNITS.name_id(n))),
          gte(PLAYER_UNITS.name_id(n), 0x000),
          orNext(
            lte(PLAYER_UNITS.name_id(n), 0x0ff),
            gte(PLAYER_UNITS.name_id(n), 0x200)
          ),
          lte(PLAYER_UNITS.name_id(n), 0x1ff),
          eq(PLAYER_UNITS.is_female(n), 1),
          lt(prev(PLAYER_UNITS.unlocked_skills(n, Job.DarkKnightF)), 0xf800e0),
          eq(PLAYER_UNITS.unlocked_skills(n, Job.DarkKnightF), 0xf800e0)
        )
      }), {}),
      ...range(0, 5).reduce((acc, n) => ({
        ...acc,
        [`alt${n + 46}`]: define(
          neq(SYSTEM.world_map_overlay, 0x70735f73),
          eq(SYSTEM.battle_active, 1),
          eq(PLAYER_UNITS.identity(n), prev(PLAYER_UNITS.identity(n))),
          eq(PLAYER_UNITS.name_id(n),  prev(PLAYER_UNITS.name_id(n))),
          gte(PLAYER_UNITS.name_id(n), 0x000),
          lte(PLAYER_UNITS.name_id(n), 0x1ff),
          eq(PLAYER_UNITS.is_male(n), 1),
          lt(prev(PLAYER_UNITS.unlocked_skills(n, Job.DarkKnightM)), 0xf800e0),
          eq(PLAYER_UNITS.unlocked_skills(n, Job.DarkKnightM), 0xf800e0)
        )
      }), {}),
    }
  });

  set.addAchievement({
    title: `Master of Mimicry`,
    points: 5,
    description: `Master the Mime job on any character`,
    conditions: {
      core: define(
        neq(SYSTEM.progression, 0x00),
        neq(SYSTEM.map_id, 0x00),
      ),
      ...range(0, 20).reduce((acc, n) => ({
        ...acc,
        [`alt${n + 1}`]: define(
          eq(SYSTEM.world_map_overlay, 0x70735f73),
          eq(UNITS.identity(n), prev(UNITS.identity(n))),
          eq(UNITS.name_id(n),  prev(UNITS.name_id(n))),
          gte(UNITS.name_id(n), 0x000),
          lte(UNITS.name_id(n), 0x2ff),
          eq(prev(UNITS.job_level(n, Job.Mime)), 7),
          eq(UNITS.job_level(n, Job.Mime), 8)
        )
      }), {}),
      ...range(0, 5).reduce((acc, n) => ({
        ...acc,
        [`alt${n + 21}`]: define(
          neq(SYSTEM.world_map_overlay, 0x70735f73),
          eq(SYSTEM.battle_active, 1),
          eq(PLAYER_UNITS.identity(n), prev(PLAYER_UNITS.identity(n))),
          eq(PLAYER_UNITS.name_id(n),  prev(PLAYER_UNITS.name_id(n))),
          gte(PLAYER_UNITS.name_id(n), 0x000),
          lte(PLAYER_UNITS.name_id(n), 0x2ff),
          eq(prev(PLAYER_UNITS.job_level(n, Job.Mime)), 7),
          eq(PLAYER_UNITS.job_level(n, Job.Mime), 8)
        )
      }), {}),
    }
  });

  // Need special handling for Ramza due to multiple character IDs
  set.addAchievement({
    title: `Ivalice's Top Heretic`,
    description: `Master the Squire job on Ramza`,
    points: 5,
    conditions: {
      core: define(
        cond('AndNext', SYSTEM.world_map_overlay, '!=', 0x70735f73),
        cond('OrNext',  SYSTEM.event_id,          '=',  0x1c3), // Depths of Murond
        cond('',        SYSTEM.world_map_overlay, '=',  0x70735f73),
        eq(UNITS.identity(0), prev(UNITS.identity(0))),
        eq(UNITS.name_id(0),  prev(UNITS.name_id(0))),
        eq(UNITS.name_id(0), 0x01),
      ),
      alt1: define(
        eq(UNITS.identity(0), 0x01), // Chapter 1 Ramza
        lt(prev(UNITS.unlocked_skills(0, Job.Base)), 0xfce0fc),
        eq(UNITS.unlocked_skills(0, Job.Base), 0xfce0fc),
      ),
      alt2: define(
        eq(UNITS.identity(0), 0x02), // Chapter 2-3 Ramza
        lt(prev(UNITS.unlocked_skills(0, Job.Base)), 0xfee0fc),
        eq(UNITS.unlocked_skills(0, Job.Base), 0xfee0fc),
      ),
      alt3: define(
        eq(UNITS.identity(0), 0x03), // Chapter 4 Ramza
        lt(prev(UNITS.unlocked_skills(0, Job.Base)), 0xffe0fc),
        eq(UNITS.unlocked_skills(0, Job.Base), 0xffe0fc),
      ),
    }
  });

  // Special characters: Mustadio, Agrias, Rapha, Marach, Orlandeau, Meliadoul, Beowulf, Reis, Cloud, Balthier, Ashley
  const specialJobs: { characterName: string, jobName: string, characterID: number, flags: number, title?: string }[] = [
    { characterName: `Mustadio`,  jobName: `Machinist`,     characterID: 0x16, flags: 0xe000fc },
    { characterName: `Agrias`,    jobName: `Holy Knight`,   characterID: 0x1e, flags: 0xf800fc },
    { characterName: `Rapha`,     jobName: `Skyseer`,       characterID: 0x29, flags: 0xfc00fc },
    { characterName: `Marach`,    jobName: `Netherseer`,    characterID: 0x1a, flags: 0xfc00fc },
    { characterName: `Beowulf`,   jobName: `Templar`,       characterID: 0x1f, flags: 0xfffefc },
    { characterName: `Reis`,      jobName: `Dragonkin`,     characterID: 0x0f, flags: 0xff00fc },
    { characterName: `Orlandeau`, jobName: `Sword Saint`,   characterID: 0x0d, flags: 0xffe0fc, title: `Lordly Person with Excalibur` },
    { characterName: `Meliadoul`, jobName: `Divine Knight`, characterID: 0x2a, flags: 0xf000fc },
    { characterName: `Ashley`,    jobName: `Riskbreaker`,   characterID: 0x34, flags: 0xffc0fc },
    { characterName: `Balthier`,  jobName: `Sky Pirate`,    characterID: 0x19, flags: 0xfff0fc, title: `The Leading Man` },
    { characterName: `Cloud`,     jobName: `Soldier`,       characterID: 0x32, flags: 0xff00fc, title: `SOLDIER First Class` },
  ];

  specialJobs.forEach(({characterName, jobName, characterID, flags, title}) => {
    set.addAchievement({
      title: title ?? `[Needs title] ${jobName} Mastery`,
      points: 5,
      description: `Master the ${jobName} job on ${characterName}`,
      conditions: {
        core: define(
          neq(SYSTEM.progression, 0x00),
          neq(SYSTEM.map_id, 0x00),
        ),
        ...range(0, 20).reduce((acc, n) => ({
          ...acc,
          [`alt${n + 1}`]: define(
            eq(SYSTEM.world_map_overlay, 0x70735f73),
            eq(UNITS.identity(n), prev(UNITS.identity(n))),
            eq(UNITS.name_id(n),  prev(UNITS.name_id(n))),
            eq(UNITS.identity(n), characterID),
            eq(UNITS.name_id(n), characterID),
            lt(prev(UNITS.unlocked_skills(n, Job.Base)), flags),
            eq(UNITS.unlocked_skills(n, Job.Base), flags)
          )
        }), {}),
        ...range(0, 5).reduce((acc, n) => ({
          ...acc,
          [`alt${n + 21}`]: define(
            neq(SYSTEM.world_map_overlay, 0x70735f73),
            eq(SYSTEM.battle_active, 1),
            eq(PLAYER_UNITS.identity(n), prev(PLAYER_UNITS.identity(n))),
            eq(PLAYER_UNITS.name_id(n),  prev(PLAYER_UNITS.name_id(n))),
            eq(PLAYER_UNITS.identity(n), characterID),
            eq(PLAYER_UNITS.name_id(n), characterID),
            lt(prev(PLAYER_UNITS.unlocked_skills(n, Job.Base)), flags),
            eq(PLAYER_UNITS.unlocked_skills(n, Job.Base), flags)
          )
        }), {}),
      }
    });
  });
}

export default makeAchievements;
