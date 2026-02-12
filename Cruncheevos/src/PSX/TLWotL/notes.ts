import { codeNote } from "../../common/notes.js";
import { range }    from "../../common/util.js";

function generateUnitRosterNotes() {
  const baseAddress = 0x57f74;

  const rosterNotes = range(1, 20).flatMap((n) => [
    codeNote(baseAddress + n * 0x100 + 0x00,  `[8-bit] Unit roster slot ${n + 1} - Character identity\\r\\n(see 0x57f74 for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0x01,  `[8-bit] Unit roster slot ${n + 1} - Party ID`),
    codeNote(baseAddress + n * 0x100 + 0x02,  `[8-bit] Unit roster slot ${n + 1} - Job ID\\r\\n(see 0x57f76 for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0x03,  `[8-bit] Unit roster slot ${n + 1} - Palette`),
    codeNote(baseAddress + n * 0x100 + 0x04,  `[8-bit] Unit roster slot ${n + 1} - Gender\\r\\nBit5 = Monster\\r\\nBit6 = Female\\r\\nBit7 = Male`),
    codeNote(baseAddress + n * 0x100 + 0x05, `[16-bit] Unit roster slot ${n + 1} - Birthday & Zodiac sign`),
    codeNote(baseAddress + n * 0x100 + 0x07,  `[8-bit] Unit roster slot ${n + 1} - Secondary skillset\\r\\n(see 0x57f7b for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0x08, `[16-bit] Unit roster slot ${n + 1} - Reaction ability\\r\\n(see 0x57f7c for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0x0a, `[16-bit] Unit roster slot ${n + 1} - Support ability\\r\\n(see 0x57f7e for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0x0c, `[16-bit] Unit roster slot ${n + 1} - Movement ability\\r\\n(see 0x57f80 for list of values)`),
    
    codeNote(baseAddress + n * 0x100 + 0x0e,  `[8-bit] Unit roster slot ${n + 1} - Equip slot: head\\r\\n(see 0x57f82 for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0x0f,  `[8-bit] Unit roster slot ${n + 1} - Equip slot: body\\r\\n(see 0x57f83 for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0x10,  `[8-bit] Unit roster slot ${n + 1} - Equip slot: accessory\\r\\n(see 0x57f84 for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0x11,  `[8-bit] Unit roster slot ${n + 1} - Equip slot: right-hand weapon\\r\\n(see 0x57f85 for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0x12,  `[8-bit] Unit roster slot ${n + 1} - Equip slot: right-hand shield\\r\\n(see 0x57f86 for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0x13,  `[8-bit] Unit roster slot ${n + 1} - Equip slot: left-hand weapon\\r\\n(see 0x57f87 for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0x14,  `[8-bit] Unit roster slot ${n + 1} - Equip slot: left-hand shield\\r\\n(see 0x57f88 for list of values)`),
    
    codeNote(baseAddress + n * 0x100 + 0x15,  `[8-bit] Unit roster slot ${n + 1} - EXP`),
    codeNote(baseAddress + n * 0x100 + 0x16,  `[8-bit] Unit roster slot ${n + 1} - Level`),
    codeNote(baseAddress + n * 0x100 + 0x17,  `[8-bit] Unit roster slot ${n + 1} - Bravery`),
    codeNote(baseAddress + n * 0x100 + 0x18,  `[8-bit] Unit roster slot ${n + 1} - Faith`),
    codeNote(baseAddress + n * 0x100 + 0x19, `[24-bit] Unit roster slot ${n + 1} - Raw HP`),
    codeNote(baseAddress + n * 0x100 + 0x1c, `[24-bit] Unit roster slot ${n + 1} - Raw MP`),
    codeNote(baseAddress + n * 0x100 + 0x1f, `[24-bit] Unit roster slot ${n + 1} - Raw SP`),
    codeNote(baseAddress + n * 0x100 + 0x22, `[24-bit] Unit roster slot ${n + 1} - Raw PA`),
    codeNote(baseAddress + n * 0x100 + 0x25, `[24-bit] Unit roster slot ${n + 1} - Raw MA`),
    
    codeNote(baseAddress + n * 0x100 + 0x28,  `[8-bit] Unit roster slot ${n + 1} - Unlocked jobs (1/3)\\r\\n(see 0x57f9c for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0x29,  `[8-bit] Unit roster slot ${n + 1} - Unlocked jobs (2/3)\\r\\n(see 0x57f9d for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0x2a,  `[8-bit] Unit roster slot ${n + 1} - Unlocked jobs (3/3)\\r\\n(see 0x57f9e for list of values)`),

    codeNote(baseAddress + n * 0x100 + 0x2b,  `[8-bit] Unit roster slot ${n + 1} - Base job action abilities unlocked (1/2)\\r\\n(see 0x57f9f for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0x2c,  `[8-bit] Unit roster slot ${n + 1} - Base job action abilities unlocked (2/2)\\r\\n(see 0x57fa0 for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0x2d,  `[8-bit] Unit roster slot ${n + 1} - Base job R/S/M abilities unlocked\\r\\n(see 0x57fa1 for list of values)`),

    codeNote(baseAddress + n * 0x100 + 0x2e,  `[8-bit] Unit roster slot ${n + 1} - Chemist action abilities unlocked (1/2)\\r\\n(see 0x57fa2 for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0x2f,  `[8-bit] Unit roster slot ${n + 1} - Chemist action abilities unlocked (2/2)\\r\\n(see 0x57fa3 for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0x30,  `[8-bit] Unit roster slot ${n + 1} - Chemist R/S/M abilities unlocked\\r\\n(see 0x57fa4 for list of values)`),

    codeNote(baseAddress + n * 0x100 + 0x31,  `[8-bit] Unit roster slot ${n + 1} - Knight action abilities unlocked (1/2)\\r\\n(see 0x57fa5 for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0x32,  `[8-bit] Unit roster slot ${n + 1} - Knight action abilities unlocked (2/2)\\r\\n(see 0x57fa6 for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0x33,  `[8-bit] Unit roster slot ${n + 1} - Knight R/S/M abilities unlocked\\r\\n(see 0x57fa7 for list of values)`),

    codeNote(baseAddress + n * 0x100 + 0x34,  `[8-bit] Unit roster slot ${n + 1} - Archer action abilities unlocked (1/2)\\r\\n(see 0x57fa8 for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0x35,  `[8-bit] Unit roster slot ${n + 1} - Archer action abilities unlocked (2/2)\\r\\n(see 0x57fa9 for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0x36,  `[8-bit] Unit roster slot ${n + 1} - Archer R/S/M abilities unlocked\\r\\n(see 0x57faa for list of values)`),

    codeNote(baseAddress + n * 0x100 + 0x37,  `[8-bit] Unit roster slot ${n + 1} - Monk action abilities unlocked (1/2)\\r\\n(see 0x57fab for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0x38,  `[8-bit] Unit roster slot ${n + 1} - Monk action abilities unlocked (2/2)\\r\\n(see 0x57fac for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0x39,  `[8-bit] Unit roster slot ${n + 1} - Monk R/S/M abilities unlocked\\r\\n(see 0x57fad for list of values)`),

    codeNote(baseAddress + n * 0x100 + 0x3a,  `[8-bit] Unit roster slot ${n + 1} - White Mage action abilities unlocked (1/2)\\r\\n(see 0x57fae for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0x3b,  `[8-bit] Unit roster slot ${n + 1} - White Mage action abilities unlocked (2/2)\\r\\n(see 0x57faf for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0x3c,  `[8-bit] Unit roster slot ${n + 1} - White Mage R/S/M abilities unlocked\\r\\n(see 0x57fb0 for list of values)`),
    
    codeNote(baseAddress + n * 0x100 + 0x3d,  `[8-bit] Unit roster slot ${n + 1} - Black Mage action abilities unlocked (1/2)\\r\\n(see 0x57fb1 for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0x3e,  `[8-bit] Unit roster slot ${n + 1} - Black Mage action abilities unlocked (2/2)\\r\\n(see 0x57fb2 for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0x3f,  `[8-bit] Unit roster slot ${n + 1} - Black Mage R/S/M abilities unlocked\\r\\n(see 0x57fb3 for list of values)`),
    
    codeNote(baseAddress + n * 0x100 + 0x40,  `[8-bit] Unit roster slot ${n + 1} - Time Mage action abilities unlocked (1/2)\\r\\n(see 0x57fb4 for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0x41,  `[8-bit] Unit roster slot ${n + 1} - Time Mage action abilities unlocked (2/2)\\r\\n(see 0x57fb5 for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0x42,  `[8-bit] Unit roster slot ${n + 1} - Time Mage R/S/M abilities unlocked\\r\\n(see 0x57fb6 for list of values)`),
    
    codeNote(baseAddress + n * 0x100 + 0x43,  `[8-bit] Unit roster slot ${n + 1} - Summoner action abilities unlocked (1/2)\\r\\n(see 0x57fb7 for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0x44,  `[8-bit] Unit roster slot ${n + 1} - Summoner action abilities unlocked (2/2)\\r\\n(see 0x57fb8 for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0x45,  `[8-bit] Unit roster slot ${n + 1} - Summoner R/S/M abilities unlocked\\r\\n(see 0x57fb9 for list of values)`),
    
    codeNote(baseAddress + n * 0x100 + 0x46,  `[8-bit] Unit roster slot ${n + 1} - Thief action abilities unlocked (1/2)\\r\\n(see 0x57fba for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0x47,  `[8-bit] Unit roster slot ${n + 1} - Thief action abilities unlocked (2/2)\\r\\n(see 0x57fbb for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0x48,  `[8-bit] Unit roster slot ${n + 1} - Thief R/S/M abilities unlocked\\r\\n(see 0x57fbc for list of values)`),

    codeNote(baseAddress + n * 0x100 + 0x49,  `[8-bit] Unit roster slot ${n + 1} - Orator action abilities unlocked (1/2)\\r\\n(see 0x57fbd for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0x4a,  `[8-bit] Unit roster slot ${n + 1} - Orator action abilities unlocked (2/2)\\r\\n(see 0x57fbe for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0x4b,  `[8-bit] Unit roster slot ${n + 1} - Orator R/S/M abilities unlocked\\r\\n(see 0x57fbf for list of values)`),
    
    codeNote(baseAddress + n * 0x100 + 0x4c,  `[8-bit] Unit roster slot ${n + 1} - Mystic action abilities unlocked (1/2)\\r\\n(see 0x57fc0 for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0x4d,  `[8-bit] Unit roster slot ${n + 1} - Mystic action abilities unlocked (2/2)\\r\\n(see 0x57fc1 for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0x4e,  `[8-bit] Unit roster slot ${n + 1} - Mystic R/S/M abilities unlocked\\r\\n(see 0x57fc2 for list of values)`),
  
    codeNote(baseAddress + n * 0x100 + 0x4f,  `[8-bit] Unit roster slot ${n + 1} - Geomancer action abilities unlocked (1/2)\\r\\n(see 0x57fc3 for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0x50,  `[8-bit] Unit roster slot ${n + 1} - Geomancer action abilities unlocked (2/2)\\r\\n(see 0x57fc4 for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0x51,  `[8-bit] Unit roster slot ${n + 1} - Geomancer R/S/M abilities unlocked\\r\\n(see 0x57fc5 for list of values)`),

    codeNote(baseAddress + n * 0x100 + 0x52,  `[8-bit] Unit roster slot ${n + 1} - Dragoon action abilities unlocked (1/2)\\r\\n(see 0x57fc6 for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0x53,  `[8-bit] Unit roster slot ${n + 1} - Dragoon action abilities unlocked (2/2)\\r\\n(see 0x57fc7 for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0x54,  `[8-bit] Unit roster slot ${n + 1} - Dragoon R/S/M abilities unlocked\\r\\n(see 0x57fc8 for list of values)`),

    codeNote(baseAddress + n * 0x100 + 0x55,  `[8-bit] Unit roster slot ${n + 1} - Samurai action abilities unlocked (1/2)\\r\\n(see 0x57fc9 for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0x56,  `[8-bit] Unit roster slot ${n + 1} - Samurai action abilities unlocked (2/2)\\r\\n(see 0x57fca for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0x57,  `[8-bit] Unit roster slot ${n + 1} - Samurai R/S/M abilities unlocked\\r\\n(see 0x57fcb for list of values)`),

    codeNote(baseAddress + n * 0x100 + 0x58,  `[8-bit] Unit roster slot ${n + 1} - Ninja action abilities unlocked (1/2)\\r\\n(see 0x57fcc for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0x59,  `[8-bit] Unit roster slot ${n + 1} - Ninja action abilities unlocked (2/2)\\r\\n(see 0x57fcd for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0x5a,  `[8-bit] Unit roster slot ${n + 1} - Ninja R/S/M abilities unlocked\\r\\n(see 0x57fce for list of values)`),
    
    codeNote(baseAddress + n * 0x100 + 0x5b,  `[8-bit] Unit roster slot ${n + 1} - Arithmetician action abilities unlocked (1/2)\\r\\n(see 0x57fcf for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0x5c,  `[8-bit] Unit roster slot ${n + 1} - Arithmetician action abilities unlocked (2/2)\\r\\n(see 0x57fd0 for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0x5d,  `[8-bit] Unit roster slot ${n + 1} - Arithmetician R/S/M abilities unlocked\\r\\n(see 0x57fd1 for list of values)`),
    
    codeNote(baseAddress + n * 0x100 + 0x5e,  `[8-bit] Unit roster slot ${n + 1} - Dark Knight (F) / Bard action abilities unlocked (1/2)\\r\\n(see 0x57fd2 for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0x5f,  `[8-bit] Unit roster slot ${n + 1} - Dark Knight (F) / Bard action abilities unlocked (2/2)\\r\\n(see 0x57fd3 for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0x60,  `[8-bit] Unit roster slot ${n + 1} - Dark Knight (F) / Bard R/S/M abilities unlocked\\r\\n(see 0x57fd4 for list of values)`),

    codeNote(baseAddress + n * 0x100 + 0x61,  `[8-bit] Unit roster slot ${n + 1} - Dancer / Dark Knight (M) action abilities unlocked (1/2)\\r\\n(see 0x57fd5 for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0x62,  `[8-bit] Unit roster slot ${n + 1} - Dancer / Dark Knight (M) action abilities unlocked (2/2)\\r\\n(see 0x57fd6 for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0x63,  `[8-bit] Unit roster slot ${n + 1} - Dancer / Dark Knight (M) R/S/M abilities unlocked\\r\\n(see 0x57fd7 for list of values)`),

    codeNote(baseAddress + n * 0x100 + 0x64,  `[Lower4] Unit roster slot ${n + 1} - [Upper4] Base job level\\r\\n[Lower4] Chemist job level`),
    codeNote(baseAddress + n * 0x100 + 0x65,  `[Lower4] Unit roster slot ${n + 1} - [Upper4] Knight job level\\r\\n[Lower4] Archer job level`),
    codeNote(baseAddress + n * 0x100 + 0x66,  `[Lower4] Unit roster slot ${n + 1} - [Upper4] Monk job level\\r\\n[Lower4] White Mage job level`),
    codeNote(baseAddress + n * 0x100 + 0x67,  `[Lower4] Unit roster slot ${n + 1} - [Upper4] Black Mage job level\\r\\n[Lower4] Time Mage job level`),
    codeNote(baseAddress + n * 0x100 + 0x68,  `[Lower4] Unit roster slot ${n + 1} - [Upper4] Summoner job level\\r\\n[Lower4] Thief job level`),
    codeNote(baseAddress + n * 0x100 + 0x69,  `[Lower4] Unit roster slot ${n + 1} - [Upper4] Orator job level\\r\\n[Lower4] Mystic job level`),
    codeNote(baseAddress + n * 0x100 + 0x6a,  `[Lower4] Unit roster slot ${n + 1} - [Upper4] Geomancer job level\\r\\n[Lower4] Dragoon job level`),
    codeNote(baseAddress + n * 0x100 + 0x6b,  `[Lower4] Unit roster slot ${n + 1} - [Upper4] Samurai job level\\r\\n[Lower4] Ninja job level`),
    codeNote(baseAddress + n * 0x100 + 0x6c,  `[Lower4] Unit roster slot ${n + 1} - [Upper4] Arithmetician level\\r\\n[Lower4] Dark Knight (F) / Bard job level`),
    codeNote(baseAddress + n * 0x100 + 0x6d,  `[Lower4] Unit roster slot ${n + 1} - [Upper4] Dancer / Dark Knight (M) level\\r\\n[Lower4] Mime job level`),

    codeNote(baseAddress + n * 0x100 + 0x6e, `[16-bit] Unit roster slot ${n + 1} - Available JP - Base job`),
    codeNote(baseAddress + n * 0x100 + 0x70, `[16-bit] Unit roster slot ${n + 1} - Available JP - Chemist`),
    codeNote(baseAddress + n * 0x100 + 0x72, `[16-bit] Unit roster slot ${n + 1} - Available JP - Knight`),
    codeNote(baseAddress + n * 0x100 + 0x74, `[16-bit] Unit roster slot ${n + 1} - Available JP - Archer`),
    codeNote(baseAddress + n * 0x100 + 0x76, `[16-bit] Unit roster slot ${n + 1} - Available JP - Monk`),
    codeNote(baseAddress + n * 0x100 + 0x78, `[16-bit] Unit roster slot ${n + 1} - Available JP - White Mage`),
    codeNote(baseAddress + n * 0x100 + 0x7a, `[16-bit] Unit roster slot ${n + 1} - Available JP - Black Mage`),
    codeNote(baseAddress + n * 0x100 + 0x7c, `[16-bit] Unit roster slot ${n + 1} - Available JP - Time Mage`),
    codeNote(baseAddress + n * 0x100 + 0x7e, `[16-bit] Unit roster slot ${n + 1} - Available JP - Summoner`),
    codeNote(baseAddress + n * 0x100 + 0x80, `[16-bit] Unit roster slot ${n + 1} - Available JP - Thief`),
    codeNote(baseAddress + n * 0x100 + 0x82, `[16-bit] Unit roster slot ${n + 1} - Available JP - Orator`),
    codeNote(baseAddress + n * 0x100 + 0x84, `[16-bit] Unit roster slot ${n + 1} - Available JP - Mystic`),
    codeNote(baseAddress + n * 0x100 + 0x86, `[16-bit] Unit roster slot ${n + 1} - Available JP - Geomancer`),
    codeNote(baseAddress + n * 0x100 + 0x88, `[16-bit] Unit roster slot ${n + 1} - Available JP - Dragoon`),
    codeNote(baseAddress + n * 0x100 + 0x8a, `[16-bit] Unit roster slot ${n + 1} - Available JP - Samurai`),
    codeNote(baseAddress + n * 0x100 + 0x8c, `[16-bit] Unit roster slot ${n + 1} - Available JP - Ninja`),
    codeNote(baseAddress + n * 0x100 + 0x8e, `[16-bit] Unit roster slot ${n + 1} - Available JP - Arithmetician`),
    codeNote(baseAddress + n * 0x100 + 0x90, `[16-bit] Unit roster slot ${n + 1} - Available JP - Dark Knight (F) / Bard`),
    codeNote(baseAddress + n * 0x100 + 0x92, `[16-bit] Unit roster slot ${n + 1} - Available JP - Dancer / Dark Knight (M)`),
    codeNote(baseAddress + n * 0x100 + 0x94, `[16-bit] Unit roster slot ${n + 1} - Available JP - Mime`),

    codeNote(baseAddress + n * 0x100 + 0x96, `[16-bit] Unit roster slot ${n + 1} - Total JP - Base job`),
    codeNote(baseAddress + n * 0x100 + 0x98, `[16-bit] Unit roster slot ${n + 1} - Total JP - Chemist`),
    codeNote(baseAddress + n * 0x100 + 0x9a, `[16-bit] Unit roster slot ${n + 1} - Total JP - Knight`),
    codeNote(baseAddress + n * 0x100 + 0x9c, `[16-bit] Unit roster slot ${n + 1} - Total JP - Archer`),
    codeNote(baseAddress + n * 0x100 + 0x9e, `[16-bit] Unit roster slot ${n + 1} - Total JP - Monk`),
    codeNote(baseAddress + n * 0x100 + 0xa0, `[16-bit] Unit roster slot ${n + 1} - Total JP - White Mage`),
    codeNote(baseAddress + n * 0x100 + 0xa2, `[16-bit] Unit roster slot ${n + 1} - Total JP - Black Mage`),
    codeNote(baseAddress + n * 0x100 + 0xa4, `[16-bit] Unit roster slot ${n + 1} - Total JP - Time Mage`),
    codeNote(baseAddress + n * 0x100 + 0xa6, `[16-bit] Unit roster slot ${n + 1} - Total JP - Summoner`),
    codeNote(baseAddress + n * 0x100 + 0xa8, `[16-bit] Unit roster slot ${n + 1} - Total JP - Thief`),
    codeNote(baseAddress + n * 0x100 + 0xaa, `[16-bit] Unit roster slot ${n + 1} - Total JP - Orator`),
    codeNote(baseAddress + n * 0x100 + 0xac, `[16-bit] Unit roster slot ${n + 1} - Total JP - Mystic`),
    codeNote(baseAddress + n * 0x100 + 0xae, `[16-bit] Unit roster slot ${n + 1} - Total JP - Geomancer`),
    codeNote(baseAddress + n * 0x100 + 0xb0, `[16-bit] Unit roster slot ${n + 1} - Total JP - Dragoon`),
    codeNote(baseAddress + n * 0x100 + 0xb2, `[16-bit] Unit roster slot ${n + 1} - Total JP - Samurai`),
    codeNote(baseAddress + n * 0x100 + 0xb4, `[16-bit] Unit roster slot ${n + 1} - Total JP - Ninja`),
    codeNote(baseAddress + n * 0x100 + 0xb6, `[16-bit] Unit roster slot ${n + 1} - Total JP - Arithmetician`),
    codeNote(baseAddress + n * 0x100 + 0xb8, `[16-bit] Unit roster slot ${n + 1} - Total JP - Dark Knight (F) / Bard`),
    codeNote(baseAddress + n * 0x100 + 0xba, `[16-bit] Unit roster slot ${n + 1} - Total JP - Dancer / Dark Knight (M)`),
    codeNote(baseAddress + n * 0x100 + 0xbc, `[16-bit] Unit roster slot ${n + 1} - Total JP - Mime`),

    codeNote(baseAddress + n * 0x100 + 0xbe, `[16 bytes] Unit roster slot ${n + 1} - Unit nickname`),
    codeNote(baseAddress + n * 0x100 + 0xce, `[16-bit] Unit roster slot ${n + 1} - Unit name ID\\r\\n(see 0x58042 for list of values)`),
    codeNote(baseAddress + n * 0x100 + 0xd0, `[16-bit] Unit roster slot ${n + 1} - (unknown)`),
    codeNote(baseAddress + n * 0x100 + 0xd2,  `[8-bit] Unit roster slot ${n + 1} - Egg colour`),
    codeNote(baseAddress + n * 0x100 + 0xd3, `[45 bytes] Unit roster slot ${n + 1} - (unknown)`),
  ]);

  const enemyBase    = 0x1908cc;
  const friendlyBase = 0x1924cc;

  const enemyNotes = range(0, 16).flatMap((n) => [
    codeNote(enemyBase + n * 0x1c0 + 0x00,  `[8-bit] Enemy/guest unit slot ${n + 1} - Character identity\\r\\n(see 0x57f74 for list of values)`),
    codeNote(enemyBase + n * 0x1c0 + 0x03,  `[8-bit] Enemy/guest unit slot ${n + 1} - Job ID\\r\\n(see 0x57f76 for list of values)`),
    codeNote(enemyBase + n * 0x1c0 + 0x04,  `[8-bit] Enemy/guest unit slot ${n + 1} - Palette`),
    
    codeNote(enemyBase + n * 0x1c0 + 0x06,  `[8-bit] Enemy/guest unit slot ${n + 1} - Gender\\r\\nBit5 = Monster\\r\\nBit6 = Female\\r\\nBit7 = Male`),
    codeNote(enemyBase + n * 0x1c0 + 0x07,  `[8-bit] Enemy/guest unit slot ${n + 1} - Death countdown`),

    // codeNote(enemyBase + n * 0x1c0 + 0x12,  `[8-bit] Enemy/guest unit slot ${n + 1} - Primary skillset\\r\\n(see 0x57f7b for list of values)`),
    // codeNote(enemyBase + n * 0x1c0 + 0x13,  `[8-bit] Enemy/guest unit slot ${n + 1} - Secondary skillset\\r\\n(see 0x57f7b for list of values)`),
    // codeNote(enemyBase + n * 0x1c0 + 0x14, `[16-bit] Enemy/guest unit slot ${n + 1} - Reaction ability\\r\\n(see 0x57f7c for list of values)`),
    // codeNote(enemyBase + n * 0x1c0 + 0x16, `[16-bit] Enemy/guest unit slot ${n + 1} - Support ability\\r\\n(see 0x57f7e for list of values)`),
    // codeNote(enemyBase + n * 0x1c0 + 0x18, `[16-bit] Enemy/guest unit slot ${n + 1} - Movement ability\\r\\n(see 0x57f80 for list of values)`),

    codeNote(enemyBase + n * 0x1c0 + 0x1a,  `[8-bit] Enemy/guest unit slot ${n + 1} - Equip slot: head\\r\\n(see 0x57f82 for list of values)`),
    codeNote(enemyBase + n * 0x1c0 + 0x1b,  `[8-bit] Enemy/guest unit slot ${n + 1} - Equip slot: body\\r\\n(see 0x57f83 for list of values)`),
    codeNote(enemyBase + n * 0x1c0 + 0x1c,  `[8-bit] Enemy/guest unit slot ${n + 1} - Equip slot: accessory\\r\\n(see 0x57f84 for list of values)`),
    codeNote(enemyBase + n * 0x1c0 + 0x1d,  `[8-bit] Enemy/guest unit slot ${n + 1} - Equip slot: right-hand weapon\\r\\n(see 0x57f85 for list of values)`),
    codeNote(enemyBase + n * 0x1c0 + 0x1e,  `[8-bit] Enemy/guest unit slot ${n + 1} - Equip slot: right-hand shield\\r\\n(see 0x57f86 for list of values)`),
    codeNote(enemyBase + n * 0x1c0 + 0x1f,  `[8-bit] Enemy/guest unit slot ${n + 1} - Equip slot: left-hand weapon\\r\\n(see 0x57f87 for list of values)`),
    codeNote(enemyBase + n * 0x1c0 + 0x20,  `[8-bit] Enemy/guest unit slot ${n + 1} - Equip slot: left-hand shield\\r\\n(see 0x57f88 for list of values)`),

    codeNote(enemyBase + n * 0x1c0 + 0x22,   `[8-bit] Enemy/guest unit slot ${n + 1} - Level`),
    codeNote(enemyBase + n * 0x1c0 + 0x28,  `[16-bit] Enemy/guest unit slot ${n + 1} - HP`),

    codeNote(enemyBase + n * 0x1c0 + 0x58,  `[8-bit] Enemy/guest unit slot ${n + 1} - Current statuses\\r\\nBit6 = Crystal\\r\\nBit5 = Dead\\r\\nBit4 = Undead\\r\\nBit3 = Charging\\r\\nBit2 = Jump\\r\\nBit1 = Defending\\r\\nBit0 = Performing`),
    codeNote(enemyBase + n * 0x1c0 + 0x59,  `[8-bit] Enemy/guest unit slot ${n + 1} - Current statuses\\r\\nBit7 = Petrify\\r\\nBit6 = Entice\\r\\nBit5 = Blindness\\r\\nBit4 = Confusion\\r\\nBit3 = Silence\\r\\nBit2 = Vampire\\r\\nBit1 = Curse\\r\\nBit0 = Treasure`),
    codeNote(enemyBase + n * 0x1c0 + 0x5a,  `[8-bit] Enemy/guest unit slot ${n + 1} - Current statuses\\r\\nBit7 = Oil\\r\\nBit6 = Float\\r\\nBit5 = Reraise\\r\\nBit4 = Invisible\\r\\nBit3 = Berserk\\r\\nBit2 = Chicken\\r\\nBit1 = Toad\\r\\nBit0 = Critical`),
    codeNote(enemyBase + n * 0x1c0 + 0x5b,  `[8-bit] Enemy/guest unit slot ${n + 1} - Current statuses\\r\\nBit7 = Poison\\r\\nBit6 = Regen\\r\\nBit5 = Protect\\r\\nBit4 = Shell\\r\\nBit3 = Haste\\r\\nBit2 = Slow\\r\\nBit1 = Stop\\r\\nBit0 = Wall`),
    codeNote(enemyBase + n * 0x1c0 + 0x5c,  `[8-bit] Enemy/guest unit slot ${n + 1} - Current statuses\\r\\nBit7 = Faith\\r\\nBit6 = Atheist\\r\\nBit5 = Charm\\r\\nBit4 = Sleep\\r\\nBit3 = Don't Move\\r\\nBit2 = Don't Act\\r\\nBit1 = Reflect\\r\\nBit0 = Doom`),

    codeNote(enemyBase + n * 0x1c0 + 0x186, `[8-bit] Enemy/guest unit slot ${n + 1} - Flag: character's turn`),
    codeNote(enemyBase + n * 0x1c0 + 0x187, `[8-bit] Enemy/guest unit slot ${n + 1} - Flag: movement taken this turn`),
    codeNote(enemyBase + n * 0x1c0 + 0x188, `[8-bit] Enemy/guest unit slot ${n + 1} - Flag: action taken this turn`),
    codeNote(enemyBase + n * 0x1c0 + 0x189, `[8-bit] Enemy/guest unit slot ${n + 1} - Flags: Ability outcome\\r\\nBit2 = Target learning ability\\r\\nBit1 = Target hit by ability\\r\\nBit0 = Turn ended/reacting`),
  ]);

  const friendlyNotes = range(0, 5).flatMap((n) => [
    codeNote(friendlyBase + n * 0x1c0 + 0x00,  `[8-bit] Player unit slot ${n + 1} - Character identity\\r\\n(see 0x57f74 for list of values)`),
    codeNote(friendlyBase + n * 0x1c0 + 0x03,  `[8-bit] Player unit slot ${n + 1} - Job ID\\r\\n(see 0x57f76 for list of values)`),
    codeNote(friendlyBase + n * 0x1c0 + 0x04,  `[8-bit] Player unit slot ${n + 1} - Palette`),
    
    codeNote(friendlyBase + n * 0x1c0 + 0x06,  `[8-bit] Player unit slot ${n + 1} - Gender\\r\\nBit5 = Monster\\r\\nBit6 = Female\\r\\nBit7 = Male`),
    codeNote(friendlyBase + n * 0x1c0 + 0x07,  `[8-bit] Player unit slot ${n + 1} - Death countdown`),

    codeNote(friendlyBase + n * 0x1c0 + 0x12,  `[8-bit] Player unit slot ${n + 1} - Primary skillset\\r\\n(see 0x57f7b for list of values)`),
    codeNote(friendlyBase + n * 0x1c0 + 0x13,  `[8-bit] Player unit slot ${n + 1} - Secondary skillset\\r\\n(see 0x57f7b for list of values)`),
    codeNote(friendlyBase + n * 0x1c0 + 0x14, `[16-bit] Player unit slot ${n + 1} - Reaction ability\\r\\n(see 0x57f7c for list of values)`),
    codeNote(friendlyBase + n * 0x1c0 + 0x16, `[16-bit] Player unit slot ${n + 1} - Support ability\\r\\n(see 0x57f7e for list of values)`),
    codeNote(friendlyBase + n * 0x1c0 + 0x18, `[16-bit] Player unit slot ${n + 1} - Movement ability\\r\\n(see 0x57f80 for list of values)`),

    codeNote(friendlyBase + n * 0x1c0 + 0x1a,  `[8-bit] Player unit slot ${n + 1} - Equip slot: head\\r\\n(see 0x57f82 for list of values)`),
    codeNote(friendlyBase + n * 0x1c0 + 0x1b,  `[8-bit] Player unit slot ${n + 1} - Equip slot: body\\r\\n(see 0x57f83 for list of values)`),
    codeNote(friendlyBase + n * 0x1c0 + 0x1c,  `[8-bit] Player unit slot ${n + 1} - Equip slot: accessory\\r\\n(see 0x57f84 for list of values)`),
    codeNote(friendlyBase + n * 0x1c0 + 0x1d,  `[8-bit] Player unit slot ${n + 1} - Equip slot: right-hand weapon\\r\\n(see 0x57f85 for list of values)`),
    codeNote(friendlyBase + n * 0x1c0 + 0x1e,  `[8-bit] Player unit slot ${n + 1} - Equip slot: right-hand shield\\r\\n(see 0x57f86 for list of values)`),
    codeNote(friendlyBase + n * 0x1c0 + 0x1f,  `[8-bit] Player unit slot ${n + 1} - Equip slot: left-hand weapon\\r\\n(see 0x57f87 for list of values)`),
    codeNote(friendlyBase + n * 0x1c0 + 0x20,  `[8-bit] Player unit slot ${n + 1} - Equip slot: left-hand shield\\r\\n(see 0x57f88 for list of values)`),

    codeNote(friendlyBase + n * 0x1c0 + 0x22,   `[8-bit] Player unit slot ${n + 1} - Level`),
    codeNote(friendlyBase + n * 0x1c0 + 0x28,  `[16-bit] Player unit slot ${n + 1} - HP`),

    codeNote(friendlyBase + n * 0x1c0 + 0x58,  `[8-bit] Player unit slot ${n + 1} - Current statuses\\r\\nBit6 = Crystal\\r\\nBit5 = Dead\\r\\nBit4 = Undead\\r\\nBit3 = Charging\\r\\nBit2 = Jump\\r\\nBit1 = Defending\\r\\nBit0 = Performing`),
    codeNote(friendlyBase + n * 0x1c0 + 0x59,  `[8-bit] Player unit slot ${n + 1} - Current statuses\\r\\nBit7 = Petrify\\r\\nBit6 = Entice\\r\\nBit5 = Blindness\\r\\nBit4 = Confusion\\r\\nBit3 = Silence\\r\\nBit2 = Vampire\\r\\nBit1 = Curse\\r\\nBit0 = Treasure`),
    codeNote(friendlyBase + n * 0x1c0 + 0x5a,  `[8-bit] Player unit slot ${n + 1} - Current statuses\\r\\nBit7 = Oil\\r\\nBit6 = Float\\r\\nBit5 = Reraise\\r\\nBit4 = Invisible\\r\\nBit3 = Berserk\\r\\nBit2 = Chicken\\r\\nBit1 = Toad\\r\\nBit0 = Critical`),
    codeNote(friendlyBase + n * 0x1c0 + 0x5b,  `[8-bit] Player unit slot ${n + 1} - Current statuses\\r\\nBit7 = Poison\\r\\nBit6 = Regen\\r\\nBit5 = Protect\\r\\nBit4 = Shell\\r\\nBit3 = Haste\\r\\nBit2 = Slow\\r\\nBit1 = Stop\\r\\nBit0 = Wall`),
    codeNote(friendlyBase + n * 0x1c0 + 0x5c,  `[8-bit] Player unit slot ${n + 1} - Current statuses\\r\\nBit7 = Faith\\r\\nBit6 = Atheist\\r\\nBit5 = Charm\\r\\nBit4 = Sleep\\r\\nBit3 = Don't Move\\r\\nBit2 = Don't Act\\r\\nBit1 = Reflect\\r\\nBit0 = Doom`),

    codeNote(friendlyBase + n * 0x1c0 + 0x186, `[8-bit] Player unit slot ${n + 1} - Flag: character's turn`),
    codeNote(friendlyBase + n * 0x1c0 + 0x187, `[8-bit] Player unit slot ${n + 1} - Flag: movement taken this turn`),
    codeNote(friendlyBase + n * 0x1c0 + 0x188, `[8-bit] Player unit slot ${n + 1} - Flag: action taken this turn`),
    codeNote(friendlyBase + n * 0x1c0 + 0x189, `[8-bit] Player unit slot ${n + 1} - Flags: Ability outcome\\r\\nBit2 = Target learning ability\\r\\nBit1 = Target hit by ability\\r\\nBit0 = Turn ended/reacting`),
  ]);

  const enemyNotesAddendum = range(0, 16).flatMap((n) => [
    // codeNote(enemyBase + n * 0x1c0 + 0x16f, `[8-bit] Enemy/guest unit slot ${n + 1} - Skillset of last ability used`),
    // codeNote(enemyBase + n * 0x1c0 + 0x170, `[8-bit] Enemy/guest unit slot ${n + 1} - ID of last ability used`),

    codeNote(enemyBase + n * 0x1c0 + 0x19c, `[8-bit] Enemy/guest unit slot ${n + 1} - Special effect flags\\r\\nBit7 = Level up\\r\\nBit6 = Switch team\\r\\nBit5 = Poached\\r\\nBit4 = Item stolen\\r\\nBit2 = Item broken`),
    codeNote(enemyBase + n * 0x1c0 + 0x19d, `[8-bit] Enemy/guest unit slot ${n + 1} - Special effect flags\\r\\nBit0 = Level down`),
  ]);

  const friendlyNotesAddendum = range(0, 5).flatMap((n) => [
    codeNote(friendlyBase + n * 0x1c0 + 0x16f, `[8-bit] Player unit slot ${n + 1} - Skillset of last ability used\\r\\n0x05 = Squire (generic)\\r\\n0x19 = Squire (Ramza ch. 1)\\r\\n0x1a = Squire (Ramza ch. 2, ch. 3)\\r\\n0x1b = Squire (Ramza ch. 4)`),
    codeNote(friendlyBase + n * 0x1c0 + 0x170, `[8-bit] Player unit slot ${n + 1} - ID of last ability used\\r\\n0x92 = Focus`),

    codeNote(friendlyBase + n * 0x1c0 + 0x19c, `[8-bit] Player unit slot ${n + 1} - Special effect flags\\r\\nBit7 = Level up\\r\\nBit6 = Switch team\\r\\nBit5 = Poached\\r\\nBit4 = Item stolen\\r\\nBit2 = Item broken`),
    codeNote(friendlyBase + n * 0x1c0 + 0x19d, `[8-bit] Player unit slot ${n + 1} - Special effect flags\\r\\nBit0 = Level down`),
  ]);

  // rosterNotes.forEach((note) => console.log(note));
  // enemyNotes.forEach((note) => console.log(note));
  // friendlyNotes.forEach((note) => console.log(note));
  enemyNotesAddendum.forEach((note) => console.log(note));
  friendlyNotesAddendum.forEach((note) => console.log(note));
}

generateUnitRosterNotes();
