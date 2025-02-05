import { byte, word, word_be } from '../../common/value.js';

// ---------------------------------------------------------------------------------------------------

export const ADDR = {
  // 0x003d: [8-bit] Camera x-axis offset in tiles
  // 0x003c: [8-bit] Camera y-axis offset in tiles
  camera_x: byte(0x003d),
  camera_y: byte(0x003c),
  

  // 0x03a3: [8-bit] Game state
  //   0x00 = Developer logos
  //   0x01 = Title screen
  //   0x02 = Attract mode demo
  //   0x03 = Number of players select
  //   0x04 = Character select
  //   0x05 = Level start
  //   0x06 = Gameplay active
  //   0x07 = Paused
  //   0x08 = Level complete
  //   0x09 = Dying
  //   0x0a = Game over
  //   0x0b = Continue screen
  //   0x0c = Ending and credits
  //   0x0d = Rest
  game_state: byte(0x03a3),

  // 0x03b7: [8-bit] World number
  world: byte(0x03b7),
  // 0x03b8: [8-bit] Stage number
  stage: byte(0x03b8),
  level: word_be(0x03b7),

  // 0x03bd: [8-bit] Player character
  //   0x00 = Koko
  //   0x01 = Suzi
  character: byte(0x03bd),

  // 0x0428: [8-bit] Lives
  lives: byte(0x0428),

  // 0x042e: [8-bit] Powerup level
  //   0x00 = Default
  //   0x01 = Boots
  //   0x02 = Wing
  powerup_level: byte(0x042e),

  // 0x0445: [24-bit BCD] Stage timer - Seconds remaining
  timer_100: byte(0x0445),
  timer_10:  byte(0x0446),
  timer_1:   byte(0x0447),
  // 0x0448: [8-bit] Stage timer - Subsecond frame counter
  timer_frames: byte(0x0448),

  // 0x0449: [8-bit] Keys remaining to complete level
  keys: byte(0x0449),

  // 0x044a: [16-bit] Player y-coordinate
  // 0x044c: [16-bit] Player x-coordinate
  player_x_coord: word(0x044c),
  player_y_coord: word(0x044a),

  // 0x045d: [8-bit] Slide state
  //   0x00 = Standing
  //   0x01 = Sliding
  slide_state: byte(0x045d),

  // 0x045e: [8-bit] Denotes steepness and direction of sloped terrain player character is standing on
  //   0x00 = Flat ground
  slope: byte(0x045e),

  // 0x04af: [27 bytes, 9 byte values] Data for items spawned by breaking blocks
  //   +0x00 [8-bit] Item type
  //   | 0x00 = (Empty)
  //   | 0x01 = Hourglass
  //   | 0x02 = Powerup
  //   | 0x03 = 1-Up
  //   | 0x80 = Object that plays poofing cloud animation once item collected
  //   +0x04 [16-bit] x-coordinate
  //   +0x06 [16-bit] y-coordinate
  //   +0x07 [8-bit] Despawn timer - coarse
  //   +0x08 [8-bit] Despawn timer - fine (counts down from 4 to 1, then resets and coarse timer is decremented)
  item_type: (n: number) => byte(0x04af + n * 9),

  // 0x0560: [256 bytes, 16-byte values] Enemy data array
  //   Each entry is a struct with the format:
  //   +0x00: y-coordinate (16-bit)
  //   +0x02: x-coordinate (16-bit)
  //   +0x04: Action state (8-bit)
  //   +0x0b: HP (8-bit)
  //   +0x0c: Death animation countdown (8-bit)
  //   | Takes a nonzero value when boss HP reaches 0, then counts down before boss death explosion
  //   | begins
  enemy_hp: (n: number) => byte(0x056b + n * 16),

  // 0x0564: [8-bit] Enemy action state - index 0
  //   Always holds boss action state for boss stages
  boss_action_state: byte(0x0564),
};

export enum GameState {
  BootLogos   = 0x00,
  TitleScreen = 0x01,
  AttractMode = 0x02,

  PlayersSelect   = 0x03,
  CharacterSelect = 0x04,
  
  StageStart = 0x05,
  Gameplay   = 0x06,
  Paused     = 0x07,
  StageClear = 0x08,
  Dead       = 0x09,
  GameOver   = 0x0A,
}

export enum SlideState {
  Standing = 0x00,
  Sliding  = 0x01,
}
