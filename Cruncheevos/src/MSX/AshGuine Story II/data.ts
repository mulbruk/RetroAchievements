import { byte, word } from '../../common/value.js';

export const ADDR = {
  // 0x0000: [8-bit] Stage number
  stage: byte(0x000),

  // 0x0001: [8-bit] Sword powerup level
  //   0x00 = Level 1
  //   0x01 = Level 2
  //   0x02 = Level 3
  sword_level: byte(0x0001),

  // 0x0003: [8-bit] Control Sphere powerup level
  //   0x00 = Not active
  //   0x0a = Level 1
  //   0x14 = Level 2
  //   0x1e = Level 3
  control_sphere_level: byte(0x0003),

  // 0x0004: [8-bit] Stage 4 - Collected M-Sphere
  //   0x00 = Uncollected
  //   0xff = Collected
  stage_4_sphere: byte(0x0004),

  // 0x0005: [8-bit] Stage 5 - Collected M-Sphere
  //   0x00 = Uncollected
  //   0xff = Collected
  stage_5_sphere: byte(0x0005),

  // 0x0016: [8-bit] Health
  health: byte(0x0016),

  // 0x0019: [8-bit] Boots powerup level
  //   0x01 = Level 1
  //   0x02 = Level 2
  //   0x03 = Level 3
  boots_level: byte(0x0019),

  // 0x0023: [24-bit BCD] Level
  level: (n: 100 | 10 | 1) => byte(0x0023 + 2 - Math.log10(n)),

  // 0x002d: [8-bit] Collision geometry ID for current screen
  //   -- Stage 2 --
  //   0xaa = Inside hidden door
  //   0xb2 = Outside hidden door
  collision_id: byte(0x002d),

  room_id: byte(0x0034),

  // 0x002e: [8-bit] Frame counter
  frames: byte(0x002e),

  // 0x0037: [8-bit] Suns rotation state (0x00 - 0x0f)
  //   Value increments every 128 frames
  suns_partial_rotation: byte(0x0037),

  // 0x0038: [8-bit] Suns rotations elapsed
  //   5 rotations = 1 day elapsed
  //   1 rotation = 2048 frames elapsed
  suns_rotations: byte(0x0038),

  // 0x0039: [8-bit] Days remaining
  //   1 day elapsed = 10240 frames elapsed
  days_remaining: byte(0x0039),

  enemy_id:    (n: number) => byte(0x4c + 0x10 * n + 0x02),
  enemy_state: (n: number) => byte(0x4c + 0x10 * n + 0x03),
  enemy_hp:    (n: number) => byte(0x4c + 0x10 * n + 0x06),

  // 0x00ea: [8-bit] Stage 3 - Deactivated first security terminal
  //   0x00 = Active
  //   0x01 = Deactivated
  security_terminal_1: byte(0x00ea),

  // 0x00e6: [8-bit] Stage 2 - standing on metal plate
  //   0x00 = Not on plate
  //   0x01 = Standing on plate
  iron_plate_state: byte(0x00e6),

  // 0x00eb: [8-bit] Stage 3 - Deactivated second security terminal
  //   0x00 = Active
  //   0x01 = Deactivated
  security_terminal_2: byte(0x00eb),

  // 0x00f0: [8-bit] Lives
  lives: byte(0x00f0),

  // 0x20b6: [8-bit] Discriminator for game state
  //   0x00 = Title screen / Ending
  //   0x01 = Gameplay
  game_state_1: byte(0x20b6),

  // 0x20eb: [8-bit] Discriminator for game state
  //    0x00 = Gameplay
  //    0xff = Title screen / Ending
  game_state_2: byte(0x20eb),

  // 0x20ec: [8-bit] Discriminator for non-gameplay state
  //   0x04 = Opening
  //   0xff = Credits
  non_gameplay_state: byte(0x20ec)
}
