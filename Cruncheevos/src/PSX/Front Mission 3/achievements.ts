import {
  AchievementSet, Condition, ConditionBuilder,
  define, andNext, orNext, once, measuredIf, resetIf,
  trigger
} from "@cruncheevos/core";

import { cond, prev, not, eq, neq, lt, gte, gt, recall, lte } from "../../common/comparison.js";
import { commaSeparatedList, range } from "../../common/util.js";
import { ADDR, battleSkills, PILOT } from "./data.js";
import { bit0, bit1, byte, dword, dword_be, word } from "../../common/value.js";

// ---------------------------------------------------------------------------------------------------
function is_battle_program() {
  return define(
    eq(ADDR.overlay1, 0x66666569)
  );
}

function is_network_program() {
  return define(
    eq(ADDR.overlay1, 0x74656e7a)
  );
}

function basic_save_protection() {
  return define(
    neq(ADDR.overlay1, 0x006c7379)
  );
}

function is_results_screen() {
  return define(
    eq(ADDR.overlay1, 0x7365727a)
  );
}

function is_dhz_route() {
  return define(
    eq(ADDR.route, 0x3)
  );
}

function is_usn_route() {
  return define(
    eq(ADDR.route, 0x2)
  );
}

function timedChallenge(sceneID: number, progressionState: number, turnCount: number) {
  return define(
    eq(ADDR.progression_state, progressionState),
    eq(ADDR.scene_id, sceneID),
    lte(ADDR.turn_number, turnCount),
    once(eq(ADDR.battle_state, 0x00)),
    trigger(
      andNext(
        eq(prev(ADDR.overlay1), 0x66666569),
        eq(ADDR.overlay1, 0x7365727a),
      )
    ),
    resetIf(
      andNext(
        eq(ADDR.overlay1, 0x66666569),
        eq(ADDR.overlay1, 0x7365727a),
      )
    ),
  )
}

function wanzerCapture(wanzerName: string) {
  const namePrefix = wanzerName.slice(0, 4);
  const nameSuffix = wanzerName.slice(4, 8);

  const numPrefix = Number([
    '0x',
    namePrefix.charCodeAt(0).toString(16),
    namePrefix.charCodeAt(1).toString(16),
    namePrefix.charCodeAt(2).toString(16),
    namePrefix.charCodeAt(3).toString(16),
  ].join(''));
  const numSuffix = Number([
    '0x',
    nameSuffix.charCodeAt(0).toString(16),
    nameSuffix.charCodeAt(1).toString(16),
    nameSuffix.charCodeAt(2).toString(16),
    nameSuffix.charCodeAt(3).toString(16),
  ].join(''));

  return {
    core: define(
      // Priming
      once(eq(ADDR.battle_state, 0x00)),

      neq(ADDR.scene_id, 0x01),
      neq(ADDR.scene_id, 0x02),
      neq(ADDR.scene_id, 0x76),

      // Null checks
      trigger(
        orNext(
          neq(ADDR.in_battle_data_ptr1, 0x00000000),
          eq(ADDR.battle_state, 0x01)
        )
      ),
      trigger( neq(ADDR.in_battle_data_ptr2, 0x00000000) ),
      // Complete mission
      trigger(
        andNext(
          eq(prev(ADDR.overlay1), 0x66666569),
          eq(ADDR.overlay1, 0x7365727a),
        )
      ),

      // Resets
      resetIf(
        andNext(
          neq(ADDR.overlay1, 0x66666569),
          neq(ADDR.overlay1, 0x7365727a),
        ),
        eq(prev(ADDR.overlay1), 0x7365727a),
        andNext(
          neq(prev(ADDR.battle_state), 0xc000),
          eq(ADDR.battle_state, 0xc000),
        ),
      ),
    ),
    ...range(0, 13).reduce((acc, n) => ({
      ...acc,
      [`alt${2 * n + 1}`]: define(
        cond('Remember',   ADDR.in_battle_data_ptr2, '+',  0x137c),
        // Check vehicle `n` is `wanzerName`
        cond('AddAddress', recall(),                 '&',  0xFFFFFF),
        cond('',           dword_be(n * 620 + 0x09), '=',  numPrefix),
        // Check vehicle `n` is `wanzerName`
        cond('AddAddress', recall(),                 '&',  0xFFFFFF),
        cond('',           dword_be(n * 620 + 0x0d), '=',  numSuffix),
        // Check vehicle HP > 0
        cond('AddAddress', recall(),                 '&',  0xFFFFFF),
        cond('',           word(n * 620 + 0x86),     '>',  0x00),
        // Check vehicle is unpiloted
        cond('AddAddress', recall(),                 '&',  0xFFFFFF),
        cond('Trigger',    byte(n * 620 + 0x03),     '=',  0xFF),
      )
    }), {}),
    ...range(0, 13).reduce((acc, n) => ({
      ...acc,
      [`alt${2 * n + 2}`]: define(
        cond('Remember',   ADDR.in_battle_data_ptr2, '+', 0x137c),
        // Check vehicle `n` is `wanzerName`
        cond('AddAddress', recall(),                 '&',  0xFFFFFF),
        cond('',           dword_be(n * 620 + 0x09), '=',  numPrefix),
        // Check vehicle `n` is `wanzerName`
        cond('AddAddress', recall(),                 '&',  0xFFFFFF),
        cond('',           dword_be(n * 620 + 0x0d), '=',  numSuffix),
        // Check vehicle HP > 0
        cond('AddAddress', recall(),                 '&',  0xFFFFFF),
        cond('',           word(n * 620 + 0x86),     '>',  0x00),
        // Check vehicle is piloted
        cond('AddAddress', recall(),                 '&',  0xFFFFFF),
        cond('Trigger',    byte(n * 620 + 0x03),     '!=', 0xFF),
        // Grab pilot index
        cond('AddAddress', recall(),                 '&',  0xFFFFFF),
        cond('Remember',   byte(n * 620 + 0x03),     '*',  0x04),
        // Build pointer to pilot's entry in actors pointer table
        cond('AddSource',  recall(),                 '+',  0x10),
        cond('Remember',   ADDR.in_battle_data_ptr2, '&',  0xFFFFFF),
        // Check whether pilot is player or computer
        //   Player pilots live in the range 0x1182fc-0x119d23
        //   Computer pilots exist in a dynamic region above 0x1225e0
        cond('AddAddress', recall()),
        cond('Trigger',    dword(0x00),              '>',  0x801182fc),
        cond('AddAddress', recall()),
        cond('Trigger',    dword(0x00),              '<',  0x80119d24),
      )
    }), {}),
  }
}

// ---------------------------------------------------------------------------------------------------

