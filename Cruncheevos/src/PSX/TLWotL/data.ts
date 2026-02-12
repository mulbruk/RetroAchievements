import { bit, bit0, bit1, bit2, bit3, bit4, bit5, bit6, bit7, byte, dword, dword_be, lower4, tbyte_be, upper4, word } from "../../common/value.js";

export const SYSTEM = {
  current_event: dword(0x0577b8),
  location_id:   dword(0x0577e0),
  event_id:      dword(0x0577e4),
  map_id:        dword(0x0577e8),
  progression:   dword(0x0578d4),
  event_replay:   bit4(0x05794b),

  month: dword(0x0577d4),
  day:   dword(0x0577d8),

  errands_enabled: bit1(0x5791e),
  errands_undertaken: (n: number) => {
    if (n < 0 || n > 95) { throw new Error('Errand index out of range'); }
    const offset = Math.floor(n / 2);
    return (n % 2 === 0) ? bit1(0x57978 + offset) : bit5(0x57978 + offset);
  },
  errands_completed: (n: number) => {
    if (n < 0 || n > 95) { throw new Error('Errand index out of range'); }
    const offset = Math.floor(n / 2);
    return (n % 2 === 0) ? bit2(0x57978 + offset) : bit6(0x57978 + offset);
  },

  artefact: (n: number) => {
    if (n < 1 || n > 31) { throw new Error('Artefact index out of range'); }
    const offset = Math.floor(n / 8);
    return bit(n % 8)(0x057970 + offset);
  },
  wonder: (n: number) => {
    if (n < 0 || n > 15) { throw new Error('Wonder index out of range'); }
    const offset = Math.floor(n / 8);
    return bit(n % 8)(0x057976 + offset);
  },

  scriptures: bit0(0x057974),
  auracite: (n: number) => {
    if (n < 0 || n > 12) { throw new Error('Auracite index out of range'); }
    const m = n + 3;
    const offset = Math.floor(m / 8);
    return bit(m % 8)(0x57974 + offset);
  },
  

  buried_treasure: (map: number, n: number) => {
    if (map < 0x00 || map > 0x7f) { throw new Error('Map index out of range'); }
    if (n < 0 || n > 3)           { throw new Error('Buried treasure index out of range'); }

    const interByteOffset = Math.floor(map / 2);
    const intraByteOffset = map % 2 === 0 ? 4 : 0;

    const bitIndex = intraByteOffset + n % 4;

    return bit(bitIndex)(0x059414 + interByteOffset);
  },

  difficulty: byte(0x0578ce),

  world_map_overlay: dword_be(0x0e0000),

  battle_active: byte(0x0e4e8c),

  active_unit_index: dword(0x096118),
};

export const SOUND_NOVELS = {
  germonique_page: word(0x059688),

  mesas_musings_page: word(0x0595a2),
  mesas_musings_fuel: word(0x0595c8),

  nanais_histories_page:  word(0x0595da),
  nanais_histories_chips: word(0x059600),

  // TODO Oeilvert
}

export const EVENT_FLAGS = {
  midlights_deep_floors: dword(0x0578b0),
  serpentarius:          bit7(0x057975),

  poachers_den_enabled:  bit0(0x05791e),
  errands_enabled:       bit1(0x05791e),
  bonus_content_enabled: bit2(0x05791e),
  chapter_4_started:     bit4(0x05791e),
  midlights_deep_exit:   bit5(0x05791e),
  activate_construct_8:  bit2(0x05791f),
  ending_funeral:        bit0(0x057920),

  save_argath:   bit6(0x05791e),
  save_boco:     bit7(0x05791e),
  save_mustadio: bit0(0x05791f),

  purchased_flower:        bit1(0x057920),
  cloud_battle:            bit3(0x057920),
  gollund_colliery:        bit1(0x057921),
  nelveska_temple:         bit3(0x057921),
  restored_reis_to_human:  bit4(0x057921),
  cletienne_dorter_battle: bit0(0x057922),
  lionel_liege_lord:       bit3(0x057922),
  disorder_in_the_order:   bit5(0x057922),
  agrias_birthday:         bit6(0x057922),
  balthier_battle:         bit0(0x057923),

  mirror_match_rank_1 : bit0(0x057926),
  mirror_match_rank_2 : bit1(0x057926),
  mirror_match_rank_3 : bit2(0x057926),
  mirror_match_rank_4 : bit3(0x057926),
};

