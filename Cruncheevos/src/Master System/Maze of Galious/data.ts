import {
  byte, word, dword, upper4, lower4,
  bit0, bit1, bit2, bit3, bit4, bit5, bit6, bit7,
}  from '../../common/value.js';

// ---------------------------------------------------------------------------------------------------

// export type WorldNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type WorldNumber = number;

export const ADDR = {
  // 0x0000: [16-bit] Game state
  //   0x0001 = Title screen
  //   0x0005 = Gameplay active
  //   0x0009 = Paused
  //   0x0102 = Attract mode demo
  //   0x010b = Item menu
  //   0x010c = Using magnifying glass
  //   0x0202 = Title screen story
  game_state:    byte(0x0000),
  game_substate: byte(0x0001),

  // 0x001b: [8-bit] Tablet ID
  tablet_id: byte(0x001b),

  // 0x0041: [8-bit] Map ID
  //   0x00 = Title screen
  //   0x01 = Castle
  //   0x02-0x0b = World (n - 1)
  map_id: byte(0x0041),

  // 0x0042: [8-bit] Screen ID
  //   Values get reused between worlds, need to pair with world ID
  screen_id: byte(0x0042),

  // 0x0046: [16-bit BCD] Subweapon ammo
  ammo:     word(0x0046),
  ammo_msb: byte(0x0047),
  ammo_lsb: byte(0x0046),

  // 0x0048: [16-bit BCD] Money
  money:     word(0x0048),
  money_msb: byte(0x0049),
  money_lsb: byte(0x0048),

  // 0x004a: [16-bit BCD] Keys
  keys:     word(0x004a),
  keys_msb: lower4(0x004b),
  keys_lsb: byte(0x004a),

  // 0x0050: [8-bit] Aphrodite EXP
  aphrodite_exp: byte(0x0050),
  // 0x0051: [8-bit] Aphrodite max EXP
  aphrodite_max_exp: byte(0x0051),
  // 0x0052: [8-bit] Aphrodite HP
  aphrodite_hp: byte(0x0052),
  // 0x0053: [8-bit] Aphrodite max HP
  aphrodite_max_hp: byte(0x0053),
  // 0x0054: [8-bit] Popolon EXP
  popolon_exp: byte(0x0054),
  // 0x0055: [8-bit] Popolon max EXP
  popolon_max_exp: byte(0x0055),
  // 0x0056: [8-bit] Popolon HP
  popolon_hp: byte(0x0056),
  // 0x0057: [8-bit] Popolon max HP
  popolon_max_hp: byte(0x0057),
  // 0x005e: [8-bit] Aphrodite HP refill/damage tick counter
  aphrodite_hp_ticks: byte(0x005e),
  // 0x0061: [8-bit] Popolon HP refill/damage tick counter
  popolon_hp_ticks: byte(0x0061),

  // 0x0063: [10 bytes, 8-bit values] World unlock flags
  //   Bit0 = Door unlocked (Great Key consumed)
  //   Bit1 = Great Key to unlock world in inventory
  //   Bit2 = Boss defeated
  //   Bit4 = Map
  //   Bit5 = Holy water
  //   Bit6 = Cape
  //   Bit7 = Magical rod
  world_unlocked:   (n: WorldNumber) => bit0(0x0063 + n - 1),
  world_have_key:   (n: WorldNumber) => bit1(0x0063 + n - 1),
  world_boss_dead:  (n: WorldNumber) => bit2(0x0063 + n - 1),
  world_have_map:   (n: WorldNumber) => bit4(0x0063 + n - 1),
  world_have_water: (n: WorldNumber) => bit5(0x0063 + n - 1),
  world_have_cape:  (n: WorldNumber) => bit6(0x0063 + n - 1),
  world_have_rod:   (n: WorldNumber) => bit7(0x0063 + n - 1),

  // 0x007a: [8-bit] Inventory flag - Cross
  inventory_cross: byte(0x007a),
  // 0x0082: [8-bit] Inventory flag - Robe
  inventory_robe: byte(0x0082),

  // 0x500: [8-bit] Player character status
  //   0x00 = Grounded
  //   0x01 = Jumping
  //   0x02 = Falling
  //   0x03 = On ladder
  //   0x04 = Knockback
  player_movement_state: byte(0x500),

  // 0x504: [8-bit] Player sprite x-coordinate
  player_x_coord: byte(0x504),
  // 0x505: [8-bit] Player sprite y-coordinate
  player_y_coord: byte(0x505),

  // 0x063d: [8-bit] Flag - Gets set when a fairy spawns
  fairy_flag: byte(0x063d),

  // 0x0690: [8-bit] God's shrine - scene ID
  shrine_id: byte(0x0690),
  // 0x0691: [8-bit] God's shrine - scene state
  shrine_state: byte(0x0691),

  // 0x0700: [8-bit] Boss ID
  boss_id: byte(0x0700),
  // 0x0701: [8-bit] Boss action state
  boss_action_state: byte(0x0701),

  // 0x0800: [8-bit] Enemy ID
  enemy_id: (n: number) => byte(0x0800 + n * 32),
  // 0x0810: [8-bit] Enemy HP
  enemy_hp: (n: number) => byte(0x0810 + n * 32),
}

export enum GameState {
  Boot          = 0x00,
  TitleScreen   = 0x01,
  AttractMode   = 0x02,
  GameStart     = 0x03,
  Gameplay      = 0x05,
  CharOut       = 0x06,
  GameOver      = 0x07,
  Paused        = 0x09,
  Transition    = 0x0a,
  ItemMenu      = 0x0b,
  ReadTablet    = 0x0c,
  DemeterShrine = 0x0e,
  BossStart     = 0x0f,
  Shrine        = 0x10,
  Ending        = 0x11,
  BossDefeat    = 0x13,
  GreatKey      = 0x14,
}
