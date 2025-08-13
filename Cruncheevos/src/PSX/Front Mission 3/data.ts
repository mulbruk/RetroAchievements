import { byte, word, dword, lower4, bit0, bit1, bit2, bit4, bit5, bit6, bit7, bit3 } from "../../common/value.js";

// ---------------------------------------------------------------------------------------------------

export const ADDR = {
  igt: dword(0xf2990),

  network_flag: byte(0x0ea86c),
  overlay1: dword(0x14d020),
  overlay2: dword(0x159020),

  in_battle_data_ptr1: dword(0x0e59a0),
  in_battle_data_ptr2: dword(0x1225e0),
  // battle_actors_table: dword(0x1e3be0),

  scene_id: word(0xe59a6),
  progression_state: byte(0x124a0c),

  platinum_medals: byte(0x124ab8),
  gold_medals:     byte(0x124ab9),
  silver_medals:   byte(0x124aba),
  bronze_medals:   byte(0x124abb), 

  route: lower4(0x124cfc),

  money: dword(0x11e958),

  battle_state: word(0x1248d2),
  turn_number:  byte(0x124a8d),
  battle_phase: byte(0x1249ce),

  jose_pilot_hp: word(0x118c3a),
  li_pilot_hp:   word(0x118dae),

  // USN pilot battle skills ---
  emma_battle_skills:   (n: number) => byte(0x1186b4 + n),
  dennis_battle_skills: (n: number) => byte(0x11899c + n),
  yun_battle_skills:    (n: number) => byte(0x118b10 + n),
  jose_battle_skills:   (n: number) => byte(0x118c84 + n),
  li_battle_skills:     (n: number) => byte(0x118df8 + n),
  linny_battle_skills:  (n: number) => byte(0x118f6c + n),
  marcus_battle_skills: (n: number) => byte(0x1190e0 + n),
  // DHZ pilot battle skills ---
  alisa_battle_skills:  (n: number) => byte(0x119254 + n),
  liu_battle_skills:    (n: number) => byte(0x1193c8 + n),
  miho_battle_skills:   (n: number) => byte(0x11953c + n),
  pham_battle_skills:   (n: number) => byte(0x1196b0 + n),
  lan_battle_skills:    (n: number) => byte(0x119824 + n),
  mayer_battle_skills:  (n: number) => byte(0x119998 + n),
  

  twin_tiger_hunt_unread: bit2(0x124c78),
  twin_tiger_hunt_read:   bit3(0x124c78),

  unread_kazumi_kato:        bit0(0x124c64),
  unread_shoichi_furusawa:   bit2(0x124c64),
  unread_dai_sato:           bit4(0x124c64),
  unread_koji_yamada:        bit6(0x124c64),
  unread_yoshihisa_ushihisa: bit0(0x124c65),
  unread_takashi_kishi:      bit2(0x124c65),
  unread_kazushi_takahashi:  bit4(0x124c65),
  unread_kiyomi_yokohama:    bit6(0x124c65),

  bounty_kazumi_kato:        bit1(0x124c64),
  bounty_shoichi_furusawa:   bit3(0x124c64),
  bounty_dai_sato:           bit5(0x124c64),
  bounty_koji_yamada:        bit7(0x124c64),
  bounty_yoshihisa_ushihisa: bit1(0x124c65),
  bounty_takashi_kishi:      bit3(0x124c65),
  bounty_kazushi_takahashi:  bit5(0x124c65),
  bounty_kiyomi_yokohama:    bit7(0x124c65),

  miss_teihoku_unread: bit6(0x124c7f),
  miss_teihoku_read:   bit7(0x124c7f),

  woo_portrait_unread: bit6(0x124c67),
  woo_portrait_read:   bit7(0x124c67),
  woo_ufo_unread:      bit2(0x124c6a), 
  woo_ufo_read:        bit3(0x124c6a),

  simulator_training:    bit5(0x124d02),
  simulator_real_battle: bit6(0x124d02),

  sw_picaresque:       bit4(0x124d21),
  sw_kaleidoscope:     bit5(0x124d21),
  sw_restrex:          bit6(0x124d21),
  sw_code_security_21: bit7(0x124d21),
  sw_undercover:       bit0(0x124d22),
  sw_yahan_q:          bit1(0x124d22),
  sw_no_wait_lifting:  bit2(0x124d22),

  simulator_shin_ohgishima: bit1(0x124d25),
  simulator_taal_base:      bit2(0x124d25),
  simulator_taipei:         bit3(0x124d25),
  simulator_oil_field:      bit4(0x124d25),
  simulator_nanjing:        bit5(0x124d25),
  simulator_fukushima:      bit6(0x124d25),
}