export const ENEMY = {
  identity: (n: number) => {
    if (n < 0 || n > 15) { throw new Error('Enemy unit index out of range'); }
    return bit5(0x1908cc + n * 0x1c0 + 0x000);
  },

  hp: (n: number) => {
    if (n < 0 || n > 15) { throw new Error('Enemy unit index out of range'); }
    return word(0x1908cc + n * 0x1c0 + 0x28);
  },

  enticed: (n: number) => {
    if (n < 0 || n > 15) { throw new Error('Enemy unit index out of range'); }
    return bit6(0x1908cc + n * 0x1c0 + 0x59);
  },

  is_turn: (n: number) => {
    if (n < 0 || n > 15) { throw new Error('Enemy unit index out of range'); }
    return bit0(0x1908cc + n * 0x1c0 + 0x186);
  },

  poached: (n: number) => {
    if (n < 0 || n > 15) { throw new Error('Enemy unit index out of range'); }
    return bit5(0x1908cc + n * 0x1c0 + 0x19c);
  },
}

export const PLAYER = {
  is_toad: (n: number) => {
    if (n < 0 || n > 4) { throw new Error('Player unit index out of range'); }
    return bit1(0x1924cc + n * 0x1c0 + 0x05a);
  },
  
  skillset_used: (n: number) => {
    if (n < 0 || n > 4) { throw new Error('Player unit index out of range'); }
    return byte(0x1924cc + n * 0x1c0 + 0x16f);
  },
  ability_used: (n: number) => {
    if (n < 0 || n > 4) { throw new Error('Player unit index out of range'); }
    return byte(0x1924cc + n * 0x1c0 + 0x170);
  },
  
  is_turn: (n: number) => {
    if (n < 0 || n > 4) { throw new Error('Player unit index out of range'); }
    return bit0(0x1924cc + n * 0x1c0 + 0x186);
  },
  movement_taken: (n: number) => {
    if (n < 0 || n > 4) { throw new Error('Player unit index out of range'); }
    return bit0(0x1924cc + n * 0x1c0 + 0x187);
  },
  action_taken: (n: number) => {
    if (n < 0 || n > 4) { throw new Error('Player unit index out of range'); }
    return bit0(0x1924cc + n * 0x1c0 + 0x188);
  },

  level_down: (n: number) => {
    if (n < 0 || n > 4) { throw new Error('Player unit index out of range'); }
    return bit0(0x1924cc + n * 0x1c0 + 0x19d);
  },
};

export enum Job {
  Base          = 0,

  Squire        = 0,
  Chemist       = 1,
  Knight        = 2,
  Archer        = 3,
  Monk          = 4,
  WhiteMage     = 5,
  BlackMage     = 6,
  TimeMage      = 7,
  Summoner      = 8,
  Thief         = 9,
  Orator        = 10,
  Mystic        = 11,
  Geomancer     = 12,
  Dragoon       = 13,
  Samurai       = 14,
  Ninja         = 15,
  Arithmetician = 16,
  Bard          = 17,
  Dancer        = 18,
  Mime          = 19,

  DarkKnightF   = 17,
  DarkKnightM   = 18,
}

const UNIT_SIZE = 0x100;
export const UNITS = {
  identity: (n: number) => {
    if (n < 0 || n > 19) { throw new Error('Character index out of range'); }
    return byte(0x57f74 + n * UNIT_SIZE);
  },
  name_id: (n: number) => {
    if (n < 0 || n > 19) { throw new Error('Character index out of range'); }
    return word(0x058042 + n * UNIT_SIZE);
  },
  is_monster: (n: number) => {
    if (n < 0 || n > 19) { throw new Error('Character index out of range'); }
    return bit5(0x057f78 + n * UNIT_SIZE);
  },
  is_female: (n: number) => {
    if (n < 0 || n > 19) { throw new Error('Character index out of range'); }
    return bit6(0x057f78 + n * UNIT_SIZE);
  },
  is_male: (n: number) => {
    if (n < 0 || n > 19) { throw new Error('Character index out of range'); }
    return bit7(0x057f78 + n * UNIT_SIZE);
  },

  job: (n: number) => {
    if (n < 0 || n > 19) { throw new Error('Character index out of range'); }
    return byte(0x057f76 + n * UNIT_SIZE);
  },
  secondary_job: (n: number) => {
    if (n < 0 || n > 19) { throw new Error('Character index out of range'); }
    return byte(0x057f7b + n * UNIT_SIZE);
  },
  reaction_ability: (n: number) => {
    if (n < 0 || n > 19) { throw new Error('Character index out of range'); }
    return word(0x057f7c + n * UNIT_SIZE);
  },
  support_ability: (n: number) => {
    if (n < 0 || n > 19) { throw new Error('Character index out of range'); }
    return word(0x057f7e + n * UNIT_SIZE);
  },
  movement_ability: (n: number) => {
    if (n < 0 || n > 19) { throw new Error('Character index out of range'); }
    return word(0x057f80 + n * UNIT_SIZE);
  },

  level: (n: number) => {
    if (n < 0 || n > 19) { throw new Error('Character index out of range'); }
    return byte(0x057f8a + n * UNIT_SIZE);
  },
  brave: (n: number) => {
    if (n < 0 || n > 19) { throw new Error('Character index out of range'); }
    return byte(0x057f8b + n * UNIT_SIZE);
  },
  faith: (n: number) => {
    if (n < 0 || n > 19) { throw new Error('Character index out of range'); }
    return byte(0x057f8c + n * UNIT_SIZE);
  },

  unlocked_skills: (n: number, job: Job) => {
    if (n < 0 || n > 19) { throw new Error('Character index out of range'); }
    return tbyte_be(0x057f9f + n * UNIT_SIZE + job * 3);
  },
  job_level: (n: number, job: Job) => {
    if (n < 0 || n > 19) { throw new Error('Character index out of range'); }
    const offset = Math.floor(job / 2);
    const accessor = (job % 2 === 0) ? upper4 : lower4;
    return accessor(0x057fa3 + n * UNIT_SIZE + offset);
  },
};