function makeAchievements(set: AchievementSet) {
  // Progression -----------------------------------------------
  set.addAchievement({
    title: `Kirishima Heavy Industries Test Pilot`,
    points: 1,
    description: `Complete the Shunyo Wanzer tests at the JDF laboratory`,
    type: 'progression',
    conditions: {
      core: define(
        eq(ADDR.scene_id, 0x01),
        eq(ADDR.progression_state, 0x00),
        eq(prev(ADDR.overlay1), 0x66666569),
        eq(ADDR.overlay1, 0x7365727a)
      )
    }
  });

  // Win conditions --------------------------------------------
  set.addAchievement({
    title: `The MIDAS Curse`,
    points: 25,
    description: `Complete the game on the USN route`,
    id: 526282,
    type: 'win_condition',
    conditions: {
      core: define(
        eq(ADDR.route, 0x2),
        eq(ADDR.progression_state, 0x73),
        eq(prev(ADDR.scene_id), 0x1FF),
        eq(ADDR.scene_id, 0x1FD),
        neq(ADDR.overlay1, 0x006c7379),
      )
    }
  });

  set.addAchievement({
    title: `That MIDAS Touch`,
    points: 25,
    description: `Complete the game on the DHZ route`,
    id: 526283,
    type: 'win_condition',
    conditions: {
      core: define(
        eq(ADDR.route, 0x3),
        eq(ADDR.progression_state, 0xBF),
        eq(prev(ADDR.scene_id), 0x1FF),
        eq(ADDR.scene_id, 0x1FD),
        neq(ADDR.overlay1, 0x006c7379),
      )
    }
  });

  // USN Route -------------------------------------------------
  const usnRouteData: { stageID: number, progressionState: number, title: string, description: string, points: number, id?: number }[] = [
    {
      stageID: 0x06, progressionState: 0x05,
      title: `A Bit of Light Treason`,
      description: `Successfully infiltrate the Yokosuka JDF Base on the USN route`,
      points: 5,
      id: 534217,
    },
    {
      stageID: 0x0b, progressionState: 0x0a,
      title: `Not Really Stealing, Just Borrowing!`,
      description: `Break through the JDF blockade and escape to Yokohama on the USN route`,
      points: 5,
      id: 534218,
    },
    {
      stageID: 0x0e, progressionState: 0x0d,
      title: `Guess It's Goodbye to Japan`,
      description: `Escape from Japan on the USN route`,
      points: 5,
      id: 534482,
    },
    {
      stageID: 0x11, progressionState: 0x10,
      title: `Prison Break`,
      description: `Break Moneymaker out of prison on the USN route`,
      points: 5,
      id: 534483,
    },
    {
      stageID: 0x14, progressionState: 0x0f,
      title: `It's Not Daddy! Call Me Master!`,
      description: `Investigate the explosion at Barilar Farm on the USN route`,
      points: 2,
      id: 534723,
    },
    {
      stageID: 0x17, progressionState: 0x16,
      title: `Uaaaaaaaaagh!`,
      description: `Defeat Serov Warren at the weapon factory on the USN route`,
      points: 10,
      id: 534724,
    },
    {
      stageID: 0x22, progressionState: 0x1d,
      title: `I'm Your Enemy! Why Do You Insist on Saving Me?`,
      description: `Complete the assault on Taal Base with the aid of Jose on the USN route`,
      points: 10,
      id: 534790,
    },
    {
      stageID: 0x1e, progressionState: 0x1d,
      title: `This Is How It Should Be...`,
      description: `Complete the assault on Taal Base and kill Jose on the USN route`,
      points: 10,
      id: 534791,
    },
    // Placeholder for missions 20-22 (split out due to route split)
    {
      stageID: 0x30, progressionState: 0x2f,
      title: `Traitors in Taipei`,
      description: `Survive the ambush at the factory in Taipei on the USN route`,
      points: 5,
      id: 535015,
    },
    {
      stageID: 0x33, progressionState: 0xe8,
      title: `Trouble in Taipei`,
      description: `Escape through the streets of Taipei on the USN route`,
      points: 5,
      id: 535016,
    },
    {
      stageID: 0x36, progressionState: 0x35,
      title: `Tunnel Vision`,
      description: `Escape Taiwan through the Futai Tunnel on the USN route`,
      points: 5,
      id: 535913,
    },
    {
      stageID: 0x3a, progressionState: 0x39,
      title: `Rapid Reaction Force`,
      description: `Defeat the Rapid Reaction Force at Yizhang on the USN route`,
      points: 5,
      id: 535914,
    },
    // Placeholder for #14
    // Placeholder for #15
    // Placeholder for #16
    {
      stageID: 0x4c, progressionState: 0x4b,
      title: `This Is Going to Blow up the Base, Right?`,
      description: `Disable the mobile fortress Tianlei on the USN route`,
      points: 10,
      id: 536028,
    },
    {
      stageID: 0x50, progressionState: 0x4f,
      title: `Bridging the Gap`,
      description: `Assist the Hua Lian rebels in taking Wuhan on the USN route`,
      points: 5,
      id: 536029,
    },
    {
      stageID: 0x57, progressionState: 0x54,
      title: `Converging on Nanjing`,
      description: `Capture Nanjing with the Hua Lian rebels on the USN route`,
      points: 10,
      id: 536083,
    },
    {
      stageID: 0x59, progressionState: 0x55,
      title: `Crushing the Centipede`,
      description: `Defeat the Wulong mercenaries at Shanghai on the USN route`,
      points: 10,
      id: 536084,
    },
    {
      stageID: 0x5b, progressionState: 0x5a,
      title: `Get on the Wanzer, Dude!`,
      description: `Escape from the Ravnui Embassy on the USN route`,
      points: 10,
      id: 536085,
    },
    {
      stageID: 0x5e, progressionState: 0x5d,
      title: `Just a Real Number in a Complex Plot`,
      description: `Defeat Liu at Yancheng Base on the USN route`,
      points: 10,
      id: 536086,
    },
    {
      stageID: 0x62, progressionState: 0x60,
      title: `I've Done Many Reprehensible Things for My Country`,
      description: `Flee the DHZ and return to Japan on the USN route`,
      points: 10,
      id: 536594,
    },
    {
      stageID: 0x66, progressionState: 0x65,
      title: `The Real Fight Begins Now`,
      description: `Ambush the coup forces at Nagahama on the USN route`,
      points: 10,
      id: 536595,
    },
    {
      stageID: 0x68, progressionState: 0x67,
      title: `It's for the Greater Good`,
      description: `Defeat the coup forces at Mt. Aso and Omuta on the USN route`,
      points: 10,
      id: 536596,
    },
    {
      stageID: 0x6b, progressionState: 0x6a,
      title: `You Have to Be Willing to Risk It If You Want MIDAS`,
      description: `Fight through the streets of Ocean City to reach the maintenance hatch on the USN route`,
      points: 10,
      id: 536597,
    },
    {
      stageID: 0x6e, progressionState: 0x6c,
      title: `So Futile...`,
      description: `Defeat the Imaginary Numbers in the maintenance section of Ocean City on the USN route`,
      points: 10,
      id: 536598,
    },
    {
      stageID: 0xe3, progressionState: 0x70,
      title: `Fool... So Be It...`,
      description: `Defeat Lukav in the depths of Ocean City on the USN route`,
      points: 10,
      id: 536599,
    },
    {
      stageID: 0x73, progressionState: 0x24,
      title: `If We Don't Hurry, the Performance Will Be Over!`,
      description: `Crash in on the press conference on the USN route`,
      points: 3,
      id: 536600,
    },
  ];

  usnRouteData.forEach(({stageID, progressionState, title, description, points, id}) => 
    set.addAchievement({
      title, points, description, id,
      conditions: {
        core: define(
          eq(ADDR.scene_id, stageID),
          eq(ADDR.progression_state, progressionState),
          eq(prev(ADDR.overlay1), 0x66666569),
          eq(ADDR.overlay1, 0x7365727a)
        )
      }
    })
  );

  set.addAchievement({
    title: `Tearing Through Taiwan`,
    description: `Clear the way to Taipei on the USN route`,
    points: 5,
    id: 535014,
    conditions: {
      core: define(
        eq(prev(ADDR.overlay1), 0x66666569),
        eq(ADDR.overlay1, 0x7365727a)
      ),
      alt1: define(
        eq(ADDR.scene_id, 0x2e),
        eq(ADDR.progression_state, 0x29),
      ),
      alt2: define(
        eq(ADDR.scene_id, 0x28),
        eq(ADDR.progression_state, 0x26),
      ),
      alt3: define(
        eq(ADDR.scene_id, 0x2d),
        eq(ADDR.progression_state, 0x25),
      ),
      alt4: define(
        eq(ADDR.scene_id, 0x2c),
        eq(ADDR.progression_state, 0x26),
      ),
    }
  });

  set.addAchievement({
    title: `You Will All Kneel to the Power of My Wanzer`,
    description: `Destroy the experimental Wanzer being tested at Guilin on the USN route`,
    points: 10,
    id: 535915,
    conditions: {
      core: define(
        orNext(
          eq(ADDR.scene_id, 0x3e),
          eq(ADDR.scene_id, 0x3f),
        ),
        eq(ADDR.progression_state, 0x3d),
        eq(prev(ADDR.overlay1), 0x66666569),
        eq(ADDR.overlay1, 0x7365727a)
      )
    }
  });

  set.addAchievement({
    title: `Don't Lose Yourself When the Time Comes...`,
    description: `Defeat the Imaginary Numbers at Xiamen on the USN route`,
    points: 5,
    id: 536026,
    conditions: {
      core: define(
        eq(ADDR.scene_id, 0x41),
        orNext(
          eq(ADDR.progression_state, 0x3e),
          eq(ADDR.progression_state, 0x3f),
        ),
        eq(prev(ADDR.overlay1), 0x66666569),
        eq(ADDR.overlay1, 0x7365727a)
      )
    }
  });

  set.addAchievement({
    title: `You Don't Understand the Greatness of This Wanzer`,
    description: `Defeat the Wulong mercenaries at Huanggoushu on the USN route`,
    points: 10,
    id: 536027,
    conditions: {
      core: define(
        eq(ADDR.scene_id, 0x49),
        orNext(
          eq(ADDR.progression_state, 0x46),
          eq(ADDR.progression_state, 0x47),
        ),
        eq(prev(ADDR.overlay1), 0x66666569),
        eq(ADDR.overlay1, 0x7365727a)
      )
    }
  });

  // DHZ Route -------------------------------------------------
  const dhzRouteData: { stageID: number, progressionState: number, title: string, description: string, points: number, id: number }[] = [
    {
      stageID: 0x79, progressionState: 0x78,
      title: `They Told Us to Get Outta the Base...`,
      description: `Escape from the Yokosuka JDF Base on the DHZ route`,
      points: 5,
      id: 526798,
    },
    {
      stageID: 0x7D, progressionState: 0x7B,
      title: `Data Heist`,
      description: `Successfully infiltrate the JDF Digi-Com Base on the DHZ route`,
      points: 5,
      id: 526799,
    },
    {
      stageID: 0x7F, progressionState: 0x7E,
      title: `Japan's Most Wanted`,
      description: `Defeat the JDF forces at Numuzu Harbour and flee Japan on the DHZ route`,
      points: 5,
      id: 526800,
    },
    {
      stageID: 0x082, progressionState: 0x81,
      title: `Detonating the Silo`,
      description: `Complete the assault on Panay Missile Base the DHZ route`,
      points: 5,
      id: 526801,
    },
    {
      stageID: 0x85, progressionState: 0x84,
      title: `Paralyzing the Fortress`,
      description: `Complete the assault on Negros Fortress on the DHZ route`,
      points: 5,
      id: 526802,
    },
    {
      stageID: 0x8A, progressionState: 0x88,
      title: `Shut Up! I'm a Fighter for Democracy!`,
      description: `Complete the assault on Dagat Ahas on the DHZ route`,
      points: 10,
      id: 526803,
    },
    {
      stageID: 0x90, progressionState: 0x8D,
      title: `Just Another Step to Manila`,
      description: `Infiltrate Taal Base on the DHZ route`,
      points: 10,
      id: 526804,
    },
    {
      stageID: 0x91, progressionState: 0x90,
      title: `This Is My Wanzer! It Was Made for Me!`,
      description: `Defeat Serov Warren at Batangas on the DHZ route`,
      points: 10,
      id: 526805,
    },
    {
      stageID: 0x94, progressionState: 0xE5,
      title: `Purple Haze, All in My Brain`,
      description: `Defeat Purple Haze in the Taipei Suburbs on the DHZ route`,
      points: 5,
      id: 526806,
    },
    {
      stageID: 0x96, progressionState: 0x95,
      title: `Under the Taiwan Strait`,
      description: `Escape Taiwan through the Futai Tunnel on the DHZ route`,
      points: 5,
      id: 526807,
    },
    {
      stageID: 0x99, progressionState: 0x98,
      title: `Hitching a Ride to Shanghai`,
      description: `Defeat the Hua Lian forces around Changsha and secure transport to the Tianlei on the DHZ route`,
      points: 5,
      id: 526808,
    },
    {
      stageID: 0xA0, progressionState: 0x9F,
      title: `Breaking and Exiting`,
      description: `Help Lan and Kwang escape from the Tianlei on the DHZ route`,
      points: 10,
      id: 526809,
    },
    {
      stageID: 0xA1, progressionState: 0xA0,
      title: `Death Will Free Me`,
      description: `Defeat Ivan Larzalev at Hankou Airport on the DHZ route`,
      points: 5,
      id: 526810,
    },
    {
      stageID: 0xA4, progressionState: 0xA6,
      title: `Betrayal Doesn't Quite Accurately Describe the Circumstances`,
      description: `Defeat Lukav outside the Ravnui Embassy on the DHZ route`,
      points: 10,
      id: 526811,
    },
    {
      stageID: 0xA8, progressionState: 0xA5,
      title: `Everything Begins Now`,
      description: `Defeat the Imaginary Numbers rampaging through Nanjing on the DHZ route`,
      points: 5,
      id: 526812,
    },
    {
      stageID: 0xAA, progressionState: 0xA9,
      title: `Something Strange Going on at Kaita Base`,
      description: `Defeat the coup forces at Kaita on the DHZ route`,
      points: 10,
      id: 526813,
    },
    {
      stageID: 0xAD, progressionState: 0xE6,
      title: `I'm Coming Back to Haunt You If I Die`,
      description: `Infiltrate the Nagoya chemical factory on the DHZ route`,
      points: 10,
      id: 526814,
    },
    {
      stageID: 0xB0, progressionState: 0xAE,
      title: `Hey, You Survived!`,
      description: `Prepare your forces for the assault on Koriyama on the DHZ route`,
      points: 10,
      id: 526815,
    },
    {
      stageID: 0xB3, progressionState: 0xE7,
      title: `Retaking Koriyama`,
      description: `Defeat the coup forces at Koriyama on the DHZ route`,
      points: 10,
      id: 526816,
    },
    {
      stageID: 0xB4, progressionState: 0xB3,
      title: `We're Just Here to Stop the Coup`,
      description: `Rescue the Prime Minister from the sanitorium at Tomiyama on the DHZ route`,
      points: 5,
      id: 526817,
    },
    {
      stageID: 0xB6, progressionState: 0xB5,
      title: `How Do You Take Responsibility If You're Dead?`,
      description: `Defeat Lt. Kuroi at Mount Asano on the DHZ route`,
      points: 10,
      id: 526818,
    },
    {
      stageID: 0xB7, progressionState: 0xB6,
      title: `You Can't Win So Easily`,
      description: `Defeat Lukav at Misumi Harbour on the DHZ route`,
      points: 10,
      id: 526819,
    },
    {
      stageID: 0xBA, progressionState: 0xB8,
      title: `Continuing to Surpass Expectations`,
      description: `Defeat Lukav at Ocean City on the DHZ route`,
      points: 10,
      id: 526820,
    },
    {
      stageID: 0xBB, progressionState: 0xBC,
      title: `Activating the Separation Sequence`,
      description: `Defeat the Imaginary Numbers at Ocean City on the DHZ route`,
      points: 10,
      id: 526821,
    },
    {
      stageID: 0xBF, progressionState: 0xBB,
      title: `Nothing but a Pathetic Human`,
      description: `Defeat Lukav and escape from Ocean City on the DHZ route`,
      points: 10,
      id: 526822,
    },
  ];

  dhzRouteData.forEach(({stageID, progressionState, title, description, points, id}) => 
    set.addAchievement({
      title, points, description, id,
      conditions: {
        core: define(
          eq(ADDR.scene_id, stageID),
          eq(ADDR.progression_state, progressionState),
          eq(prev(ADDR.overlay1), 0x66666569),
          eq(ADDR.overlay1, 0x7365727a)
        )
      }
    })
  );

  // Platinum medals -------------------------------------------
  set.addAchievement({
    title: `USN Route - Platinum Medalist I`,
    description: `Receive 17 platinum medals on the USN route`,
    points: 5,
    id: 526318,
    conditions: {
      core: define(
        is_results_screen(),
        measuredIf(is_usn_route()),
        eq(prev(ADDR.platinum_medals), 16),
        cond('Measured', ADDR.platinum_medals, '=', 17)
      )
    }
  });

  set.addAchievement({
    title: `USN Route - Platinum Medalist II`,
    description: `Receive 35 platinum medals on the USN route`,
    points: 10,
    id: 526319,
    conditions: {
      core: define(
        is_results_screen(),
        measuredIf(is_usn_route()),
        eq(prev(ADDR.platinum_medals), 34),
        cond('Measured', ADDR.platinum_medals, '=', 35)
      )
    }
  });

  set.addAchievement({
    title: `USN Route - Platinum Medalist III`,
    description: `Receive 69 platinum medals on the USN route`,
    points: 25,
    id: 526320,
    conditions: {
      core: define(
        is_results_screen(),
        measuredIf(is_usn_route()),
        eq(prev(ADDR.platinum_medals), 68),
        cond('Measured', ADDR.platinum_medals, '=', 69)
      )
    }
  });
  
  set.addAchievement({
    title: `DHZ Route - Platinum Medalist I`,
    description: `Receive 15 platinum medals on the DHZ route`,
    points: 5,
    id: 526321,
    conditions: {
      core: define(
        is_results_screen(),
        measuredIf(is_dhz_route()),
        eq(prev(ADDR.platinum_medals), 14),
        cond('Measured', ADDR.platinum_medals, '=', 15)
      )
    }
  });

  set.addAchievement({
    title: `DHZ Route - Platinum Medalist II`,
    description: `Receive 30 platinum medals on the DHZ route`,
    points: 10,
    id: 526322,
    conditions: {
      core: define(
        is_results_screen(),
        measuredIf(is_dhz_route()),
        eq(prev(ADDR.platinum_medals), 29),
        cond('Measured', ADDR.platinum_medals, '=', 30)
      )
    }
  });

  set.addAchievement({
    title: `DHZ Route - Platinum Medalist III`,
    description: `Receive 59 platinum medals on the DHZ route`,
    points: 25,
    id: 526323,
    conditions: {
      core: define(
        is_results_screen(),
        measuredIf(is_dhz_route()),
        eq(prev(ADDR.platinum_medals), 58),
        cond('Measured', ADDR.platinum_medals, '=', 59)
      )
    }
  });

  // Challenges (USN) ------------------------------------------
  set.addAchievement({
    title: `Making a Quick Exit`,
    description: `While fleeing the Yokosuka JDF base on the USN route, complete the battle before enemy reinforcements can arrive`,
    type: 'missable',
    points: 5,
    conditions: {
      core: timedChallenge(0x06, 0x05, 5)
    }
  });

  set.addAchievement({
    title: `Convoy Disassembly`,
    description: `While fighting in Yokohama on the USN route, destroy both trucks before they escape and then complete the mission`,
    type: 'missable',
    points: 5,
    conditions: {
      core: define(
        // Priming
        once(
          andNext(
            eq(ADDR.overlay1, 0x66666569),
            eq(ADDR.progression_state, 0x0b),
            eq(ADDR.scene_id, 0x0c),
            eq(prev(ADDR.battle_state), 0x01),
            eq(ADDR.battle_state, 0x00),
          )
        ),

        // Null checks
        trigger(
          orNext(
            neq(ADDR.in_battle_data_ptr1, 0x00000000),
            eq(ADDR.battle_state, 0x01)
          )
        ),
        trigger( neq(ADDR.in_battle_data_ptr2, 0x00000000) ),

        // Check destuction of trucks
        ...range(0, 34).map((n) => define(
          // Check actor `n` is not player wanzer/pilot
          cond('AddAddress', ADDR.in_battle_data_ptr2, '&',  0xFFFFFF),
          cond('AndNext',    dword(0x10 + n * 4),      '>',  0x801225e0),
          // Check actor `n` is vehicle and not pilot
          cond('AddAddress', ADDR.in_battle_data_ptr2, '&',  0xFFFFFF),
          cond('AddAddress', dword(0x10 + n * 4),      '&',  0xFFFFFF),
          cond('AndNext',    byte(0x00),               '!=', 0x00),
          // Check vehicle `n` is truck
          cond('AddAddress', ADDR.in_battle_data_ptr2, '&',  0xFFFFFF),
          cond('AddAddress', dword(0x10 + n * 4),      '&',  0xFFFFFF),
          cond('AndNext',    dword_be(0x09),           '=',  0x53656B69),
          // Check body health on previous frame
          cond('AddAddress', ADDR.in_battle_data_ptr2, '&',  0xFFFFFF),
          cond('AddAddress', dword(0x10 + n * 4),      '&',  0xFFFFFF),
          cond('AndNext',    prev(word(0x86)),         '>',  0x00),
          // Check body health on current frame
          cond('AddAddress', ADDR.in_battle_data_ptr2, '&',  0xFFFFFF),
          cond('AddAddress', dword(0x10 + n * 4),      '&',  0xFFFFFF),
          cond('AndNext',    word(0x86),               '=',  0x00),
          cond('AddHits',    0x01,                     '=',  0x01)
        )),
        cond('Trigger',      0x00,                     '=', 0x01, 2),

        // Complete mission
        trigger(
          andNext(
            eq(prev(ADDR.overlay1), 0x66666569),
            eq(ADDR.overlay1, 0x7365727a),
          )
        ),

        // Reset if any trucks escape
        ...range(0, 34).map((n) => define(
          // Check actor `n` existed on previous frame
          cond('AddAddress', ADDR.in_battle_data_ptr2,  '&',  0xFFFFFF),
          cond('AndNext',    prev(dword(0x10 + n * 4)), '!=', 0x00),
          // Check actor `n` does not exist on current frame
          cond('AddAddress', ADDR.in_battle_data_ptr2,  '&',  0xFFFFFF),
          cond('AndNext',   dword(0x10 + n * 4),        '=',  0x00),
          // Check actor `n` wav vehicle and not pilot
          cond('AddAddress', ADDR.in_battle_data_ptr2,  '&',  0xFFFFFF),
          cond('AddAddress', prev(dword(0x10 + n * 4)), '&',  0xFFFFFF),
          cond('AndNext',    byte(0x00),                '!=', 0x00),
          // Check vehicle `n` is truck
          cond('AddAddress', ADDR.in_battle_data_ptr2,  '&',  0xFFFFFF),
          cond('AddAddress', prev(dword(0x10 + n * 4)), '&',  0xFFFFFF),
          cond('AndNext',    dword_be(0x09),            '=',  0x53656B69),
          // Check body health on previous frame
          cond('AddAddress', ADDR.in_battle_data_ptr2, '&',  0xFFFFFF),
          cond('AddAddress', dword(0x10 + n * 4),      '&',  0xFFFFFF),
          cond('ResetIf',    prev(word(0x86)),         '>',  0x00),
        )),

        // Resets
        resetIf(
          andNext(
            neq(ADDR.overlay1, 0x66666569),
            neq(ADDR.overlay1, 0x7365727a),
          ),
          neq(ADDR.progression_state, 0x0b),
          neq(ADDR.scene_id, 0x0c),
          andNext(
            neq(prev(ADDR.battle_state), 0xc000),
            eq(ADDR.battle_state, 0xc000),
          ),
        ),
      )
    }
  });

  set.addAchievement({
    title: `A New Wanzer at Zeros Cost`,
    description: `While fighting at Barilar Farms on the USN route, capture Pham's Zeros wanzer to add to your stock or sell for scrap`,
    type: 'missable',
    points: 10,
    conditions: {
      core: define(
       // Priming
        once(eq(ADDR.battle_state, 0x00)),

        // Null checks
        trigger(
          orNext(
            neq(ADDR.in_battle_data_ptr1, 0x00000000),
            eq(ADDR.battle_state, 0x01)
          )
        ),
        trigger( neq(ADDR.in_battle_data_ptr2, 0x00000000) ),
        // Complete mission
        trigger(
          andNext(
            eq(prev(ADDR.overlay1), 0x66666569),
            eq(ADDR.overlay1, 0x7365727a),
          )
        ),

        // Resets
        resetIf(
          andNext(
            neq(ADDR.overlay1, 0x66666569),
            neq(ADDR.overlay1, 0x7365727a),
          ),
          eq(prev(ADDR.overlay1), 0x7365727a),
          neq(ADDR.progression_state, 0x0f),
          neq(ADDR.scene_id, 0x14),
          andNext(
            neq(prev(ADDR.battle_state), 0xc000),
            eq(ADDR.battle_state, 0xc000),
          ),
        ),
      ),
      ...range(0, 13).reduce((acc, n) => ({
        ...acc,
        [`alt${2 * n + 1}`]: define(
          cond('Remember',   ADDR.in_battle_data_ptr2, '+', 0x137c),
          // Check vehicle `n` is `Zeros`
          cond('AddAddress', recall(),                 '&',  0xFFFFFF),
          cond('',           dword_be(n * 620 + 0x09), '=',   0x5A65726F),
          // Check vehicle HP > 0
          cond('AddAddress', recall(),                 '&',  0xFFFFFF),
          cond('',           word(n * 620 + 0x86),     '>',  0x00),
          // Check vehicle is unpiloted
          cond('AddAddress', recall(),                 '&',  0xFFFFFF),
          cond('Trigger',    byte(n * 620 + 0x03),     '=',  0xFF),
        )
      }), {}),
      ...range(0, 13).reduce((acc, n) => ({
        ...acc,
        [`alt${2 * n + 2}`]: define(
          cond('Remember',   ADDR.in_battle_data_ptr2, '+', 0x137c),
          // Check vehicle `n` is `Zeros`
          cond('AddAddress', recall(),                 '&',  0xFFFFFF),
          cond('',           dword_be(n * 620 + 0x09), '=',  0x5A65726F),
          // Check vehicle HP > 0
          cond('AddAddress', recall(),                 '&',  0xFFFFFF),
          cond('',           word(n * 620 + 0x86),     '>',  0x00),
          // Check vehicle is piloted
          cond('AddAddress', recall(),                 '&',  0xFFFFFF),
          cond('Trigger',    byte(n * 620 + 0x03),     '!=', 0xFF),
          // Grab pilot index
          cond('AddAddress', recall(),                 '&',  0xFFFFFF),
          cond('Remember',   byte(n * 620 + 0x03),     '*',  0x04),
          // Build pointer to pilot's entry in actors pointer table
          cond('AddSource',  recall(),                 '+',  0x10),
          cond('Remember',   ADDR.in_battle_data_ptr2, '&',  0xFFFFFF),
          // Check whether pilot is player or computer
          //   Player pilots live in the range 0x1182fc-0x119d23
          //   Computer pilots exist in a dynamic region above 0x1225e0
          cond('AddAddress', recall()),
          cond('Trigger',    dword(0x00),              '>',  0x801182fc),
          cond('AddAddress', recall()),
          cond('Trigger',    dword(0x00),              '<',  0x80119d24),
        )
      }), {}),
    }
  });

  set.addAchievement({
    title: `Dam Quick Work`,
    description: `During the battle at Ba Kui Dam on the USN route, destroy the Laiying 1 before it can radio for help`,
    type: 'missable',
    points: 5,
    conditions: {
      core: define(
        // Priming
        eq(ADDR.overlay1, 0x66666569),
        eq(ADDR.progression_state, 0x21),
        eq(ADDR.scene_id, 0x24),
        eq(ADDR.battle_state, 0x00),
        lte(ADDR.turn_number, 6),

        // Null checks
        trigger( neq(ADDR.in_battle_data_ptr1, 0x00000000) ),
        trigger( neq(ADDR.in_battle_data_ptr2, 0x00000000) ),
      ),
      ...range(0, 13).reduce((acc, n) => ({
        ...acc,
        [`alt${n + 1}`]: define(
          cond('Remember', ADDR.in_battle_data_ptr2,     '+', 0x137c),
          cond('Remember', recall(),                     '&', 0xFFFFFF),
          cond('AddAddress', recall()),
          cond('',           dword_be(n * 620 + 0x09),   '=', 0x4c616979),
          cond('AddAddress', recall()),
          cond('',           prev(word(n * 620 + 0x86)), '>', 0x00),
          cond('AddAddress', recall()),
          cond('Trigger',    word(n * 620 + 0x86),       '=', 0x00),
        )
      }), {}),
    }
  });

  set.addAchievement({
    title: `Pedestrian Safety Course`,
    description: `While fighting in Foshan on the USN route, complete the mission without allowing Jose or Li to fall in battle`,
    type: 'missable',
    points: 5,
    conditions: {
      core: define(
        // Complete mission
        trigger(
          andNext(
            eq(prev(ADDR.overlay1), 0x66666569),
            eq(ADDR.overlay1, 0x7365727a),
          )
        ),

        // Reset on Li being killed
        resetIf(
          andNext(
            eq(ADDR.scene_id, 0x46),
            gt(prev(ADDR.li_pilot_hp), 0),
            eq(ADDR.li_pilot_hp, 0),
          )
        ),

        // Reset on Jose being killed
        resetIf(
          andNext(
            eq(ADDR.scene_id, 0x47),
            gt(prev(ADDR.jose_pilot_hp), 0),
            eq(ADDR.jose_pilot_hp, 0),
          )
        ),

        // Resets
        resetIf(
          andNext(
            neq(ADDR.overlay1, 0x66666569),
            neq(ADDR.overlay1, 0x7365727a),
          ),
          eq(prev(ADDR.overlay1), 0x7365727a),
          neq(ADDR.progression_state, 0x43),
          andNext(
            neq(ADDR.scene_id, 0x46),
            neq(ADDR.scene_id, 0x47),
          ),
          andNext(
            neq(prev(ADDR.battle_state), 0xc000),
            eq(ADDR.battle_state, 0xc000),
          ),
        ),
      ),
      alt1: define(
        once(
          andNext(
            eq(ADDR.scene_id, 0x46),
            gt(ADDR.li_pilot_hp, 0),
            eq(ADDR.battle_state, 0x00),
          )
        )
      ),
      alt2: define(
        once(
          andNext(
            eq(ADDR.scene_id, 0x47),
            gt(ADDR.jose_pilot_hp, 0),
            eq(ADDR.battle_state, 0x00),
          )
        )
      )
    }
  });

  set.addAchievement({
    title: `If We Die, It'll All Be for Nothing`,
    description: `While fighting in Nanjing city on the USN route, complete the mission without either friendly helicopter being destroyed`,
    type: 'missable',
    points: 5,
    conditions: {
      core: define(
        // Priming
        once(
          andNext(
            eq(ADDR.overlay1, 0x66666569),
            eq(ADDR.progression_state, 0x54),
            eq(ADDR.scene_id, 0x57),
            eq(prev(ADDR.battle_state), 0x01),
            eq(ADDR.battle_state, 0x00),
          )
        ),

        // Null checks
        trigger(
          orNext(
            neq(ADDR.in_battle_data_ptr1, 0x00000000),
            eq(ADDR.battle_state, 0x01)
          )
        ),
        trigger( neq(ADDR.in_battle_data_ptr2, 0x00000000) ),

        // Complete mission
        trigger(
          andNext(
            eq(prev(ADDR.overlay1), 0x66666569),
            eq(ADDR.overlay1, 0x7365727a),
          )
        ),

        // Check destuction of helicopters
        ...range(0, 34).map((n) => define(
          // Check actor `n` is not player wanzer/pilot
          cond('AddAddress', ADDR.in_battle_data_ptr2, '&',  0xFFFFFF),
          cond('AndNext',    dword(0x10 + n * 4),      '>',  0x801225e0),
          // Check actor `n` is vehicle and not pilot
          cond('AddAddress', ADDR.in_battle_data_ptr2, '&',  0xFFFFFF),
          cond('AddAddress', dword(0x10 + n * 4),      '&',  0xFFFFFF),
          cond('AndNext',    byte(0x00),               '!=', 0x00),
          // Check vehicle `n` is helicopter
          cond('AddAddress', ADDR.in_battle_data_ptr2, '&',  0xFFFFFF),
          cond('AddAddress', dword(0x10 + n * 4),      '&',  0xFFFFFF),
          cond('AndNext',    dword_be(0x09),           '=',  0x5368616E),
          // Check body health on previous frame
          cond('AddAddress', ADDR.in_battle_data_ptr2, '&',  0xFFFFFF),
          cond('AddAddress', dword(0x10 + n * 4),      '&',  0xFFFFFF),
          cond('AndNext',    prev(word(0x86)),         '>',  0x00),
          // Check body health on current frame
          cond('AddAddress', ADDR.in_battle_data_ptr2, '&',  0xFFFFFF),
          cond('AddAddress', dword(0x10 + n * 4),      '&',  0xFFFFFF),
          cond('ResetIf',    word(0x86),               '=',  0x00)
        )),

        // Resets
        resetIf(
          andNext(
            neq(ADDR.overlay1, 0x66666569),
            neq(ADDR.overlay1, 0x7365727a),
          ),
          neq(ADDR.progression_state, 0x54),
          neq(ADDR.scene_id, 0x57),
          andNext(
            neq(prev(ADDR.battle_state), 0xc000),
            eq(ADDR.battle_state, 0xc000),
          ),
        ),
      )
    }
  });

  set.addAchievement({
    title: `Admiral of the Fleet`,
    description: `While being attacked by the Japanese navy on the USN route, complete the mission having destroyed at least 8 enemy vehicles and without having lost any friendly wanzers`,
    type: `missable`,
    points: 10,
    conditions: {
      core: define(
        // Priming
        once(
          andNext(
            eq(prev(ADDR.overlay1), 0x746e6573),
            eq(ADDR.overlay1, 0x66666569),
          )
        ),

        // Complete mission
        trigger(
          andNext(
            eq(prev(ADDR.overlay1), 0x66666569),
            eq(ADDR.overlay1, 0x7365727a),
          )
        ),

        // Destroy 8 vehicles
        ...range(0, 13).map((n) =>
          define(
            cond('Remember',   ADDR.in_battle_data_ptr2,   '+', 0x137c),
            cond('Remember',   recall(),                   '&', 0xFFFFFF),
            cond('AddAddress', recall()),
            cond('AndNext',    prev(word(n * 620 + 0x86)), '>', 0x00),
            cond('AddAddress', recall()),
            cond('AddHits',    word(n * 620 + 0x86),       '=', 0x00),
          )
        ),
        cond('Measured', 0x00, '=', 0x01, 8),

        // Reset if any friendly wanzers destroyed
        ...range(1, 10).map((n) =>
          define(
            cond('AndNext', prev(word(0x119d24 + n * 620 + 0x86)), '>', 0x00),
            cond('ResetIf', word(0x119d24 + n * 620 + 0x86),       '=', 0x00),
          )
        ),
        
        // Resets
        resetIf(
          andNext(
            neq(ADDR.overlay1, 0x66666569),
            neq(ADDR.overlay1, 0x7365727a),
          ),
          neq(ADDR.progression_state, 0x60),
          neq(ADDR.scene_id, 0x62),
          andNext(
            neq(prev(ADDR.battle_state), 0xc000),
            eq(ADDR.battle_state, 0xc000),
          ),
        ),
      )
    }
  })

  // Challenges (DHZ) ------------------------------------------
  set.addAchievement({
    title: `This Didn't Take Too Much Time`,
    description: `While fighting at the power plant on the DHZ route, defeat the enemy helicopters before reinforcements arrive`,
    type: 'missable',
    points: 5,
    conditions: {
      core: timedChallenge(0x7a, 0x79, 2)
    }
  });

  set.addAchievement({
    title: `Crashing the Search Party`,
    description: `After crashing in the Panay jungle on the DHZ route, defeat the enemy scouts before they can radio back to base`,
    type: 'missable',
    points: 5,
    conditions: {
      core: timedChallenge(0x81, 0x7f, 8)
    }
  });

  set.addAchievement({
    title: `Boarding Denied`,
    description: `While fighting in the hangar of Dahat Agas on the DHZ route, complete the battle without allowing more than one enemy pilot to board a wanzer`,
    type: 'missable',
    points: 5,
    conditions: {
      core: define(
        // Priming
        once(
          andNext(
            eq(ADDR.overlay1, 0x66666569),
            eq(ADDR.progression_state, 0x85),
            eq(ADDR.scene_id, 0x87),
            eq(prev(ADDR.battle_state), 0x01),
            eq(ADDR.battle_state, 0x00),
          )
        ),

        // Null checks
        trigger( neq(ADDR.in_battle_data_ptr2, 0x00000000) ),

        // Complete mission
        trigger(
          andNext(
            eq(prev(ADDR.overlay1), 0x66666569),
            eq(ADDR.overlay1, 0x7365727a),
          )
        ),

        // On this map, all enemy pilots have index < 0x0c
        // Check all friendly wanzers for boarding events
        ...range(0, 18).map((n) => define(
          cond('AndNext', prev(byte(0x119d24 + n * 620 + 3)), '=', 0xff),
          cond('AddHits', byte(0x119d24 + n * 620 + 3),       '<', 0x0c),
        )),
        // Check all enemy wanzers for boarding events
        cond('Remember', ADDR.in_battle_data_ptr2, '+', 0x137c),
        cond('Remember', recall(),                 '&', 0xFFFFFF),
        ...range(0, 13).map((n) => define(
          cond('AddAddress', recall()),
          cond('AndNext',    prev(byte(n * 620 + 0x03)),  '=',  0xff),
          cond('AddAddress', recall()),
          cond('AddHits',    byte(n * 620 + 0x03),        '<',  0x0c),
        )),
        cond('ResetIf', 0, '=', 1, 2),

        // Resets
        resetIf(
          andNext(
            neq(ADDR.overlay1, 0x66666569),
            neq(ADDR.overlay1, 0x7365727a),
          ),
          neq(ADDR.progression_state, 0x85),
          neq(ADDR.scene_id, 0x87),
          andNext(
            neq(prev(ADDR.battle_state), 0xc000),
            eq(ADDR.battle_state, 0xc000),
          ),
        ),
      )
    }
  });

  set.addAchievement({
    title: `Railcar Rampage`,
    description: `During the battle at the entrance of the Futai Tunnel on the DHZ route, use the armoured railcar to destroy an enemy wanzer`,
    type: 'missable',
    points: 3,
    conditions: {
      core: define(
        // Priming
        once(
          andNext(
            eq(ADDR.overlay1, 0x66666569),
            eq(ADDR.progression_state, 0x94),
            eq(ADDR.scene_id, 0x95),
            eq(prev(ADDR.battle_state), 0x01),
            eq(ADDR.battle_state, 0x00),
          )
        ),

        // Null checks
        trigger( neq(ADDR.in_battle_data_ptr1, 0x00000000) ),
        trigger( neq(ADDR.in_battle_data_ptr2, 0x00000000) ),

        // Resets
        resetIf(
          neq(ADDR.overlay1, 0x66666569),
          neq(ADDR.progression_state, 0x94),
          neq(ADDR.scene_id, 0x95),
          neq(ADDR.battle_state, 0x00),
        ),
      ),
      ...range(0, 34).reduce((acc, n) => ({
        ...acc,
        [`alt${n + 1}`]: define(
          // Check for player phase
          cond('',           ADDR.battle_phase,        '=', 0x00),

          // Check acting unit is railcar
          cond('AddAddress', ADDR.in_battle_data_ptr1, '&', 0xFFFFFF),
          cond('AddAddress', dword(0x158),             '&', 0xFFFFFF),
          cond('Trigger',    dword_be(0x09),           '=', 0x41726D6F),
          
          // Check actor `n` is vehicle and not pilot
          cond('AddAddress', ADDR.in_battle_data_ptr2, '&',  0xFFFFFF),
          cond('AddAddress', dword(0x10 + n * 4),      '&',  0xFFFFFF),
          cond('Trigger',    byte(0x00),               '!=', 0x00),
          // Check vehicle has pilot
          cond('AddAddress', ADDR.in_battle_data_ptr2, '&',  0xFFFFFF),
          cond('AddAddress', dword(0x10 + n * 4),      '&',  0xFFFFFF),
          cond('Trigger',    byte(0x03),               '!=', 0xFF),
          // Remember pilot index
          cond('AddAddress', ADDR.in_battle_data_ptr2, '&',  0xFFFFFF),
          cond('AddAddress', dword(0x10 + n * 4),      '&',  0xFFFFFF),
          cond('Remember',   byte(0x03),               '*',  0x04),
          // Build pointer to pilot's entry in actors pointer table
          cond('AddSource',  recall(),                 '+',  0x10),
          cond('Remember',   ADDR.in_battle_data_ptr2, '&',  0xFFFFFF),
          // Check whether pilot is player or computer
          //   Player pilots live in the range 0x1182fc-0x119d23
          //   Computer pilots exist in a dynamic region above 0x1225e0
          cond('AddAddress', recall()),
          cond('Trigger',    dword(0x00),              '>', ADDR.in_battle_data_ptr2),
          // Check vehicle health on previous frame
          cond('AddAddress', ADDR.in_battle_data_ptr2, '&',  0xFFFFFF),
          cond('AddAddress', dword(0x10 + n * 4),      '&',  0xFFFFFF),
          cond('Trigger',    prev(word(0x86)),         '>',  0x00),
          // Check vehicle health on current frame
          cond('AddAddress', ADDR.in_battle_data_ptr2, '&',  0xFFFFFF),
          cond('AddAddress', dword(0x10 + n * 4),      '&',  0xFFFFFF),
          cond('Trigger',    word(0x86),               '=',  0x00),

        )
      }), {}),
      ...range(0, 34).reduce((acc, n) => ({
        ...acc,
        [`alt${n + 35}`]: define(
          // Check for enemy phase
          cond('',           ADDR.battle_phase,        '=', 0x01),

          // Check targeted unit is railcar --------------------
          // Grab actors table index of targeted unit
          cond('AddAddress', ADDR.in_battle_data_ptr1, '&', 0xFFFFFF),
          cond('AddAddress', dword(0x144),             '&', 0xFFFFFF),
          cond('Remember',   byte(0x0f),               '*', 0x04),
          // Build pointer into actors table
          cond('AddSource',  recall(),                 '+', 0x10),
          cond('Remember',   ADDR.in_battle_data_ptr2, '&', 0xFFFFFF),
          // Build pointer into actor data
          cond('AddAddress', recall()),
          cond('Remember',   dword(0x00),              '&', 0xFFFFFF),
          // Check actor name
          cond('AddAddress', recall()),
          cond('Trigger',    dword_be(0x09),           '=', 0x41726D6F),

          // Check actor `n` is vehicle and not pilot
          cond('AddAddress', ADDR.in_battle_data_ptr2, '&',  0xFFFFFF),
          cond('AddAddress', dword(0x10 + n * 4),      '&',  0xFFFFFF),
          cond('Trigger',    byte(0x00),               '!=', 0x00),
          // Check vehicle has pilot
          cond('AddAddress', ADDR.in_battle_data_ptr2, '&',  0xFFFFFF),
          cond('AddAddress', dword(0x10 + n * 4),      '&',  0xFFFFFF),
          cond('Trigger',    byte(0x03),               '!=', 0xFF),
          // Remember pilot index
          cond('AddAddress', ADDR.in_battle_data_ptr2, '&',  0xFFFFFF),
          cond('AddAddress', dword(0x10 + n * 4),      '&',  0xFFFFFF),
          cond('Remember',   byte(0x03),               '*',  0x04),
          // Build pointer to pilot's entry in actors pointer table
          cond('AddSource',  recall(),                 '+',  0x10),
          cond('Remember',   ADDR.in_battle_data_ptr2, '&',  0xFFFFFF),
          // Check whether pilot is player or computer
          //   Player pilots live in the range 0x1182fc-0x119d23
          //   Computer pilots exist in a dynamic region above 0x1225e0
          cond('AddAddress', recall()),
          cond('Trigger',    dword(0x00),              '>', ADDR.in_battle_data_ptr2),
          // Check vehicle health on previous frame
          cond('AddAddress', ADDR.in_battle_data_ptr2, '&',  0xFFFFFF),
          cond('AddAddress', dword(0x10 + n * 4),      '&',  0xFFFFFF),
          cond('Trigger',    prev(word(0x86)),         '>',  0x00),
          // Check vehicle health on current frame
          cond('AddAddress', ADDR.in_battle_data_ptr2, '&',  0xFFFFFF),
          cond('AddAddress', dword(0x10 + n * 4),      '&',  0xFFFFFF),
          cond('Trigger',    word(0x86),               '=',  0x00),
        )
      }), {}),
    }
  });

  set.addAchievement({
    title: `Wanzerjacking`,
    description: `After raising the elevator in the Nagoya sewers on the DHZ route (without having downloaded the sewer plans), have Ryogo board an enemy wanzer`,
    type: 'missable',
    points: 5,
    conditions: {
      core: define(
        // Priming
        eq(ADDR.overlay1, 0x66666569),
        eq(ADDR.progression_state, 0xab),
        eq(ADDR.scene_id, 0xe6),
        eq(ADDR.battle_state, 0x00),
        eq(ADDR.nagoya_sewer_plans, 0),
        gt(ADDR.ryogo_pilot_hp, 0),

        // Null checks
        // trigger( neq(ADDR.in_battle_data_ptr1, 0x00000000) ),
        trigger( neq(ADDR.in_battle_data_ptr2, 0x00000000) ),
      ),
      ...range(0, 13).reduce((acc, n) => ({
        ...acc,
        [`alt${n + 1}`]: define(
          cond('Remember',   ADDR.in_battle_data_ptr2, '+', 0x137c),
          // Check vehicle isn't destroyed
          cond('AddAddress', recall(),                 '&',  0xFFFFFF),
          cond('Trigger',    word(n * 620 + 0x86),     '!=', 0x00),
          // Check vehicle was without pilot
          cond('AddAddress', recall(),                 '&',  0xFFFFFF),
          cond('Trigger',    prev(byte(n * 620 + 3)),  '=',  0xFF),
          // Check vehicle has pilot
          cond('AddAddress', recall(),                 '&',  0xFFFFFF),
          cond('Trigger',    byte(n * 620 + 3),        '!=', 0xFF),
          // Remember pilot index
          cond('AddAddress', recall(),                 '&',  0xFFFFFF),
          cond('Remember',   byte(n * 620 + 3),        '*',  0x04),
          
          // Build pointer to pilot's entry in actors pointer table
          cond('AddSource',  recall(),                 '+',  0x10),
          cond('Remember',   ADDR.in_battle_data_ptr2, '&',  0xFFFFFF),
          // Check whether pilot is Ryogo
          cond('AddAddress', recall()),
          cond('Trigger',    dword(0x00),              '=',  0x80118758),
        )
      }), {}),
      // ...range(0, 34).reduce((acc, n) => ({
      //   ...acc,
      //   [`alt${n + 1}`]: define(
      //     // Check actor `n` is not player wanzer/pilot
      //     cond('AddAddress', ADDR.in_battle_data_ptr2, '&',  0xFFFFFF),
      //     cond('Trigger',    dword(0x10 + n * 4),      '>',  0x801225e0),
      //     // Check actor `n` is vehicle and not pilot
      //     cond('AddAddress', ADDR.in_battle_data_ptr2, '&',  0xFFFFFF),
      //     cond('AddAddress', dword(0x10 + n * 4),      '&',  0xFFFFFF),
      //     cond('Trigger',    byte(0x00),               '!=', 0x00),
      //     // Check vehicle was without pilot
      //     cond('AddAddress', ADDR.in_battle_data_ptr2, '&',  0xFFFFFF),
      //     cond('AddAddress', dword(0x10 + n * 4),      '&',  0xFFFFFF),
      //     cond('Trigger',    prev(byte(0x03)),         '=',  0xFF),
      //     // Check vehicle has pilot
      //     cond('AddAddress', ADDR.in_battle_data_ptr2, '&',  0xFFFFFF),
      //     cond('AddAddress', dword(0x10 + n * 4),      '&',  0xFFFFFF),
      //     cond('Trigger',    byte(0x03),               '!=', 0xFF),
      //     // Remember pilot index
      //     cond('AddAddress', ADDR.in_battle_data_ptr2, '&',  0xFFFFFF),
      //     cond('AddAddress', dword(0x10 + n * 4),      '&',  0xFFFFFF),
      //     cond('Remember',   byte(0x03),               '*',  0x04),
          
      //     // Build pointer to pilot's entry in actors pointer table
      //     cond('AddSource',  recall(),                 '+',  0x10),
      //     cond('Remember',   ADDR.in_battle_data_ptr2, '&',  0xFFFFFF),
      //     // Check whether pilot is Ryogo
      //     cond('AddAddress', recall()),
      //     cond('Trigger',    dword(0x00),              '=',  0x80118758),
      //   )
      // }), {}),
    }
  });

  // Wanzer captures -------------------------------------------
  set.addAchievement({
    title: `Wanzer Wrangler - Hoshun Mk112`,
    description: `Capture a Hoshun Mk112 wanzer to add to your stock or sell for scrap`,
    type: 'missable',
    points: 10,
    id: 537812,
    conditions: wanzerCapture("HoshunMk112")
  });

  set.addAchievement({
    title: `Wanzer Wrangler - Lenghe 1`,
    description: `Capture a Lenghe 1 wanzer to add to your stock or sell for scrap`,
    type: 'missable',
    points: 10,
    id: 537813,
    conditions: wanzerCapture("Lenghe 1")
  });

  set.addAchievement({
    title: `Wanzer Wrangler - Mingtian 1`,
    description: `Capture a Mingtian 1 wanzer to add to your stock or sell for scrap`,
    type: 'missable',
    points: 10,
    id: 537814,
    conditions: wanzerCapture("Mingtian 1")
  });

  set.addAchievement({
    title: `Wanzer Wrangler - Qibing 0`,
    description: `Capture a Qibing 0 wanzer to add to your stock or sell for scrap`,
    type: 'missable',
    points: 10,
    id: 537815,
    conditions: wanzerCapture("Qibing 0")
  });

  set.addAchievement({
    title: `Wanzer Wrangler - Shunwang 1`,
    description: `Capture a Shunwang 1 wanzer to add to your stock or sell for scrap`,
    type: 'missable',
    points: 10,
    id: 537816,
    conditions: wanzerCapture("Shunwang 1")
  });

  set.addAchievement({
    title: `Wanzer Wrangler - Shunyo Mk111`,
    description: `Capture a Shunyo Mk111 wanzer to add to your stock or sell for scrap`,
    type: 'missable',
    points: 10,
    id: 537817,
    conditions: wanzerCapture("ShunyoMk111")
  });

  // Bounties --------------------------------------------------
  set.addAchievement({
    title: `Bounty Hunter - Kazumi Kato`,
    description: `Receive a bounty for helping bring Kazumi Kato to justice`,
    type: 'missable',
    points: 3,
    id: 536603,
    conditions: {
      core: define(
        is_network_program(),
        eq(prev(ADDR.unread_kazumi_kato), 1),
        eq(ADDR.unread_kazumi_kato, 0),
        eq(prev(ADDR.bounty_kazumi_kato), 0),
        eq(ADDR.bounty_kazumi_kato, 1),
      )
    }
  });

  set.addAchievement({
    title: `Bounty Hunter - Shoichi Furusawa`,
    description: `Receive a bounty for helping bring Shoichi Furusawa to justice`,
    type: 'missable',
    points: 1,
    id: 536607,
    conditions: {
      core: define(
        is_network_program(),
        eq(prev(ADDR.unread_shoichi_furusawa), 1),
        eq(ADDR.unread_shoichi_furusawa, 0),
        eq(prev(ADDR.bounty_shoichi_furusawa), 0),
        eq(ADDR.bounty_shoichi_furusawa, 1),
      )
    }
  });

  set.addAchievement({
    title: `Bounty Hunter - Dai Sato`,
    description: `Receive a bounty for helping bring Dai Sato to justice`,
    type: 'missable',
    points: 1,
    id: 536602,
    conditions: {
      core: define(
        is_network_program(),
        eq(prev(ADDR.unread_dai_sato), 1),
        eq(ADDR.unread_dai_sato, 0),
        eq(prev(ADDR.bounty_dai_sato), 0),
        eq(ADDR.bounty_dai_sato, 1),
      )
    }
  });

  set.addAchievement({
    title: `Bounty Hunter - Koji Yamada`,
    description: `Receive a bounty for helping bring Koji Yamada to justice`,
    type: 'missable',
    points: 1,
    id: 536606,
    conditions: {
      core: define(
        is_network_program(),
        eq(prev(ADDR.unread_koji_yamada), 1),
        eq(ADDR.unread_koji_yamada, 0),
        eq(prev(ADDR.bounty_koji_yamada), 0),
        eq(ADDR.bounty_koji_yamada, 1),
      )
    }
  });

  set.addAchievement({
    title: `Bounty Hunter - Yoshihisa Ushihisa`,
    description: `Receive a bounty for helping bring Yoshihisa Ushihisa to justice`,
    type: 'missable',
    points: 1,
    id: 536609,
    conditions: {
      core: define(
        is_network_program(),
        eq(prev(ADDR.unread_yoshihisa_ushihisa), 1),
        eq(ADDR.unread_yoshihisa_ushihisa, 0),
        eq(prev(ADDR.bounty_yoshihisa_ushihisa), 0),
        eq(ADDR.bounty_yoshihisa_ushihisa, 1),
      )
    }
  });

  set.addAchievement({
    title: `Bounty Hunter - Takashi Kishi`,
    description: `Receive a bounty for helping bring Takashi Kishi to justice`,
    type: 'missable',
    points: 1,
    id: 536608,
    conditions: {
      core: define(
        is_network_program(),
        eq(prev(ADDR.unread_takashi_kishi), 1),
        eq(ADDR.unread_takashi_kishi, 0),
        eq(prev(ADDR.bounty_takashi_kishi), 0),
        eq(ADDR.bounty_takashi_kishi, 1),
      )
    }
  });

  set.addAchievement({
    title: `Bounty Hunter - Kazushi Takahashi`,
    description: `Receive a bounty for helping bring Kazushi Takahashi to justice`,
    type: 'missable',
    points: 1,
    id: 536604,
    conditions: {
      core: define(
        is_network_program(),
        eq(prev(ADDR.unread_kazushi_takahashi), 1),
        eq(ADDR.unread_kazushi_takahashi, 0),
        eq(prev(ADDR.bounty_kazushi_takahashi), 0),
        eq(ADDR.bounty_kazushi_takahashi, 1),
      )
    }
  });

  set.addAchievement({
    title: `Bounty Hunter - Kiyomi Yokohama`,
    description: `Receive a bounty for helping bring Kiyomi Yokohama to justice`,
    type: 'missable',
    points: 1,
    id: 536605,
    conditions: {
      core: define(
        is_network_program(),
        eq(prev(ADDR.unread_kiyomi_yokohama), 1),
        eq(ADDR.unread_kiyomi_yokohama, 0),
        eq(prev(ADDR.bounty_kiyomi_yokohama), 0),
        eq(ADDR.bounty_kiyomi_yokohama, 1),
      )
    }
  });

  // Network quests --------------------------------------------
  set.addAchievement({
    title: `Miss Teihoku 2112`,
    description: `Successfully rig the Miss Teihoku pageant in Alisa's favour`,
    type: 'missable',
    points: 1,
    id: 536646,
    conditions: {
      core: define(
        is_network_program(),
        eq(prev(ADDR.miss_teihoku_unread), 1),
        eq(ADDR.miss_teihoku_unread, 0),
        eq(prev(ADDR.miss_teihoku_read), 0),
        eq(ADDR.miss_teihoku_read, 1),
      )
    }
  });

  set.addAchievement({
    title: `Twin Tiger Hunt`,
    description: `Receive payment for hacking the Twin Tiger Software server`,
    type: 'missable',
    points: 1,
    // id: 536646,
    conditions: {
      core: define(
        is_network_program(),
        eq(prev(ADDR.twin_tiger_hunt_unread), 1),
        eq(ADDR.twin_tiger_hunt_unread, 0),
        eq(prev(ADDR.twin_tiger_hunt_read), 0),
        eq(ADDR.twin_tiger_hunt_read, 1),
      )
    }
  });
  
  set.addAchievement({
    title: `You Ruined a Beautiful Piece of Art!`,
    description: `Receive Woo's rating on an enlarged photo of himself`,
    type: 'missable',
    points: 1,
    id: 536647,
    conditions: {
      core: define(
        is_network_program(),
        eq(prev(ADDR.woo_portrait_unread), 1),
        eq(ADDR.woo_portrait_unread, 0),
        eq(prev(ADDR.woo_portrait_read), 0),
        eq(ADDR.woo_portrait_read, 1),
      )
    }
  });

  set.addAchievement({
    title: `I Want to Believe`,
    description: `Receive Woo's rating on the UFO photo`,
    type: 'missable',
    points: 1,
    id: 536648,
    conditions: {
      core: define(
        is_network_program(),
        eq(prev(ADDR.woo_ufo_unread), 1),
        eq(ADDR.woo_ufo_unread, 0),
        eq(prev(ADDR.woo_ufo_read), 0),
        eq(ADDR.woo_ufo_read, 1),
      )
    }
  });
  
  // Simulator -------------------------------------------------
  set.addAchievement({
    title: `Simulator Student`,
    points: 2,
    description: `Unlock Training difficulty for the battle simulator`,
    conditions: {
      core: define(
        basic_save_protection(),
        eq(prev(ADDR.simulator_training), 0),
        eq(ADDR.simulator_training, 1)
      )
    }
  });

  set.addAchievement({
    title: `Simulator Savant`,
    points: 2,
    description: `Unlock Real Battle difficulty for the battle simulator`,
    conditions: {
      core: define(
        basic_save_protection(),
        eq(prev(ADDR.simulator_real_battle), 0),
        eq(ADDR.simulator_real_battle, 1)
      )
    }
  });

  set.addAchievement({
    title: `Map Collector - Shin Ohgishima Bridge`,
    points: 2,
    description: `Unlock the Shin Ohgishima Bridge map for the battle simulator`,
    conditions: {
      core: define(
        basic_save_protection(),
        eq(prev(ADDR.simulator_shin_ohgishima), 0),
        eq(ADDR.simulator_shin_ohgishima, 1)
      )
    }
  });

  set.addAchievement({
    title: `Map Collector - Taal Base`,
    points: 2,
    description: `Unlock the Taal Base map for the battle simulator`,
    conditions: {
      core: define(
        basic_save_protection(),
        eq(prev(ADDR.simulator_taal_base), 0),
        eq(ADDR.simulator_taal_base, 1)
      )
    }
  });

  set.addAchievement({
    title: `Map Collector - Taipei`,
    points: 2,
    description: `Unlock the Taipei map for the battle simulator`,
    conditions: {
      core: define(
        basic_save_protection(),
        eq(prev(ADDR.simulator_taipei), 0),
        eq(ADDR.simulator_taipei, 1)
      )
    }
  });

  set.addAchievement({
    title: `Map Collector - Oil Field`,
    points: 2,
    description: `Unlock the Oil Field map for the battle simulator`,
    conditions: {
      core: define(
        basic_save_protection(),
        eq(prev(ADDR.simulator_oil_field), 0),
        eq(ADDR.simulator_oil_field, 1)
      )
    }
  });

  set.addAchievement({
    title: `Map Collector - Nanjing`,
    points: 2,
    description: `Unlock the Nanjing map for the battle simulator`,
    conditions: {
      core: define(
        basic_save_protection(),
        eq(prev(ADDR.simulator_nanjing), 0),
        eq(ADDR.simulator_nanjing, 1)
      )
    }
  });

  set.addAchievement({
    title: `Map Collector - Fukushima`,
    points: 2,
    description: `Unlock the Fukushima map for the battle simulator`,
    conditions: {
      core: define(
        basic_save_protection(),
        eq(prev(ADDR.simulator_fukushima), 0),
        eq(ADDR.simulator_fukushima, 1)
      )
    }
  });

  // Software --------------------------------------------------
  set.addAchievement({
    title: `Script Kiddie`,
    description: `Obtain one piece of software`,
    points: 1,
    id: 526831,
    conditions: {
      core: define(
        basic_save_protection(),
        cond('AddSource', prev(ADDR.sw_picaresque)),
        cond('AddSource', prev(ADDR.sw_kaleidoscope)),
        cond('AddSource', prev(ADDR.sw_restrex)),
        cond('AddSource', prev(ADDR.sw_code_security_21)),
        cond('AddSource', prev(ADDR.sw_undercover)),
        cond('AddSource', prev(ADDR.sw_yahan_q)),
        cond('AddSource', prev(ADDR.sw_no_wait_lifting)),
        eq(0, 0),
        cond('AddSource', ADDR.sw_picaresque),
        cond('AddSource', ADDR.sw_kaleidoscope),
        cond('AddSource', ADDR.sw_restrex),
        cond('AddSource', ADDR.sw_code_security_21),
        cond('AddSource', ADDR.sw_undercover),
        cond('AddSource', ADDR.sw_yahan_q),
        cond('AddSource', ADDR.sw_no_wait_lifting),
        eq(0, 1)
      )
    }
  });

  set.addAchievement({
    title: `Big Spender`,
    description: `Obtain all pieces of software`,
    points: 5,
    id: 526832,
    conditions: {
      core: define(
        basic_save_protection(),
        cond('AddSource', prev(ADDR.sw_picaresque)),
        cond('AddSource', prev(ADDR.sw_kaleidoscope)),
        cond('AddSource', prev(ADDR.sw_restrex)),
        cond('AddSource', prev(ADDR.sw_code_security_21)),
        cond('AddSource', prev(ADDR.sw_undercover)),
        cond('AddSource', prev(ADDR.sw_yahan_q)),
        cond('AddSource', prev(ADDR.sw_no_wait_lifting)),
        eq(0, 6),
        cond('AddSource', ADDR.sw_picaresque),
        cond('AddSource', ADDR.sw_kaleidoscope),
        cond('AddSource', ADDR.sw_restrex),
        cond('AddSource', ADDR.sw_code_security_21),
        cond('AddSource', ADDR.sw_undercover),
        cond('AddSource', ADDR.sw_yahan_q),
        cond('AddSource', ADDR.sw_no_wait_lifting),
        cond('Measured', 0, '=', 7)
      )
    }
  });

  // Battle skills ---------------------------------------------
  const battleSkillsByPartName = Object.groupBy(battleSkills, (foo) => foo.partName);

  Object.entries(battleSkillsByPartName).forEach(([partName, partData]) => {
    partData
    const skillIDs = (partData!).map(({id}) => id);
    
    set.addAchievement({
      title: `Pro Pilot - ${partName}`,
      points: 3,
      description: `Learn all battle skills taught by ${partName} parts on a single character`,
      conditions: {
        core: define(
          is_battle_program()
        ),
        ...range(0x01, 0x0F).reduce((acc, n) => ({
          ...acc,
          [`alt${n}`]: define(
            cond('MeasuredIf', PILOT.affiliation(n), '=', 0x01),
            ...skillIDs.map((id) => cond('AddSource', prev(PILOT.battleSkill(n, id)), '/', prev(PILOT.battleSkill(n, id)))),
            eq(0, 2),
            ...skillIDs.map((id) => cond('AddSource', PILOT.battleSkill(n, id), '/', PILOT.battleSkill(n, id))),
            eq(0, 3),
          ).withLast({flag: 'Measured'})
        }), {})
      }
    });
  });
}

export default makeAchievements;