const PILOT_BASE = 0x1182fc;
const PILOT_SIZE = 372;

export const PILOT = {
  base_addr: PILOT_BASE,
  data_size: PILOT_SIZE,

  computer: (n: number) => word(PILOT_BASE + PILOT_SIZE * n + 0x3c),

  affiliation: (n: number) => byte(PILOT_BASE + PILOT_SIZE * n + 0xae),

  battleSkill: (n: number, skillID: number) => byte(
    PILOT_BASE + PILOT_SIZE * n + 0xd0 + (skillID - 1)
  ),
}

const WANZER_BASE = 0x119d24;
const WANZER_SIZE = 620;

export const WANZER = {
  base_addr: WANZER_BASE,
  data_size: WANZER_SIZE,
}

// ---------------------------------------------------------------------------------------------------

const pilotIdentifiers = [
  { id: 0x01, name: "Kazuki Takemura" },
  { id: 0x02, name: "Emma Klamsky" },
  { id: 0x03, name: "Ryogo Kusama" },
  { id: 0x04, name: "Dennis Vicarth" },
  { id: 0x05, name: "Yun Lai Fa" },
  { id: 0x06, name: "Jose Astrada" },
  { id: 0x07, name: "Xiang Mei Li" },
  { id: 0x08, name: "Linny Barilar" },
  { id: 0x09, name: "Marcus Armstrong" },
  { id: 0x0A, name: "Alisa Takemura" },
  { id: 0x0B, name: "Hei Fong Liu" },
  { id: 0x0C, name: "Miho Shinjo" },
  { id: 0x0D, name: "Pham Luis" },
  { id: 0x0E, name: "Xiao Hua Lan" },
  { id: 0x0F, name: "Mayer Edward" },
  { id: 0x10, name: "Isao Takemura" },
] as const;

export type PilotID   = typeof pilotIdentifiers[number]['id'];
export type PilotName = typeof pilotIdentifiers[number]['name'];

// ---------------------------------------------------------------------------------------------------

export const pilotData: {id: PilotID, name: PilotName}[] = [
  { id: 0x01, name: "Kazuki Takemura" },
  { id: 0x02, name: "Emma Klamsky" },
  { id: 0x03, name: "Ryogo Kusama" },
  { id: 0x04, name: "Dennis Vicarth" },
  { id: 0x05, name: "Yun Lai Fa" },
  { id: 0x06, name: "Jose Astrada" },
  { id: 0x07, name: "Xiang Mei Li" },
  { id: 0x08, name: "Linny Barilar" },
  { id: 0x09, name: "Marcus Armstrong" },
  { id: 0x0A, name: "Alisa Takemura" },
  { id: 0x0B, name: "Hei Fong Liu" },
  { id: 0x0C, name: "Miho Shinjo" },
  { id: 0x0D, name: "Pham Luis" },
  { id: 0x0E, name: "Xiao Hua Lan" },
  { id: 0x0F, name: "Mayer Edward" },
  { id: 0x10, name: "Isao Takemura" },
] as const;