const BATTLE_UNIT_SIZE = 0x1C0;
export const PLAYER_UNITS = {
  identity: (n: number) => {
    if (n < 0 || n > 4) { throw new Error('Character index out of range'); }
    return byte(0x19284c + n * BATTLE_UNIT_SIZE);
  },
  name_id: (n: number) => {
    if (n < 0 || n > 4) { throw new Error('Character index out of range'); }
    return word(0x1929b8 + n * BATTLE_UNIT_SIZE);
  },
  is_monster: (n: number) => {
    if (n < 0 || n > 4) { throw new Error('Character index out of range'); }
    return bit5(0x192852 + n * BATTLE_UNIT_SIZE);
  },
  is_female: (n: number) => {
    if (n < 0 || n > 4) { throw new Error('Character index out of range'); }
    return bit6(0x192852 + n * BATTLE_UNIT_SIZE);
  },
  is_male: (n: number) => {
    if (n < 0 || n > 4) { throw new Error('Character index out of range'); }
    return bit7(0x192852 + n * BATTLE_UNIT_SIZE);
  },

  job: (n: number) => {
    if (n < 0 || n > 4) { throw new Error('Character index out of range'); }
    return byte(0x19284f + n * BATTLE_UNIT_SIZE);
  },
  secondary_job: (n: number) => {
    if (n < 0 || n > 4) { throw new Error('Character index out of range'); }
    return byte(0x19285f + n * BATTLE_UNIT_SIZE);
  },
  reaction_ability: (n: number) => {
    if (n < 0 || n > 4) { throw new Error('Character index out of range'); }
    return word(0x192860 + n * BATTLE_UNIT_SIZE);
  },
  support_ability: (n: number) => {
    if (n < 0 || n > 4) { throw new Error('Character index out of range'); }
    return word(0x192862 + n * BATTLE_UNIT_SIZE);
  },
  movement_ability: (n: number) => {
    if (n < 0 || n > 4) { throw new Error('Character index out of range'); }
    return word(0x192864 + n * BATTLE_UNIT_SIZE);
  },

  level: (n: number) => {
    if (n < 0 || n > 4) { throw new Error('Character index out of range'); }
    return byte(0x19286e + n * BATTLE_UNIT_SIZE);
  },
  original_brave: (n: number) => {
    if (n < 0 || n > 4) { throw new Error('Character index out of range'); }
    return byte(0x19286f + n * BATTLE_UNIT_SIZE);
  },
  modified_brave: (n: number) => {
    if (n < 0 || n > 4) { throw new Error('Character index out of range'); }
    return byte(0x192870 + n * BATTLE_UNIT_SIZE);
  },
  original_faith: (n: number) => {
    if (n < 0 || n > 4) { throw new Error('Character index out of range'); }
    return byte(0x192871 + n * BATTLE_UNIT_SIZE);
  },
  modified_faith: (n: number) => {
    if (n < 0 || n > 4) { throw new Error('Character index out of range'); }
    return byte(0x192872 + n * BATTLE_UNIT_SIZE);
  },

  x_coord: (n: number) => {
    if (n < 0 || n > 4) { throw new Error('Character index out of range'); }
    return byte(0x192893 + n * BATTLE_UNIT_SIZE);
  },
  y_coord: (n: number) => {
    if (n < 0 || n > 4) { throw new Error('Character index out of range'); }
    return byte(0x192894 + n * BATTLE_UNIT_SIZE);
  },
  facing: (n: number) => {
    if (n < 0 || n > 4) { throw new Error('Character index out of range'); }
    return lower4(0x192895 + n * BATTLE_UNIT_SIZE);
  },

  unlocked_skills: (n: number, job: Job) => {
    if (n < 0 || n > 19) { throw new Error('Character index out of range'); }
    return tbyte_be(0x1928e5 + n * UNIT_SIZE + job * 3);
  },
  job_level: (n: number, job: Job) => {
    if (n < 0 || n > 19) { throw new Error('Character index out of range'); }
    const offset = Math.floor(job / 2);
    const accessor = (job % 2 === 0) ? upper4 : lower4;
    return accessor(0x19291e + n * UNIT_SIZE + offset);
  },
}
