import { byte } from '../../common/value.js';

// ---------------------------------------------------------------------------------------------------

export const ADDR = {
  // 0x1060: [256 bytes, 32 byte entries] Enemy data
  //   +0X00 [8-bit] Enemy type
  //   | 0x81 = Koopa
  //   | 0x0d = Koopa retracted into shell
  //   | 0x8c = Cannonball
  //   | 0x6e = Exploding cannonball
  //   | 0x91 = Buzzy Beetle
  //   | 0x1b = Buzzy Beetle retracted into shell
  //   | 0x93 = Dry Bones
  //   | 0x1c = Dry Bones retracted into shell
  //   | 0xf0 = Generic enemy death state
  //   +0x01 [8-bit] x-coordinate (relative to viewport)
  //   +0x03 [8-bit] y-coordinate
  //   +0x0b [8-bit] Behaviour flags
  enemy_state: (n: number) => byte(0x1060 + n * 0x20),

  // 0x1a16: [8-bit] Player control state
  //   0x00 = Input accepted
  //   0x01 = Input ignored
  //   Input is ignored during level end jingle, resumes being accepted on the same frame that game
  //   state transitions from gameplay to stage clear screen
  input_state: byte(0x1a16),

  // 0x1b7d: [8-bit] Game state
  //   0x00 = Gameplay
  //   0x81 = Death / Ready
  //   0x82 = Stage clear
  //   0x83 = Game over
  //   0x85 = Ending
  //   0xFF = Title screen
  game_state: byte(0x1b7d),

  // 0x1b68: [8-bit] Level ID
  level_id: byte(0x1b68),

  // 0x1b6b: [8-bit] Stage timer - subsecond frames
  // 0x1b6c: [8-bit] Stage timer - seconds
  timer_seconds: byte(0x1b6c),
  timer_frames:  byte(0x1b6b),

  // 0x1b4a: [8-bit] Player state
  //   0x00 = Grounded
  //   0x01 = Jump ascent
  //   0x02 = Jump descent (controlled)
  //   0x03 = Jump descent (uncontrolled) / falling
  //   0x04 = Death animation
  player_state: byte(0x1b4a),

  // 0x1b5d: [8-bit] Super Boy bounce state
  //   0x00 = Not bouncing
  //   0x01 = Bouncing off enemy/object
  bounce_state: byte(0x1b5d),

  // 0x1b67: [8-bit] Lives
  lives: byte(0x1b67),

  // 0x1b78: [8-bit] Powerup status
  //   0x00 = Small
  //   0x01 = Large
  //   0x02 = Fire
  //   0x03 = Invincible
  powerup_state: byte(0x1b78),
}
