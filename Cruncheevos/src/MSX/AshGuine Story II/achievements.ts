import {
  Achievement, AchievementSet,
  define, andNext, once, resetIf, trigger,
  orNext
} from "@cruncheevos/core";

import { cond, prev, eq, neq, lt, gte, gt } from "../../common/comparison.js";
import { ADDR } from "./data.js";
import { isGameplay } from "./functions.js";

// ---------------------------------------------------------------------------------------------------

// https://www.nicovideo.jp/watch/sm37785390

function makeAchievements(set: AchievementSet) {
  const progression: { 
    id?: number, points: number, type: Achievement.Type,
    stageID: number, collisionID: number, exitsID: number, 
    title: string
  }[] = [
    { points:  5, type: `progression`,   stageID: 0x01, collisionID: 0xa5, exitsID: 0xad, title: `The Underground Temple` },
    { points:  5, type: `progression`,   stageID: 0x02, collisionID: 0xa6, exitsID: 0x79, title: `The Mountainous Region` },
    { points:  5, type: `progression`,   stageID: 0x03, collisionID: 0xad, exitsID: 0x02, title: `The Equatorial Ring` },
    { points:  5, type: `progression`,   stageID: 0x04, collisionID: 0xa5, exitsID: 0x79, title: `The Subterranean Passage` },
    { points:  5, type: `progression`,   stageID: 0x05, collisionID: 0xa5, exitsID: 0xfb, title: `The Tower of Maid Sante` },
    { points: 10, type: `win_condition`, stageID: 0x06, collisionID: 0xa5, exitsID: 0x8a, title: `Gizemahl Castle` }
  ];

  progression.forEach(({id, points, type, stageID, collisionID, exitsID, title}) => 
    set.addAchievement({
      title, id, points, type,
      description: `Complete stage ${stageID}`,
      conditions: {
        core: define(
          isGameplay(),
          eq(ADDR.collision_id, collisionID),
          eq(ADDR.room_id, exitsID),
          eq(prev(ADDR.stage), stageID),
          eq(ADDR.stage, stageID + 1)
        )
      }
    })
  );

  set.addAchievement({
    title: `Float Like a Butterfly`,
    points: 10,
    description: `Defeat the boss of stage 1 without taking damage`,
    conditions: {
      core: define(
        once(
          andNext(
            isGameplay(),
            eq(ADDR.stage, 0x01),
            eq(ADDR.collision_id, 0xa5),
            eq(ADDR.room_id, 0xad),
            eq(ADDR.enemy_id(0), 0x04),
            eq(prev(ADDR.enemy_state(0)), 0x00),
            eq(ADDR.enemy_state(0), 0x01)
          )
        ),
        trigger(
          eq(ADDR.enemy_id(0), 0x04),
          eq(prev(ADDR.enemy_state(0)), 0x01),
          gt(ADDR.enemy_state(0), 0x01)
        ),
        resetIf(
          // neq(ADDR.game_state_1, 0x01),
          neq(ADDR.game_state_2, 0x00)
        ),
        resetIf(
          neq(ADDR.stage, 0x01),
          neq(ADDR.collision_id, 0xa5),
          neq(ADDR.room_id, 0xad)
        ),
        resetIf(
          lt(ADDR.lives, prev(ADDR.lives))
        ),
        resetIf(
          lt(ADDR.health, prev(ADDR.health))
        )
      )
    }
  });

  set.addAchievement({
    title: `A Secret to No One`,
    points: 1,
    type: 'missable',
    description: `Discover a hidden door in stage 2`,
    conditions: {
      core: define(
        isGameplay(),
        eq(ADDR.stage, 0x02),
        eq(prev(ADDR.collision_id), 0xb2),
        eq(ADDR.collision_id, 0xaa),
        eq(ADDR.room_id, 0x12)
      )
    }
  });

  set.addAchievement({
    title: `Curse of IRON PLATE`,
    points: 1,
    description: `Complete stage 2 without crossing from natural terrain onto the metal plate more than once`,
    conditions: {
      core: define(
        once(
          andNext(
            isGameplay(),
            eq(prev(ADDR.stage), 0x01),
            eq(ADDR.stage, 0x02)
          )
        ),
        trigger(
          andNext(
            eq(prev(ADDR.stage), 0x02),
            eq(ADDR.stage, 0x03)
          )
        ),
        resetIf(
          // neq(ADDR.game_state_1, 0x01),
          neq(ADDR.game_state_2, 0x00),
        ),
        resetIf(
          cond('', ADDR.iron_plate_state, '>', prev(ADDR.iron_plate_state), 2)
        ),
        resetIf(
          andNext(
            neq(ADDR.stage, 0x02),
            neq(ADDR.stage, 0x03)
          )
        )
      )
    }
  });

  set.addAchievement({
    title: `A Swift Sharp Shock`,
    points: 10,
    description: `After defeating one of the heads of the stage 2 boss, defeat the other head and the body within 10 seconds`,
    conditions: {
      core: define(
        once(
          cond('AddSource', prev(ADDR.enemy_id(0))),
          cond('AddSource', prev(ADDR.enemy_id(1))),
          cond('AndNext', 0, '=', 14),
          cond('AddSource', ADDR.enemy_id(0)),
          cond('AddSource', ADDR.enemy_id(1)),
          cond('AndNext', 0, '<', 14),
          cond('AndNext', ADDR.enemy_id(2), '=', 0x08),
          cond('AndNext', ADDR.enemy_hp(2), '>', 0x00),
          cond('',        ADDR.enemy_hp(2), '<', 0xf0)
        ),
        trigger(
          eq(ADDR.enemy_id(2), 0x08),
          lt(prev(ADDR.enemy_hp(2)), 0x0a),
          orNext(
            eq(ADDR.enemy_hp(2), 0x00),
            gt(ADDR.enemy_hp(2), 0xf0)
          )
        ),
        once(
          cond('AddSource', prev(ADDR.enemy_id(0))),
          cond('AddSource', prev(ADDR.enemy_id(1))),
          cond('AndNext', 0, '=', 14),
          cond('AddSource', ADDR.enemy_id(0)),
          cond('AddSource', ADDR.enemy_id(1)),
          cond('AndNext', 0, '<', 14),
          cond('AndNext', ADDR.enemy_id(2), '=', 0x08),
          cond('AndNext', ADDR.enemy_hp(2), '>', 0x00),
          cond('AndNext', ADDR.enemy_hp(2), '<', 0xf0)
        ),
        cond('AddHits', 1, '=', 1),
        cond('ResetIf', 0, '=', 1, 601),
        resetIf(
          // neq(ADDR.game_state_1, 0x01),
          neq(ADDR.game_state_2, 0x00)
        ),
        resetIf(
          neq(ADDR.stage, 0x02),
          neq(ADDR.collision_id, 0xa6),
          neq(ADDR.room_id, 0x79)
        ),
        resetIf(
          lt(ADDR.lives, prev(ADDR.lives))
        )
      )
    }
  });

  set.addAchievement({
    title: `Knife-Thrower Knackered`,
    points: 3,
    description: `In stage 3, defeat a knife throwing miniboss without taking damage`,
    conditions: {
      core: define(
        trigger(
          eq(prev(ADDR.enemy_id(0)), 0x05),
          eq(ADDR.enemy_id(0), 0x00)
        ),
        resetIf(
          // neq(ADDR.game_state_1, 0x01),
          neq(ADDR.game_state_2, 0x00),
        ),
        resetIf(
          neq(ADDR.stage, 0x03),
          lt(ADDR.lives, prev(ADDR.lives)),
          lt(ADDR.health, prev(ADDR.health))
        ),
        resetIf(
          andNext(
            neq(ADDR.collision_id, 0xab),
            neq(ADDR.collision_id, 0xac)
          ),
          andNext(
            neq(ADDR.room_id, 0x10),
            neq(ADDR.room_id, 0x1e)
          )
        )
      ),
      alt1: define(
        once(
          andNext(
            eq(ADDR.stage, 0x03),
            eq(ADDR.collision_id, 0xab),
            eq(ADDR.room_id, 0x1e),
            eq(ADDR.enemy_id(0), 0x05),
            eq(prev(ADDR.enemy_state(0)), 0x00),
            eq(ADDR.enemy_state(0), 0x01)
          )
        )
      ),
      alt2: define(
        once(
          andNext(
            eq(ADDR.stage, 0x03),
            eq(ADDR.collision_id, 0xac),
            eq(ADDR.room_id, 0x10),
            eq(ADDR.enemy_id(0), 0x05),
            eq(prev(ADDR.enemy_state(0)), 0x00),
            eq(ADDR.enemy_state(0), 0x01)
          )
        )
      )
    }
  });

  set.addAchievement({
    title: `Ball and Chain Knight Banished`,
    points: 10,
    description: `Defeat the boss of stage 3 without taking damage`,
    conditions: {
      core: define(
        once(
          andNext(
            isGameplay(),
            eq(ADDR.stage, 0x03),
            eq(ADDR.collision_id, 0xad),
            eq(ADDR.room_id, 0x02),
            eq(ADDR.enemy_id(0), 0x06),
            eq(prev(ADDR.enemy_state(0)), 0x00),
            eq(ADDR.enemy_state(0), 0x01)
          )
        ),
        trigger(
          eq(prev(ADDR.enemy_id(0)), 0x06),
          eq(prev(ADDR.enemy_state(0)), 0x01),
          eq(ADDR.enemy_id(0), 0x00),
          gt(ADDR.enemy_state(0), 0x01)
        ),
        resetIf(
          // neq(ADDR.game_state_1, 0x01),
          neq(ADDR.game_state_2, 0x00)
        ),
        resetIf(
          neq(ADDR.stage, 0x03),
          neq(ADDR.collision_id, 0xad),
          neq(ADDR.room_id, 0x02)
        ),
        resetIf(
          lt(ADDR.lives, prev(ADDR.lives))
        ),
        resetIf(
          lt(ADDR.health, prev(ADDR.health))
        )
      )
    }
  });

  set.addAchievement({
    title: `Orbliterator`,
    points: 2,
    type: 'missable',
    description: `Collect the M-Orb in stage 4`,
    conditions: {
      core: define(
        isGameplay(),
        eq(ADDR.stage, 0x04),
        eq(prev(ADDR.stage_4_sphere), 0x00),
        eq(ADDR.stage_4_sphere, 0xff)
      )
    }
  });

  set.addAchievement({
    title: `Azumural Wizard Assassinated`,
    points: 10,
    type: 'missable',
    description: `Defeat the boss of stage 4 without having collected the M-Orb`,
    conditions: {
      core: define(
        once(
          andNext(
            isGameplay(),
            eq(ADDR.stage, 0x04),
            eq(ADDR.stage_4_sphere, 0x00),
            eq(ADDR.collision_id, 0xa5),
            eq(ADDR.room_id, 0x79),
            eq(ADDR.enemy_id(0), 0x08),
            eq(prev(ADDR.enemy_state(0)), 0x00),
            eq(ADDR.enemy_state(0), 0x01)
          )
        ),
        trigger(
          eq(prev(ADDR.enemy_id(0)), 0x08),
          eq(prev(ADDR.enemy_state(0)), 0x01),
          eq(ADDR.enemy_id(0), 0x00),
          gt(ADDR.enemy_state(0), 0x01)
        ),
        resetIf(
          // neq(ADDR.game_state_1, 0x01),
          neq(ADDR.game_state_2, 0x00)
        ),
        resetIf(
          neq(ADDR.stage, 0x04),
          neq(ADDR.collision_id, 0xa5),
          neq(ADDR.room_id, 0x79)
        ),
        resetIf(
          lt(ADDR.lives, prev(ADDR.lives))
        )
      )
    }
  });

  set.addAchievement({
    title: `Much Orbliged`,
    points: 2,
    type: 'missable',
    description: `Collect the M-Orb in stage 5`,
    conditions: {
      core: define(
        isGameplay(),
        eq(ADDR.stage, 0x05),
        eq(prev(ADDR.stage_5_sphere), 0x00),
        eq(ADDR.stage_5_sphere, 0xff)
      )
    }
  });

  set.addAchievement({
    title: `War Machine Wrecked`,
    points: 10,
    type: 'missable',
    description: `Defeat the boss of stage 5 without having collected the M-Orb`,
    conditions: {
      core: define(
        once(
          andNext(
            isGameplay(),
            eq(ADDR.stage, 0x05),
            eq(ADDR.stage_5_sphere, 0x00),
            eq(ADDR.collision_id, 0xa5),
            eq(ADDR.room_id, 0xfb),
            eq(ADDR.enemy_id(0), 0x07),
            eq(ADDR.enemy_id(1), 0x07),
            eq(ADDR.enemy_id(2), 0x07),
            eq(ADDR.enemy_id(3), 0x07),
            eq(prev(ADDR.enemy_state(0)), 0x00),
            eq(prev(ADDR.enemy_state(1)), 0x00),
            eq(prev(ADDR.enemy_state(2)), 0x00),
            eq(prev(ADDR.enemy_state(3)), 0x00),
            eq(ADDR.enemy_state(0), 0x01),
            eq(ADDR.enemy_state(1), 0x01),
            eq(ADDR.enemy_state(2), 0x01),
            eq(ADDR.enemy_state(3), 0x01)
          )
        ),
        resetIf(
          // neq(ADDR.game_state_1, 0x01),
          neq(ADDR.game_state_2, 0x00)
        ),
        resetIf(
          neq(ADDR.stage, 0x05),
          neq(ADDR.collision_id, 0xa5),
          neq(ADDR.room_id, 0xfb)
        ),
        resetIf(
          lt(ADDR.lives, prev(ADDR.lives))
        )
      ),
      alt1: trigger(
        andNext(
          eq(prev(ADDR.enemy_state(0)), 0xfe),
          eq(prev(ADDR.enemy_state(1)), 0x00),
          eq(prev(ADDR.enemy_state(2)), 0x00),
          eq(prev(ADDR.enemy_state(3)), 0x00),
        ),
        andNext(
          eq(ADDR.enemy_state(0), 0xff),
          eq(ADDR.enemy_state(1), 0x00),
          eq(ADDR.enemy_state(2), 0x00),
          eq(ADDR.enemy_state(3), 0x00)
        )
      ), 
      alt2: trigger(
        andNext(
          eq(prev(ADDR.enemy_state(0)), 0x00),
          eq(prev(ADDR.enemy_state(1)), 0xfe),
          eq(prev(ADDR.enemy_state(2)), 0x00),
          eq(prev(ADDR.enemy_state(3)), 0x00),
        ),
        andNext(
          eq(ADDR.enemy_state(0), 0x00),
          eq(ADDR.enemy_state(1), 0xff),
          eq(ADDR.enemy_state(2), 0x00),
          eq(ADDR.enemy_state(3), 0x00)
        )
      ), 
      alt3: trigger(
        andNext(
          eq(prev(ADDR.enemy_state(0)), 0x00),
          eq(prev(ADDR.enemy_state(1)), 0x00),
          eq(prev(ADDR.enemy_state(2)), 0xfe),
          eq(prev(ADDR.enemy_state(3)), 0x00),
        ),
        andNext(
          eq(ADDR.enemy_state(0), 0x00),
          eq(ADDR.enemy_state(1), 0x00),
          eq(ADDR.enemy_state(2), 0xff),
          eq(ADDR.enemy_state(3), 0x00)
        )
      ), 
      alt4: trigger(
        andNext(
          eq(prev(ADDR.enemy_state(0)), 0x00),
          eq(prev(ADDR.enemy_state(1)), 0x00),
          eq(prev(ADDR.enemy_state(2)), 0x00),
          eq(prev(ADDR.enemy_state(3)), 0xfe),
        ),
        andNext(
          eq(ADDR.enemy_state(0), 0x00),
          eq(ADDR.enemy_state(1), 0x00),
          eq(ADDR.enemy_state(2), 0x00),
          eq(ADDR.enemy_state(3), 0xff)
        )
      )
    }
  });

  set.addAchievement({
    title: `Room Guards Routed`,
    points: 3,
    description: `In stage 6, defeat a duo of dark knights without taking damage`,
    conditions: {
      core: define(
        trigger(
          orNext(
            eq(prev(ADDR.enemy_id(0)), 0x02),
            eq(prev(ADDR.enemy_id(1)), 0x02)
          ),
          andNext(
            eq(ADDR.enemy_id(0), 0x00),
            eq(ADDR.enemy_id(1), 0x00)
          )
        ),
        resetIf(
          // neq(ADDR.game_state_1, 0x01),
          neq(ADDR.game_state_2, 0x00),
        ),
        resetIf(
          neq(ADDR.stage, 0x06),
          lt(ADDR.lives, prev(ADDR.lives)),
          lt(ADDR.health, prev(ADDR.health))
        ),
        resetIf(
          andNext(
            neq(ADDR.collision_id, 0xb0),
            neq(ADDR.collision_id, 0xb2)
          ),
          andNext(
            neq(ADDR.room_id, 0x69),
            neq(ADDR.room_id, 0x7a),
            neq(ADDR.room_id, 0x9f)
          )
        )
      ),
      alt1: define(
        once(
          andNext(
            eq(ADDR.stage, 0x06),
            eq(ADDR.collision_id, 0xb2),
            eq(ADDR.room_id, 0x69),
            eq(ADDR.enemy_id(0), 0x02),
            eq(ADDR.enemy_id(1), 0x02),
            eq(prev(ADDR.enemy_state(0)), 0x00),
            eq(prev(ADDR.enemy_state(1)), 0x00),
            eq(ADDR.enemy_state(0), 0x01),
            eq(ADDR.enemy_state(1), 0x01)
          )
        )
      ),
      alt2: define(
        once(
          andNext(
            eq(ADDR.stage, 0x06),
            eq(ADDR.collision_id, 0xb2),
            eq(ADDR.room_id, 0x7a),
            eq(ADDR.enemy_id(0), 0x02),
            eq(ADDR.enemy_id(1), 0x02),
            eq(prev(ADDR.enemy_state(0)), 0x00),
            eq(prev(ADDR.enemy_state(1)), 0x00),
            eq(ADDR.enemy_state(0), 0x01),
            eq(ADDR.enemy_state(1), 0x01)
          )
        )
      ),
      alt3: define(
        once(
          andNext(
            eq(ADDR.stage, 0x06),
            eq(ADDR.collision_id, 0xb0),
            eq(ADDR.room_id, 0x9f),
            eq(ADDR.enemy_id(0), 0x02),
            eq(ADDR.enemy_id(1), 0x02),
            eq(prev(ADDR.enemy_state(0)), 0x00),
            eq(prev(ADDR.enemy_state(1)), 0x00),
            eq(ADDR.enemy_state(0), 0x01),
            eq(ADDR.enemy_state(1), 0x01)
          )
        )
      )
    }
  });

  // set.addAchievement({
  //   title: `[Needs title] Stage 6 boss challenge`,
  //   points: 10,
  //   description: `Defeat the boss of stage 6 without taking damage`,
  //   conditions: {
  //     core: define(
  //       once(
  //         andNext(
  //           isGameplay(),
  //           eq(ADDR.stage, 0x06),
  //           eq(ADDR.collision_id, 0xa5),
  //           eq(ADDR.room_id, 0x8a),
  //           eq(ADDR.enemy_id(0), 0x06),
  //           eq(prev(ADDR.enemy_state(0)), 0x00),
  //           eq(ADDR.enemy_state(0), 0x01)
  //         )
  //       ),
  //       trigger(
  //         eq(prev(ADDR.enemy_id(0)), 0x06),
  //         eq(prev(ADDR.enemy_state(0)), 0x01),
  //         eq(ADDR.enemy_id(0), 0x06),
  //         gt(ADDR.enemy_state(0), 0x01)
  //       ),
  //       resetIf(
  //         // neq(ADDR.game_state_1, 0x01),
  //         neq(ADDR.game_state_2, 0x00)
  //       ),
  //       resetIf(
  //         neq(ADDR.stage, 0x06),
  //         neq(ADDR.collision_id, 0xa5),
  //         neq(ADDR.room_id, 0x8a)
  //       ),
  //       resetIf(
  //         lt(ADDR.lives, prev(ADDR.lives))
  //       ),
  //       resetIf(
  //         lt(ADDR.health, prev(ADDR.health))
  //       )
  //     )
  //   }
  // });

  set.addAchievement({
    title: `Banutracus' Bane`,
    points: 10,
    description: `Complete stage 6 without dying`,
    conditions: {
      core: define(
        once(
          andNext(
            isGameplay(),
            eq(prev(ADDR.stage), 0x05),
            eq(ADDR.stage, 0x06)
          )
        ),
        trigger(
          eq(ADDR.collision_id, 0xa5),
          eq(ADDR.room_id, 0x8a),
          eq(prev(ADDR.stage), 0x06),
          eq(ADDR.stage, 0x07)
        ),
        resetIf(
          // neq(ADDR.game_state_1, 0x01),
          neq(ADDR.game_state_2, 0x00)
        ),
        resetIf(
          lt(ADDR.stage, 0x06)
        ),
        resetIf(
          lt(ADDR.lives, prev(ADDR.lives))
        )
      )
    }
  });

  set.addAchievement({
    title: `Hero of Nepentes`,
    points: 25,
    description: `Complete the game without using a continue after running out of lives`,
    conditions: {
      core: define(
        once(
          andNext(
            neq(prev(ADDR.game_state_2), 0x00),
            eq(ADDR.game_state_2, 0x00)
            // isGameplay(),
            // eq(prev(ADDR.stage), 0x11),
            // eq(ADDR.stage, 0x01)
          )
        ),
        trigger(
          eq(prev(ADDR.stage), 0x06),
          eq(ADDR.stage, 0x07)
        ),
        // resetIf(
        //   // neq(ADDR.game_state_1, 0x01),
        //   neq(ADDR.game_state_2, 0x00)
        // ),
        resetIf(
          andNext(
            once(eq(ADDR.stage, 0x00)),
            lt(ADDR.stage, 0x01)
          )
        ),
        resetIf(
          andNext(
            once(eq(ADDR.stage, 0x01)),
            gt(ADDR.stage, 0x07)
          )
        ),
        // cond('AndNext', ADDR.lives, '=', 0x00, 1),
        // cond('AndNext', ADDR.lives, '=', 0x03, 1),
        // cond('ResetIf', ADDR.lives, '=', 0x00)
        resetIf(
          andNext(
            eq(prev(ADDR.lives), 0x01),
            eq(ADDR.lives, 0x00)
          )
        )
      )
    }
  });

  // ---------------------------

  set.addAchievement({
    title: `Superior Stabber`,
    points: 3,
    description: `Upgrade Ashguine's sword to its highest level`,
    conditions: {
      core: define(
        isGameplay(),
        eq(prev(ADDR.sword_level), 0x01),
        eq(ADDR.sword_level, 0x02)
      )
    }
  });

  set.addAchievement({
    title: `Upgraded Option`,
    points: 3,
    description: `Upgrade Ashguine's control sphere to its highest level`,
    conditions: {
      core: define(
        isGameplay(),
        eq(prev(ADDR.control_sphere_level), 0x14),
        eq(ADDR.control_sphere_level, 0x1e)
      )
    }
  });

  set.addAchievement({
    title: `Fleet of Foot`,
    points: 3,
    description: `Upgrade Ashguine's boots to their highest level`,
    conditions: {
      core: define(
        isGameplay(),
        eq(prev(ADDR.boots_level), 0x02),
        eq(ADDR.boots_level, 0x03)
      )
    }
  });

  // set.addAchievement({
  //   title: `[Needs title] Reach level 250`,
  //   points: 5,
  //   description: `Raise Ashguine's level to at least 250`,
  //   conditions: {
  //     core: define(
  //       isGameplay(),
  //       cond('AddSource', prev(ADDR.level(100)), '*', 100),
  //       cond('AddSource', prev(ADDR.level( 10)), '*',  10),
  //       cond('AddSource', prev(ADDR.level(  1)), '*',   1),
  //       neq(0, 0),
  //       cond('AddSource', prev(ADDR.level(100)), '*', 100),
  //       cond('AddSource', prev(ADDR.level( 10)), '*',  10),
  //       cond('AddSource', prev(ADDR.level(  1)), '*',   1),
  //       lt(0, 250),
  //       cond('AddSource', ADDR.level(100), '*', 100),
  //       cond('AddSource', ADDR.level( 10), '*',  10),
  //       cond('AddSource', ADDR.level(  1), '*',   1),
  //       gte(0, 250)
  //     )
  //   }
  // });
}

export default makeAchievements;