export const battleSkills: {id: number, skillName: string, partName: string, partType: 'Arm' | 'Body' | 'Legs'}[] = [
  {id: 0x01, skillName: 'Blackout',       partName: 'Mingtian 1',     partType: 'Legs' },
  {id: 0x02, skillName: 'Brace I',        partName: 'Kyojun Mk107',   partType: 'Legs' },
  {id: 0x03, skillName: 'Brace II',       partName: 'Tieqi 4',        partType: 'Legs' },
  {id: 0x04, skillName: 'Initiative I',   partName: 'Zenislev',       partType: 'Legs' },
  {id: 0x05, skillName: 'Initiative II',  partName: 'Zeros',          partType: 'Legs' },
  {id: 0x06, skillName: 'Initiative III', partName: 'Lenghe 1',       partType: 'Body' },
  {id: 0x07, skillName: 'AP-30%',         partName: 'Kasel M2',       partType: 'Legs' },
  {id: 0x08, skillName: 'AP-60%',         partName: 'Shunyo Mk111',   partType: 'Legs' },
  {id: 0x09, skillName: 'AP-0',           partName: 'Hoshun Mk112',   partType: 'Legs' },
  {id: 0x0A, skillName: 'Evade 1 Up',     partName: 'Zeros',          partType: 'Body' },
  {id: 0x0B, skillName: 'Evade 2 Up',     partName: 'Whisk',          partType: 'Legs' },
  {id: 0x0C, skillName: 'Evade-MAX',      partName: 'Shunwang 1',     partType: 'Legs' },
  {id: 0x0D, skillName: 'Def-C1 Up',      partName: 'Genie',          partType: 'Body' },
  {id: 0x0E, skillName: 'Def-C2 Up',      partName: 'Laiying Type 1', partType: 'Body' },
  {id: 0x0F, skillName: 'Def-CMAX',       partName: 'Mingtian 1',     partType: 'Body' },
  {id: 0x10, skillName: 'E-Def-C1 Down',  partName: 'Meledyne M1',    partType: 'Body' },
  {id: 0x11, skillName: 'E-Def-C2 Down',  partName: 'Tieqi 4',        partType: 'Body' },
  {id: 0x12, skillName: 'E-Def-C Nul',    partName: 'Whisk',          partType: 'Body' },
  {id: 0x13, skillName: 'E-Evade 1 Down', partName: 'Pare PAW1',      partType: 'Legs' },
  {id: 0x14, skillName: 'E-Evade 2 Down', partName: 'Vinedrai',       partType: 'Body' },
  {id: 0x15, skillName: 'E-Evade Nul',    partName: 'Shunwang 1',     partType: 'Body' },
  {id: 0x16, skillName: 'E-Acc1 Down',    partName: 'Pare PAW1',      partType: 'Body' },
  {id: 0x17, skillName: 'E-Acc2 Down',    partName: 'Wude 3',         partType: 'Body' },
  {id: 0x18, skillName: 'E-Acc Nul',      partName: 'Shangdi 1',      partType: 'Body' },
  {id: 0x19, skillName: 'E-Skill 1',      partName: 'Rekson M4F',     partType: 'Legs' },
  {id: 0x1A, skillName: 'E-Skill 2',      partName: 'Getty',          partType: 'Legs' },
  {id: 0x1B, skillName: 'E-Skill 3',      partName: 'Wude 3',         partType: 'Legs' },
  {id: 0x1C, skillName: 'Chaff',          partName: 'Drake M2C',      partType: 'Body' },
  {id: 0x1D, skillName: 'Guard-B',        partName: 'Prov PAW2',      partType: 'Legs' },
  {id: 0x1E, skillName: 'Avoid20',        partName: 'Tiandong 3',     partType: 'Legs' },
  {id: 0x1F, skillName: 'Avoid40',        partName: 'Lanze',          partType: 'Legs' },
  {id: 0x20, skillName: 'Avoid80',        partName: 'Yongsai 3',      partType: 'Legs' },
  {id: 0x21, skillName: 'DMGFix100',      partName: 'Kyokei Mk108',   partType: 'Legs' },
  {id: 0x22, skillName: 'DMGFix200',      partName: 'Qibing 0',       partType: 'Legs' },
  {id: 0x23, skillName: 'DMGFix400',      partName: 'Shunyo Mk111',   partType: 'Body' },
  {id: 0x24, skillName: 'Prvnt Loss',     partName: 'Enyo MK109',     partType: 'Legs' },
  {id: 0x25, skillName: 'Escape',         partName: 'Foura M12A',     partType: 'Legs' },
  {id: 0x26, skillName: 'AutoCountr',     partName: 'Genie',          partType: 'Legs' },
  {id: 0x27, skillName: 'Auto I',         partName: 'Enyo MK109',     partType: 'Body' },
  {id: 0x28, skillName: 'Auto II',        partName: 'Prov PAW2',      partType: 'Body' },
  {id: 0x29, skillName: 'Rvnge-Body',     partName: 'Hoshun Mk112',   partType: 'Body' },
  {id: 0x2A, skillName: 'Rvnge-Same',     partName: 'Shunyo Mk111',   partType: 'Arm' },
  {id: 0x2B, skillName: 'Revenge I',      partName: 'Jinyo Mk110',    partType: 'Body' },
  {id: 0x2C, skillName: 'Revenge II',     partName: 'Qibing 0',       partType: 'Body' },
  {id: 0x2D, skillName: 'Revenge III',    partName: 'Getty',          partType: 'Body' },
  {id: 0x2E, skillName: 'Dbl Punch I',    partName: 'Grapple M1',     partType: 'Arm' },
  {id: 0x2F, skillName: 'Dbl Punch II',   partName: 'Wude 3',         partType: 'Arm' },
  {id: 0x30, skillName: 'Dbl Shot I',     partName: 'Prov PAW2',      partType: 'Arm' },
  {id: 0x31, skillName: 'Dbl Shot II',    partName: 'Shangdi 1',      partType: 'Arm' },
  {id: 0x32, skillName: 'Dbl Assault',    partName: 'Zenislev',       partType: 'Body' },
  {id: 0x33, skillName: 'Salvo',          partName: 'Whisk',          partType: 'Arm' },
  {id: 0x34, skillName: 'Hard Knocks',    partName: 'Grezex',         partType: 'Legs' },
  {id: 0x35, skillName: 'Tackle I',       partName: 'Zenislev',       partType: 'Body' },
  {id: 0x36, skillName: 'Tackle II',      partName: 'Tiandong 3',     partType: 'Body' },
  {id: 0x37, skillName: 'Tackle III',     partName: 'Lanze',          partType: 'Body' },
  {id: 0x38, skillName: 'ShieldAtk I',    partName: 'Zeros',          partType: 'Arm' },
  {id: 0x39, skillName: 'ShieldAtk II',   partName: 'Lanze',          partType: 'Arm' },
  {id: 0x3A, skillName: 'ShieldAtk III',  partName: 'Lenghe 1',       partType: 'Arm' },
  {id: 0x3B, skillName: 'ROFUP I',        partName: 'Kyojun Mk107',   partType: 'Arm' },
  {id: 0x3C, skillName: 'ROFUP II',       partName: 'Jinyo Mk110',    partType: 'Arm' },
  {id: 0x3D, skillName: 'ROFUP III',      partName: 'Yongsai 3',      partType: 'Arm' },
  {id: 0x3E, skillName: 'Body Smash',     partName: 'Hoshun Mk112',   partType: 'Arm' },
  {id: 0x3F, skillName: 'Arm Smash',      partName: 'Foura M12A',     partType: 'Arm' },
  {id: 0x40, skillName: 'Leg Smash',      partName: 'Enyo MK109',     partType: 'Arm' },
  {id: 0x41, skillName: 'Rndm Smash',     partName: 'Mingtian 1',     partType: 'Arm' },
  {id: 0x42, skillName: 'Aim-Body',       partName: 'Shunwang 1',     partType: 'Arm' },
  {id: 0x43, skillName: 'Aim-Arm',        partName: 'Vinedrai',       partType: 'Arm' },
  {id: 0x44, skillName: 'Aim-Leg',        partName: 'Tieqi 4',        partType: 'Arm' },
  {id: 0x45, skillName: 'Aim',            partName: 'Grezex',         partType: 'Arm' },
  {id: 0x46, skillName: 'Skill+1 Up',     partName: 'Meledyne M1',    partType: 'Legs' },
  {id: 0x47, skillName: 'Skill+2 Up',     partName: 'Grapple M1',     partType: 'Legs' },
  {id: 0x48, skillName: 'Skill+3 Up',     partName: 'Laiying Type 1',  partType: 'Legs' },
  {id: 0x49, skillName: 'Melee I',        partName: 'Kyokei Mk108',   partType: 'Body' },
  {id: 0x4A, skillName: 'Melee II',       partName: 'Kasel M2',       partType: 'Body' },
  {id: 0x4B, skillName: 'Melee III',      partName: 'Grapple M1',     partType: 'Body' },
  {id: 0x4C, skillName: 'Hit or Miss',    partName: 'Kyokei Mk108',   partType: 'Arm' },
  {id: 0x4D, skillName: 'Zoom I',         partName: 'Kyojun Mk107',   partType: 'Body' },
  {id: 0x4E, skillName: 'Zoom II',        partName: 'Rekson M4F',     partType: 'Body' },
  {id: 0x4F, skillName: 'Zoom III',       partName: 'Grezex',         partType: 'Body' },
  {id: 0x50, skillName: 'Stun Punch',     partName: 'Kasel M2',       partType: 'Arm' },
  {id: 0x51, skillName: 'Panic Shot',     partName: 'Meledyne M1',    partType: 'Arm' },
  {id: 0x52, skillName: 'Eject Punch',    partName: 'Tiandong 3',     partType: 'Arm' },
  {id: 0x53, skillName: 'Pilot DMG I',    partName: 'Drake M2C',      partType: 'Arm' },
  {id: 0x54, skillName: 'Pilot DMG II',   partName: 'Laiying Type 1',  partType: 'Arm' },
  {id: 0x55, skillName: 'Pilot DMG III',  partName: 'Genie',          partType: 'Arm' },
  {id: 0x56, skillName: 'Fast Atk',       partName: 'Jinyo Mk110',    partType: 'Legs' },
  {id: 0x57, skillName: 'ToppleShot',     partName: 'Pare PAW1',      partType: 'Arm' },
  {id: 0x58, skillName: 'TopplePnch',     partName: 'Qibing 0',       partType: 'Arm' },
  {id: 0x59, skillName: 'Pilot Eject',    partName: 'Foura M12A',     partType: 'Body' },
  {id: 0x5A, skillName: 'EXPx2',          partName: 'Drake M2C',      partType: 'Legs' },
  {id: 0x5B, skillName: 'EXPx3',          partName: 'Shangdi 1',      partType: 'Legs' },
  {id: 0x5C, skillName: 'EXPx4',          partName: 'Vinedrai',       partType: 'Legs' },
  {id: 0x5D, skillName: 'BkupMelee',      partName: 'Yongsai 3',      partType: 'Body' },
  {id: 0x5E, skillName: 'BkupFire',       partName: 'Rekson M4F',     partType: 'Arm' },
  {id: 0x5F, skillName: 'Firingsquad',    partName: 'Getty',          partType: 'Arm' },
  {id: 0x60, skillName: 'GangBeating',    partName: 'Lenghe 1',       partType: 'Legs' },
];

