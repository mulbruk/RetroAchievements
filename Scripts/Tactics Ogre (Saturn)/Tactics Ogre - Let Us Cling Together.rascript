// Tactics Ogre: Let Us Cling Together
// #ID = 22174

// ---------------------------------------------------------------------------------------------------
// Game state & load protection

// 0DB307: [8-bit] Game state
//   0x00 = Cutscene/Battle (also flickers to this when switching from world map to other states -
//          possibly using events engine to render the static background scenes for other modes)
//          (also used on main menu)
//   0x30 = When displaying audio system logo before title screen
//   0x50 = Load/save data, starting a new game, title screen 'Age of Xytegenia' cinematic
//   0x60 = Shop / Edit / Warren Report
//   0x70 = World map

function game_state() => byte(0xDB307)

GameState = {
  "Field Program":   0x00,
  "Boot Logos":      0x30,
  "Data Management": 0x50,
  "Shop, Edit, Etc": 0x60,
  "World Map":       0x70,
}

function is_game_state(state) => game_state() == GameState[state]

function load_protection() => !is_game_state("Data Management")

// Loading from a mid-battle save goes directly from data management to the field engine, this is the
// only case in which those two states are adjacent in time
function mid_battle_load_protection() => prior(game_state()) != GameState["Data Management"]

// 0x1FFC01: [8-bit] Hard mode flag (0 = normal, 1 = hard)
//   Hard mode state doesn't get saved - needs to be turned on every time the title screen is visited

function is_hard_mode() => byte(0x1FFC01) == 1


// ---------------------------------------------------------------------------------------------------
// In-game statistics

// 0x0D3456: [16-bit] In game calendar - years elapsed
// 0x0D345A: [16-bit] In game calendar - month
//   The Valerian calendar has 15 months of 24 or 25 days each, for a total of 366 days in the year.
//   0x01 = Month of God:    24 days |   0 days elapsed at start of month
//   0x02 = Month of Earth:  25 days |  24 days elapsed at start of month
//   0x03 = Month of Water:  24 days |  49 days elapsed at start of month
//   0x04 = Month of Shadow: 24 days |  73 days elapsed at start of month
//   0x05 = Month of White:  25 days |  97 days elapsed at start of month
//   0x06 = Month of Flame:  24 days | 122 days elapsed at start of month
//   0x07 = Month of Wind:   24 days | 146 days elapsed at start of month
//   0x08 = Month of Gold:   25 days | 170 days elapsed at start of month
//   0x09 = Month of Storm:  24 days | 195 days elapsed at start of month
//   0x0a = Month of Dark:   24 days | 219 days elapsed at start of month
//   0x0b = Month of Sea:    25 days | 243 days elapsed at start of month
//   0x0c = Month of Black:  24 days | 268 days elapsed at start of month
//   0x0d = Month of Twin:   24 days | 292 days elapsed at start of month
//   0x0e = Month of Fire:   25 days | 316 days elapsed at start of month
//   0x0f = Month of Light:  25 days | 341 days elapsed at start of month
// 0x0D345E: [16-bit] In game calendar - day

function calendar_year()  => word(0x0D3456)
function calendar_month() => word(0x0D345A)
function calendar_day()   => word(0x0D345E)

// 0x0D3468: [16-bit] Play time (measured in frames) - upper 2 bytes
//   Saturn memory swizzling prevents this from being treated as a 32-bit value
// 0x0D346A: [16-bit] Play time (measured in frames) - lower 2 bytes
//   Saturn memory swizzling prevents this from being treated as a 32-bit value

function in_game_time() => word(0x0D3468) * 0x10000 + word(0x0D346A)


// ---------------------------------------------------------------------------------------------------
// Inventory

// 0x0D34E4: [16-bit] Inventory slot 1
//   Inventory is kept sorted so that all items occur in the array before any empty slots. When a new
//   item is added, it is not added to the end of the group of filled slots, but somewhere in the
//   middle according to the sort order the game uses (based on item type etc.). All items in the
//   inventory occurring after the added item will be shifted towards the end of the array. Likewise,
//   when an item is used up and removed from the inventory, all items after it will be shifted
//   towards the start of the array.

Items = {
  "Rimfire":    0x4F,

  "OgreBlade":  0x1B,
  "OgreShield": 0x6C,
  "OgreArmor":  0x7D,
  "OgreHelm":   0x8E,

  "DagdaMaul":  0x2F,
  "ReaperMail": 0x7C,
  "SkullMask":  0x8D,
  "GhostRing":  0xA0,

  "WornSword":  0x0E,
  "ItchyGlove": 0x6F,
  "SweatArmor": 0x76,
  "SlimyHelm":  0x8A,

  "FireCrest":  0xC9,
}

function inventory_slot(number) => word(0x0D34E4 + 2 * (number - 1))

// Instability of item position in the inventory requires checking all slots to tell if a new item
// has been added
function item_added_to_inventory(item) => (
  all_of(
    range(1, 204),
    n => prev(inventory_slot(n)) != Items[item]
  ) &&
  __ornext(
    any_of(
      range(1, 204),
      n => inventory_slot(n) == Items[item]
    )
  )
)

// 0x0D3816: [16-bit] Spells inventory slot 1
//   Spells inventory is kept sorted so that all items occur in the array before any empty slots.
//   When a new spell is added, it is not added to the end of the group of filled slots, but
//   somewhere in the middle according to the sort order the game uses (based on element etc.). All
//   items in the inventory occurring after the added item will be shifted towards the end of the
//   array. Likewise, if a spell is dropped from the inventory, all spells after it will be shifted
//   towards the start of the array.

Spells = {
  "AirCry":      0x04,
  "NovaStrike":  0x0B,
  "Supernova":   0x0C,
  "Earthquake":  0x14,
  "IceRequiem":  0x1C,
  "Heal":        0x25,
  "HealPlus":    0x26,
  "MajorHeal":   0x27,
  "Resurrect":   0x28,
  "Necromancy":  0x30,
  "Reincarnate": 0x37,
  "Snapdragon":  0x38,
}

function spell_inventory_slot(number) => word(0x0D3816 + 2 * number)

// Instability of spell position in the inventory requires checking all slots to tell if a new spell
// has been added
function spell_added_to_inventory(spell) => (
  all_of(
    range(0, 55),
    n => prev(spell_inventory_slot(n)) != Spells[spell]
  ) &&
  __ornext(
    any_of(
      range(0, 55),
      n => spell_inventory_slot(n) == Spells[spell]
    )
  )
)


// ---------------------------------------------------------------------------------------------------
// Maps

// 0xD34DA: [8-bit] Map ID (high byte) - Determines map group
// 0xD34DE: [8-bit] Map ID (low byte)  - Selects map from within map group
function map_group() => byte(0x0D34DA)
function map_index() => byte(0x0D34DE)

function map_id() => map_group() * 0x100 + map_index()

Maps = {
  // Urban exterior (Golyat / Almorica / Asyton style)
  "Golyat (Intro)":         0x0000,
  "Rhime (Cistina Battle)": 0x0001,
  "Port Asyton":            0x0002,
  "Rhime (Vyce and Arycelle Battle)": 0x0009,
  "Rhime (Sacking 1)":      0x000B,
  "Rhime (Ozma Battle)":    0x000B,
  "Rhime (Sacking 2)":      0x000C,

  // Urban exterior (Balmamusa / Grimsby style)
  "Balmamusa C1":           0x0200,
  "Krysaro":                0x0201,
  "Balmamusa 2L":           0x0203,

  // Castle exterior
  "Almorica Gates":         0x0300,

  // Castle exterior
  "Phidoch South":          0x0600,
  "Phidoch West":           0x0601,

  // Castle exterior
  "Barnicia Gates":         0x0700,
  "BarniciaCourtyard":      0x0701,
  
  // Castle exterior
  "Heim Postern Gate":      0x0800,
  "Heim Gates":             0x0801,

  // Castle interior
  "Almorica Passage":       0x0900,
  "Barnicia Staircase":     0x0901,
  "Heim Dungeon":           0x0902,

  // Castle interior
  "CoritanaeWard":          0x0A01,

  // Castle interior
  "Phidoch Hall":           0x0B00,

  // Castle interior
  "Coronation":             0x0C00,
  "Heim Great Hall":        0x0C00,

  // Fortress
  "Qadriga":                0x0D00,
  "Boed Fortress":          0x0D01,
  "Ndamsa":                 0x0D02,

  // Hanging Gardens
  "Foot of the Gardens":    0x0E00,
  "Twixt Heaven and Earth": 0x0E11,
  
  // Grassland & swamp
  "Tynemouth Hill":         0x1000,
  "Xeod Moors":             0x1004,
  "Lake Bordu":             0x1008,
  
  // Desert
  "Boulder Sands":          0x1100,

  // Volcanic
  "Weobry":                 0x1201,
  "PotD Floor 100":         0x1202,

  // Temple
  "Hahnela Temple":         0x1300,
  "Xoshonell Temple":       0x1301,
  "Vaasa Temple":           0x1302,
  "Greuza Temple":          0x1303,
  "Hagia Banhamuba":        0x1304,

  // PotD
  "PotD Floor 1":           0x1400,
  "PotD Floor 3":           0x1402,

  // Tomb Below
  "The Tomb Below":         0x1500,
  "Tomb - Martym & Barbas": 0x1502,
  "Tomb - Dorgalua":        0x1503,

  // Building interiors
  "Boed Interior":          0x160B,
  "TristanRoom":            0x1612,
}

function is_map(map) => map_id() == Maps[map]

// 0x0D34D4: [16-bit] Position on world map
//   0x00 = Ashmedai
//   0x01 = Bortegun Fens
//   0x02 = Belmorose
//   0x03 = Madura
//   0x04 = Brigantys
//   0x05 = Ndamsa
//   0x06 = Banhamuba
//   0x07 = Hedon
//   0x08 = Port Asyton
//   0x09 = Bahanna
//   0x0A = Coritanae
//   0x0B = Xeod Moors
//   0x0C = Balmamusa
//   0x0D = Lambiss Hill
//   0x0E = Phidoch Castle
//   0x0F = Weobry
//   0x10 = Psonji Weald
//   0x11 = Lake Bordu
//   0x12 = Tynemouth Hill
//   0x13 = Krysaro Town
//   0x14 = Qadriga Fortress
//   0x15 = Iorumza
//   0x16 = Rhime
//   0x17 = Golborza Plain
//   0x18 = Almorica Castle
//   0x19 = Golyat
//   0x1A = Fortress Geyld
//   0x1B = Barnicia Castle
//   0x1C = Boulder Sands
//   0x1D = Oeram Town
//   0x1E = Heim
//   0x1F = Boed Fortress
//   0x20 = Hanging Gardens
//   0x21 = Neimrahava
//   0x22 = Grimsby Town
//   0x23 = Gecho Fortress
function is_map_location(location) => word(0x0D34D4) == location

// 0xD34E2: [8-bit] Palace of the Dead - current floor
function potd_floor() => byte(0x0D34E2) + 1
function is_potd_floor(floor) => byte(0x0D34E2) == (floor - 1)


// ---------------------------------------------------------------------------------------------------
// Encounter groups

// 0x0D3A0E: [8-bit bitfield] Battle condition flags
//   Lower 2 bits:
//     0 = Story battle/scripted event
//     1 = Random battle
//     2 = Training battle
//     3 = Audio library logo that appears before the title screen (goes stale)
//   Bit2 = Set when some spell effects are animating
//   Bit3 = Unknown, can be 0 or 1 during both story battles and random encounters
//   Bit4 = Tutorial mode
//   0x0C during title screen demos
function battle_condition_flags() => byte(0x0D3A0E)
function is_story_battle()    => bit0(0x0D3A0E) == 0 && bit1(0x0D3A0E) == 0
function is_random_battle()   => bit0(0x0D3A0E) == 1 && bit1(0x0D3A0E) == 0
function is_training_battle() => bit0(0x0D3A0E) == 0 && bit1(0x0D3A0E) == 1

// 0x0D915E: [16-bit] Encounter group ID
//  Story battles and random battles possibly have overlapping IDs -> always check battle type flags at 0xd3a0e to disambiguate.
//  When passing over a location on the map where a random battle can occur, this value will change to the encounter group for a battle at that location even if the battle isn't triggered.
function encounter_group()   => word(0x0D915E)
function is_encounter(group) => encounter_group() == Encounters[group]
function is_story_encounter(id) => is_story_battle() && word(0x0D915E) == Encounters[id]

Encounters = {
  "Intro Xenobians":     0x01,

  "Orba":                0x06,
  "Moldova":             0x09,
  "NybethC1":            0x0C,
  "RhimeC1":             0x10,
  "Sir Grion":           0x12,
  "GanppC1":             0x16,
  "Balmamusa C1":        0x19,
  
  "Arycelle 2C":         0x1C,
  "Veldrei":             0x2A,
  "Almorica Gates 2C":   0x32,
  
  "Balmamusa 2L":        0x33,
  "Vyce and Arycelle":   0x41,
  "Almorica Gates 2L":   0x44,
  
  "Oz C3N":              0x55,
  "Ganpp3N":             0x57,
  "Nybeth C3N":          0x5F,
  "Xaebos C3N":          0x63,

  "Phidoch South":       0x67,
  "Phidoch West":        0x68,
  
  "Gannon":              0x6A,
  "Ganpp3C":             0x77,
  "Oz C3C":              0x7A,
  "Oz and Ozma":         0x7C,
  "LeonarDuel":          0x7D,
  
  "Ganpp3L":             0x88,
  "Xaebos C3L":          0x8A,
  "Oz C3L Group":        0x8E,
  "Ozma (Rhime)":        0x91,
  
  "Sherri":              0xA2,
  "Barnicia Gates":      0xA6,
  "Barbas":              0xA7,
  "Lanselot 1":          0xA8,
  "Lanselot 2":          0xA9,
  "Pherenian":           0xAB,
  "Heim Postern Gate":   0xB0,
  "Heim Gates":          0xB1,
  "Brantyn":             0xB4,
  "Foot of the Gardens": 0xB5,
  "Andoras":             0xC6,
  "The Tomb Below":      0xC7,
  "RelicsOfThePast":     0xC8,
  "Martym & Barbas":     0xC9,
  "Dorgalua":            0xCA,
  "Hahnela Temple":      0xD3,
  "Xoshonell Temple":    0xD1,
  "Vaasa Temple":        0xD5,
  "Greuza Temple":       0xD7,
}


// ---------------------------------------------------------------------------------------------------
// Event scripts

// 0x0BD232: [16-bit] Event script ID
//   Mirror of 0x33c62 when script active, but this location persists previous value when no script active
//   0x0067 = Sir Grion defeat event
//   0x009A = Arycelle defeat event (Port Asyton)
//   0x00BD = Veldrei defeat event
//   0x00F4 = C2 Law Balmamusa map clear event
//   0x0114 = Vyce defeat event (Rhime)
//   0x013B = Oz defeat event (neutral)
//   0x0145 = Ganpp defeat event (C3, all routess)
//   0x0169 = Nybeth defeat event (Ndamsa)
//   0x0179 = Xaebos defeat event (neutral)
//   0x018B = Ozma defeat event (neutral)
//   0x0192 = Gannon defeat event
//   0x01B5 = Leonar 1v1 duel start
//   0x01B7 = Leonar defeat (chaos)
//   0x01CB = Oz defeat event (chaos, Boed)
//   0x01D8 = Oz defeat event (chaos, Ozma dead)
//   0x020D = Xaebos defeat (law)
//   0x0215 = Ozma defeat (Hobyrim alive) (law)
//   0x0218 = Ozma defeat (Hobyrim dead) (law)
//   0x0220 = Oz second fight start (law)
//   0x0221 = Oz defeat event (law)
//   0x0255 = Sherri defeat event
//   0x0267 = Barbas defeat event (Barnicia)
//   0x0269 = Catiua defeat event (Barnicia)
//   0x026A = Lanselot defeat event (Catiua present)
//   0x026E = Lanselot defeat event (Catiua absent)
//   0x0282 = Pherenian defeat event
//   0x029F = Brantyn defeat event
//   0x02D5 = Andoras defeat event
//   0x02DB = Martym defeat event (Barbas alive)
//   0x02DC = Martym defeat event (Barbas dead)
//   0x02DD = Barbas defeat event (Martym alive)
//   0x02DE = Barbas defeat event (Martym dead)
//   0x02E0 = Dorgalua fight start
//   0x02E1 = Dorgalua defeat event 1
//   0x02E2 = Dorgalua defeat event 2
function event_script_id() => word(0x0BD232)
function is_event_script(id) => event_script_id() == id

function event_script_trigger(id) => (
  prev(event_script_id()) != id &&
  event_script_id() == id
)

function event_script_multi_trigger(ids) => (
  event_script_id() != prev(event_script_id()) &&
  __ornext(
    any_of(ids, id => event_script_id() == id)
  )
)

function stale_event_script_reset(id) => (
  prev(event_script_id()) == id &&
  event_script_id() == id
)


// ---------------------------------------------------------------------------------------------------
// Strings

// 0x0D8CC2: [16-bit] ID of last displayed string
//   0x04A9 = "<name> fell and perished."
//   0x0D5A = Ganpp: Obda death reaction
//   0x0D5B = Ganpp: Berda death reaction
//   0x0D5C = Ganpp: Banga death reaction
//   0x0D5D = Ganpp: Zanga death reaction
//   0x0F34 = C3C duel choice
//   0x0F35 = C3C duel response
//   0x14FA = Princess ending "Glory to Valeria!"
//   0x15C5 = Lord ending (high Chaos Frame) "King Denam draws a fatal hand."
//   0x15C7 = Lord ending (low Chaos Frame) "Glory to the Walister!"
function string_id() => word(0x0D8CC2)


// ---------------------------------------------------------------------------------------------------
// Music

// 0x0F77FC: [16-bit] Music ID - Sequenced and PCM music

// 0x0F7809: [8-bit] CD audio state
//   0x00 = Not playing
//   0x01 = Playing

// 0x0F79BA: [16-bit] Music ID - CD Audio
//   0x02 = Hidden Treasure Fanfare
//   0x03 = Level Up Jingle
//   0x04 = Cheering
//   0x05 = Booing
//   0x06 = Class Change
//   0x07 = Unit Desertion
//   0x08 = Blessed Memory (Save/load screen)
//   0x09 = Overture (Title Screen)

Music = {
  "Null":                        0x00,
  "Chaotic Island":              0x01,
  "Prepare to Take the Field":   0x02,
  "Glory":                       0x03,
  "Retreat!":                    0x04,
  "A Colour of Chaos":           0x05,
  "Island Atlas":                0x06,
  "Blasphemous Experiment":      0x07,
  "Fog of Phantom":              0x08,
  "Fight It Out!":               0x09,
  "Breath of the Earth":         0x0A,
  "Chivalry and Savagery":       0x0B,
  "Unsealed":                    0x0C,
  "Unit March":                  0x0D,
  "Avilla Henya":                0x0E,
  "Fortune Teller 2":            0x0F,
  "VENDETTA!":                   0x11,
  "Three Kings":                 0x12,
  "Limitation":                  0x13,
  "Theme of Black Knight":       0x14,
  "War Situation":               0x15,
  "Warren Report":               0x16,
  "Passing Moment":              0x17,
  "Song of Tundra":              0x18,
  "Air Land":                    0x19,
  "Catastrophe":                 0x1A,
  "Harvest Dance":               0x1B,
  "Box of Sentiment":            0x26,
  "Emotion and Absence of Mind": 0x27,
  "Theme of WLO":                0x28,
  "Insincerity":                 0x29,
  "Religious Precepts":          0x2A,
  "Footsteps from Darkness":     0x2B,
  "Agitation":                   0x2C,
  "Theme of the Priest":         0x2D,
  "Restriction on Power":        0x2E,
  "A Cygnet":                    0x2F,
  "Fact of Shock":               0x30,
  "Deathrattle":                 0x31,
  "Notice of Death":             0x32,
  "Prayer":                      0x33,
  "Reminiscence":                0x3F,
  "Awakening":                   0x40,
  "Coronation":                  0x41,
  "Rumbling":                    0x45,
}

function music_id() => byte(0xf77fc)
function is_music(track)  =>      music_id()  == Music[track]
function was_music(track) => prev(music_id()) == Music[track]

function cd_audio_playing() => byte(0xf7809) == 1
function cd_audio_track()   => byte(0xf79ba)


// ---------------------------------------------------------------------------------------------------
// Unit roster

// Special character IDs
CharacterID = {
  // Party members
  "Deneb":         0x31,
  "Denam":         0x32,
  "Denam4":        0x33,
  "Catiua (Dark Priest)": 0x36,
  "Catiua":        0x37,
  "Canopus":       0x3A,
  "Mirdyn":        0x3B,
  "Gildas":        0x3C,
  "Cistina":       0x4C,
  "Cerya":         0x4D,
  "Sherri":        0x4E,
  "Olivya":        0x4F,
  "Presance":      0x50,
  "Hobyrim":       0x51,
  "Folcurt":       0x52,
  "Bayin":         0x53,
  "Arycelle":      0x54,
  "Ocionne":       0x55,
  "Jeunan":        0x56,
  "Xapan":         0x57,
  "Dievold":       0x58,
  "Oelias":        0x59,
  "Rudlum":        0x5A,
  "Vyce":          0x6B,
  "Ganpp":         0x6C,

  // Generics
  "Nothing":       0x00,
  "Soldier":       0x01,
  "Knight":        0x02,
  "Berserker":     0x03,
  "Black Knight":  0x04,
  "Daimyo":        0x05,
  "Dragoon":       0x06,
  "Ninja":         0x07,
  "Beast Tamer":   0x08,
  "Wizard":        0x09,
  "Warlock":       0x0A,
  "Exorcist":      0x0B,
  "Lich":          0x0C,
  "Fusilier":      0x0D,
  "Amazon":        0x0E,
  "Valkyrie":      0x0F,
  "Archer":        0x10,
  "Dragon Tamer":  0x11,
  "Siren":         0x12,
  "Witch":         0x13,
  "Cleric":        0x14,
  "Priestess":     0x15,
  "Divine Knight": 0x16,

  // Bosses
  "Lanselot":      0x41,
  "Brantyn":       0x42,
  "Dorgalua":      0x43,
  "Balxephon":     0x44,
  "Barbas":        0x45,
  "Martym":        0x46,
  "Volaq":         0x47,
  "Andoras":       0x48,
  "Ozma":          0x49,
  "Oz":            0x4A,
  "Leonar":        0x4B,
  "Xaebos":        0x5C,
  "Nybeth":        0x5D,
  "Beelzebuth":    0x5E,
  "Falfadel":      0x5F,
  "Vepahl":        0x60,
  "VyceChaos":     0x61,
  "Ramidos":       0x62,
  "Vyce (Rhime)":  0x63,
  "Modiliani":     0x64,
  "Brutakos":      0x65,
  "Muntzer":       0x66,
  "LeonarZombie":  0x67,
  "XaebosZombie":  0x68,
  "GildasZombie":  0x69,
  "NybethLich":    0x6A,

  "LootBag": 0xF0,
}

// Character class IDs
ClassID = {
  "Lich": 0x0C,
  "DivineKnight": 0x16,
  "Lord": 0x33,
}

function unit_roster_class_id(n)     => byte(0x0DABF0 + 0x2C * n + 0x00)
function unit_roster_character_id(n) => byte(0x0DABF0 + 0x2C * n + 0x01)

function unit_roster_equip_slot(n, slot) => byte(0x0DABF0 + 0x2C * n + 0x22 + slot)
function unit_roster_spell_slot(n, slot) => byte(0x0DABF0 + 0x2C * n + 0x26 + slot)


function nova_strike_equipped(n) => __ornext (
  unit_roster_spell_slot(n, 0) == Spells["NovaStrike"] ||
  unit_roster_spell_slot(n, 1) == Spells["NovaStrike"] ||
  unit_roster_spell_slot(n, 2) == Spells["NovaStrike"] ||
  unit_roster_spell_slot(n, 3) == Spells["NovaStrike"]
)

function unit_has_item_equipped(n, item) => __ornext(
  unit_roster_equip_slot(n, 0) == Items[item]  ||
  unit_roster_equip_slot(n, 1) == Items[item]  ||
  unit_roster_equip_slot(n, 2) == Items[item]  ||
  unit_roster_equip_slot(n, 3) == Items[item]
)

function unit_equipment_change(n) => __ornext(
  unit_roster_equip_slot(n, 0) != prev(unit_roster_equip_slot(n, 0)) ||
  unit_roster_equip_slot(n, 1) != prev(unit_roster_equip_slot(n, 1)) ||
  unit_roster_equip_slot(n, 2) != prev(unit_roster_equip_slot(n, 2)) ||
  unit_roster_equip_slot(n, 3) != prev(unit_roster_equip_slot(n, 3))
)

function unit_has_ogre_set_equipped(n) => (
  unit_has_item_equipped(n, "OgreBlade") &&
  unit_has_item_equipped(n, "OgreShield") &&
  unit_has_item_equipped(n, "OgreArmor") &&
  unit_has_item_equipped(n, "OgreHelm") &&
  unit_equipment_change(n)
)

function unit_has_dark_road_set_equipped(n) => (
  unit_has_item_equipped(n, "DagdaMaul") &&
  unit_has_item_equipped(n, "ReaperMail") &&
  unit_has_item_equipped(n, "SkullMask") &&
  unit_has_item_equipped(n, "GhostRing") &&
  unit_equipment_change(n)
)

function unit_has_reeking_set_equipped(n) => (
  unit_has_item_equipped(n, "WornSword") &&
  unit_has_item_equipped(n, "ItchyGlove") &&
  unit_has_item_equipped(n, "SweatArmor") &&
  unit_has_item_equipped(n, "SlimyHelm") &&
  unit_equipment_change(n)
)

function character_added_to_roster(character) => any_of(
  range(1, 29),
  n => (
    prev(unit_roster_character_id(n)) != CharacterID[character] &&
         unit_roster_character_id(n)  == CharacterID[character]
  )
)

function class_added_to_roster(class_name) => any_of(
  range(1, 29),
  n => (
    prev(unit_roster_class_id(n)) != ClassID[class_name] &&
         unit_roster_class_id(n)  == ClassID[class_name]
  )
)

function nova_strike_deneb_recruited() => any_of(
  range(1, 29),
  n => (
    prev(unit_roster_character_id(n)) != CharacterID["Deneb"] &&
         unit_roster_character_id(n)  == CharacterID["Deneb"] &&
    nova_strike_equipped(n)
  )
)

function character_recruited(flicker_protection, character) => (
  load_protection() &&
  flicker_protection &&
  character_added_to_roster(character)
)

// 0x0D390E: [8-bit bitfield] Flags - Character class related
//   Bit gets set the first time a character of the given class enters the unit roster (whether by
//   class change, recruitment, or as a guest unit)
//   Bit0 = ??
//   Bit1 = Soldier
//   Bit2 = Knight
//   Bit3 = Berzerker
//   Bit4 = Black Knight
//   Bit5 = Daimyo
//   Bit6 = Dragoon
//   Bit7 = Ninja

// 0x0D3910: [8-bit bitfield] Flags - Character class related
//   Bit gets set the first time a character of the given class enters the unit roster (whether by
//   class change, recruitment, or as a guest unit)
//   Bit0 = Dragon Tamer
//   Bit1 = Siren
//   Bit2 = Witch
//   Bit3 = Cleric
//   Bit4 = Priestess
//   Bit5 = Thunder Dragon
//   Bit6 = Red Dragon
//   Bit7 = Earth Dragon

// 0x0D3911: [8-bit bitfield] Flags - Character class related
//   Bit gets set the first time a character of the given class enters the unit roster (whether by
//   class change, recruitment, or as a guest unit)
//   Bit0 = Beast Tamer
//   Bit1 = Wizard
//   Bit2 = Warlock
//   Bit3 = Exorcist
//   Bit4 = Fusilier (must recuit Lindl to unlock Fusilier)
//   Bit5 = Amazon
//   Bit6 = Valkyrie
//   Bit7 = Archer

function lindl_recruited() => bit_transition_1(bit4(0x0D3911))


// ---------------------------------------------------------------------------------------------------
// Chapters

// 0x0D34D2: [8-bit] Chapter
//   0x00 = Chapter 1
//   0x01 = Chapter 2 Chaos
//   0x02 = Chapter 2 Law
//   0x03 = Chapter 3 Neutral
//   0x04 = Chapter 3 Chaos
//   0x05 = Chapter 3 Law
//   0x06 = Chapter 4

ChapterID = {
  "C1":  0x00,
  "C2C": 0x01,
  "C2L": 0x02,
  "C3N": 0x03,
  "C3C": 0x04,
  "C3L": 0x05,
  "C4":  0x06,
}

function chapter() => byte(0x0D34D2)
function was_chapter(id) => prev(chapter()) == ChapterID[id]
function is_chapter(id)  =>      chapter()  == ChapterID[id]

// Used as an additional point of reference for stability for event-flag trigger achievements
function chapter_stable(chapter) => chapter() == prev(chapter()) && is_chapter(chapter)
function chapter_transition(previous, next) => prev(chapter()) == ChapterID[previous] && is_chapter(next)

// Discriminators to determine which route was taken to reach Chapter 4
function on_law_route()     => bit7(0x0D3916) == 1
function on_neutral_route() => bit0(0x0D3919) == 1 && bit3(0x0D391F) == 1
function on_chaos_route()   => bit0(0x0D3919) == 1 && bit4(0x0D391F) == 1


// ---------------------------------------------------------------------------------------------------
// Event flags

// For silly alignment reasons
function bit_is_1(value) => value == 1

function bit_transition_0(value) => value < prev(value)
function bit_transition_1(value) => value > prev(value)

// 0x0D390A: [8-bit bitfield] Flags (world map related - controls whether path is present between two locations) / State of doors opened on current battlefield
// Bit0 = Road from Qadriga Fortress to Madura
// Bit1 = Visible door #1
// Bit2 = Visible door #2
// Bit3 = Hidden door #1
// Bit4 = ??
// Bit5 = ??
// Bit6 = ??
// Bit7 = ??

function door1_opened() => bit_transition_1(bit1(0x0D390A))
function door2_opened() => bit_transition_1(bit2(0x0D390A))
function hidden_door_opened() => bit_transition_1(bit3(0x0D390A))

function door1_open() => bit1(0x0D390A) == 1
function door2_open() => bit2(0x0D390A) == 1
function hidden_door_open() => bit3(0x0D390A) == 1

// -----------------------------
// Chapter 1

// 0x0D3914: [8-bit bitfield] Event flags - Chapter 1 (3 / 6)
//   Bit0 = Completed Krysaro battle
//   Bit1 = Tynemouth Hill battle: Competed Canpus' initial dialogue
//   Bit2 = ??
//   Bit3 = Krysaro battle: Presance dead
//   Bit4 = Completed cutscene after Krysaro battle (Presance alive)
//   Bit5 = Completed cutscene after Krysaro battle (Preaance dead)
//   Bit6 = Completed Qadriga Fortress battle
//   Bit7 = Completed cutscene at Almorica after Krysaro

function c1_krysaro_battle() => bit_transition_1(bit0(0x0D3914))
function c1_qadriga_battle() => bit_transition_1(bit6(0x0D3914))

// 0x0D3917: [8-bit bitfield] Event flags - Chapter 1 (4 / 6)
//   Bit0 = Completed Golborza Plain battle
//   Bit1 = Completed Rhime battle
//   Bit2 = Rhime battle: Chose to help Cistina
//   Bit3 = Rhime battle: Chose not to help Cistina
//   Bit4 = Rhime battle: Cistina dead
//   Bit5 = Completed post-Rhime cutscene ("For Walister")
//   Bit6 = Completed post-Rhime cutscene ("For peace")
//   Bit7 = Completed post-Rhime cutscene (had chosen not to help Cistina)

function c1_golborza_battle() => bit_transition_1(bit0(0x0D3917))
function c1_rhime_battle()    => bit_transition_1(bit1(0x0D3917))

// 0x0D3916: [8-bit bitfield] Event flags - Chapter 1 (5 / 6)
//   Bit0 = Completed Phidoch Castle cutscene
//   Bit1 = Phidoch cutscene: ("Not now sister")
//   Bit2 = Phidoch cutscene: ("We were fools")
//   Bit3 = Completed Almorica cutscene (post-Phidoch)
//   Bit4 = Completed Lake Bordu battle
//   Bit5 = Completed Xeod Moors battle
//   Bit6 = Completed first Balmamusa battle
//   Bit7 = Balmamusa decision: ("I understand")

function c1_bordu_battle() => bit_transition_1(bit4(0x0D3916))
function c1_xeod_battle()  => bit_transition_1(bit5(0x0D3916))
function c1_balmamusa_1()          => bit_is_1(bit6(0x0D3916))
function c1_law_choice()   => bit_transition_1(bit7(0x0D3916))

// 0x0D3919: [8-bit bitfield] Event flags - Chapter 1 (6 / 6) / Chapter 2 Chaos (1 / 7)
//   Bit0 = 1: Balmamusa decision: ("Stop this lunacy")
//   Bit1 = 2C: Completed opening cutscene at Port Asyton (Canopus alive)
//   Bit2 = 2C: Completed opening cutscene at Port Asyton (Canopus dead)
//   Bit3 = 2C: Completed battle at Port Asyton
//   Bit4 = 2C: Port Asyton battle: First dialogue between Denam and Arycelle
//   Bit5 = 2C: Port Asyton battle: Second dialogue between Denam and Arycelle
//   Bit6 = 2C: Port Asyton battle: Third dialogue between Denam and Arycelle
//   Bit7 = 2C: Completed battle at Xeod Moors

function c1_chaos_choice()   => bit_transition_1(bit0(0x0D3919))
function c2c_asyton_battle() => bit_transition_1(bit3(0x0D3919))
function c2c_xeod_battle()   => bit_transition_1(bit7(0x0D3919))

// 0x0D3918: [8-bit bitfield] Event flags - Chapter 2 Chaos (2 / 7)
//   Bit0 = Completed battle at Lake Bordu
//   Bit1 = Completed battle at Tynemouth Hill
//   Bit2 = Tynemouth Hill battle: Dialogue from Arycelle
//   Bit3 = Tynemouth Hill battle: Arycelle dead
//   Bit4 = Tynemouth Hill battle: Dialogue between Denam and Vyce
//   Bit5 = Completed battle at Krysaro
//   Bit6 = Completed cutscene at Krysaro with Folcurt (Cistina alive)
//   Bit7 = Completed cutscene at Krysaro with Folcurt (Cistina dead)

function c2c_bordu_battle()   => bit_transition_1(bit0(0x0D3918))
function c2c_vyce_battle()    => bit_transition_1(bit1(0x0D3918))
function c2c_krysaro_battle() => bit_transition_1(bit5(0x0D3918))

// 0x0D391B: [8-bit bitfield] Event flags - Chapter 2 Chaos (3 / 7)
//   Bit0 = Completed battle at Qadriga Fortress
//   Bit1 = Qadriga battle: Folcurt dead
//   Bit2 = Qadriga battle: Bayin dead
//   Bit3 = Post Qadriga Fortress cutscene: (Folcurt and Bayin alive, "We will help")
//   Bit4 = Post Qadriga Fortress cutscene: (Folcurt and Bayin alive, "We must decline")
//   Bit5 = Post Qadriga Fortress cutscene: (Folcurt and Bayin alive, Cistina dead)
//   Bit6 = Post Qadriga Fortress cutscene: (Folcurt alive, Bayin dead)
//   Bit7 = Post Qadriga Fortress cutscene: (Folcurt dead, "We will help")

function c2c_qadriga_battle() => bit_transition_1(bit0(0x0D391B))

// 0x0D391A: [8-bit bitfield] Event flags - Chapter 2 Chaos (4 / 7)
//   Bit0 = Post Qadriga Fortress cutscene: (Folcurt dead, "We must decline")
//   Bit1 = Post Qadriga Fortress cutscene: (Folcurt dead, Cistina dead)
//   Bit2 = Post Qadriga Fortress cutscene (Folcurt & Bayin dead)
//   Bit3 = Complete battle at Ndamsa
//   Bit4 = Ndamsa battle: Folcurt dead
//   Bit5 = Ndamsa battle: Bayin dead
//   Bit6 = Completed post-Ndamsa cutscene (Folcurt and Bayin alive)
//   Bit7 = Completed post-Ndamsa cutscene (Folcurt dead)

function c2c_ndamsa_battle() => bit_transition_1(bit3(0x0D391A))

// 0x0D391D: [8-bit bitfield] Event flags - Chapter 2 Chaos (5 / 7)
//   Bit0 = Completed post-Ndamsa cutscene (Bayin dead)
//   Bit1 = Completed post-Ndamsa cutscene (Folcurt and Bayin dead)
//   Bit2 = ??
//   Bit3 = ??
//   Bit4 = Completed battle at Golyat
//   Bit5 = Golyat: Folcurt dead
//   Bit6 = Golyat: Bayin dead
//   Bit7 = Golyat: Cistina dead

function c2c_golyat_battle() => bit_transition_1(bit4(0x0D391D))

// 0x0D391C: [8-bit bitfield] Event flags - Chapter 2 Chaos (6 / 7)
//   Bit0 = Completed cutscene at Boed
//   Bit1 = Completed cutscene at Boed: ("You chase a dream..." / "It's not about Bakram")
//   Bit2 = Completed cutscene at Boed: (Folcurt, "I don't care")
//   Bit3 = Completed cutscene at Boed: (Bayin, "I don't care")
//   Bit4 = Completed battle and cutscenes at Rhime
//   Bit5 = Completed battle at Golborza
//   Bit6 = Completed battle at Almorica Gates
//   Bit7 = Completed battle at Almorica Passage

function c2c_rhime_battle()    => bit_transition_1(bit4(0x0D391C))
function c2c_golborza_battle() => bit_transition_1(bit5(0x0D391C))

// 0x0D391F: [8-bit bitfield] Event flags - Chapter 2 Chaos (7 / 7) / Chapter 2 Law (1 / 4)
//   Bit0 = 2C: Almorica Passage battle: First dialogue between Denam and Vyce
//   Bit1 = 2C: Almorica Passage battle: Second dialogue between Denam and Vyce
//   Bit2 = 2C: Almorica Passage battle: Third dialogue between Denam and Vyce
//   Bit3 = 2C: Almorica Passage battle: ("You're right")
//   Bit4 = 2C: Almorica Passage battle: ("I can't do that")
//   Bit5 = 2L: Completed battle at Balmamusa
//   Bit6 = 2L: Completed battle at Xeod Moors
//   Bit7 = 2L: Completed first battle at Port Asyton

function c2c_neutral_choice()   => bit_transition_1(bit3(0x0D391F))
function c2c_chaos_choice()     => bit_transition_1(bit4(0x0D391F))
function c2l_balmamusa_battle() => bit_transition_1(bit5(0x0D391F))
function c2l_xeod_battle()      => bit_transition_1(bit6(0x0D391F))
function c2l_asyton_battle()    => bit_transition_1(bit7(0x0D391F))

// 0x0D391E: [8-bit bitfield] Event flags - Chapter 2 Law (2 / 4)
//   Bit0 = Completed second battle at Port Asyton
//   Bit1 = Port Asyton: First dialogue between Denam and Arycelle
//   Bit2 = Port Asyton: Second dialogue from Arycelle
//   Bit3 = Port Asyton: Third dialogue between Denam and Arycelle
//   Bit4 = Completed post-Port Asyton cutscene with Denam and Catiua
//   Bit5 = Completed battle at Qadriga Fortress
//   Bit6 = Qadriga Fortress battle: Xapan dead
//   Bit7 = Qadriga Fortress battle: ("Why not?")

function c2l_arycelle_battle() => bit_transition_1(bit0(0x0D391E))
function c2l_qadriga_battle()  => bit_transition_1(bit5(0x0D391E))

// 0x0D3921: [8-bit bitfield] Event flags - Chapter 2 Law (3 / 4)
//   Bit0 = Completed battle at Tynemouth Hill
//   Bit1 = Completed cutscenes at Almorica
//   Bit2 = Completed Xapan cutscene at Almorica
//   Bit3 = Completed battle at Golborza Plain
//   Bit4 = Completed Rhime cutscene
//   Bit5 = Rhime cutscene ("This is my calling")
//   Bit6 = Rhime cutscene ("I could never...")
//   Bit7 = Completed battle at Rhime

function c2l_tynemouth_battle() => bit_transition_1(bit0(0x0D3921))
function c2l_golborza_battle()  => bit_transition_1(bit3(0x0D3921))
function c2l_rhime_battle()     => bit_transition_1(bit7(0x0D3921))

// 0x0D3920: [8-bit bitfield] Event flags - Chapter 2 Law (4 / 4) / Chapter 3 Neutral (1 / 7)
//   Bit0 = 2L: Rhime battle: Dialogue from Vyce
//   Bit1 = 2L: Rhime battle: Dialogue from Arycelle
//   Bit2 = 2L: Rhime battle: Arycelle dead
//   Bit3 = 2L: Completed battle at Almorica Gates
//   Bit4 = 2L: Completed battle at Almorica Passageway
//   Bit5 = 2L: Completed battle with Leonar
//   Bit6 = 3N: Completed Gates of Almorica Battle
//   Bit7 = 3N: Almorica: cutscene with Mirdyn and Canopus

function c2l_leonar_battle()   => bit_transition_1(bit5(0x0D3920))
function c3n_almorica_battle() => bit_transition_1(bit6(0x0D3920))

// 0x0D3923: [8-bit bitfield] Event flags - Chapter 3 Neutral (2 / 7)
//   Bit0 = Almorica: Completed cutscene with Mirdyn (Canopus dead)
//   Bit1 = Completed battle at Boed Fortress
//   Bit2 = Boed Fortress battle: Cerya dead
//   Bit3 = Completed cutscene at Boed Fortress (Cerya alive)
//   Bit4 = Completed cutscene at Boed Fortress (Cerya alive, Cistina dead)
//   Bit5 = Completed post-Boed cutscenes at Almorica
//   Bit6 = Completed battle at Tynemouth Hill
//   Bit7 = Completed battle at Port Asyton

function c3n_boed_battle()      => bit_transition_1(bit1(0x0D3923))
function c3n_boed_cerya_dead()  =>         bit_is_1(bit2(0x0D3923))
function c3n_tynemouth_battle() => bit_transition_1(bit6(0x0D3923))
function c3n_asyton_battle()    => bit_transition_1(bit7(0x0D3923))

// 0x0D3922: [8-bit bitfield] Event flags - Chapter 3 Neutral (3 / 7)
//   Bit0 = Completed scene with Leonar at Krysaro
//   Bit1 = Completed battle at Qadriga Fortress
//   Bit2 = Qadriga Fortress battle: Phaesta dialogue
//   Bit3 = Qadriga Fortress battle: Tamuz dialogue
//   Bit4 = Qadriga Fortress battle: Chamos dialogue
//   Bit5 = Completed cutscenes at Qadriga Fortress
//   Bit6 = Qadriga Fortress: ("In truth, yes")
//   Bit7 = Qadriga Fortress: ("I am no longer certain")

function c3n_qadriga_battle() => bit_transition_1(bit1(0x0D3922))

// 0x0D3925: [8-bit bitfield] Event flags - Chapter 3 Neutral (4 / 7)
//   Bit0 = Qadriga Fortress: ("I can't accept you")
//   Bit1 = Port Asyton cutscene ("You may join us")
//   Bit2 = Port Asyton cutscene: ("I must refuse")
//   Bit3 = Port Asyton cutscene (Dievold dead, "You may join us")
//   Bit4 = Port Asyton cutscene (Dievold dead, "I must refuse")
//   Bit5 = Port Asyton battle: Oelias dead
//   Bit6 = Port Asyton battle: Dievold dead
//   Bit7 = Port Asyton cutscene: (Oelias dead)

// 0x0D3924: [8-bit bitfield] Event flags - Chapter 3 Neutral (5 / 7)
//   Bit0 = Completed battle at Hedon
//   Bit1 = Completed battle at Hagia Banhamuba
//   Bit2 = Completed battle at Ndamsa
//   Bit3 = Ndamsa battle: Dialogue from Denam
//   Bit4 = Ndamsa battle: Dialogue from Mirdyn
//   Bit5 = Ndamsa battle: Dialogue from Canopus
//   Bit6 = Ndamsa battle: Dialogue from Oelias
//   Bit7 = Ndamsa battle: Dialogue from Gildas

function c3n_hedon_battle()     => bit_transition_1(bit0(0x0D3924))
function c3n_banhamuba_battle() => bit_transition_1(bit1(0x0D3924))
function c3n_nybeth_battle()    => bit_transition_1(bit2(0x0D3924))

// 0x0D3927: [8-bit bitfield] Event flags - Chapter 3 Neutral (6 / 7)
//   Bit0 = Completed battle at Coritanae Ward
//   Bit1 = Completed battle at Golyat
//   Bit2 = Golyat: ("You'd be welcome")
//   Bit3 = Golyat: ("I can't accept you")
//   Bit4 = Completed post-Ndamsa cutscene at Almorica
//   Bit5 = Completed battle at Coritanae Gates
//   Bit6 = Completed battle at Weobry
//   Bit7 = Completed battle at Rhime

function c3n_xaebos_battle() => bit_transition_1(bit0(0x0D3927))
function c3n_orgeau_battle() => bit_transition_1(bit1(0x0D3927))
function c3n_weobry_battle() => bit_transition_1(bit6(0x0D3927))
function c3n_rhime_battle()  => bit_transition_1(bit7(0x0D3927))

// 0x0D3926: [8-bit bitfield] Event Flags - Chapter 3 Neutral (7 / 7) / Chapter 3 Chaos (1 / 5)
//   Bit0 = 3N: Completed cutscenes at Rhime
//   Bit1 = 3N: Completed cutscenes at Almorica
//   Bit2 = 3N: Completed battle at Phidoch South Wall
//   Bit3 = 3N: Completed battle at Phidoch West Wall
//   Bit4 = 3N: Completed battle at Phidoch Hall
//   Bit5 = 3C: Completed opening cutscenes (Canopus alive)
//   Bit6 = 3C: Completed opening cutscenes (Canopus dead)
//   Bit7 = 3C: Completed Port Asyton battle

function c3n_ozma_battle()   => bit_transition_1(bit4(0x0D3926))
function c3c_asyton_battle() => bit_transition_1(bit7(0x0D3926))

// 0x0D3929: [8-bit bitfield] Event flags = Chapter 3 Chaos (2 / 5)
//   Bit0 = Completed battle at Xeod Moors
//   Bit1 = Completed battle at Coritanae Gates
//   Bit2 = Completed battle at Coritanae Ward
//   Bit3 = Completed battle at Coritanae Ward: ("You're leaving?")
//   Bit4 = Completed battle at Coritanae Ward: ("You're being selfish")
//   Bit5 = Completed battle at Bahanna
//   Bit6 = Completed battle at Brigantys South Wall
//   Bit7 = Brigantys South Wall: Dialogue from Canopus

function c3c_xeod_battle()        => bit_transition_1(bit0(0x0D3929))
function c3c_coritanae_battle_1() => bit_transition_1(bit2(0x0D3929))
function c3c_bahanna_battle_1()   => bit_transition_1(bit5(0x0D3929))

// 0x0D3928: [8-bit bitfield] Event flags - Chapter 3 Chaos (3 / 5)
//   Bit0 = Completed battle at Brigantys West Wall
//   Bit1 = Brigantys West Wall: Dialogue from Canopus
//   Bit2 = Completed battle at Brigantys Passageway
//   Bit3 = Completed battle at Bahanna
//   Bit4 = Bahanna: Hobyrim dead
//   Bit5 = Bahanna: ("You'd be welcome")
//   Bit6 = Bahanna: ("I can't accept you")
//   Bit7 = Completed battle at Coritanae Gates

function c3c_xaebos_battle()    => bit_transition_1(bit2(0x0D3928))
function c3c_bahanna_battle_2() => bit_transition_1(bit3(0x0D3928))

// 0x0D392B: [8-bit bitfield] Event flags - Chapter 3 Chaos (4 / 5)
//   Bit0 = Completed battle at Coritanae Ward
//   Bit1 = Completed battle at Weobry
//   Bit2 = Completed battle at Rhime
//   Bit3 = Completed cutscenes at Almorica (Canopus alive)
//   Bit4 = Completed cutscenes at Almorica (Canopus dead)
//   Bit5 = Completed battle at Boed Fortress
//   Bit6 = Completed cutscenes at Boed Fortress (Cistina alive)
//   Bit7 = Completed cutscenes at Boed Fortress (Cistina dead)

function c3c_leonar_battle() => bit_transition_1(bit0(0x0D392B))
function c3c_weobry_battle() => bit_transition_1(bit1(0x0D392B))
function c3c_rhime_battle()  => bit_transition_1(bit2(0x0D392B))
function c3c_boed_battle()   => bit_transition_1(bit5(0x0D392B))

// 0x0D392A: [8-bit bitfield] Event flags - Chapter 3 Chaos (5 / 5) / Chapter 3 Law (1 / 4)
//   Bit0 = 3C: Completed battle at Phidoch South Wall
//   Bit1 = 3C: Completed battle at Phidoch West Wall
//   Bit2 = 3C: Phidoch Hall: Ozma dead before Oz
//   Bit3 = 3C: Phidoch Hall: Oz dead before Ozma
//   Bit4 = 3C: Completed battle at Phidoch Hall
//   Bit5 = 3L: Completed battle at Madura
//   Bit6 = 3L: Completed battle at Brigantys South Wall
//   Bit7 = 3L: Brigantys South Wall battle: witnessed dialogue from Canopus

function c3c_ozma_dead()      =>         bit_is_1(bit2(0x0D392A))
function c3c_oz_dead()        =>         bit_is_1(bit3(0x0D392A))
function c3c_oz_ozma_battle() => bit_transition_1(bit4(0x0D392A))
function c3l_madura_battle()  => bit_transition_1(bit5(0x0D392A))

// 0x0D392D: [8-bit bitfield] Event flags - Chapter 3 Law (2 / 4)
//   Bit0 = Completed battle at Brigantys West Wall
//   Bit1 = Brigantys West Wall battle: witnessed dialogue from Canopus
//   Bit2 = Completed battle at Brigantys Passageway
//   Bit3 = Brigantys cutscene: ("No, they're not")
//   Bit4 = Brigantys cutscene: ("How could they be?")
//   Bit5 = Completed battle at Bahanna
//   Bit6 = Completed battle at Coritanae Gates
//   Bit7 = Completed battle at Coritanae Ward

function c3l_brigantys_battle() => bit_transition_1(bit2(0x0D392D))
function c3l_bahanna_battle()   => bit_transition_1(bit5(0x0D392D))
function c3l_coritanae_battle() => bit_transition_1(bit7(0x0D392D))

// 0xD392C: [8-bit bitfield] Event flags - Chapter 3 Law (3 / 4)
//   Bit0 = Coritanae Ward: First dialogue between Jeunan and Gatialo
//   Bit1 = Coritanae Ward: Second dialogue between Jeunan and Gatialo
//   Bit2 = Completed battle at Lake Bordu or Psonji Weald
//   Bit3 = Completed battle at Tynemouth Hill
//   Bit4 = Completed battle at Almorica Gates
//   Bit5 = Completed battle at Almorica Passageway
//   Bit6 = Almorica: Mirdyn & Gildas recruitment cutscene (Canopus alive)
//   Bit7 = Almorica: Mirdyn & Gildas recruitment cutscene (Canopus dead)

function c3l_jeunan_backstory() => bit_transition_1(bit1(0xD392C))
function c3l_bordu_or_psonji()  => bit_transition_1(bit2(0xD392C))
function c3l_tynemouth_battle() => bit_transition_1(bit3(0xD392C))
function c3l_xaebos_battle()    => bit_transition_1(bit5(0xD392C))

// 0x0D392F: [8-bit bitfield] Events flags - Chapter 3 Law (4 / 4)
//   Bit0 = Completed battle at Weobry
//   Bit1 = Completed battle at Rhime
//   Bit2 = Completed battle at Phidoch South Wall
//   Bit3 = Completed battle at Phidoch West Wall
//   Bit4 = Completed first battle with Oz at Phidoch Hall
//   Bit5 = Rhime battle: Hobyrim dead
//   Bit6 = Rhime battle: ("You'd be welcome")
//   Bit7 = Rhime battle: ("I can't accept you")

function c3l_weobry_battle() => bit_transition_1(bit0(0x0D392F))
function c3l_rhime_battle()  => bit_transition_1(bit1(0x0D392F))
function c3l_rhime_hobyrim_dead()    => bit_is_1(bit5(0x0D392F))

// 0x0D392E: [8-bit bitfield] Event flags - Chapter 4 (1 / 17)
//   Bit0 = C3 Law: Completed second battle with Oz at Phidoch Hall
//   Bit1 = Read Warren Report entry "Deneb's Emporium"
//   Bit2 = Deneb able to be recruited
//   Bit3 = ??
//   Bit4 = Completed Hobyrim backstory cutscene at Krysaro
//   Bit5 = Completed battle at Bahanna
//   Bit6 = Completed events at Brigantys
//   Bit7 = Completed battle at Brigantys west wall

function c3l_oz_battle()        => bit_transition_1(bit0(0x0D392E))
function c4_hobyrim_backstory() => bit_transition_1(bit4(0x0D392E))
function c4_bahanna_battle()    => bit_transition_1(bit5(0x0D392E))
function c4_brigantys_event()   => bit_transition_1(bit6(0x0D392E))
function c4_brigantys_west_battle()     => bit_is_1(bit7(0x0D392E))

// 0x0D3931: [8-bit bitfield] Event Flags - Chapter 4 (2 / 17)
//   Bit0 = ??
//   Bit1 = Completed battle at Brigantys south wall
//   Bit2 = Completed cutscenes at Brigantys (Cistina and Cerya present)
//   Bit3 = ??
//   Bit4 = ??
//   Bit5 = ??
//   Bit6 = ??
//   Bit7 = Completed cutscenes at Brigantys (Cistina present)

function c4_brigantys_south_battle() => bit_is_1(bit1(0x0D3931))

// 0x0D3930: [8-bit bitfield] Event flags - Chapter 4 (3 / 17)
//   Bit0 = ??
//   Bit1 = Completed cutscenes at Brigantys (No sisters recruited)
//   Bit2 = Completed battle at Mt. Hedon
//   Bit3 = Completed battle at Hagia Banhamuba
//   Bit4 = Hagia Banhamuba battle: Olivya dialogue
//   Bit5 = Hagia Banhamuba battle: Cistina dialogue
//   Bit6 = Hagia Banhamuba battle: Cerya dialogue
//   Bit7 = Completed battle at Hagia Banhamuba with Sherri alive

function c4_hedon_battle()     => bit_transition_1(bit2(0x0D3930))
function c4_banhamuba_battle() => bit_transition_1(bit3(0x0D3930))

// 0x0D3933: [8-bit bitfield] Event flags - Chapter 4 (4 / 17)
//   Bit0 = Completed events at Hagia Banhamuba (Sherri dead)
//   Bit1 = Hagia Banhamuba: ("That I cannot do")
//   Bit2 = Hagia Banhamuba: ("I'll do what I must")
//   Bit3 = Completed cutscene at Phidoch Castle (post Hagia Banhamuba)
//   Bit4 = Completed battle at Lambiss Hill
//   Bit5 = Completed battle at Barnicia Gates
//   Bit6 = Completed battle at Barnicia Courtyard
//   Bit7 = Barnicia Courtyard: Dialogue between Gildas and Barbas

function c4_lambiss_hill_battle() => bit_transition_1(bit4(0x0D3933))
function c4_barnicia_gates()      => bit_transition_1(bit5(0x0D3933))
function c4_barnicia_barbas()     => bit_transition_1(bit6(0x0D3933))

// 0x0D3932: [8-bit bitfield] Event Flags - Chapter 4 (5 / 17)
//   Bit0 = Barnicia Courtyard: Dialogue between Mirdyn and Barbas
//   Bit1 = Barnicia Courtyard: Dialogue between Canopus, Gildas, and Barba
//   Bit2 = Barnicia Courtyard: Dialogue between Canopus and Barbas
//   Bit3 = Barnicia courtyard: Dialogue between Vyce, Denam, and Barbas
//   Bit4 = Completed battle at Barnicia Passage
//   Bit5 = Barnicia Passage: Dialogue between Denam and Catiua
//   Bit6 = Completed battle at Barnicia Passage (Catiua dead)
//   Bit7 = Completed battle at Barnicia Passage (Catiua alive)

function c4_barnicia_catiua_dead() =>    bit_is_1(bit6(0x0D3932))
function c4_lanselot_battle() => bit_transition_1(bit4(0x0D3932))

// 0x0D3935: [8-bit bitfield] Event Flags - Chapter 4 (6 / 17)
//   Bit0 = Barnicia: first dialogue between Denam and Lanselot
//   Bit1 = Barnicia: Second dialogue between Denam and Lanselot
//   Bit2 = Completed battle at Barnicia Passageway (Catiua Absent)
//   Bit3 = Catiua commits suicide (Present in battle, wrong first dialogue choice)
//   Bit4 = Catiua and Denam reconcile (Present in battle, correct dialogue choices)
//   Bit5 = Catiua commits suicide (Present in battle, wrong second dialogue choice)
//   Bit6 = Catiua commits suicide (Absent from battle, wrong first dialogue choice)
//   Bit7 = Catiua commits suicide (Absent from battle, wrong second dialogue choice)

// 0x0D3934: [8-bit bitfield] Event Flags - Chapter 4 (7 / 17)
//   Bit0 = Denam and Catiua reconcile (absent from battle, correct dialogue choices)
//   Bit1 = Completed post-Barnicia cutscene at Phidoch
//   Bit2 = Completed post-Barnicia cutscene at Phidoch (Catiua dead)
//   Bit3 = ??
//   Bit4 = Read Warren Report entry 'Blast on Exeter'
//   Bit5 = Read Warren Report entry 'Rhamsen Wreck Raised"
//   Bit6 = Cutscene in Phidoch after Catiua dead in battle, starts Boulder Sands questline
//   Bit7 = Completed battle at Boulder Sands

function c4_boulder_sands_battle() => bit_transition_1(bit7(0x0D3934))

// 0x0D3937: [8-bit bitfield] Event flags - Chapter 4 (8 / 17)
//   Bit0 = Completed battle at Iorumza
//   Bit1 = Completed battle at Oeram Town
//   Bit2 = Completed battle at Heim Postern Gate
//   Bit3 = Completed battle at Heim Gates
//   Bit4 = Completed battle at Heim South Wall
//   Bit5 = Completed battle at Heim Courtyard
//   Bit6 = Completed battle at Heim Great Hall
//   Bit7 = Heim Great Hall: Dialogue between Denam and Brantyn

function c4_iorumza_battle() => bit_transition_1(bit0(0x0D3937))
function c4_oeram_battle()   => bit_transition_1(bit1(0x0D3937))
function c4_brantyn_battle() => bit_transition_1(bit6(0x0D3937))

// 0x0D3936: [8-bit bitfield] Event flags - Chapter 4 (9 / 17)
//   Bit0 = Post-Heim cutscenes (Catiua dead)
//   Bit1 = ??
//   Bit2 = Lanselot at monastery cutscene (Catiua alive)
//   Bit3 = Lanselot at monastery cutscene (Catiua dead)
//   Bit4 = ??
//   Bit5 = Completed battle at Twixt Heaven and Earth
//   Bit6 = Twixt Heaven and Earth: Dialogue between Canopus and Andoras
//   Bit7 = Chamber of the Seal: Martym dead

function c4_andoras_battle()   => bit_transition_1(bit5(0x0D3936))
function c4_tomb_martym_dead() => bit_transition_1(bit7(0x0D3936))

// 0x0D3939: [8-bit bitfield] Flags - Chapter 4 / Sidequests (10 / 17)
//   Bit0 = Chamber of the Seal: Barbas dead
//   Bit1 = Completed cutscene revealing Xenobians' true purpose in Valeria
//   Bit2 = Completed cutscene at Almorica between Deneb, Canopus, and Warren
//   Bit3 = Completed Sherri recruitment event at Balmamusa
//   Bit4 = Read Warren Report entry "Pirates of Qadriga"
//   Bit5 = Completed events at Qadriga Fortress
//   Bit6 = Completed events at Qadriga Fortress without fighting
//   Bit7 = Completed Apocrypha conversation with Mreuva at Coritanae

function c4_tomb_barbas_dead()  => bit_transition_1(bit0(0x0D3939))
function c4_xenobia_backstory() => bit_transition_1(bit1(0x0D3939))
function c4_deneb_and_canopus() => bit_transition_1(bit2(0x0D3939))
function c4_qadriga_pirates()   => __ornext(bit_transition_1(bit5(0x0D3939)) || bit_transition_1(bit6(0x0D3939)))

// 0x0D3938: [8-bit bitfield] Event flags - Chapter 4 / Sidequests (11 / 17)
//   Bit0 = Apocrypha conversation: "I wonder..."
//   Bit1 = Apocrypha conversation "I know I will"
//   Bit2 = ??
//   Bit3 = Promoted Cerya to shaman
//   Bit4 = Promoted Cistina to shaman
//   Bit5 = Promoted Sherri to shaman
//   Bit6 = Promoted Olivya to shaman
//   Bit7 = Completed battle at Grimsby

function c4_cerya_promotion()   => bit_transition_1(bit3(0x0D3938))
function c4_cistina_promotion() => bit_transition_1(bit4(0x0D3938))
function c4_sherri_promotion()  => bit_transition_1(bit5(0x0D3938))
function c4_olivya_promotion()  => bit_transition_1(bit6(0x0D3938))
function c4_grimsby_battle()    => bit_transition_1(bit7(0x0D3938))

// 0x0D393B: [8-bit bitfield] Event flags - Chapter 4 / Sidequests (12 / 17)
//   Bit0 = Read Warren Report entry "Bandits of Neimrahava"
//   Bit1 = Completed battle at Boed Fortress
//   Bit2 = Opened Xoshonell Temple at Boed Fortress
//   Bit3 = Completed Xoshonell Temple
//   Bit4 = Completed battle at Ndamsa Fortress
//   Bit5 = Opened Hahnela Temple at Ndamsa Fortress
//   Bit6 = Complete battle at Hahnela Temple
//   Bit7 = Completed battle at Gecho Fortress
function c4_boed_battle()      =>                  bit1(0x0D393B)
function c4_xoshonell_temple() => bit_transition_1(bit3(0x0D393B))
function c4_ndamsa_battle()    =>                  bit4(0x0D393B)
function c4_hahnela_temple()   => bit_transition_1(bit6(0x0D393B))
function c4_gecho_battle()     =>                  bit7(0x0D393B)

// 0x0D393A: [8-bit bitfield] Event flags - Chapter 4 / Sidequests (13 / 17)
//   Bit0 = Opened Vaasa Temple at Gecho Fortress
//   Bit1 = Completed battle at Vaasa Temple
//   Bit2 = Completed battle at Fortress Geyld
//   Bit3 = Opened Greuza Temple at Fortress Geyld
//   Bit4 = Completed battle at Greuza Temple
//   Bit5 = Completed battle at Neimrahava
//   Bit6 = Killed Berda Jr.
//   Bit7 = Killed Obda Jr.

function c4_vaasa_temple()  => bit_transition_1(bit1(0x0D393A))
function c4_gelyd_battle()  =>                  bit2(0x0D393A)
function c4_greuza_temple() => bit_transition_1(bit4(0x0D393A))
function c4_neimrahava()    => bit_transition_1(bit5(0x0D393A))

// 0x0D393D: [8-bit bitfield] Event flags - Chapter 4 / Sidequests (14 / 17)
//   Bit0 = Xapan battle at Golyat available
//   Bit1 = Completed battle at Golyat
//   Bit2 = Got Xapan below 20HP
//   Bit3 = Completed battle at Madura
//   Bit4 = Completed battle at Belmorose
//   Bit5 = Completed Ocionne battle at Belmorose
//   Bit6 = Belmorose: Dialogue between Jeunan and Ocionne
//   Bit7 = Belmorose: Dialogue between Denam and Ocionne

function c4_golyat_battle()    => bit_transition_1(bit1(0x0D393D))
function c4_madura_battle()    =>                  bit3(0x0D393D)
function c4_belmorose_battle() =>                  bit4(0x0D393D)

// 0x0D393C: [8-bit bitfield] Event flags - Chapter 4 / Sidequests (15 / 17)
//   Bit0 = Completed battle at Bortegun Fens
//   Bit1 = PotD: Completed Falfadel battle on floor 1
//   Bit2 = PotD: Completed Rudlum battle on floor 2
//   Bit3 = PotD: Floor 2: Rudlum dead
//   Bit4 = Potd: Completed Xadoba battle on floor 3
//   Bit5 = PotD: Completed Nybeth battle on floor 4 (neutral)
//   Bit6 = PotD: Nybeth battle - Oelias and Nybeth dialogue
//   Bit7 = PotD: Completed Nybeth battle on floor 4 (law / chaos)

function c4_bortegun_battle() =>                  bit0(0x0D393C)
function c4_potd_floor_4()    => __ornext(bit_transition_1(bit5(0x0D393C)) || bit_transition_1(bit7(0x0D393C)))

// 0x0D393F: [8-bit bitfield] Event flags - Chapter 4 / Sidequests (16 / 17)
//   Bit0 = PotD: Floor 4 Leonar death dialogue
//   Bit1 = ??
//   Bit2 = PotD: Rodrick ability: Dirge Sword
//   Bit3 = PotD: Rodrick ability: Restless
//   Bit4 = PotD: Rodrick ability: Hellfire
//   Bit5 = PotD: Rodrick ability: Indomitable
//   Bit6 = PotD: Rodrick ability: Raging Peak
//   Bit7 = PotD: Rodrick ability: Dragon Fang

// 0x0D393E: [8-bit bitfield] Event flags - Chapter 4 / Sidequests (17 / 17)
//   Bit0 = PotD: Rodrick ability: Moonlight
//   Bit1 = PotD: Rodrick ability: Gale Cutter
//   Bit2 = PotD: Rodrick ability: Space Rift
//   Bit3 = PotD: Rodrick ability: Demon Sword
//   Bit4 = PotD: Completed Belzebuth battle on floor 50
//   Bit5 = PotD: Completed Vepahl battle on floor 25
//   Bit6 = PotD: Completed Nybeth battle on floor 100
//   Bit7 = Read Warren Report entry "A Traitor in Our Midst?"

function c4_potd_floor_25()  => bit_transition_1(bit5(0x0D393E))
function potd_floor_25_clear()       => bit_is_1(bit5(0x0D393E))
function c4_potd_floor_50()  => bit_transition_1(bit4(0x0D393E))
function potd_floor_50_clear()       => bit_is_1(bit4(0x0D393E))
function c4_potd_floor_100() => bit_transition_1(bit6(0x0D393E))
function potd_floor_100_clear()      => bit_is_1(bit6(0x0D393E))

// 0x0D3913: [8-bit bitfield] Event flags - Miscellaneous
//   Bit0 = ??
//   Bit1 = ??
//   Bit2 = ??
//   Bit3 = ??
//   Bit4 = ??
//   Bit5 = ??
//   Bit6 = C1: Completed events after rescuing Duke Ronwey
//   Bit7 = C4: Defeated Dorgalua

function c1_ronwey_rescued()  => bit_transition_1(bit6(0x0D3913))
function c4_dorgalua_battle() => bit_transition_1(bit7(0x0D3913))
function c4_dorgalua_dead()   => bit_is_1(bit7(0x0D3913))


// ---------------------------------------------------------------------------------------------------
// Progression, sidequest, and completion achievements

function event_flag_trigger(flicker_protection, flag_transition) => (
  load_protection() && 
  flicker_protection && flag_transition
)


// Chapter 1 -------------------
achievement(
  title = "Liberation", id = 426239,
  description = "Liberate Almorica Castle and save Duke Ronwey from execution during chapter 1",
  type = "progression", points = 1,
  trigger = event_flag_trigger(chapter_stable("C1"), c1_ronwey_rescued())
)

// This battle doesn't set an event flag upon victory -> sets an event flag during the cutscene before
// the battle starts instead. Can't use normal trigger logic.
// TODO: Consider using event script ID for Orba's death event rather than triggering on music ID
achievement(
  title = "Making Peace with the Light", id = 435592,
  description = "Defeat Orba the Iridescent at Tynemouth Hill during chapter 1",
  type = "progression", points = 3,
  trigger = (
    is_game_state("Field Program") &&
    is_map("Tynemouth Hill") &&
    is_story_encounter("Orba") &&
    !was_music("Glory") &&
    is_music("Glory")
  )
)

achievement(
  title = "The Sepulchral Sleep of Death", id = 435547,
  description = "Defeat Necroprentice Moldova at Krysaro Town during chapter 1",
  type = "progression", points = 5,
  trigger = event_flag_trigger(chapter_stable("C1"), c1_krysaro_battle())
)

achievement(
  title = "From Ink of Blackest Night", id = 435548,
  description = "Defeat Consul Nybeth Obdilord at Qadriga Fortress during chapter 1",
  type = "progression", points = 5,
  trigger = event_flag_trigger(chapter_stable("C1"), c1_qadriga_battle())
)

achievement(
  title = "The Sky Falls Together with Almorica", id = 435549,
  description = "Defeat Brezen the Stuttering at Golborza Plain during chapter 1",
  type = "progression", points = 5,
  trigger = event_flag_trigger(chapter_stable("C1"), c1_golborza_battle())
)

achievement(
  title = "Only by Putting Aside Vain Desires Is True Peace Possible", id = 426240,
  description = "Defeat Sir Bolis at Rhime during chapter 1",
  type = "progression", points = 5,
  trigger = event_flag_trigger(chapter_stable("C1"), c1_rhime_battle())
)

achievement(
  title = "Troubled Times Such as These", id = 435550,
  description = "Defeat Sir Grion at Lake Bordu during chapter 1",
  type = "progression", points = 5,
  trigger = event_flag_trigger(chapter_stable("C1"), c1_bordu_battle())
)

achievement(
  title = "Obda and Berda's First Taste of Battle", id = 435551,
  description = "Defeat Ganpp the Stubborn at Xeod Moors during chapter 1",
  type = "progression", points = 5,
  trigger = event_flag_trigger(chapter_stable("C1"), c1_xeod_battle())
)

achievement(
  title = "If Someone Must Bloody Their Hands...", id = 425193,
  description = "Accept orders at Balmamusa, for the good of the Walister cause",
  type = "progression", points = 10,
  trigger = event_flag_trigger(chapter_stable("C1"), c1_law_choice())
)

achievement(
  title = "What Virtue Lies in This Madness?", id = 425194,
  description = "Refuse orders at Balmamusa and become an outlaw",
  type = "progression", points = 10,
  trigger = event_flag_trigger(chapter_stable("C1"), c1_chaos_choice())
)

// Chapter 2 (law) -------------
achievement(
  title = "True Freedom Isn't Granted from Above, It Is Won from Below", id = 435552,
  description = "Defeat all enemy forces at Balmamusa during chapter 2 on the law route",
  type = "progression", points = 5,
  trigger = event_flag_trigger(chapter_stable("C2L"), c2l_balmamusa_battle())
)

achievement(
  title = "Only Blood Can Pay the Price of the Slain", id = 435553,
  description = "Defeat Garba of the Blue Flame at Xeod Moors during chapter 2 on the law route",
  type = "progression", points = 5,
  trigger = event_flag_trigger(chapter_stable("C2L"), c2l_xeod_battle())
)

achievement(
  title = "No Quarter to Ogres Who Slay Their Own", id = 435554,
  description = "Defeat Nadia of the Requiem at Port Asyton during chapter 2 on the law route",
  type = "progression", points = 5,
  trigger = event_flag_trigger(chapter_stable("C2L"), c2l_asyton_battle())
)

achievement(
  title = "Better the Rams Rise to Lead the Flock Than Such Shepherds", id = 425196,
  description = "Defeat Arycelle at Port Asyton during chapter 2 on the law route",
  type = "progression", points = 5,
  trigger = event_flag_trigger(chapter_stable("C2L"), c2l_arycelle_battle())
)

achievement(
  title = "A Dry Grave's No End for a Pirate", id = 435593,
  description = "Defeat Darza the Pirate at Qadriga Fortress during chapter 2 on the law route",
  type = "progression", points = 5,
  trigger = event_flag_trigger(chapter_stable("C2L"), c2l_qadriga_battle())
)

achievement(
  title = "A War Fought in the Name of Power, Not People", id = 435555,
  description = "Defeat Wynoa of the Wilds at Tynemouth Hill during chapter 2 on the law route",
  type = "progression", points = 5,
  trigger = event_flag_trigger(chapter_stable("C2L"), c2l_tynemouth_battle())
)

achievement(
  title = "Was It All to Slake a Thirst for Power?", id = 435556,
  description = "Defeat Gousin of Prayer at Golborza Plain during chapter 2 on the law route",
  type = "progression", points = 5,
  trigger = event_flag_trigger(chapter_stable("C2L"), c2l_golborza_battle())
)

achievement(
  title = "Is Revolution without Principles Meaningless?", id = 425197,
  description = "Defeat Vyce and Arycelle at Rhime during chapter 2 on the law route",
  type = "progression", points = 5,
  trigger = event_flag_trigger(chapter_stable("C2L"), c2l_rhime_battle())
)

achievement(
  title = "What Becomes of Those Who've Outlived Their Usefulness?", id = 425198,
  description = "Participate in Sir Leonar's plot against Duke Ronwey during chapter 2 on the law route",
  type = "progression", points = 10,
  trigger = event_flag_trigger(chapter_transition("C2L", "C3L"), c2l_leonar_battle())
)

// Chapter 2 (chaos) -----------
achievement(
  title = "Justice and War Seldom Keep Company", id = 435557,
  description = "Defeat Arycelle at Port Asyton during chapter 2 on the chaos route",
  type = "progression", points = 5,
  trigger = event_flag_trigger(chapter_stable("C2C"), c2c_asyton_battle())
)

achievement(
  title = "In the Heat of Battle, All Are Criminal and All Are Innocent", id = 435558,
  description = "Defeat Xapan at Xeod Moors during chapter 2 on the chaos route",
  type = "progression", points = 5,
  trigger = event_flag_trigger(chapter_stable("C2C"), c2c_xeod_battle())
)

achievement(
  title = "It Is the People Who Suffer in Any Struggle, However Noble", id = 435559,
  description = "Defeat Genzo the Wailing at Lake Bordu during chapter 2 on the chaos route",
  type = "progression", points = 5,
  trigger = event_flag_trigger(chapter_stable("C2C"), c2c_bordu_battle())
)

achievement(
  title = "It Is a Fact of Life and War That Men Use Others", id = 425199,
  description = "Defeat Vyce at Tynemouth Hill during chapter 2 on the chaos route",
  type = "progression", points = 5,
  trigger = event_flag_trigger(chapter_stable("C2C"), c2c_vyce_battle())
)

achievement(
  title = "A Detour around the Duke's Lines", id = 435606,
  description = "Defeat Farrel at Krysaro Town during chapter 2 on the chaos route",
  type = "progression", points = 5,
  trigger = event_flag_trigger(chapter_stable("C2C"), c2c_krysaro_battle())
)

achievement(
  title = "Breaking What Sea and Storm Have Made Strong", id = 435560,
  description = "Defeat Darza the Pirate at Qadriga Fortress during chapter 2 on the chaos route",
  type = "progression", points = 5,
  trigger = event_flag_trigger(chapter_stable("C2C"), c2c_qadriga_battle())
)

achievement(
  title = "No Fool but a Dead Fool", id = 425200,
  description = "Defeat Veldrei the Lamenting at Ndamsa Fortress during chapter 2 on the chaos route",
  points = 5,
  trigger = event_flag_trigger(chapter_stable("C2C"), c2c_ndamsa_battle())
)

achievement(
  title = "Prayers Left Unanswered", id = 435561,
  description = "Defeat Dagon of Woe at Golyat during chapter 2 on the chaos route",
  type = "progression", points = 5,
  trigger = event_flag_trigger(chapter_stable("C2C"), c2c_golyat_battle())
)

achievement(
  title = "Where There's Peril, There's Reward", id = 435562,
  description = "Defeat Xapan at Rhime during chapter 2 on the chaos route",
  type = "progression", points = 5,
  trigger = event_flag_trigger(chapter_stable("C2C"), c2c_rhime_battle())
)

achievement(
  title = "If Words Will Not Win Free, Steel Must", id = 435563,
  description = "Defeat Ramidos the Poison Fang at Golborza Plain during chapter 2 on the chaos route",
  type = "progression", points = 5,
  trigger = event_flag_trigger(chapter_stable("C2C"), c2c_golborza_battle())
)

achievement(
  title = "What's Done Is Done", id = 425201,
  description = "Accept Sir Leonar's offer to rejoin the Walister Resistance",
  type = "progression", points = 10,
  trigger = event_flag_trigger(chapter_transition("C2C", "C3N"), c2c_neutral_choice())
)

achievement(
  title = "What's Done Cannot Be Undone", id = 425202,
  description = "Reject Sir Leonar's offer to rejoin the Walister Resistance",
  type = "progression", points = 10,
  trigger = event_flag_trigger(chapter_transition("C2C", "C3C"), c2c_chaos_choice())
)

// Chapter 3 (law) -------------
achievement(
  title = "Advancing From Behind the Keep", id = 435564,
  description = "Defeat all hostile wildlife at Madura Drift during chapter 3 on the law route",
  type="progression", points = 5,
  trigger = event_flag_trigger(chapter_stable("C3L"), c3l_madura_battle())
)

achievement(
  title = "Curse the Gods or Curse Your Sorry Selves", id = 435565,
  description = "Defeat Hektor the Chagrined at Brigantys Castle during chapter 3 on the law route",
  type="progression", points = 10,
  trigger = event_flag_trigger(chapter_stable("C3L"), c3l_brigantys_battle())
)

achievement(
  title = "Creeping in the Shadows Towards Coritanae", id = 435566,
  description = "Defeat Roberval the Withered at Bahanna Highland during chapter 3 on the law route",
  type="progression", points = 5,
  trigger = event_flag_trigger(chapter_stable("C3L"), c3l_bahanna_battle())
)

achievement(
  title = "Gossiping with Gatialo", id = 425203,
  description = "Learn more of Jeunan's past while fighting Gatialo at Coritanae Keep",
  type = "missable", points = 1,
  trigger = event_flag_trigger(chapter_stable("C3L"), c3l_jeunan_backstory())
)

achievement(
  title = "Hierophant's End", id = 425204,
  description = "Defeat Gatialo the Ochre at Coritanae Keep and confront Hierophant Balbatos during chapter 3 on the law route",
  type = "progression", points = 10,
  trigger = event_flag_trigger(chapter_stable("C3L"), c3l_coritanae_battle())
)

achievement(
  title = "Escape from the Swamp", id = 435567,
  description = "Defeat either Brutakos of Purple at Lake Bordu or Muntzer the Horsetail at the Psonji Weald during chapter 3 on the law route",
  type="progression", points = 5,
  trigger = event_flag_trigger(chapter_stable("C3L"), c3l_bordu_or_psonji())
)

achievement(
  title = "Serving Another Bowl of the Weak Broth of Defeat", id = 435568,
  description = "Defeat Ganpp at Tynemouth Hill during chapter 3 on the law route",
  type="progression", points = 5,
  trigger = event_flag_trigger(chapter_stable("C3L"), c3l_tynemouth_battle())
)

achievement(
  title = "Extinguishing Galgastan's Embers", id = 425205,
  description = "Defeat Sir Xaebos at Almorica Castle during chapter 3 on the law route",
  type = "progression", points = 10,
  trigger = event_flag_trigger(chapter_stable("C3L"), c3l_xaebos_battle())
)

achievement(
  title = "Traversing Ways Known Only to Goatherds and Peasants", id = 435569,
  description = "Defeat all hostile wildlife at Mount Weobry during chapter 3 on the law route",
  type="progression", points = 5,
  trigger = event_flag_trigger(chapter_stable("C3L"), c3l_weobry_battle())
)

achievement(
  title = "Throw Down Your Swords or Die", id = 435570,
  description = "Defeat the Dark Knight Ozma at Rhime during chapter 3 on the law route",
  type="progression", points = 5,
  trigger = event_flag_trigger(chapter_stable("C3L"), c3l_rhime_battle())
)

achievement(
  title = "A Castle Is Only as Strong as Its Garrison", id = 425206,
  description = "Defeat the Dark Knight Oz at Phidoch Castle during chapter 3 on the law route",
  type = "progression", points = 10,
  trigger = event_flag_trigger(chapter_transition("C3L", "C4"), c3l_oz_battle())
)

// Chapter 3 (neutral) ---------
achievement(
  title = "Those Who Truly Seek Death", id = 435571,
  description = "Defeat Hektor the Chagrined at Almorica Castle during chapter 3 on the neutral route",
  type="progression", points = 5,
  trigger = event_flag_trigger(chapter_stable("C3N"), c3n_almorica_battle())
)

achievement(
  title = "A Dark Day for a Dark Knight", id = 435572,
  description = "Defeat the Dark Knight Oz at Boed Fortress during chapter 3 on the neutral route",
  type="progression", points = 5,
  trigger = event_flag_trigger(chapter_stable("C3N"), c3n_boed_battle())
)

achievement(
  title = "Feeding on the Rich Stew of Vengeance", id = 435573,
  description = "Defeat Ganpp at Tynemouth Hill during chapter 3 on the neutral route",
  type="progression", points = 5,
  trigger = event_flag_trigger(chapter_stable("C3N"), c3n_tynemouth_battle())
)

achievement(
  title = "More Grist for the Mill", id = 425207,
  description = "Defeat Botis of Tears at Qadriga Fortress and rescue Sir Leonar's forces during chapter 3 on the neutral route",
  type = "missable", points = 5,
  trigger = event_flag_trigger(chapter_stable("C3N"), c3n_qadriga_battle())
)

achievement(
  title = "Ones Pallid of Flesh", id = 435574,
  description = "Defeat the undead throng at Port Asyton during chapter 3 on the neutral route",
  type="progression", points = 5,
  trigger = event_flag_trigger(chapter_stable("C3N"), c3n_asyton_battle())
)

achievement(
  title = "Defiling the Very Substance of Life", id = 435575,
  description = "Defeat the undead throng at Mount Hedon during chapter 3 on the neutral route",
  type="progression", points = 5,
  trigger = event_flag_trigger(chapter_stable("C3N"), c3n_hedon_battle())
)

achievement(
  title = "Profaning All That is Sacred", id = 435576,
  description = "Defeat the undead throng at Hagia Banhamuba during chapter 3 on the neutral route",
  type="progression", points = 5,
  trigger = event_flag_trigger(chapter_stable("C3N"), c3n_banhamuba_battle())
)

achievement(
  title = "Blasphemous Experiment", id = 425208,
  description = "Defeat Nybeth Obdilord at Ndamsa Fortress and release Gildas from his torment during chapter 3 on the neutral route",
  type = "progression", points = 5,
  trigger = event_flag_trigger(chapter_stable("C3N"), c3n_nybeth_battle())
)

achievement(
  title = "Thwarting Galgastan's Gambit", id = 425209,
  description = "Defeat Orgeau the Spirited at Golyat during chapter 3 on the neutral route",
  type = "missable", points = 5,
  trigger = event_flag_trigger(chapter_stable("C3N"), c3n_orgeau_battle())
)

achievement(
  title = "How Men of Honour Meet Death", id = 425210,
  description = "Defeat Sir Xaebos at Coritanae Keep during chapter 3 on the neutral route",
  type = "progression", points = 10,
  trigger = event_flag_trigger(chapter_stable("C3N"), c3n_xaebos_battle())
)

achievement(
  title = "Taking Rhime Unawares", id = 435577,
  description = "Defeat all hostile wildlife at Mount Weobry during chapter 3 on the neutral route",
  type="progression", points = 5,
  trigger = event_flag_trigger(chapter_stable("C3N"), c3n_weobry_battle())
)

achievement(
  title = "Too Many Have Died to End This with Half Measures", id = 435578,
  description = "Defeat all enemy forces at Rhime during chapter 3 on the neutral route",
  type="progression", points = 5,
  trigger = event_flag_trigger(chapter_stable("C3N"), c3n_rhime_battle())
)

achievement(
  title = "For What Have We Bled?", id = 425211,
  description = "Defeat the Dark Knight Ozma at Phidoch Castle during chapter 3 on the neutral route",
  type = "progression", points = 10,
  trigger = event_flag_trigger(chapter_transition("C3N", "C4"), c3n_ozma_battle())
)

// Chapter 3 (chaos) -----------
achievement(
  title = "Sending Gannon to Ground a Corpse", id = 435579,
  description = "Defeat Gannon the Violet at Port Asyton during chapter 3 on the chaos route",
  type="progression", points = 5,
  trigger = event_flag_trigger(chapter_stable("C3C"), c3c_asyton_battle())
)

achievement(
  title = "Better to Die at a Traitor's Hands than Die a Traitor", id = 435580,
  description = "Defeat Felnatore the Reverend at Xeod Moors during chapter 3 on the chaos route",
  type="progression", points = 5,
  trigger = event_flag_trigger(chapter_stable("C3C"), c3c_xeod_battle())
)

achievement(
  title = "There Is Blood Enough on All Our Hands", id = 435581,
  description = "Defeat Sir Xaebos at Coritanae Keep during chapter 3 on the chaos route",
  type="progression", points = 10,
  trigger = event_flag_trigger(chapter_stable("C3C"), c3c_coritanae_battle_1())
)

achievement(
  title = "A Foul Place for Battle", id = 435582,
  description = "Defeat all enemy forces at Bahanna Highland during chapter 3 on the chaos route",
  type="progression", points = 5,
  trigger = event_flag_trigger(chapter_stable("C3C"), c3c_bahanna_battle_1())
)

achievement(
  title = "Why Dirty One's Hands, When a Mob Will Do the Knifework for You?", id = 425212,
  description = "Defeat Sir Xaebos at Brigantys Castle during chapter 3 on the chaos route",
  type = "progression", points = 10,
  trigger = event_flag_trigger(chapter_stable("C3C"), c3c_xaebos_battle())
)

achievement(
  title = "For Every Step Forward Sliding Back Two", id = 435583,
  description = "Defeat Modiliani the Angry at Bahanna Highland during chapter 3 on the chaos route",
  type="progression", points = 5,
  trigger = event_flag_trigger(chapter_stable("C3C"), c3c_bahanna_battle_2())
)

achievement(
  title = "Dwelling in the Dark and Drinking Deep of Blood", id = 425213,
  description = "Defeat Sir Leonar at Coritanae Keep during chapter 3 on the chaos route",
  type = "progression", points = 10,
  trigger = event_flag_trigger(chapter_stable("C3C"), c3c_leonar_battle())
)

achievement(
  title = "Serving up the Bitter Stew of Failure", id = 435584,
  description = "Defeat Ganpp at Mount Weobry during chapter 3 on the chaos route",
  type="progression", points = 5,
  trigger = event_flag_trigger(chapter_stable("C3C"), c3c_weobry_battle())
)

achievement(
  title = "Who Holds the Power Now?", id = 435585,
  description = "Defeat Hiram the Red at Rhime during chapter 3 on the chaos route",
  type = "progression", points = 5,
  trigger = event_flag_trigger(chapter_stable("C3C"), c3c_rhime_battle())
)

achievement(
  title = "Harrying the Dark Knights", id = 435586,
  description = "Defeat the Dark Knight Oz at Boed Fortress during chapter 3 on the chaos route",
  type = "", points = 5,
  trigger = event_flag_trigger(chapter_stable("C3C"), c3c_boed_battle())
)

achievement(
  title = "The Fall of House Glacius", id = 425214,
  description = "Defeat the Dark Knights Oz and Ozma at Phidoch Castle during chapter 3 on the chaos route",
  type = "progression", points = 10,
  trigger = event_flag_trigger(chapter_stable("C3C"), c3c_oz_ozma_battle())
)

// Chapter 4 -------------------
achievement(
  title = "It's a Cool Place and They Say It Gets Colder", id = 435607,
  description = "Defeat Uram of the Blue Steel at Bahanna Highland during chapter 4",
  type="progression", points = 5,
  trigger = event_flag_trigger(chapter_stable("C4"), c4_bahanna_battle())
)

achievement(
  title = "Father to Son", id = 425215,
  description = "Meet with the Order of Philaha at Brigantys Castle during chapter 4",
  type = "progression", points = 5,
  trigger = event_flag_trigger(chapter_stable("C4"), c4_brigantys_event())
)

achievement(
  title = "Face It Alone", id = 425216,
  description = "Meet peacefully with the Order of Philaha at Brigantys Castle during chapter 4",
  type = "missable", points = 1,
  trigger = (
    event_flag_trigger(chapter_stable("C4"), c4_brigantys_event()) &&
    !c4_brigantys_west_battle() &&
    !c4_brigantys_south_battle()
  )
)

achievement(
  title = "Hotfooting It through Hedon", id = 435587,
  description = "Defeat LeRozza the Gray at Mount Hedon during chapter 4",
  type="progression", points = 5,
  trigger = event_flag_trigger(chapter_stable("C4"), c4_hedon_battle())
)

achievement(
  title = "All Breeding and No Substance", id = 435588,
  description = "Defeat Sherri the Witch at Hagia Banhamuba during chapter 4",
  type="progression", points = 5,
  trigger = event_flag_trigger(chapter_stable("C4"), c4_banhamuba_battle())
)

achievement(
  title = "All This Intrigue Over a Sword?", id = 425217,
  description = "Learn the Xenobians' true purpose in coming to Valeria",
  type = "missable", points = 1,
  trigger = event_flag_trigger(chapter_stable("C4"), c4_xenobia_backstory())
)

achievement(
  title = "The Pirates of Qadriga Fortress", id = 445885,
  description = "Investigate reports of pirate activity at Qadriga Fortress during chapter 4",
  type = "", points = 3,
  trigger = event_flag_trigger(chapter_stable("C4"), c4_qadriga_pirates())
)

achievement(
  title = "He Who Fights and Runs Away", id = 429267,
  description = "Defeat Xapan at Golyat during chapter 4",
  type = "missable", points = 5,
  trigger = event_flag_trigger(chapter_stable("C4"), c4_golyat_battle())
)

achievement(
  title = "A Fine Stratagem on the Page", id = 425218,
  description = "Defeat Pajeot of Azure at Lambiss Hill during chapter 4",
  type="progression", points = 5,
  trigger = event_flag_trigger(chapter_stable("C4"), c4_lambiss_hill_battle())
)

achievement(
  title = "Mind the Plumage", id = 426238,
  description = "Witness a hidden scene with Deneb and Canopus during chapter 4",
  type = "missable", points = 1,
  trigger = event_flag_trigger(chapter_stable("C4"), c4_deneb_and_canopus())
)

achievement(
  title = "The Knight of Lodis", id = 425219,
  description = "Defeat Lanselot Tartaros at Barnicia Castle during chapter 4",
  type = "progression", points = 10,
  trigger = event_flag_trigger(chapter_stable("C4"), c4_lanselot_battle())
)

achievement(
  title = "Rhamsen Wreck Raised", id = 435594,
  description = "Defeat the Dark Knight Martym at Grimsby Town during chapter 4",
  points = 5,
  trigger = event_flag_trigger(chapter_stable("C4"), c4_grimsby_battle())
)

achievement(
  title = "The Bandits of Neimrahava", id = 435595,
  description = "Defeat Ganpp at Neimrahava Woods during chapter 4",
  points = 5,
  trigger = event_flag_trigger(chapter_stable("C4"), c4_neimrahava())
)

achievement(
  title = "A Strength Beyond Any Sorcery", id = 426024,
  description = "Defeat Pherenian the Godless at Boulder Sands during chapter 4, and acquire the Commando's fusil",
  type = "missable", points = 5,
  trigger = event_flag_trigger(chapter_stable("C4"), c4_boulder_sands_battle())
)

achievement(
  title = "Advancing Steadily on Heim", id = 435589,
  description = "Defeat Stanoska the Beastlord at Iorumza Canyon during chapter 4",
  type="progression", points = 5,
  trigger = event_flag_trigger(chapter_stable("C4"), c4_iorumza_battle())
)

achievement(
  title = "Judgement's Hour Is at Hand", id = 435590,
  description = "Defeat Hanzo the Assassin at Oeram Town during chapter 4",
  type="progression", points = 5,
  trigger = event_flag_trigger(chapter_stable("C4"), c4_oeram_battle() )
)

achievement(
  title = "The Quickest Way to the Throne Is a Knife to the King's Ribs", id = 425276,
  description = "Defeat Regent Brantyn Morne and liberate the Royal City of Heim during chapter 4",
  type = "progression", points = 10,
  trigger = event_flag_trigger(chapter_stable("C4"), c4_brantyn_battle())
)

achievement(
  title = "A Traitor in Our Midst?", id = 425277,
  description = "Learn more of Hobyrim's past during chapter 4",
  type = "missable", points = 1,
  trigger = event_flag_trigger(chapter_stable("C4"), c4_hobyrim_backstory())
)

achievement(
  title = "The Last of the Nildahme Royal House", id = 425278,
  description = "Defeat the Dark Knight Andoras at Twixt Heaven and Earth atop the Hanging Gardens during chapter 4",
  type = "progression", points = 10,
  trigger = event_flag_trigger(chapter_stable("C4"), c4_andoras_battle())
)

achievement(
  title = "Dynast King's Demise", id = 425279,
  description = "Defeat the revenant of King Dorgalua and seal the Chaos Gate",
  type = "progression", points = 25,
  trigger = event_flag_trigger(chapter_stable("C4"), c4_dorgalua_battle())
)

achievement(
  title = "Glory to the Walister!", id = 433030,
  description = "Receive the Lord ending with a low Chaos Frame",
  type = "win_condition", points = 10,
  trigger = (
    is_game_state("Field Program") &&
    c4_dorgalua_dead() &&
    is_map("Coronation") &&
    is_music("Coronation") &&
    prev(string_id()) == 0x15C7 &&
    string_id() == 0x0000
  )
)

achievement(
  title = "Glory to Lodis?", id = 433031,
  description = "Receive the Lord ending with a high Chaos Frame",
  type = "win_condition", points = 10,
  trigger = (
    is_game_state("Field Program") &&
    c4_dorgalua_dead() &&
    is_map("TristanRoom") &&
    is_music("Reminiscence") &&
    prev(string_id()) == 0x15C5 &&
    string_id() == 0x0000
  )
)

achievement(
  title = "Glory to Valeria!", id = 433032,
  description = "Receive the Princess ending",
  type = "win_condition", points = 10,
  trigger = (
    is_game_state("Field Program") &&
    c4_dorgalua_dead() &&
    is_map("Coronation") &&
    is_music("Coronation") &&
    prev(string_id()) == 0x14FA &&
    string_id() == 0x0000
  )
)

// Chapter 4 - Apocrypha -------
achievement(
  title = "The Great Valerian Fortresses", id = 435605,
  description = "Open the way to the elemental temples by defeating the outlaw groups occupying Boed Fortress, Fortress Geyld, Gecho Fortress, and Ndamsa Fortress",
  points = 10,
  trigger = (
    load_protection() &&
    chapter() == ChapterID["C4"] &&
    ((
      prev(c4_boed_battle()) +
      prev(c4_gecho_battle()) +
      prev(c4_gelyd_battle()) +
      prev(c4_ndamsa_battle())
    ) < 4 ) &&
    measured(
      (c4_boed_battle() + c4_gecho_battle() + c4_gelyd_battle() + c4_ndamsa_battle()) == 4
    )
  )
)

achievement(
  title = "Xoshonell's Strength", id = 425235,
  description = "Defeat the guardians of Xoshonell Temple and acquire Supernova, the fire apocrypha",
  points = 5,
  trigger = (
    once(c4_xoshonell_temple()) &&
    once(spell_added_to_inventory("Supernova")) && 
    never(
      !is_game_state("Field Program") ||
      map_id() != Maps["Xoshonell Temple"] ||
      encounter_group() != Encounters["Xoshonell Temple"]
    )
  )
)

achievement(
  title = "Hahnela's Fury", id = 425249,
  description = "Defeat the guardians of Hahnela Temple and acquire Air Cry, the wind apocrypha",
  points = 5,
  trigger = (
    once(c4_hahnela_temple()) &&
    once(spell_added_to_inventory("AirCry")) && 
    never(
      !is_game_state("Field Program") ||
      map_id() != Maps["Hahnela Temple"] ||
      encounter_group() != Encounters["Hahnela Temple"]
    )
  )
)

achievement(
  title = "Vaasa's Might", id = 425250,
  description = "Defeat the guardians of Vaasa Temple and acquire Earthquake, the earth apocrypha",
  points = 5,
  trigger = (
    once(c4_vaasa_temple()) &&
    once(spell_added_to_inventory("Earthquake")) && 
    never(
      !is_game_state("Field Program") ||
      map_id() != Maps["Vaasa Temple"] ||
      encounter_group() != Encounters["Vaasa Temple"]
    )
  )
)

achievement(
  title = "Greuza's Mercy", id = 425251,
  description = "Defeat the guardians of Greuza Temple and acquire Ice Requiem, the water apocrypha",
  points = 5,
  trigger = (
    once(c4_greuza_temple()) &&
    once(spell_added_to_inventory("IceRequiem")) && 
    never(
      !is_game_state("Field Program") ||
      map_id() != Maps["Greuza Temple"] ||
      encounter_group() != Encounters["Greuza Temple"]
    )
  )
)

// Chapter 4 - PotD ------------
achievement(
  title = "The Road to Ashmedai", id = 435591,
  description = "Open the path to the Temple of Ashmedai's Palace of the Dead by defeating all hostile forces at Madura Drift, Belmorose Wilds, and Bortegun Fen",
  points = 10,
  trigger = (
    load_protection() &&
    chapter() == ChapterID["C4"] &&
    ((
      prev(c4_madura_battle()) +
      prev(c4_belmorose_battle()) +
      prev(c4_bortegun_battle())
    ) < 3 ) &&
    measured(
      (c4_madura_battle() + c4_belmorose_battle() + c4_bortegun_battle()) == 3
    )
  )
)

achievement(
  title = "Undeath on Two Legs", id = 425272,
  description = "Defeat Nybeth Obdilord on the fourth floor of the Palace of the Dead",
  points = 5,
  trigger = event_flag_trigger(chapter_stable("C4"), c4_potd_floor_4())
)

achievement(
  title = "For Those Who Abandon Faith for the Fist, Only Hell Awaits", id = 425273,
  description = "Defeat Vepahl the White Mage on the twenty-fifth floor of the Palace of the Dead",
  points = 10,
  trigger = event_flag_trigger(chapter_stable("C4"), c4_potd_floor_25())
)

achievement(
  title = "Too Weak, This Corporeal Form", id = 425274,
  description = "Defeat Belzebuth the Sorceress on the fiftieth floor of the Palace of the Dead and acquire Dead Scream, the dark Apocrypha",
  points = 10,
  trigger = event_flag_trigger(chapter_stable("C4"), c4_potd_floor_50())
)

achievement(
  title = "Person of Obdilordly Caliber", id = 425275,
  description = "Defeat Nybeth Obdilord on the hundredth floor of the Palace of the Dead, bringing a conclusion to his research on immortality",
  points = 25,
  trigger = event_flag_trigger(chapter_stable("C4"), c4_potd_floor_100())
)


// ---------------------------------------------------------------------------------------------------
// Hard mode achievements

function event_flag_trigger_no_load_protection(flicker_protection, flag_transition) => (
  flicker_protection &&
  flag_transition
)

function hard_mode_siege(
  priming_conditions,
  location,
  trigger_condition,
  start_chapter,
  end_chapters
) => (
  any_of(
    priming_conditions,
    priming_condition =>
      once(
        priming_condition &&
        is_story_battle() &&
        is_hard_mode() &&
        mid_battle_load_protection() &&
        is_game_state("Field Program") &&
        is_map_location(location) &&
        is_chapter(start_chapter)
      )
  ) &&
  trigger_when(
    trigger_condition
  ) &&
  never(
    !is_hard_mode() ||
    !is_map_location(location) ||
    is_game_state("Boot Logos") ||
    is_game_state("Data Management") ||
    is_music("Retreat!") ||
    is_music("A Colour of Chaos") ||
    all_of(end_chapters, chapter => !is_chapter(chapter))
  )
)

achievement(
  title = "Fight it Out!", id = 437051,
  description = "In a single attempt on hard mode, complete a pair of fateful battles at Balmamusa during chapter 1",
  points = 10,
  trigger = hard_mode_siege(
    [is_encounter("Balmamusa C1") && is_map("Balmamusa C1")],
    0x0C,
    c1_balmamusa_1() &&
    __ornext(is_chapter("C2C") || is_chapter("C2L")) &&
    was_chapter("C1"),
    "C1",
    ["C1", "C2C", "C2L"]
  )
)

achievement(
  title = "A Better Tomorrow",
  description = "In a single attempt on hard mode, complete all battles in the assault on Almorica Castle during chapter 2 on the chaos route",
  points = 10,
  trigger = hard_mode_siege(
    [is_encounter("Almorica Gates 2C") && is_map("Almorica Gates")],
    0x18,
    __ornext(
      event_flag_trigger_no_load_protection(always_true(), c2c_neutral_choice()) ||
      event_flag_trigger_no_load_protection(always_true(), c2c_chaos_choice())
    ) &&
    __ornext(is_chapter("C3N") || is_chapter("C3C")) &&
    was_chapter("C2C"),
    "C2C",
    ["C2C", "C3N", "C3C"]
  )
)

achievement(
  title = "Revolt",
  description = "In a single attempt on hard mode, complete all battles in the assault on Almorica Castle during chapter 2 on the law route",
  points = 10,
  trigger = hard_mode_siege(
    [is_encounter("Almorica Gates 2L") && is_map("Almorica Gates")],
    0x18,
    event_flag_trigger_no_load_protection(chapter_transition("C2L", "C3L"), c2l_leonar_battle()),
    "C2L",
    ["C2L", "C3L"]
  )
)

achievement(
  title = "Impregnable Defense",
  description = "In a single attempt on hard mode, complete all battles in the assault on Phidoch Castle during chapter 3 on the neutral route",
  points = 10,
  trigger = hard_mode_siege(
    [
      is_encounter("Phidoch South") && is_map("Phidoch South"),
      is_encounter("Phidoch West") && is_map("Phidoch West")
    ],
    0x0E,
    event_flag_trigger_no_load_protection(chapter_transition("C3N", "C4"), c3n_ozma_battle()),
    "C3N",
    ["C3N", "C4"]
  )
)

achievement(
  title = "Chivalry and Savagery",
  description = "In a single attempt on hard mode, complete all battles in the assault on Phidoch Castle during chapter 3 on the chaos route",
  points = 10,
  trigger = hard_mode_siege(
    [
      is_encounter("Phidoch South") && is_map("Phidoch South"),
      is_encounter("Phidoch West") && is_map("Phidoch West")
    ],
    0x0E,
    event_flag_trigger_no_load_protection(chapter_stable("C3C"), c3c_oz_ozma_battle()),
    "C3C",
    ["C3C"]
  )
)

achievement(
  title = "Vendetta!",
  description = "In a single attempt on hard mode, complete all battles in the assault on Phidoch Castle during chapter 3 on the law route",
  points = 10,
  trigger = hard_mode_siege(
    [
      is_encounter("Phidoch South") && is_map("Phidoch South"),
      is_encounter("Phidoch West") && is_map("Phidoch West")
    ],
    0x0E,
    event_flag_trigger_no_load_protection(chapter_transition("C3L", "C4"), c3l_oz_battle()),
    "C3L",
    ["C3L", "C4"]
  )
)

achievement(
  title = "A Clash of Giants",
  description = "In a single attempt on hard mode, complete all battles in the assault on Barnicia Castle during chapter 4",
  points = 10,
  trigger = hard_mode_siege(
    [is_encounter("Barnicia Gates") && is_map("Barnicia Gates")],
    0x1B,
    event_flag_trigger_no_load_protection(chapter_stable("C4"), c4_lanselot_battle()),
    "C4",
    ["C4"]
  )
)

achievement(
  title = "Restriction on Power",
  description = "In a single attempt on hard mode, complete all battles in the assault on Heim during chapter 4",
  points = 10,
  trigger = hard_mode_siege(
    [
      is_encounter("Heim Postern Gate") && is_map("Heim Postern Gate"),
      is_encounter("Heim Gates") && is_map("Heim Gates")
    ],
    0x1E,
    event_flag_trigger_no_load_protection(chapter_stable("C4"), c4_brantyn_battle()),
    "C4",
    ["C4"]
  )
)

achievement(
  title = "Air Land",
  description = "In a single attempt on hard mode, complete all battles at the Hanging Gardens (from Foot of the Gardens through Twixt Heaven and Earth) during chapter 4",
  points = 10,
  trigger = hard_mode_siege(
    [is_encounter("Foot of the Gardens") && is_map("Foot of the Gardens")],
    0x20,
    event_flag_trigger_no_load_protection(chapter_stable("C4"), c4_andoras_battle()),
    "C4",
    ["C4"]
  )
)

achievement(
  title = "Deeds Writ in Stone",
  description = "In a single attempt on hard mode, complete all battles at Dorgalua's Tomb (from The Tomb Below through the second battle at Chamber of the Seal) during chapter 4",
  points = 25,
  trigger = hard_mode_siege(
    [is_encounter("The Tomb Below") && is_map("The Tomb Below")],
    0x20,
    event_flag_trigger_no_load_protection(chapter_stable("C4"), c4_dorgalua_battle()),
    "C4",
    ["C4"]
  )
)

function hard_mode_potd(
  starting_floor,
  ending_floor,
  suppression_condition,
  trigger_condition
) => (
  once(
    is_hard_mode() &&
    mid_battle_load_protection() &&
    is_game_state("Field Program") &&
    is_map_location(0x00) &&
    is_potd_floor(starting_floor) &&
    !suppression_condition &&
    is_chapter("C4")
  ) &&
  trigger_when(
    trigger_condition
  ) &&
  never(
    !is_hard_mode() ||
    !is_map_location(0x00) ||
    potd_floor() > ending_floor ||
    !is_chapter("C4") ||
    is_game_state("Boot Logos") ||
    is_game_state("Data Management") ||
    is_music("Retreat!") ||
    is_music("A Colour of Chaos")
  )
)

achievement(
  title = "Deathrattle",
  description = "In a single attempt on hard mode, clear floors 1-25 of the Palace of the Dead and defeat Vepahl",
  points = 10,
  trigger = hard_mode_potd(
    1,
    25,
    potd_floor_25_clear(),
    c4_potd_floor_25()
  )
)

achievement(
  title = "Fog of Phantom",
  description = "In a single attempt on hard mode, clear floors 26-50 of the Palace of the Dead and defeat Belzebuth",
  points = 10,
  trigger = hard_mode_potd(
    26,
    50,
    potd_floor_50_clear(),
    c4_potd_floor_50()
  )
)

achievement(
  title = "Billow of the Dark",
  description = "In a single attempt on hard mode, clear floors 50-100 of the Palace of the Dead and defeat Nybeth",
  points = 25,
  trigger = hard_mode_potd(
    51,
    100,
    potd_floor_100_clear(),
    c4_potd_floor_100()
  )
)


// ---------------------------------------------------------------------------------------------------
// Battle system

// Battle state ------------------------------------------------

// 0x0DBC82: [16-bit] Battle active flag
//   Goes to 1 when battle starts, 0 when battle ends. Doesn't get cleared between fights on a few
//   multi-battle stages, and after a few battles that go into a long cutscene rather than a victory
//   screen.

// 0x0DC272: [8-bit] Battle active flag 2
// Goes to 1 after 'Battle Start' displayed, goes to 0 when victory screen is displayed, on game over,
// or when scene ends if battle goes into a cutscene without victory display. Also goes to 0 when unit
// roster is opened up during battle.
// 
// Flickers from 0 to 1 for a few frames between the victory screen and the loot screen.

function battle_start()    => bit0(0x0DBC82) > prev(bit0(0x0DBC82))
function battle_end()      => bit0(0x0DBC82) < prev(bit0(0x0DBC82))
function battle_active()   => bit0(0x0DBC82) == 1
function battle_inactive() => bit0(0x0DBC82) == 0

function battle_halted()   => bit0(0x0DC272) == 0

// 0D9026: [8-bit] Total number of units alive on battlefield
function units_alive_on_battlefield() => byte(0x0D9026)

// In-battle unit data -----------------------------------------

// 0x0DB380: [3240-byte array] Deployed units data (30 entries, each entry 0x6C bytes)
// 0x0D9650: [3240-byte array] In-battle unit data (30 entries, each entry 0x6C bytes)

// 0x0D902A: [16-bit pointer] Unit whose turn it is in battle (0xFFFF when no unit has a turn)
// 0x0D902E: [16-bit pointer] Unit currently acting in battle (0xFFFF when no unit acting)
// 0x0D9032: [16-bit pointer] Unit that is being targeted for certain changes of state (dying,
//                            being persuaded) (0xFFFF if no unit special targeted)
// 0x0D9632: [16-bit pointer] Currently targeted/focused unit in battle (0xFFFF if no unit targeted)

//   +0x0D9650 = Class (see 0xdabf0 for list of values) [8-bit]
//   +0x0D9651 = Special character ID / unit appearance (see 0xdabf1 for list of values) [8-bit]
//   +0x0D9652 = Element / gender / player or computer / leader status [8-bit]
//     Bit 6: Unit is computer-controlled (guest unit or enemy)
//     Bit 7: Unit is leader
//   +0x0D9656 = HP [16-bit]
//   +0x0D966f = Status condition flags / character action state [8-bit]
//     Bit0 = Charm
//     Bit1 = ??
//     Bit2 = Taking damage?
//     Bit3 = ??
//     Bit4 = Moving/blocking/???
//     Bit5 = ??
//     Bit6 = Preparing to act
//     Bit7 = Taking damage?
//   +0x0D9674 = Unit affiliation [16-bit]
//     0 = Friendly, 1 = Friendly guest, 2 = Training battle second team, 3 = Enemy
//   +0x0D9688 = Unit facing (0 = NE, 1 = SW, 2 = NW, 3 = SE) [16-bit]
//   +0x0D969E = Unit coordinate, NW-SE axis [8-bit]
//   +0x0D969F = Unit coordinate, NE-SW axis [8-bit]
//   +0x0D96AA = Elevation of tile unit is standing on [16-bit]
//   +0x0d96b8 = Index of unit in deployed units array and battle units array [16-bit]

Affiliation = {
  "Friendly": 0x00,
  "Guest":    0x01,
  "Team2":    0x02,
  "Enemy":    0x03,
}

// Unit whose turn it is ---------------------------------------
function active_unit_ptr() => word(0x0D902A)
function unit_is_active()  => active_unit_ptr() != 0xFFFF

function active_unit()                  => active_unit_ptr() * 0x6C
function active_unit_character_id()     => byte(active_unit() + 0x0D9651)
function active_unit_hp()               => word(active_unit() + 0x0D9656)
function active_unit_affiliation()      => byte(active_unit() + 0x0D9674)
function active_unit_has_taken_damage() => bit2(active_unit() + 0x0D966F)
function active_unit_x()                => byte(active_unit() + 0x0D969E)
function active_unit_y()                => byte(active_unit() + 0x0D969F)
function active_unit_elevation()        => word(active_unit() + 0x0D96AC)
function active_unit_index()            => word(active_unit() + 0x0D96B8)

function active_unit_is_leader()      => bit7(active_unit() + 0x0D9652) == 1
function active_unit_is_character(id) => active_unit_character_id() == CharacterID[id]
function active_unit_has_affiliation(affiliation) => (
  active_unit_affiliation() == Affiliation[affiliation]
)

function active_unit_takes_damage() => (
  bit2(active_unit() + 0x0D966F) > prev(bit2(active_unit() + 0x0D966F))
)

// Unit currently taking action --------------------------------
function acting_unit_ptr() => word(0x0D902E)

function acting_unit()              => acting_unit_ptr() * 0x6C
function acting_unit_character_id() => byte(acting_unit() + 0x0D9651)
function acting_unit_affiliation()  => byte(acting_unit() + 0x0D9674)

function acting_unit_has_affiliation(affiliation) => (
  acting_unit_affiliation() == Affiliation[affiliation]
)

function active_unit_was_acting() => prev(acting_unit_ptr()) == active_unit_ptr()
function active_unit_not_acting() =>      acting_unit_ptr()  != active_unit_ptr()

// Unit targeted for certain changes of state ------------------
function special_target_ptr()       => word(0x0D9032)
function unit_is_special_targeted() => special_target_ptr()  != 0xFFFF

function special_target()              => word(0x0D9032) * 0x6C
function special_target_affiliation()  => byte(special_target() + 0x0D9674)
function special_target_character_id() => byte(special_target() + 0x0D9651)

function special_target_is_leader()      => bit7(special_target() + 0x0D9652) == 1
function special_target_hp()             => word(special_target() + 0x0D9656)
function special_target_dead()           => special_target_hp() == 0

function special_target_is_character(id) => special_target_character_id() == CharacterID[id]

function special_target_has_affiliation(affiliation) => (
  special_target_affiliation() == Affiliation[affiliation]
)
function special_target_affiliation_change() => (
  special_target_affiliation() != prev(special_target_affiliation())
)

// Targeted / focused unit -------------------------------------
function target_unit_ptr()  => word(0x0D9632)
function unit_is_targeted() => target_unit_ptr() != 0xFFFF

function target_unit()                  => target_unit_ptr() * 0x6C
function target_unit_character_id()     => byte(target_unit() + 0x0D9651)
function target_unit_has_taken_damage() => bit2(target_unit() + 0x0D966F) == 1
function target_unit_affiliation()      => byte(target_unit() + 0x0D9674)
function target_unit_facing()           => word(target_unit() + 0x0D9688)
function target_unit_x()                => byte(target_unit() + 0x0D969E)
function target_unit_y()                => byte(target_unit() + 0x0D969F)
function target_unit_elevation()        => word(target_unit() + 0x0D96AC)

function target_unit_has_affiliation(affiliation) => (
  target_unit_affiliation() == Affiliation[affiliation]
)

function target_unit_is_enemy()  => byte(target_unit() + 0x0D9674) == 3
function target_unit_is_leader() => bit7(target_unit() + 0x0D9652) == 1

// Static accessors --------------------------------------------
function battle_unit_class(n) => byte(0x0D9650 + n * 0x6C)
function battle_unit_id(n) => byte(0x0D9650 + n * 0x6C + 0x01)
function battle_unit_hp(n) => word(0x0D9650 + n * 0x6C + 0x06)
function battle_unit_affiliation(n) => word(0x0D9650 + n * 0x6C + 0x24)
function battle_unit_x(n)  => byte(0x0D9650 + n * 0x6C + 0x4E)
function battle_unit_y(n)  => byte(0x0D9650 + n * 0x6C + 0x4F)

function deploy_slot_has_class(n, class_id) => byte(0x0DB380 + n * 0x6C) == CharacterID[class_id]
function deploy_slot_character_id(n) => byte(0x0DB380 + n * 0x6C + 0x01)
function deploy_slot_has_affiliation(n, aff) => byte(0x0DB3A4 + n * 0x6C) == Affiliation[aff]

// Active character state --------------------------------------
// 0x0DC22C: [16-bit] Battle menu state (0 = closed, 1 = open)
function battle_menu() => bit0(0x0DC22C)

function battle_menu_closed()    => battle_menu() < prev(battle_menu())
function battle_menu_is_closed() => battle_menu() == 0

// 0x0DA852: [Upper4] Movement substate
//   Goes from 4 to 3 when unit has moved during movement phase but before movement is confirmed, goes
//   from 3 to 4 if movement is cancelled
function movement_substate() => high4(0x0DA852)
function movement_complete() => bit0(0x0d9036) > prev(bit0(0x0d9036))

// 0x0D9036: [8-bit] State of active unit
//   Bit0 = Has moved this turn
//   Bit1 = Has attacked this turn

function unit_has_moved()    => bit0(0x0D9036) == 1
function unit_has_attacked() => bit1(0x0D9036) == 1

// 0x0DA9B2: [16-bit] State of active character
//   0x02 = Action menu closed
//   0x03 = Move targeting / moving
//   0x04 = Spell targeting
//   0x06 = Action menu open
//   0x07 = Attack targeting / melee attacking
//   0x08 = Ranged attacking / Spellcasting
//   0x0F = Using item
//   0x10 = Turn ending

ActiveCharacterState = {
  "MenuClosed":     0x02,
  "MoveTargetMove": 0x03,
  "SpellTarget":    0x04,
  "ActionMenuOpen": 0x06,
  "AttackTarget":   0x07,
  "Spellcast":      0x08,
  "UsingItem":      0x0F,
  "EndTurn":        0x10,
}

function active_character_state() => word(0x0DA9B2)
function was_active_character_state(state) => (
  prev(active_character_state()) == ActiveCharacterState[state]
)
function is_active_character_state(state) => (
  active_character_state() == ActiveCharacterState[state]
)

// Combat actions ----------------------------------------------
// 0x0D8DC0: [16-bit] Action taken in combat
//   Value gets set when action is selected, but before action is confirmed. Always pair with a change
//   in state of the targeted unit or active unit action state value to ensure the action was actually
//   taken.
//
//   0xBBAA = AA = action type, BB = weapon/spell/ability/item ID
//   -- Action types --
//   0x00 = melee attack
//   0x01 = ranged attack
//   0x02 = innate character abilities? movement etc.
//   0x03 = spellcast
//   0x04 = item use (items then trigger a spellcast to apply their effect)
//   0x05 = some abilities such as persuade

CombatActions = {
  "Unarmed":     0xD100,
  "StoneThrow":  0xD601,
  "Darkness":    0x4B02,
  "Necromancy":  0x3003,
  "Reincarnate": 0x3703,
  "Snapdragon":  0x3803,
  "Bodygrab":    0x7804,
  "Persuade":    0x6305,
}

function combat_action()      => word(0x0D8DC0)
function combat_action_type() => byte(0x0D8DC0)
function is_combat_action(action) => combat_action() == CombatActions[action]

// Counterattacking --------------------------------------------
// 0x0CC50A: [16-bit] Counterattack state (+ probably other unknown flags)
//   Bit1 = Unit counterattacking
//   To detect the start of a counterattack, this flag will transition from 0 to 1 on the same frame
//   that the value of the acting unit pointer 0x0d902e transitions from pointing at the unit whose
//   turn it is (and who initiated the attack) to pointing at the unit that is now counterattacking.
//   The last action taken in combat (0x0d8dc0) will also update on this frame to reflect the action
//   taken by the counterattacking unit.

function counterattack_state()  => bit1(0x0CC50A)
function counterattack_start()  => counterattack_state() > prev(counterattack_state())
function counterattack_active() => counterattack_state() == 1

// Combat action restrictions ----------------------------------
function attack_restriction(allowed_actions) => never(
  unit_is_active() &&
  active_unit_has_affiliation("Friendly") &&
  is_active_character_state("AttackTarget") &&
  battle_menu_closed() &&
  none_of(
    allowed_actions,
    action => combat_action() == action
  )
)

function spell_restriction(allowed_actions) => never(
  unit_is_active() &&
  active_unit_has_affiliation("Friendly") &&
  is_active_character_state("Spellcast") &&
  battle_menu_closed() &&
  none_of(
    allowed_actions,
    action => combat_action() == action
  )
)

function counterattack_restriction(allowed_actions) => never(
  unit_is_active() &&
  active_unit_was_acting() &&
  active_unit_not_acting() &&
  acting_unit_has_affiliation("Friendly") &&
  counterattack_start() &&
  none_of(
    allowed_actions,
    action => combat_action() == action
  )
)

Elements = {
  "Wind":  0x01,
  "Fire":  0x02,
  "Earth": 0x03,
  "Water": 0x04,
}

// 0x0D3362: [54-byte array] Snapdragon data - each entry 0x12 bytes long.
function snapdragon_element(n) => (
  word(0x0D3470 + n * 0x20)
)

function snapdragon_restriction(n, element) => never(
  unit_is_active() &&
  active_unit_has_affiliation("Friendly") &&
  is_active_character_state("AttackTarget") &&
  battle_menu_closed() &&
  combat_action() == ((0x08 + n) * 0x100 + 0x00) &&
  snapdragon_element(n) != Elements[element]
)

function snapdragon_counterattack_restriction(n, element) => never(
  unit_is_active() &&
  active_unit_was_acting() &&
  active_unit_not_acting() &&
  acting_unit_affiliation() == 0x00 &&
  counterattack_start() &&
  combat_action() == ((0x08 + n) * 0x100 + 0x00) &&
  snapdragon_element(n) != Elements[element]
)

// Unit death detection ------------------------------------------------------------------------------
// TODO the one remaining place this is used is redundant and should probably be removed
// function enemy_leader_defeated() => (
//   unit_is_special_targeted() &&
//   special_target_ptr() != prev(special_target_ptr()) &&
//   special_target_has_affiliation("Enemy") &&
//   special_target_is_leader() &&
//   special_target_dead()
// )

// function enemy_leader_very_dead() => (
//   unit_is_special_targeted() &&
//   special_target_ptr() == prev(special_target_ptr()) &&
//   special_target_has_affiliation("Enemy") &&
//   special_target_is_leader() &&
//   special_target_dead()
// )

// function enemy_unit_defeated() => (
//   unit_is_special_targeted() &&
//   special_target_ptr() != prev(special_target_ptr()) &&
//   special_target_has_affiliation("Enemy") &&
//   special_target_dead()
// )

// function guest_unit_defeated() => (
//   unit_is_special_targeted() &&
//   special_target_ptr() != prev(special_target_ptr()) &&
//   special_target_has_affiliation("Guest") &&
//   special_target_dead()
// )

// function friendly_unit_defeated() => (
//   unit_is_special_targeted() &&
//   special_target_ptr() != prev(special_target_ptr()) &&
//   special_target_has_affiliation("Friendly") &&
//   special_target_dead()
// )


// ---------------------------------------------------------------------------------------------------
// Challenge achievements

// 2024-07-15: Found an edge case that caused a failed trigger in some achievements that were using
//             `enemy_leader_defeated()` as the final trigger condition, updated logic for all
//             challenges to use event flag triggers 
// 2024-08-25: Replaced event flag triggers with event script triggers to provide a small gap between
//             when challenge achievements pop and when story progression achievements pop
// 2024-09-06: Bit of tidying up and optimizing

function challenge_conditions(map, encounter) => (
  is_map(map) &&
  is_story_encounter(encounter) &&
  battle_start()
)

function challenge_reset(map, encounter) => (
  !is_game_state("Field Program") ||
  !is_map(map) ||
  !is_encounter(encounter) ||
  is_music("Retreat!") ||
  is_music("A Colour of Chaos")
)

// -----------------------------
// Chapter 1

achievement(
  title = "Undead on Time", id = 425192,
  description = "Defeat Consul Nybeth Obdilord at Qadriga Fortress before more than eight days have elapsed on the in-game calendar",
  type = "missable", points = 5,
  trigger = (
    event_flag_trigger(chapter_stable("C1"), c1_qadriga_battle()) &&
    calendar_year() == 0 &&
    calendar_month() == 1 &&
    calendar_day() <= 8
  )
)

achievement(
  title = "Maintaining a Staunch Front Line", id = 447819,
  description = "Defeat Sir Grion at Lake Bordu while ensuring that your units move every turn, and that they never move towards the southeast edge of the map. Resuming from a mid-battle save is prohibited",
  type = "missable", points = 10,
  trigger = (
    once(
      mid_battle_load_protection() &&
      challenge_conditions("Lake Bordu", "Sir Grion")
    ) &&
    trigger_when(
      // c1_bordu_battle()
      event_script_trigger(0x0067)
    ) &&
    never(
      challenge_reset("Lake Bordu", "Sir Grion")
    ) &&
    never(
      unit_is_active() &&
      active_unit_has_affiliation("Friendly") &&
      !unit_has_moved() &&
      !was_active_character_state("EndTurn") &&
      is_active_character_state("EndTurn")
    ) &&
    never(
      once(
        never(
          active_character_state() == prev(active_character_state()) &&
          is_active_character_state("MoveTargetMove") &&
          movement_substate() > prev(movement_substate())
        ) &&
        unit_is_active() &&
        active_unit_has_affiliation("Friendly") &&
        active_unit_ptr() == prev(active_unit_ptr()) &&
        movement_substate() != 0x03 &&
        active_unit_x() > prev(active_unit_x())
      ) &&
      movement_complete()
    )
  )
)

// -----------------------------
// Chapter 2 chaos

achievement(
  title = "The Butcher of Port Asyton", id = 437052,
  description = "Defeat Arycelle at Port Asyton, after first killing all six of her companions while trying to explain that you are not a mass murderer. Resuming from a mid-battle save is prohibited",
  type = "missable", points = 10,
  trigger = (
    once(
      mid_battle_load_protection() &&
      challenge_conditions("Port Asyton", "Arycelle 2C")
    ) &&
    trigger_when(
      tally_of(
        range(1, 19),
        7,
        n => (
          battle_unit_affiliation(n) == 3 &&
          prev(battle_unit_hp(n)) > 0 &&
          battle_unit_hp(n) == 0
        )
      ) &&
      // Use `once` to force an `AndNext` to suppress a warning, remove hit before publishing
      once(
        event_script_trigger(0x009A)
      )
    ) &&
    never(
      challenge_reset("Port Asyton", "Arycelle 2C")
    ) &&
    never(
      stale_event_script_reset(0x009A)
    )
  )
)

achievement(
  title = "Two Birds, One Stone", id = 424989,
  description = "Defeat Veldrei the Lamenting at Ndamsa Fortress by using the Stone Throw ability to deal the final blow",
  type = "missable", points = 10,
  trigger = (
    once(
      challenge_conditions("Ndamsa", "Veldrei")
    ) &&
    trigger_when(
      combat_action() == CombatActions["StoneThrow"] &&
      event_script_trigger(0x00BD)
    ) &&
    never(
      challenge_reset("Ndamsa", "Veldrei")
    ) &&
    never(
      combat_action() != CombatActions["StoneThrow"] &&
      is_event_script(0x00BD)
    )
  )
)

// -----------------------------
// Chapter 2 law

achievement(
  title = "Since We've Already Ceded the Moral High Ground...", id = 438658,
  description = "During the battle at Balmamusa, do not take any action that targets an enemy unit on a tile of equal or lower elevation to the attacking unit. Resuming from a mid-battle save is prohibited",
  type = "missable", points = 10,
  trigger = (
    once(
      mid_battle_load_protection() &&
      challenge_conditions("Balmamusa 2L", "Balmamusa 2L")
    ) &&
    trigger_when(
      // c2l_balmamusa_battle()
      event_script_trigger(0x00F4)
    ) &&
    never(
      challenge_reset("Balmamusa 2L", "Balmamusa 2L")
    ) &&
    never(
      __ornext(
        is_active_character_state("AttackTarget") || is_active_character_state("Spellcast")
      ) &&
      unit_is_active() &&
      active_unit_has_affiliation("Friendly") &&
      battle_menu_is_closed() &&
      unit_is_targeted() &&
      target_unit_has_affiliation("Enemy") &&
      active_unit_elevation() >= target_unit_elevation() 
    )
  )
)

achievement(
  title = "It's Dangerous to Go Alone", id = 441141,
  description = "Defeat Vyce and Arycelle at Rhime while ensuring that your units never end their turn on a tile adjacent to another unit. Resuming from a mid-battle save is prohibited",
  type = "missable", points = 10,
  trigger = once(
    mid_battle_load_protection() &&
    challenge_conditions("Rhime (Vyce and Arycelle Battle)", "Vyce and Arycelle")
  ) &&
  trigger_when(
    // c2l_rhime_battle()
    event_script_trigger(0x0114)
  ) &&
  never(
    challenge_reset("Rhime (Vyce and Arycelle Battle)", "Vyce and Arycelle")
  ) &&
  // Check that active unit is not standing adjacent to any other unit when turn ends
  never(
    any_of(
      range(0, 19),
      n => (
        (
          unit_is_active() &&
          active_unit_has_affiliation("Friendly") &&
          // active_unit_index() != n &&
          !was_active_character_state("EndTurn") &&
          is_active_character_state("EndTurn") &&
          battle_unit_hp(n) > 0 &&
          (active_unit_x() - battle_unit_x(n)) == 1 &&
          (active_unit_y() - battle_unit_y(n)) == 0
        ) ||
        (
          unit_is_active() &&
          active_unit_has_affiliation("Friendly") &&
          // active_unit_index() != n &&
          !was_active_character_state("EndTurn") &&
          is_active_character_state("EndTurn") &&
          battle_unit_hp(n) > 0 &&
          (battle_unit_x(n) - active_unit_x()) == 1 &&
          (active_unit_y() - battle_unit_y(n)) == 0
        ) ||
        (
          unit_is_active() &&
          active_unit_has_affiliation("Friendly") &&
          // active_unit_index() != n &&
          !was_active_character_state("EndTurn") &&
          is_active_character_state("EndTurn") &&
          battle_unit_hp(n) > 0 &&
          (active_unit_x() - battle_unit_x(n)) == 0 &&
          (active_unit_y() - battle_unit_y(n)) == 1
        ) ||
        (
          unit_is_active() &&
          active_unit_has_affiliation("Friendly") &&
          // active_unit_index() != n &&
          !was_active_character_state("EndTurn") &&
          is_active_character_state("EndTurn") &&
          battle_unit_hp(n) > 0 &&
          (active_unit_x() - battle_unit_x(n)) == 0 &&
          (battle_unit_y(n) - active_unit_y()) == 1
        )
      )
    )
  ) &&
  // When the final blow is landed on Vyce, the game goes directly into the cutscene event without
  // setting the flag to end the active unit's turn. Need to trigger a check for unit adjacency on
  // transition to the cutscene event script instead.
  never(
    any_of(
      range(0, 19),
      n => (
        (
          __ornext(
            battle_unit_hp(n) > 0 ||
            battle_unit_id(n) == CharacterID["Vyce (Rhime)"]
          ) &&
          active_unit_has_affiliation("Friendly") &&
          // active_unit_index() != n &&
          event_script_trigger(0x0114) &&
          // battle_unit_hp(n) > 0 &&
          (active_unit_x() - battle_unit_x(n)) == 1 &&
          (active_unit_y() - battle_unit_y(n)) == 0
        ) ||
        (
          __ornext(
            battle_unit_hp(n) > 0 ||
            battle_unit_id(n) == CharacterID["Vyce (Rhime)"]
          ) &&
          active_unit_has_affiliation("Friendly") &&
          // active_unit_index() != n &&
          event_script_trigger(0x0114) &&
          // battle_unit_hp(n) > 0 &&
          (battle_unit_x(n) - active_unit_x()) == 1 &&
          (active_unit_y() - battle_unit_y(n)) == 0
        ) ||
        (
          __ornext(
            battle_unit_hp(n) > 0 ||
            battle_unit_id(n) == CharacterID["Vyce (Rhime)"]
          ) &&
          active_unit_has_affiliation("Friendly") &&
          // active_unit_index() != n &&
          event_script_trigger(0x0114) &&
          // battle_unit_hp(n) > 0 &&
          (active_unit_x() - battle_unit_x(n)) == 0 &&
          (active_unit_y() - battle_unit_y(n)) == 1
        ) ||
        (
          __ornext(
            battle_unit_hp(n) > 0 ||
            battle_unit_id(n) == CharacterID["Vyce (Rhime)"]
          ) &&
          active_unit_has_affiliation("Friendly") &&
          // active_unit_index() != n &&
          event_script_trigger(0x0114) &&
          // battle_unit_hp(n) > 0 &&
          (active_unit_x() - battle_unit_x(n)) == 0 &&
          (battle_unit_y(n) - active_unit_y()) == 1
        )
      )
    )
  ) // &&
  // When the final blow is landed on Vyce, his HP goes to 0 so the above logic considers him not to
  // be present for the adjacency check. However, he delivers a speech upon 0HP rather than his sprite
  // vanishing, so it feels wrong not to reset the achievement when landing the final blow standing
  // next to him.
  // never(
  //   any_of(
  //     range(0, 19),
  //     n => (
  //       (
  //         active_unit_has_affiliation("Friendly") &&
  //         active_unit_index() != n &&
  //         event_script_trigger(0x0114) &&
  //         battle_unit_id(n) == CharacterID["Vyce (Rhime)"] &&
  //         (active_unit_x() - battle_unit_x(n)) == 1 &&
  //         (active_unit_y() - battle_unit_y(n)) == 0
  //       ) ||
  //       (
  //         active_unit_has_affiliation("Friendly") &&
  //         active_unit_index() != n &&
  //         event_script_trigger(0x0114) &&
  //         battle_unit_id(n) == CharacterID["Vyce (Rhime)"] &&
  //         (battle_unit_x(n) - active_unit_x()) == 1 &&
  //         (active_unit_y() - battle_unit_y(n)) == 0
  //       ) ||
  //       (
  //         active_unit_has_affiliation("Friendly") &&
  //         active_unit_index() != n &&
  //         event_script_trigger(0x0114) &&
  //         battle_unit_id(n) == CharacterID["Vyce (Rhime)"] &&
  //         (active_unit_x() - battle_unit_x(n)) == 0 &&
  //         (active_unit_y() - battle_unit_y(n)) == 1
  //       ) ||
  //       (
  //         active_unit_has_affiliation("Friendly") &&
  //         active_unit_index() != n &&
  //         event_script_trigger(0x0114) &&
  //         battle_unit_id(n) == CharacterID["Vyce (Rhime)"] &&
  //         (active_unit_x() - battle_unit_x(n)) == 0 &&
  //         (battle_unit_y(n) - active_unit_y()) == 1
  //       )
  //     )
  //   )
  // )
)

// -----------------------------
// Chapter 3 neutral

achievement(
  title = "Only Up", id = 439422,
  description = "Defeat Oz at Boed Fortress while never having your units finish their movement on a tile of lower elevation than the one they began on, and while ensuring that Cerya survives the battle. Resuming from a mid-battle save is prohibited",
  type = "missable", points = 10,
  trigger = (
    once(
      mid_battle_load_protection() &&
      challenge_conditions("Boed Fortress", "Oz C3N")
    ) &&
    trigger_when(
      // c3n_boed_battle()
      event_script_trigger(0x013B)
    ) &&
    never(
      challenge_reset("Boed Fortress", "Oz C3N")
    ) &&
    never(
      c3n_boed_cerya_dead()
    ) &&
    never(
      once(
        never(
          active_character_state() == prev(active_character_state()) &&
          is_active_character_state("MoveTargetMove") &&
          movement_substate() > prev(movement_substate())
        ) &&
        unit_is_active() &&
        active_unit_has_affiliation("Friendly") &&
        active_unit_ptr() == prev(active_unit_ptr()) &&
        movement_substate() != 0x03 &&
        active_unit_elevation()  < prev(active_unit_elevation())
      ) &&
      movement_complete()
    )
  )
)

function adjacent_unit_targeting_restriction() => (
  never(
    __ornext(
      is_active_character_state("AttackTarget") || is_active_character_state("Spellcast")
    ) &&
    unit_is_active() &&
    active_unit_has_affiliation("Friendly") &&
    battle_menu_is_closed() &&
    unit_is_targeted() &&
    (active_unit_x() - target_unit_x()) == 0 &&
    (active_unit_y() - target_unit_y()) == 1
  ) &&
  never(
    __ornext(
      is_active_character_state("AttackTarget") || is_active_character_state("Spellcast")
    ) &&
    unit_is_active() &&
    active_unit_has_affiliation("Friendly") &&
    battle_menu_is_closed() &&
    unit_is_targeted() &&
    (active_unit_x() - target_unit_x()) == 0 &&
    (target_unit_y() - active_unit_y()) == 1
  ) &&
  never(
    __ornext(
      is_active_character_state("AttackTarget") || is_active_character_state("Spellcast")
    ) &&
    unit_is_active() &&
    active_unit_has_affiliation("Friendly") &&
    battle_menu_is_closed() &&
    unit_is_targeted() &&
    (active_unit_x() - target_unit_x()) == 1 &&
    (active_unit_y() - target_unit_y()) == 0
  ) &&
  never(
    __ornext(
      is_active_character_state("AttackTarget") || is_active_character_state("Spellcast")
    ) &&
    unit_is_active() &&
    active_unit_has_affiliation("Friendly") &&
    battle_menu_is_closed() &&
    unit_is_targeted() &&
    (target_unit_x() - active_unit_x()) == 1 &&
    (active_unit_y() - target_unit_y()) == 0
  )
)

achievement(
  title = "Maintaining a Respectful Distance", id = 441142,
  description = "Defeat Nybeth Obdilord at Ndamsa Fortress while not taking any action that targets a unit adjacent to the initiating unit. Resuming from a mid-battle save is prohibited",
  type = "missable", points = 10,
  trigger = once(
    mid_battle_load_protection() &&
    challenge_conditions("Ndamsa", "Nybeth C3N")
  ) &&
  trigger_when(
    // c3n_nybeth_battle()
    event_script_multi_trigger([0x0168, 0x0169])
  ) &&
  never(
    challenge_reset("Ndamsa", "Nybeth C3N")
  ) &&
  adjacent_unit_targeting_restriction()
)

achievement(
  title = "Learning the Folly of a Frontal Assault", id = 441145,
  description = "Defeat Sir Xaebos at Coritanae Keep while not taking any action that targets an enemy unit from behind or from directly to the side. Resuming from a mid-battle save is prohibited",
  type = "missable", points = 10,
  trigger = once(
    mid_battle_load_protection() &&
    challenge_conditions("CoritanaeWard", "Xaebos C3N")
  ) &&
  trigger_when(
    event_script_trigger(0x0179)
  ) &&
  never(
    challenge_reset("CoritanaeWard", "Xaebos C3N")
  ) &&
  // Check that the attacking character is always in front of a targeted enemy unit.
  // When an enemy unit dies and turns into a loot bag its facing changes to 0x00 while the targeted
  // unit index continues to point at it -> needs to be excluded from logic. 
  never(
    __ornext(
      is_active_character_state("AttackTarget") || is_active_character_state("Spellcast")
    ) &&
    unit_is_active() &&
    active_unit_has_affiliation("Friendly") &&
    battle_menu_is_closed() &&
    unit_is_targeted() &&
    target_unit_has_affiliation("Enemy") &&
    target_unit_character_id() != CharacterID["LootBag"] &&
    target_unit_facing() == 0x00 &&
    active_unit_x() <= target_unit_x()
  ) &&
  never(
    __ornext(
      is_active_character_state("AttackTarget") || is_active_character_state("Spellcast")
    ) &&
    unit_is_active() &&
    active_unit_has_affiliation("Friendly") &&
    battle_menu_is_closed() &&
    unit_is_targeted() &&
    target_unit_has_affiliation("Enemy") &&
    target_unit_character_id() != CharacterID["LootBag"] &&
    target_unit_facing() == 0x01 &&
    active_unit_y() <= target_unit_y()
  ) &&
  never(
    __ornext(
      is_active_character_state("AttackTarget") || is_active_character_state("Spellcast")
    ) &&
    unit_is_active() &&
    active_unit_has_affiliation("Friendly") &&
    battle_menu_is_closed() &&
    unit_is_targeted() &&
    target_unit_has_affiliation("Enemy") &&
    target_unit_character_id() != CharacterID["LootBag"] &&
    target_unit_facing() == 0x02 &&
    active_unit_x() >= target_unit_x()
  ) &&
  never(
    __ornext(
      is_active_character_state("AttackTarget") || is_active_character_state("Spellcast")
    ) &&
    unit_is_active() &&
    active_unit_has_affiliation("Friendly") &&
    battle_menu_is_closed() &&
    unit_is_targeted() &&
    target_unit_has_affiliation("Enemy") &&
    target_unit_character_id() != CharacterID["LootBag"] &&
    target_unit_facing() == 0x03 &&
    active_unit_y() >= target_unit_y()
  )
)

// achievement(
//   title = "Dispatching the Enemy in an Orderly Fashion", id = 458319,
//   description = "Defeat the Dark Knight Ozma at Phidoch Castle while not taking any action that targets an enemy unit other than the last enemy unit to have taken a turn. Resuming from a mid-battle save is prohibited",
//   type = "missable", points = 10,
//   trigger = ()
// )

// -----------------------------
// Chapter 3 chaos

achievement(
  title = "Lorule's Finest?", id = 437050,
  description = "Defeat Gannon's forces at Port Asyton using only weapons, spells, skills, and items of the dark element",
  type = "missable", points = 10,
  trigger = (
    once(
      mid_battle_load_protection() &&
      challenge_conditions("Port Asyton", "Gannon")
    ) &&
    trigger_when(
      // c3c_asyton_battle()
      event_script_trigger(0x0192)
    ) &&
    never(
      challenge_reset("Port Asyton", "Gannon")
    ) &&
    attack_restriction(
      [0x1B00, 0x2500, 0x2F00, 0x3300, 0x3F00, 0x4A00, 0x4D00, 0x4E00, 0x5A01, 0x5B01, 0x6C00]
    ) &&
    spell_restriction(
      [0x2903, 0x2A03, 0x2B03, 0x02C03, 0x2D03, 0x2E03, 0x2F03, 0x3003, 0x4502, 0x4602, 0x4702, 0x4B02, 0x5104, 0xC804, 0x9003, 0x3F04]
    ) &&
    counterattack_restriction(
      [0x1B00, 0x2500, 0x2F00, 0x3300, 0x3F00, 0x4A00, 0x4D00, 0x4E00, 0x5A01, 0x5B01, 0x6C00]
    )
  )
)

achievement(
  title = "A Duel, Then", id = 434582,
  description = "Defeat Leonar at Coritanae Keep after accepting his offer to duel one-on-one",
  type = "missable", points = 10,
  trigger = ((
    __ornext(string_id() == 0x0F34 || string_id() == 0x0F35) &&
    // is_map("CoritanaeWard") &&
    __ornext(is_music("Notice of Death") || is_music("VENDETTA!")) &&
    battle_halted()
  ) ||
  once(
    challenge_conditions("CoritanaeWard", "LeonarDuel")
  )) &&
  trigger_when(
    // c3c_leonar_battle()
    event_script_trigger(0x01B7)
  ) &&
  never(
    !is_game_state("Field Program") ||
    !is_map("CoritanaeWard") ||
    is_music("Retreat!") ||
    is_music("A Colour of Chaos")
  )
)

achievement(
  title = "Bird Bane", id = 430351,
  description = "Defeat Ganpp at Mount Weobry after first killing Obda, Berda, Banga, and Zanga. Resuming from a mid-battle save is prohibited",
  type = "missable", points = 10,
  trigger = (
    once(
      mid_battle_load_protection() &&
      challenge_conditions("Weobry", "Ganpp3C")
    ) &&
    trigger_when(
      // TODO consider using event script IDs rather than string IDs
      once(prev(string_id()) != 0x0D5A && string_id() == 0x0D5A) &&
      once(prev(string_id()) != 0x0D5B && string_id() == 0x0D5B) &&
      once(prev(string_id()) != 0x0D5C && string_id() == 0x0D5C) &&
      once(prev(string_id()) != 0x0D5D && string_id() == 0x0D5D) &&
      // Use `once` to force an `AndNext` to suppress a warning, remove hit before publishing
      once(event_script_trigger(0x0145))
    ) &&
    never(
      challenge_reset("Weobry", "Ganpp3C")
    ) &&
    never(
      stale_event_script_reset(0x0145)
    )
  )
)

achievement(
  title = "Pay No Attention to the Men Behind the Curtain", id = 436989,
  description = "Defeat Oz at Boed Fortress without deploying units of any class other than Wizard",
  type = "missable", points = 10,
  trigger = (
    once(
      challenge_conditions("Boed Fortress", "Oz C3C")
    ) &&
    // c3c_boed_battle()
    event_script_trigger(0x01CB)
  ) &&
  all_of(
    range(0, 7),
    n => never(
      battle_active() &&
      !is_music("Glory") &&
      deploy_slot_has_affiliation(n, "Friendly") &&
      !deploy_slot_has_class(n, "Wizard")
    )
  ) &&
  never(
    challenge_reset("Boed Fortress", "Oz C3C")
  ) &&
  // These two entries in the array can contain stale friendly actor from the cutscene that plays out
  // before the battle. Exclude checking them if total deploy count indicates they are unused.
  never(
    battle_active() &&
    !is_music("Glory") &&
    units_alive_on_battlefield() > 8 &&
    deploy_slot_has_affiliation(8, "Friendly") &&
    !deploy_slot_has_class(8, "Wizard")
  ) &&
  never(
    battle_active() &&
    !is_music("Glory") &&
    units_alive_on_battlefield() > 9 &&
    deploy_slot_has_affiliation(9, "Friendly") &&
    !deploy_slot_has_class(9, "Wizard")
  )
)

achievement(
  title = "Saving the Easy Target for Last", id = 437045,
  description = "During the battle with the Dark Knights Oz and Ozma at Phidoch Castle, defeat Ozma before Oz",
  type = "missable", points = 10,
  trigger = once(
    challenge_conditions("Phidoch Hall", "Oz and Ozma")
  ) &&
  trigger_when(
    // c3c_oz_ozma_battle()
    event_script_trigger(0x01D8)
  ) &&
  never(
    c3c_oz_dead() && !c3c_ozma_dead()
  ) &&
  never(
    challenge_reset("Phidoch Hall", "Oz and Ozma")
  )
)

// -----------------------------
// Chapter 3 law

achievement(
  title = "Birdwatcher", id = 448881,
  description = "Defeat Ganpp at Tynemouth Hill without dealing any damage to Obda, Berda, Banga, or Zanga. Resuming from a mid-battle save is prohibited",
  type = "missable", points = 10,
  trigger = (
    once(
      mid_battle_load_protection() &&
      challenge_conditions("Tynemouth Hill", "Ganpp3L")
    ) &&
    trigger_when(
      // c3l_tynemouth_battle()
      event_script_trigger(0x0145)
    ) &&
    never(
      challenge_reset("Tynemouth Hill", "Ganpp3L")
    ) &&
    never(
      unit_is_active() &&
      active_unit_has_affiliation("Friendly") &&
      unit_is_targeted() &&
      target_unit_is_enemy() &&
      !target_unit_is_leader() &&
      target_unit_has_taken_damage()
    ) &&
    never(
      unit_is_active() &&
      active_unit_has_affiliation("Enemy") &&
      !active_unit_is_leader() &&
      active_unit_not_acting() &&
      acting_unit_has_affiliation("Friendly") &&
      counterattack_active() &&
      active_unit_hp() < prev(active_unit_hp())
    )
  )
)

achievement(
  title = "Backstabber", id = 441144,
  description = "Defeat Sir Xaebos at Almorica Castle while not taking any action that targets an enemy unit from in front or from directly to the side. Resuming from a mid-battle save is prohibited",
  type = "missable", points = 10,
  trigger = once(
    mid_battle_load_protection() &&
    challenge_conditions("Almorica Passage", "Xaebos C3L")
  ) &&
  trigger_when(
    event_script_trigger(0x020D)
  ) &&
  never(
    challenge_reset("Almorica Passage", "Xaebos C3L")
  ) &&
  // Check that the attacking character is always behind a targeted enemy unit.
  // Melee attacks provoke a counterattack that turns the attacked unit around, need to exclude this
  // from detection logic. Unit remains targeted for one frame after counterattack phase ends.
  never(
    is_active_character_state("AttackTarget") &&
    unit_is_active() &&
    active_unit_has_affiliation("Friendly") &&
    battle_menu_is_closed() &&
    unit_is_targeted() &&
    target_unit_has_affiliation("Enemy") &&
    
    prev(counterattack_state()) != 1 &&
    counterattack_state() != 1 &&
    
    target_unit_character_id() != 0xF0 &&
    target_unit_facing() == 0x00 &&
    active_unit_x() >= target_unit_x()
  ) &&
  never(
    is_active_character_state("AttackTarget") &&
    unit_is_active() &&
    active_unit_has_affiliation("Friendly") &&
    battle_menu_is_closed() &&
    unit_is_targeted() &&
    target_unit_has_affiliation("Enemy") &&

    prev(counterattack_state()) != 1 &&
    counterattack_state() != 1 &&
    
    target_unit_character_id() != 0xF0 &&
    target_unit_facing() == 0x01 &&
    active_unit_y() >= target_unit_y()
  ) &&
  never(
    is_active_character_state("AttackTarget") &&
    unit_is_active() &&
    active_unit_has_affiliation("Friendly") &&
    battle_menu_is_closed() &&
    unit_is_targeted() &&
    target_unit_has_affiliation("Enemy") &&

    prev(counterattack_state()) != 1 &&
    counterattack_state() != 1 &&
    
    target_unit_character_id() != 0xF0 &&
    target_unit_facing() == 0x02 &&
    active_unit_x() <= target_unit_x()
  ) &&
  never(
    is_active_character_state("AttackTarget") &&
    unit_is_active() &&
    active_unit_has_affiliation("Friendly") &&
    battle_menu_is_closed() &&
    unit_is_targeted() &&
    target_unit_has_affiliation("Enemy") &&

    prev(counterattack_state()) != 1 &&
    counterattack_state() != 1 &&
    
    target_unit_character_id() != 0xF0 &&
    target_unit_facing() == 0x03 &&
    active_unit_y() <= target_unit_y()
  ) &&
  // Check that the spellcasting character is always behind a targeted enemy unit.
  // A few spells such as Tornado spin the attacked unit around and cause the achievement to reset
  // even if the casting unit initiated the attack while behind the target. This is fine, becuase it
  // is funny when it happens.
  never(
    is_active_character_state("Spellcast") &&
    unit_is_active() &&
    active_unit_has_affiliation("Friendly") &&
    battle_menu_is_closed() &&
    unit_is_targeted() &&
    target_unit_has_affiliation("Enemy") &&
    target_unit_character_id() != 0xF0 &&
    target_unit_facing() == 0x00 &&
    active_unit_x() >= target_unit_x()
  ) &&
  never(
    is_active_character_state("Spellcast") &&
    unit_is_active() &&
    active_unit_has_affiliation("Friendly") &&
    battle_menu_is_closed() &&
    unit_is_targeted() &&
    target_unit_has_affiliation("Enemy") &&
    target_unit_character_id() != 0xF0 &&
    target_unit_facing() == 0x01 &&
    active_unit_y() >= target_unit_y()
  ) &&
  never(
    is_active_character_state("Spellcast") &&
    unit_is_active() &&
    active_unit_has_affiliation("Friendly") &&
    battle_menu_is_closed() &&
    unit_is_targeted() &&
    target_unit_has_affiliation("Enemy") &&
    target_unit_character_id() != 0xF0 &&
    target_unit_facing() == 0x02 &&
    active_unit_x() <= target_unit_x()
  ) &&
  never(
    is_active_character_state("Spellcast") &&
    unit_is_active() &&
    active_unit_has_affiliation("Friendly") &&
    battle_menu_is_closed() &&
    unit_is_targeted() &&
    target_unit_has_affiliation("Enemy") &&
    target_unit_character_id() != 0xF0 &&
    target_unit_facing() == 0x03 &&
    active_unit_y() <= target_unit_y()
  )
)

achievement(
  title = "Rupture Rose and Camellia", id = 438817,
  description = "Defeat the Dark Knight Ozma at Rhime while not targeting her with anything other than bare hand melee attacks, and while ensuring Hobyrim survives the battle. Resuming from a mid-battle save is prohibited",
  type = "missable", points = 10,
  trigger = (
    once(
      mid_battle_load_protection() &&
      challenge_conditions("Rhime (Ozma Battle)", "Ozma (Rhime)")
    ) &&
    trigger_when(
      // c3l_rhime_battle()
      event_script_multi_trigger([0x0215, 0x0218])
    ) &&
    never(
      challenge_reset("Rhime (Ozma Battle)", "Ozma (Rhime)")
    ) &&
    never(
      c3l_rhime_hobyrim_dead()
    ) &&
    never(
      unit_is_active() &&
      active_unit_has_affiliation("Friendly") &&
      is_active_character_state("AttackTarget") &&
      battle_menu_closed() &&
      unit_is_targeted() &&
      // target_unit_has_affiliation("Enemy") &&
      target_unit_character_id() == 0x49 &&
      // target_unit_character_id() != 0xF0 &&
      !is_combat_action("Unarmed")
    ) &&
    never(
      unit_is_active() &&
      active_unit_has_affiliation("Friendly") &&
      is_active_character_state("Spellcast") &&
      battle_menu_is_closed() &&
      unit_is_targeted() &&
      // target_unit_has_affiliation("Enemy") &&
      target_unit_character_id() == 0x49 &&
      // target_unit_character_id() != 0xF0 &&
      !is_combat_action("Unarmed")
    ) &&
    never(
      unit_is_active() &&
      // active_unit_has_affiliation("Enemy") &&
      active_unit_character_id() == 0x49 &&
      active_unit_was_acting() &&
      active_unit_not_acting() &&
      acting_unit_has_affiliation("Friendly") &&
      counterattack_start() &&
      !is_combat_action("Unarmed")
    )
  )
)

achievement(
  title = "Unfinished Business", id = 461089,
  description = "Defeat the Dark Knight Oz at Phidoch Castle without attacking or counterattacking him with any unit other than Denam. Resuming from a mid-battle save is prohibited",
  type = "missable", points = 10,
  trigger = once(
    mid_battle_load_protection() &&
    is_map("Phidoch Hall") &&
    is_event_script(0x0220) &&
    prev(encounter_group()) != Encounters["Oz C3L Group"] &&
    is_story_encounter("Oz C3L Group")
  ) &&
  trigger_when(
    event_script_trigger(0x0221)
  ) &&
  never(
    challenge_reset("Phidoch Hall", "Oz C3L Group")
  ) &&
  never(
    __ornext(
      is_active_character_state("AttackTarget") ||
      is_active_character_state("Spellcast")
    ) &&
    battle_menu_is_closed() &&
    unit_is_active() &&
    active_unit_has_affiliation("Friendly") &&
    active_unit_character_id() != CharacterID["Denam"] &&
    unit_is_targeted() &&
    target_unit_has_affiliation("Enemy") &&
    target_unit_character_id() == CharacterID["Oz"]
  ) && never(
    unit_is_active() &&
    active_unit_character_id() == CharacterID["Oz"] &&
    active_unit_was_acting() &&
    active_unit_not_acting() &&
    counterattack_start() &&
    acting_unit_has_affiliation("Friendly") &&
    acting_unit_character_id() != CharacterID["Denam"]
  )
)

// -----------------------------
// Chapter 4

achievement(
  title = "Believer Bother", id = 430278,
  description = "During the battle with Sherri at Hagia Banhamuba, kill the cleric by knocking her into the pit in the middle of the map",
  type = "missable", points = 10,
  trigger = once(
    challenge_conditions("Hagia Banhamuba", "Sherri")
  ) &&
  trigger_when(
    // Use `once` to force an `AndNext` for style reasons, remove hit before publishing
    once(
      unit_is_targeted() &&
      target_unit_is_enemy() &&
      prior(target_unit_character_id()) == CharacterID["Cleric"] &&
      target_unit_character_id() == CharacterID["Nothing"] &&
      prev(string_id()) != 0x04A9 &&
      string_id() == 0x04A9
    )
  ) &&
  never(
    challenge_reset("Hagia Banhamuba", "Sherri")
  ) &&
  never (
    unit_is_special_targeted() &&
    special_target_ptr() != prev(special_target_ptr()) &&
    special_target_has_affiliation("Enemy") &&
    special_target_character_id() == CharacterID["Cleric"] &&
    special_target_dead()
  ) &&
  all_of(
    range(1, 19),
    n => never(
      battle_unit_affiliation(n) == 0x03 &&
      prev(battle_unit_class(n)) == 0x14 &&
      battle_unit_class(n) == 0xF0
    )
  ) && never(
    event_script_trigger(0x0255)
  )
)

achievement(
  title = "The Path to the Palace Depths", id = 438325,
  description = "Open a hidden door on the third floor of the Palace of the Dead",
  points = 1,
  trigger = once(
    is_potd_floor(3) &&
    is_map("PotD Floor 3") &&
    battle_start() &&
    !is_music("Glory")
  ) &&
  trigger_when(
    hidden_door_opened()
  ) &&
  never(
    !is_game_state("Field Program") ||
    !is_map("PotD Floor 3") ||
    !is_potd_floor(3) ||
    battle_inactive()
  )
)

achievement(
  title = "Close Quarters Combat", id = 441143,
  description = "Defeat the Dark Knight Barbas at Barnicia Castle while not taking any action that targets a unit not adjacent to the initiating unit, and while not knocking back any targeted unit. Resuming from a mid-battle save is prohibited",
  type = "missable", points = 10,
  trigger = once(
    mid_battle_load_protection() &&
    challenge_conditions("BarniciaCourtyard", "Barbas")
  ) &&
  trigger_when(
    // c4_barnicia_barbas()
    event_script_trigger(0x0267)
  ) &&
  never(
    challenge_reset("BarniciaCourtyard", "Barbas")
  ) &&

  never(
    __ornext(
        is_active_character_state("AttackTarget") || is_active_character_state("Spellcast")
      ) &&
      unit_is_active() &&
      active_unit_has_affiliation("Friendly") &&
      battle_menu_is_closed() &&
      !unit_has_attacked() &&
      unit_is_targeted() &&
      target_unit_ptr() != active_unit_ptr() &&
      (active_unit_x() - target_unit_x()) >  1 &&
      (active_unit_y() - target_unit_y()) == 0
  ) &&
  never(
    __ornext(
        is_active_character_state("AttackTarget") || is_active_character_state("Spellcast")
      ) &&
      unit_is_active() &&
      active_unit_has_affiliation("Friendly") &&
      battle_menu_is_closed() &&
      !unit_has_attacked() &&
      unit_is_targeted() &&
      target_unit_ptr() != active_unit_ptr() &&
      (target_unit_x() - active_unit_x()) >  1 &&
      (active_unit_y() - target_unit_y()) == 0
  ) &&
  never(
    __ornext(
        is_active_character_state("AttackTarget") || is_active_character_state("Spellcast")
      ) &&
      unit_is_active() &&
      active_unit_has_affiliation("Friendly") &&
      battle_menu_is_closed() &&
      !unit_has_attacked() &&
      unit_is_targeted() &&
      target_unit_ptr() != active_unit_ptr() &&
      (active_unit_x() - target_unit_x()) == 0 &&
      (active_unit_y() - target_unit_y()) >  1
  ) &&
  never(
    __ornext(
        is_active_character_state("AttackTarget") || is_active_character_state("Spellcast")
      ) &&
      unit_is_active() &&
      active_unit_has_affiliation("Friendly") &&
      battle_menu_is_closed() &&
      !unit_has_attacked() &&
      unit_is_targeted() &&
      target_unit_ptr() != active_unit_ptr() &&
      (active_unit_x() - target_unit_x()) == 0 &&
      (target_unit_y() - active_unit_y()) >  1
  ) &&
  
  never(
    __ornext(
        is_active_character_state("AttackTarget") || is_active_character_state("Spellcast")
      ) &&
      unit_is_active() &&
      active_unit_has_affiliation("Friendly") &&
      battle_menu_is_closed() &&
      !unit_has_attacked() &&
      unit_is_targeted() &&
      target_unit_ptr() != active_unit_ptr() &&
      (active_unit_x() - target_unit_x()) >= 1 &&
      (active_unit_y() - target_unit_y()) >= 1
  ) &&
  never(
    __ornext(
        is_active_character_state("AttackTarget") || is_active_character_state("Spellcast")
      ) &&
      unit_is_active() &&
      active_unit_has_affiliation("Friendly") &&
      battle_menu_is_closed() &&
      !unit_has_attacked() &&
      unit_is_targeted() &&
      target_unit_ptr() != active_unit_ptr() &&
      (target_unit_x() - active_unit_x()) >= 1 &&
      (active_unit_y() - target_unit_y()) >= 1
  ) &&
  never(
    __ornext(
        is_active_character_state("AttackTarget") || is_active_character_state("Spellcast")
      ) &&
      unit_is_active() &&
      active_unit_has_affiliation("Friendly") &&
      battle_menu_is_closed() &&
      !unit_has_attacked() &&
      unit_is_targeted() &&
      target_unit_ptr() != active_unit_ptr() &&
      (target_unit_x() - active_unit_x()) >= 1 &&
      (target_unit_y() - active_unit_y()) >= 1
  ) &&
  never(
    __ornext(
        is_active_character_state("AttackTarget") || is_active_character_state("Spellcast")
      ) &&
      unit_is_active() &&
      active_unit_has_affiliation("Friendly") &&
      battle_menu_is_closed() &&
      !unit_has_attacked() &&
      unit_is_targeted() &&
      target_unit_ptr() != active_unit_ptr() &&
      (active_unit_x() - target_unit_x()) >= 1 &&
      (target_unit_y() - active_unit_y()) >= 1
  )
  // never(
  //   tally(
  //     1,
  //     deduct(
  //       __ornext(
  //         is_active_character_state("AttackTarget") || is_active_character_state("Spellcast")
  //       ) &&
  //       unit_is_active() &&
  //       active_unit_has_affiliation("Friendly") &&
  //       battle_menu_is_closed() &&
  //       !unit_has_attacked() &&
  //       unit_is_targeted() &&
  //       target_unit_ptr() != active_unit_ptr() &&
  //       (active_unit_x() - target_unit_x()) == 0 &&
  //       (active_unit_y() - target_unit_y()) == 1
  //     ),
  //     deduct(
  //       __ornext(
  //         is_active_character_state("AttackTarget") || is_active_character_state("Spellcast")
  //       ) &&
  //       unit_is_active() &&
  //       active_unit_has_affiliation("Friendly") &&
  //       battle_menu_is_closed() &&
  //       !unit_has_attacked() &&
  //       unit_is_targeted() &&
  //       target_unit_ptr() != active_unit_ptr() &&
  //       (active_unit_x() - target_unit_x()) == 0 &&
  //       (target_unit_y() - active_unit_y()) == 1
  //     ),
  //     deduct(
  //       __ornext(
  //         is_active_character_state("AttackTarget") || is_active_character_state("Spellcast")
  //       ) &&
  //       unit_is_active() &&
  //       active_unit_has_affiliation("Friendly") &&
  //       battle_menu_is_closed() &&
  //       !unit_has_attacked() &&
  //       unit_is_targeted() &&
  //       target_unit_ptr() != active_unit_ptr() &&
  //       (active_unit_x() - target_unit_x()) == 1 &&
  //       (active_unit_y() - target_unit_y()) == 0
  //     ),
  //     deduct(
  //       __ornext(
  //         is_active_character_state("AttackTarget") || is_active_character_state("Spellcast")
  //       ) &&
  //       unit_is_active() &&
  //       active_unit_has_affiliation("Friendly") &&
  //       battle_menu_is_closed() &&
  //       !unit_has_attacked() &&
  //       unit_is_targeted() &&
  //       target_unit_ptr() != active_unit_ptr() &&
  //       (target_unit_x() - active_unit_x()) == 1 &&
  //       (active_unit_y() - target_unit_y()) == 0
  //     ),
  //     (
  //       __ornext(
  //         is_active_character_state("AttackTarget") || is_active_character_state("Spellcast")
  //       ) &&
  //       unit_is_active() &&
  //       active_unit_has_affiliation("Friendly") &&
  //       battle_menu_is_closed() &&
  //       !unit_has_attacked() &&
  //       unit_is_targeted() &&
  //       target_unit_ptr() != active_unit_ptr()
  //     )
  //   )
  // )
)

function prev_battle_unit_hp(n) => prev(word(0x0D9650 + n * 0x6C + 0x06))
function prev_battle_unit_x(n)  => prev(byte(0x0D9650 + n * 0x6C + 0x4E))
function prev_battle_unit_y(n)  => prev(byte(0x0D9650 + n * 0x6C + 0x4F))

function luct_adjacency_requirements() {
  foo = array_map(range(0, 161), n => always_false())
  
  foo[160] = (
    unit_is_active() &&
    active_unit_has_affiliation("Friendly") &&
    !was_active_character_state("EndTurn") &&
    is_active_character_state("EndTurn")
  )
  foo[161] = deduct(
    prior(active_unit_ptr()) != 0xFFFF &&
    is_active_character_state("EndTurn") &&
    prev(active_unit_ptr()) != active_unit_ptr() &&
    byte(prev(active_unit_ptr()) * 0x6C + 0x0D9674) == Affiliation["Friendly"]
  )

  for n in range(0, 19) {
    foo[8 * n] = deduct(
      unit_is_active() &&
      active_unit_has_affiliation("Friendly") &&
      // active_unit_index() != n &&
      !was_active_character_state("EndTurn") &&
      is_active_character_state("EndTurn") &&
      battle_unit_hp(n) > 0 &&

      (active_unit_x() - battle_unit_x(n)) == 1 &&
      (active_unit_y() - battle_unit_y(n)) == 0
    )
    foo[8 * n + 1] = (
      prior(active_unit_ptr()) != 0xFFFF &&
      is_active_character_state("EndTurn") &&
      prev(active_unit_ptr()) != active_unit_ptr() &&
      byte(prev(active_unit_ptr()) * 0x6C + 0x0D9674) == Affiliation["Friendly"] &&
      // word(prev(active_unit_ptr()) * 0x6C + 0x0D96B8) != n && // active_unit_index
      prev_battle_unit_hp(n) > 0 &&

      (byte(prev(active_unit_ptr()) * 0x6C + 0x0D969E) - prev_battle_unit_x(n)) == 1 &&
      (byte(prev(active_unit_ptr()) * 0x6C + 0x0D969F) - prev_battle_unit_y(n)) == 0
    )
    foo[8 * n + 2] = deduct(
      unit_is_active() &&
      active_unit_has_affiliation("Friendly") &&
      // active_unit_index() != n &&
      !was_active_character_state("EndTurn") &&
      is_active_character_state("EndTurn") &&
      battle_unit_hp(n) > 0 &&

      (battle_unit_x(n) - active_unit_x()) == 1 &&
      (active_unit_y() - battle_unit_y(n)) == 0
    )
    foo[8 * n + 3] = (
      prior(active_unit_ptr()) != 0xFFFF &&
      is_active_character_state("EndTurn") &&
      prev(active_unit_ptr()) != active_unit_ptr() &&
      byte(prev(active_unit_ptr()) * 0x6C + 0x0D9674) == Affiliation["Friendly"] &&
      // word(prev(active_unit_ptr()) * 0x6C + 0x0D96B8) != n && // active_unit_index
      prev_battle_unit_hp(n) > 0 &&

      (prev_battle_unit_x(n) - byte(prev(active_unit_ptr()) * 0x6C + 0x0D969E)) == 1 &&
      (byte(prev(active_unit_ptr()) * 0x6C + 0x0D969F) - prev_battle_unit_y(n)) == 0
    )
    foo[8 * n + 4] = deduct(
      unit_is_active() &&
      active_unit_has_affiliation("Friendly") &&
      // active_unit_index() != n &&
      !was_active_character_state("EndTurn") &&
      is_active_character_state("EndTurn") &&
      battle_unit_hp(n) > 0 &&

      (active_unit_x() - battle_unit_x(n)) == 0 &&
      (active_unit_y() - battle_unit_y(n)) == 1
    )
    foo[8 * n + 5] = (
      prior(active_unit_ptr()) != 0xFFFF &&
      is_active_character_state("EndTurn") &&
      prev(active_unit_ptr()) != active_unit_ptr() &&
      byte(prev(active_unit_ptr()) * 0x6C + 0x0D9674) == Affiliation["Friendly"] &&
      // word(prev(active_unit_ptr()) * 0x6C + 0x0D96B8) != n && // active_unit_index
      prev_battle_unit_hp(n) > 0 &&

      (byte(prev(active_unit_ptr()) * 0x6C + 0x0D969E) - prev_battle_unit_x(n)) == 0 &&
      (byte(prev(active_unit_ptr()) * 0x6C + 0x0D969F) - prev_battle_unit_y(n)) == 1
    )
    foo[8 * n + 6] = deduct(
      unit_is_active() &&
      active_unit_has_affiliation("Friendly") &&
      // active_unit_index() != n &&
      !was_active_character_state("EndTurn") &&
      is_active_character_state("EndTurn") &&
      prev_battle_unit_hp(n) > 0 &&

      (active_unit_x() - battle_unit_x(n)) == 0 &&
      (battle_unit_y(n) - active_unit_y()) == 1
    )
    foo[8 * n + 7] = (
      prior(active_unit_ptr()) != 0xFFFF &&
      is_active_character_state("EndTurn") &&
      prev(active_unit_ptr()) != active_unit_ptr() &&
      byte(prior(active_unit_ptr()) * 0x6C + 0x0D9674) == Affiliation["Friendly"] &&
      // word(prev(active_unit_ptr()) * 0x6C + 0x0D96B8) != n && // active_unit_index
      battle_unit_hp(n) > 0 &&

      (byte(prev(active_unit_ptr()) * 0x6C + 0x0D969E) - prev_battle_unit_x(n)) == 0 &&
      (prev_battle_unit_y(n) - byte(prev(active_unit_ptr()) * 0x6C + 0x0D969F)) == 1
    )
  }

  return never(
    tally(
      1,
      foo
    )
  )
}

function luct_final_turn_adjacency_requirements() {
  foo = array_map(range(0, 160), n => always_false())
  foo[160] = (
    event_script_multi_trigger([0x026A, 0x026E]) &&
    unit_is_active() &&
    active_unit_has_affiliation("Friendly")
  )
  for n in range(0, 19) {
    foo[4 * n] = deduct(
      event_script_multi_trigger([0x026A, 0x026E]) &&
      unit_is_active() &&
      active_unit_has_affiliation("Friendly") &&
      // active_unit_index() != n &&
      battle_unit_hp(n) > 0 &&
      (active_unit_x() - battle_unit_x(n)) == 1 &&
      (active_unit_y() - battle_unit_y(n)) == 0
    )
    foo[4 * n + 80] = deduct(
      event_script_multi_trigger([0x026A, 0x026E]) &&
      unit_is_active() &&
      active_unit_has_affiliation("Friendly") &&
      // active_unit_index() != n &&
      battle_unit_class(n) == 0x041 &&
      (active_unit_x() - battle_unit_x(n)) == 1 &&
      (active_unit_y() - battle_unit_y(n)) == 0
    )
    
    foo[4 * n + 1] = deduct(
      event_script_multi_trigger([0x026A, 0x026E]) &&
      unit_is_active() &&
      active_unit_has_affiliation("Friendly") &&
      // active_unit_index() != n &&
      battle_unit_hp(n) > 0 &&
      (battle_unit_x(n) - active_unit_x()) == 1 &&
      (active_unit_y() - battle_unit_y(n)) == 0
    )
    foo[4 * n + 81] = deduct(
      event_script_multi_trigger([0x026A, 0x026E]) &&
      unit_is_active() &&
      active_unit_has_affiliation("Friendly") &&
      // active_unit_index() != n &&
      battle_unit_class(n) == 0x041 &&
      (battle_unit_x(n) - active_unit_x()) == 1 &&
      (active_unit_y() - battle_unit_y(n)) == 0
    )
    
    foo[4 * n + 2] = deduct(
      event_script_multi_trigger([0x026A, 0x026E]) &&
      unit_is_active() &&
      active_unit_has_affiliation("Friendly") &&
      // active_unit_index() != n &&
      battle_unit_hp(n) > 0 &&
      (active_unit_x() - battle_unit_x(n)) == 0 &&
      (active_unit_y() - battle_unit_y(n)) == 1
    )
    foo[4 * n + 82] = deduct(
      event_script_multi_trigger([0x026A, 0x026E]) &&
      unit_is_active() &&
      active_unit_has_affiliation("Friendly") &&
      // active_unit_index() != n &&
      battle_unit_class(n) == 0x041 &&
      (active_unit_x() - battle_unit_x(n)) == 0 &&
      (active_unit_y() - battle_unit_y(n)) == 1
    )
    
    foo[4 * n + 3] = deduct(
      event_script_multi_trigger([0x026A, 0x026E]) &&
      unit_is_active() &&
      active_unit_has_affiliation("Friendly") &&
      // active_unit_index() != n &&
      battle_unit_hp(n) > 0 &&
      (active_unit_x() - battle_unit_x(n)) == 0 &&
      (battle_unit_y(n) - active_unit_y()) == 1
    )
    foo[4 * n + 83] = deduct(
      event_script_multi_trigger([0x026A, 0x026E]) &&
      unit_is_active() &&
      active_unit_has_affiliation("Friendly") &&
      // active_unit_index() != n &&
      battle_unit_class(n) == 0x041 &&
      (active_unit_x() - battle_unit_x(n)) == 0 &&
      (battle_unit_y(n) - active_unit_y()) == 1
    )
  }

  return never(
    tally(
      1,
      foo
    )
  )
}

achievement(
  title = "Let Us Cling Together", id = 438818,
  description = "Defeat Lanselot Tartaros at Barnicia Castle while ensuring that your units always end their turn on a tile adjacent to another unit. If Catiua is present, she must survive. Resuming from a mid-battle save is prohibited",
  type = "missable", points = 10,
  trigger = once(
    (
      mid_battle_load_protection() &&
      challenge_conditions("Barnicia Staircase", "Lanselot 1")
    ) ||
    (
      mid_battle_load_protection() &&
      challenge_conditions("Barnicia Staircase", "Lanselot 2")
    )
  ) &&
  trigger_when(
    // c4_lanselot_battle()
    event_script_multi_trigger([0x026A, 0x026E])
  ) &&
  never(
    challenge_reset("Barnicia Staircase", "Lanselot 1") &&
    challenge_reset("Barnicia Staircase", "Lanselot 2")
  ) &&
  never(
    c4_barnicia_catiua_dead()
  ) &&
  never(
    is_event_script(0x0269)
  ) &&
  luct_adjacency_requirements() &&
  luct_final_turn_adjacency_requirements()
)

achievement(
  title = "Fighting Fire with Fire", id = 437046,
  description = "Defeat the guardians of Xoshonell Temple using only weapons, spells, skills, and items of the fire element. Resuming from a mid-battle save is prohibited",
  type = "missable", points = 10,
  trigger = (
    once(
      mid_battle_load_protection() &&
      challenge_conditions("Xoshonell Temple", "Xoshonell Temple")
    ) &&
    trigger_when(
      c4_xoshonell_temple()
    ) &&
    never(
      challenge_reset("Xoshonell Temple", "Xoshonell Temple")
    ) &&
    attack_restriction(
      [0x0800, 0x0900, 0x0A00, 0x1300, 0x2000, 0x2100, 0x2A00, 0x3B00, 0x4500, 0x4600, 0x5601, 0x6800]
    ) &&
    snapdragon_restriction(0, "Fire") &&
    snapdragon_restriction(1, "Fire") &&
    snapdragon_restriction(2, "Fire") &&
    spell_restriction(
      [0x0903, 0x0A03, 0x0B03, 0x0C03, 0x0D03, 0x0E03, 0x0F03, 0x1003, 0x3202, 0x3B02, 0x3C02, 0x4D04, 0xC404, 0x5302, 0x7A02, 0x8C03, 0x3B04]
    ) &&
    counterattack_restriction(
      [0x0800, 0x0900, 0x0A00, 0x1300, 0x2000, 0x2100, 0x2A00, 0x3B00, 0x4500, 0x4600, 0x5601, 0x6800]
    ) &&
    snapdragon_counterattack_restriction(0, "Fire") &&
    snapdragon_counterattack_restriction(1, "Fire") &&
    snapdragon_counterattack_restriction(2, "Fire")
  )
)

achievement(
  title = "Howling into the Wind", id = 437049,
  description = "Defeat the guardians of Hahnela Temple using only weapons, spells, skills, and items of the wind element. Resuming from a mid-battle save is prohibited",
  type = "missable", points = 10,
  trigger = (
    once(
      mid_battle_load_protection() &&
      challenge_conditions("Hahnela Temple", "Hahnela Temple")
    ) &&
    trigger_when(
      c4_hahnela_temple()
    ) &&
    never(
      challenge_reset("Hahnela Temple", "Hahnela Temple")
    ) &&
    attack_restriction(
      [0x0800, 0x0900, 0x0A00, 0x1200, 0x1F00, 0x2100, 0x2900, 0x3200, 0x3A00, 0x4400, 0x5501, 0x6700]
    ) &&
    snapdragon_restriction(0, "Wind") &&
    snapdragon_restriction(1, "Wind") &&
    snapdragon_restriction(2, "Wind") &&
    spell_restriction(
      [0x0103, 0x0203, 0x0303, 0x0403, 0x0503, 0x0603, 0x0703, 0x0803, 0x3102, 0x3902, 0x3A02, 0x4902, 0x4A02, 0x4C04, 0xC304, 0x5202, 0x7902, 0x8B03, 0x3A04]
    ) &&
    counterattack_restriction(
      [0x0800, 0x0900, 0x0A00, 0x1200, 0x1F00, 0x2100, 0x2900, 0x3200, 0x3A00, 0x4400, 0x5501, 0x6700]
    ) &&
    snapdragon_counterattack_restriction(0, "Wind") &&
    snapdragon_counterattack_restriction(1, "Wind") &&
    snapdragon_counterattack_restriction(2, "Wind")
  )
)

achievement(
  title = "Banging Two Rocks Together", id = 437048,
  description = "Defeat the guardians of Vaasa Temple using only weapons, spells, skills, and items of the earth element. Resuming from a mid-battle save is prohibited",
  type = "missable", points = 10,
  trigger = (
    once(
      mid_battle_load_protection() &&
      challenge_conditions("Vaasa Temple", "Vaasa Temple")
    ) &&
    trigger_when(
      c4_vaasa_temple()
    ) &&
    never(
      challenge_reset("Vaasa Temple", "Vaasa Temple")
    ) &&
    attack_restriction(
      [0x0800, 0x0900, 0x0A00, 0x1400, 0x2200, 0x2B00, 0x2C00, 0x3C00, 0x4700, 0x5701, 0x6900]
    ) &&
    snapdragon_restriction(0, "Earth") &&
    snapdragon_restriction(1, "Earth") &&
    snapdragon_restriction(2, "Earth") &&
    spell_restriction(
      [0x1103, 0x1203, 0x1303, 0x1403, 0x1503, 0x1603, 0x1703, 0x1803, 0x3302, 0x3D02, 0x3E02, 0x3F02, 0x4E04, 0xC504, 0x5402, 0x7B02, 0x8D03, 0x3C04]
    ) &&
    counterattack_restriction(
      [0x0800, 0x0900, 0x0A00, 0x1400, 0x2200, 0x2B00, 0x2C00, 0x3C00, 0x4700, 0x5701, 0x6900]
    ) &&
    snapdragon_counterattack_restriction(0, "Earth") &&
    snapdragon_counterattack_restriction(1, "Earth") &&
    snapdragon_counterattack_restriction(2, "Earth")
  )
)

achievement(
  title = "A Drop of Water in the Ocean", id = 437047,
  description = "Defeat the guardians of Greuza Temple using only weapons, spells, skills, and items of the water element. Resuming from a mid-battle save is prohibited",
  type = "missable", points = 10,
  trigger = (
    once(
      mid_battle_load_protection() &&
      challenge_conditions("Greuza Temple", "Greuza Temple")
    ) &&
    trigger_when(
      c4_greuza_temple()
    ) &&
    never(
      challenge_reset("Greuza Temple", "Greuza Temple")
    ) &&
    attack_restriction(
      [0x0800, 0x0900, 0x0A00, 0x1500, 0x1600, 0x2300, 0x2D00, 0x3D00, 0x4800, 0x5801, 0x6A00]
    ) &&
    snapdragon_restriction(0, "Water") &&
    snapdragon_restriction(1, "Water") &&
    snapdragon_restriction(2, "Water") &&
    spell_restriction(
      [0x1903, 0x1A03, 0x1B03, 0x1C03, 0x1D03, 0x1E03, 0x1F03, 0x2003, 0x3402, 0x4002, 0x4102, 0x4802, 0x4F04, 0xC604, 0x5502, 0x7C02, 0x8E03, 0x3D04]
    ) &&
    counterattack_restriction(
      [0x0800, 0x0900, 0x0A00, 0x1500, 0x1600, 0x2300, 0x2D00, 0x3D00, 0x4800, 0x5801, 0x6A00]
    ) &&
    snapdragon_counterattack_restriction(0, "Water") &&
    snapdragon_counterattack_restriction(1, "Water") &&
    snapdragon_counterattack_restriction(2, "Water")
  )
)

achievement(
  title = "Contrarian Streak", id = 448882,
  description = "Defeat Pherenian the Godless at Boulder Sands without taking any action other than using magic. Resuming from a mid-battle save is prohibited",
  type = "missable", points = 10,
  trigger = (
    once(
      mid_battle_load_protection() &&
      challenge_conditions("Boulder Sands", "Pherenian")
    ) &&
    trigger_when(
      // c4_boulder_sands_battle()
      event_script_trigger(0x0282)
    ) &&
    never(
      challenge_reset("Boulder Sands", "Pherenian")
    ) &&
    never(
      unit_is_active() &&
      active_unit_has_affiliation("Friendly") &&
      is_active_character_state("AttackTarget") &&
      battle_menu_closed()
    ) &&
    never(
      unit_is_active() &&
      active_unit_has_affiliation("Friendly") &&
      is_active_character_state("Spellcast") &&
      battle_menu_closed() &&
      combat_action_type() != 0x03
    ) &&
    never(
      unit_is_active() &&
      active_unit_has_affiliation("Friendly") &&
      is_active_character_state("UsingItem") &&
      battle_menu_closed()
    ) &&
    never(
      unit_is_active() &&
      active_unit_has_affiliation("Enemy") &&
      // active_unit_was_acting() &&
      // active_unit_not_acting() &&
      // acting_unit_has_affiliation("Friendly") &&
      counterattack_active() &&
      active_unit_has_taken_damage() == 1
    )
  )
)

achievement(
  title = "Denying Divine Assistance", id = 437044,
  description = "Defeat Brantyn Morne at the Royal City of Heim before he is able to summon more than one Divine Knight. Resuming from a mid-battle save is prohibited",
  type = "missable", points = 10,
  trigger = (
    once(
      mid_battle_load_protection() &&
      challenge_conditions("Heim Great Hall", "Brantyn")
    ) &&
    trigger_when(
      // c4_brantyn_battle()
      event_script_trigger(0x029F)
    ) &&
    never(
      challenge_reset("Heim Great Hall", "Brantyn")
    ) &&
    never(
      repeated(
        2,
        battle_active() &&
        is_combat_action("Darkness") &&
        byte(0x0D9026) > prev(byte(0x0D9026))
      )
    )
  )
)

achievement(
  title = "Manifold Gardens", id = 438326,
  description = "Open all three doors at Foot of the Gardens during the battle, including the hidden door",
  type = "missable", points = 3,
  trigger = once(
    challenge_conditions("Foot of the Gardens", "Foot of the Gardens")
  ) &&
  trigger_when(
    // Use `once` to force an `AndNext` for style reasons, remove hit before publishing
    once(
      __ornext(door1_opened() || door2_opened() || hidden_door_opened()) &&
      door1_open() &&
      door2_open() &&
      hidden_door_open()
    )
  ) &&
  never(
    challenge_reset("Foot of the Gardens", "Foot of the Gardens")
  ) &&
  never(
    is_music("Glory")
  )
)

achievement(
  title = "Don't Make Me Repeat Myself",id = 448928,
  description = "Defeat the Dark Knight Andoras at Twixt Heaven and Earth while never taking the same type of action (direct attack, projectile, special, magic, item, or persuade) two or more times in a row. Resuming from a mid-battle save is prohibited",
  type = "missable", points = 10,
  trigger = once(
    mid_battle_load_protection() &&
    challenge_conditions("Twixt Heaven and Earth", "Andoras")
  ) &&
  trigger_when(
    // c4_andoras_battle()
    event_script_trigger(0x02D5)
  ) &&
  never(
    challenge_reset("Twixt Heaven and Earth", "Andoras")
  ) &&
  never(
    repeated(
      2,
      never(
        unit_is_active() &&
        active_unit_has_affiliation("Friendly") &&
        is_active_character_state("AttackTarget") &&
        battle_menu_closed() &&
        combat_action_type() != 0x00
      ) &&
      never(
        unit_is_active() &&
        active_unit_has_affiliation("Friendly") &&
        is_active_character_state("Spellcast") &&
        battle_menu_closed()
      ) &&
      never(
        unit_is_active() &&
        active_unit_has_affiliation("Friendly") &&
        is_active_character_state("UsingItem") &&
        battle_menu_closed()
      ) &&
      unit_is_active() &&
      active_unit_has_affiliation("Friendly") &&
      is_active_character_state("AttackTarget") &&
      battle_menu_closed() &&
      combat_action_type() == 0x00
    )
  ) &&
  never(
    repeated(
      2,
      never(
        unit_is_active() &&
        active_unit_has_affiliation("Friendly") &&
        is_active_character_state("AttackTarget") &&
        battle_menu_closed() &&
        combat_action_type() != 0x01
      ) &&
      never(
        unit_is_active() &&
        active_unit_has_affiliation("Friendly") &&
        is_active_character_state("Spellcast") &&
        battle_menu_closed()
      ) &&
      never(
        unit_is_active() &&
        active_unit_has_affiliation("Friendly") &&
        is_active_character_state("UsingItem") &&
        battle_menu_closed()
      ) &&
      unit_is_active() &&
      active_unit_has_affiliation("Friendly") &&
      is_active_character_state("AttackTarget") &&
      battle_menu_closed() &&
      combat_action_type() == 0x01
    )
  ) &&
  never(
    repeated(
      2,
      never(
        unit_is_active() &&
        active_unit_has_affiliation("Friendly") &&
        is_active_character_state("AttackTarget") &&
        battle_menu_closed()
      ) &&
      never(
        unit_is_active() &&
        active_unit_has_affiliation("Friendly") &&
        is_active_character_state("Spellcast") &&
        battle_menu_closed() &&
        combat_action_type() != 0x02
      ) &&
      never(
        unit_is_active() &&
        active_unit_has_affiliation("Friendly") &&
        is_active_character_state("UsingItem") &&
        battle_menu_closed()
      ) &&
      unit_is_active() &&
      active_unit_has_affiliation("Friendly") &&
      is_active_character_state("Spellcast") &&
      battle_menu_closed() &&
      combat_action_type() == 0x02
    )
  ) &&
  never(
    repeated(
      2,
      never(
        unit_is_active() &&
        active_unit_has_affiliation("Friendly") &&
        is_active_character_state("Spellcast") &&
        battle_menu_closed() &&
        combat_action_type() != 0x03
      ) &&
      never(
        unit_is_active() &&
        active_unit_has_affiliation("Friendly") &&
        is_active_character_state("AttackTarget") &&
        battle_menu_closed()
      ) &&
      never(
        unit_is_active() &&
        active_unit_has_affiliation("Friendly") &&
        is_active_character_state("UsingItem") &&
        battle_menu_closed()
      ) &&
      unit_is_active() &&
      active_unit_has_affiliation("Friendly") &&
      is_active_character_state("Spellcast") &&
      battle_menu_closed() &&
      combat_action_type() == 0x03
    )
  ) &&
  never(
    repeated(
      2,
      never(
        unit_is_active() &&
        active_unit_has_affiliation("Friendly") &&
        is_active_character_state("Spellcast") &&
        battle_menu_closed() &&
        combat_action_type() != 0x04
      ) &&
      never(
        unit_is_active() &&
        active_unit_has_affiliation("Friendly") &&
        is_active_character_state("AttackTarget") &&
        battle_menu_closed()
      ) &&
      never(
        unit_is_active() &&
        active_unit_has_affiliation("Friendly") &&
        is_active_character_state("UsingItem") &&
        battle_menu_closed()
      ) &&
      unit_is_active() &&
      active_unit_has_affiliation("Friendly") &&
      is_active_character_state("Spellcast") &&
      battle_menu_closed() &&
      combat_action_type() == 0x04
    )
  ) &&
  never(
    repeated(
      2,
      never(
        unit_is_active() &&
        active_unit_has_affiliation("Friendly") &&
        is_active_character_state("Spellcast") &&
        battle_menu_closed()
      ) &&
      never(
        unit_is_active() &&
        active_unit_has_affiliation("Friendly") &&
        is_active_character_state("AttackTarget") &&
        battle_menu_closed()
      ) &&
      unit_is_active() &&
      active_unit_has_affiliation("Friendly") &&
      is_active_character_state("UsingItem") &&
      battle_menu_closed() &&
      combat_action_type() == 0x05
    )
  )
)

achievement(
  title = "Even Odds", id = 434774,
  description = "Defeat Martym and Barbas at Chamber of the Seal with no more than two units deployed. Resuming from a mid-battle save is prohibited",
  type = "missable", points = 10,
  trigger = (
    (
      trigger_when(
        once(c4_tomb_martym_dead()) &&
        once(c4_tomb_barbas_dead())
      ) &&
      never(
        (
          !is_game_state("Field Program") &&
          !is_game_state("Shop, Edit, Etc")
        ) ||
        !is_map("Tomb - Martym & Barbas") ||
        (prev(is_music("Glory")) && !is_music("Glory")) ||
        is_music("Retreat!") ||
        is_music("A Colour of Chaos") ||
        (cd_audio_playing() && cd_audio_track() == 0x09) // Overture
      )
    ) &&
    (
      // Prime challenge indicator on unit deployment screen
      (
        is_game_state("Shop, Edit, Etc") &&
        is_encounter("RelicsOfThePast") &&
        prior(music_id()) == 0x06 && // Island Atlas
        is_music("Prepare to Take the Field") &&
        battle_halted() &&
        (
          (byte(0x033a28) & 0x80) +
          (byte(0x033a2a) & 0x80) +
          (byte(0x033a2b) & 0x80) +
          (byte(0x033a2c) & 0x80) +
          (byte(0x033a2d) & 0x80) +
          (byte(0x033a2e) & 0x80) +
          (byte(0x033a2f) & 0x80) +
          (byte(0x033a30) & 0x80) +
          (byte(0x033a31) & 0x80) +
          (byte(0x033a33) & 0x80)
        ) >= 0x400
      ) ||
      // Keep challenge indicator alive between ending deployment and event scene loading in
      once(
        never(
          !is_music("Prepare to Take the Field")
        ) &&
        prior(game_state()) == GameState["Shop, Edit, Etc"] &&
        is_game_state("Field Program") &&
        is_map("Tomb - Martym & Barbas") &&
        battle_halted() &&
        (
          (byte(0x033a28) & 0x80) +
          (byte(0x033a2a) & 0x80) +
          (byte(0x033a2b) & 0x80) +
          (byte(0x033a2c) & 0x80) +
          (byte(0x033a2d) & 0x80) +
          (byte(0x033a2e) & 0x80) +
          (byte(0x033a2f) & 0x80) +
          (byte(0x033a30) & 0x80) +
          (byte(0x033a31) & 0x80) +
          (byte(0x033a33) & 0x80)
        ) >= 0x400
      ) ||
      // Keep challenge indicator alive during opening cutscene
      (
        is_encounter("Martym & Barbas") &&
        prior(music_id()) == 0x02 && // Prepare to Take the Field
        is_music("Footsteps from Darkness") &&
        battle_halted() &&
        deploy_slot_has_affiliation(2, "Enemy")
      ) ||
      // Keep challenge indicator alive during opening cutscene
      (
        is_encounter("Martym & Barbas") &&
        prior(music_id()) == 0x2B && // Footsteps from Darkness
        is_music("Theme of Black Knight") &&
        battle_halted() &&
        deploy_slot_has_affiliation(2, "Enemy")
      ) ||
      // Finally reached the point where a challenge would usually prime
      once(
        mid_battle_load_protection() &&
        is_game_state("Field Program") &&
        is_map("Tomb - Martym & Barbas") &&
        is_story_encounter("Martym & Barbas") &&
        deploy_slot_has_affiliation(2, "Enemy") &&
        !is_music("Glory") &&
        battle_start()
      )
    )
  )
)

achievement(
  title = "Killer Queen", id = 424987,
  description = "Defeat Dorgalua by having Catiua deal the final blow. Resuming from a mid-battle save is prohibited",
  type = "missable", points = 10,
  trigger = (
    once(
      mid_battle_load_protection() &&
      challenge_conditions("Tomb - Dorgalua", "Dorgalua") &&
      any_of(
        array_map(range(1, 9), deploy_slot_character_id),
        id => id == CharacterID["Catiua"]
      )
    ) &&
    trigger_when(
      // Use `once` to force an `AndNext` for style reasons, remove hit before publishing
      once(
        active_unit_is_character("Catiua") &&
        event_script_trigger(0x02E1)
        // c4_dorgalua_battle()
      )
    ) &&
    never(
      challenge_reset("Tomb - Dorgalua", "Dorgalua")
    ) &&
    // TODO this condition is no longer needed and should be removed
    // never(
    //   !active_unit_is_character("Catiua") &&
    //   enemy_leader_defeated()
    // ) &&
    never(
      is_event_script(0x02E1) &&
      !active_unit_is_character("Catiua")
    )
  )
)


// ---------------------------------------------------------------------------------------------------
// Character recruitment achievements

// Main trio -------------------
achievement(
  title = "Person of Lordly Caliber", id = 426044,
  description = "Unlock Denam's Lord class",
  points = 3,
  trigger = (
    load_protection() &&
    chapter_stable("C4") &&
    prev(unit_roster_class_id(0)) != ClassID["Lord"] &&
         unit_roster_class_id(0)  == ClassID["Lord"]
  )
)

achievement(
  title = "Blood Be Damned", id = 426042,
  description = "Recruit Catiua Pavel",
  points = 3,
  trigger = character_recruited(
    chapter_stable("C4"),
    "Catiua"
  )
)

achievement(
  title = "If You Can't Beat Them", id = 426033,
  description = "Recruit Vyce Bozeck and join forces with the New Walister Alliance",
  points = 1,
  trigger = character_recruited(
    chapter_stable("C3L"),
    "Vyce"
  )
)

// Walister --------------------
achievement(
  title = "Fury of the Holy Father", id = 426026,
  description = "Recruit Donnalto Presance",
  points = 5,
  trigger = character_recruited(
    chapter_stable("C1"),
    "Presance"
  )
)

achievement(
  title = "Hey, Who're You Calling Aloser?", id = 426028,
  description = "Recruit Arycelle Dania",
  points = 5,
  trigger = character_recruited(
    chapter_stable("C2C"),
    "Arycelle"
  )
)

achievement(
  title = "A Soldier with the Heart of a Merchant", id = 426027,
  description = "Recruit Xapan Illudas",
  points = 5,
  trigger = character_recruited(
    __ornext(chapter_stable("C2L") || chapter_stable("C4")),
    "Xapan"
  )
)

achievement(
  title = "A Mercenary's Only Worth What You Pay Him", id = 431461,
  description = "Recruit Xapan at a special bargain rate during chapter 4",
  type = "missable", points = 3,
  trigger = character_recruited(
    chapter_stable("C4"),
    "Xapan"
  )
)

// Bakram ----------------------
achievement(
  title = "Chasing a Dream", id = 426029,
  description = "Recruit Cistina Phoraena",
  points = 5,
  trigger = character_recruited(
    chapter_stable("C2C"),
    "Cistina"
  )
)

achievement(
  title = "Leader of the Liberation Front", id = 426037,
  description = "Recruit Cerya Phoraena",
  points = 5,
  trigger = character_recruited(
    __ornext(chapter_stable("C3C") || chapter_stable("C4")),
    "Cerya"
  )
)

achievement(
  title = "Philaha's Faithful", id = 426039,
  description = "Recruit Olivya Phoraena",
  points = 1,
  trigger = character_recruited(
    chapter_stable("C4"),
    "Olivya"
  )
)

achievement(
  title = "Rain Must Fall", id = 426040,
  description = "Recruit Sherri Phoraena",
  points = 5,
  trigger = character_recruited(
    chapter_stable("C4"),
    "Sherri"
  )
)

achievement(
  title = "Fresh-Faced Knight", id = 426030,
  description = "Recruit Folcurt Reeda Lynde",
  points = 5,
  trigger = character_recruited(
    chapter_stable("C2C"),
    "Folcurt"
  )
)

achievement(
  title = "Wizened Wizard", id = 426031,
  description = "Recruit Bayin Rosen Orne",
  points = 5,
  trigger = character_recruited(
    chapter_stable("C2C"),
    "Bayin"
  )
)

// Galgastani ------------------
achievement(
  title = "Patricidal Priestess", id = 426045,
  description = "Recruit Oelias Obdilord",
  points = 5,
  trigger = character_recruited(
    chapter_stable("C3N"),
    "Oelias"
  )
)

achievement(
  title = "Soulless Brother", id = 426046,
  description = "Recruit Dievold Obdilord",
  points = 5,
  trigger = character_recruited(
    chapter_stable("C3N"),
    "Dievold"
  )
)

achievement(
  title = "A Blade Wet with the Blood of Innocents", id = 426032,
  description = "Recruit Jeunan Avertif",
  points = 5,
  trigger = character_recruited(
    chapter_stable("C3L"),
    "Jeunan"
  )
)

achievement(
  title = "Where There's Life, There's Hope for Vengeance", id = 426041,
  description = "Recruit Ocionne Rabine",
  points = 5,
  trigger = character_recruited(
    chapter_stable("C4"),
    "Ocionne"
  )
)

achievement(
  title = "Beastmaster Turned Bandit", id = 426043,
  description = "Recruit Ganpp Vochstein",
  points = 5,
  trigger = character_recruited(
    chapter_stable("C4"),
    "Ganpp"
  )
)

// Xenobian --------------------
achievement(
  title = "Spread Your Wings", id = 426025,
  description = "Recruit Canopus Wolph",
  points = 1,
  trigger = character_recruited(
    chapter_stable("C1"),
    "Canopus"
  )
)

achievement(
  title = "Xenobia's Finest", id = 426034,
  description = "Recruit Mirdyn Walhorn",
  points = 1,
  trigger = character_recruited(
    __ornext(chapter_stable("C3L") || chapter_stable("C3N") || chapter_stable("C3C")),
    "Mirdyn"
  )
)

achievement(
  title = "Xenobia's Coarsest", id = 426035,
  description = "Recruit Gildas Byrne",
  points = 1,
  trigger = character_recruited(
    __ornext(chapter_stable("C3L") || chapter_stable("C3C")),
    "Gildas"
  )
)

achievement(
  title = "The Star", id = 426038,
  description = "Recruit Deneb Rove",
  points = 3,
  trigger = character_recruited(
    chapter_stable("C4"),
    "Deneb"
  )
)

achievement(
  title = "The Superstar", id = 426047,
  description = "Recruit Deneb with her special Nova Strike spell",
  type = "missable", points = 10,
  trigger = (
    load_protection() &&
    chapter_stable("C4") &&
    nova_strike_deneb_recruited()
  )
)

achievement(
  title = "An Oddly Familiar Face", id = 426048,
  description = "Recruit \"Robert Rudlum\"",
  points = 5,
  trigger = character_recruited(
    chapter_stable("C4"),
    "Rudlum"
  )
)

// Other -----------------------
achievement(
  title = "The Blind Swordsman", id = 426036,
  description = "Recruit Hobyrim Vandam",
  points = 5,
  trigger = character_recruited(
    __ornext(chapter_stable("C3L") || chapter_stable("C3N") || chapter_stable("C3C")),
    "Hobyrim"
  )
)

achievement(
  title = "A Different Breed of Weapon", id = 426049,
  description = "Recruit \"Jonathon\" Lindl",
  points = 5,
  trigger = (
    load_protection() &&
    chapter_stable("C4") &&
    lindl_recruited()
  )
)

// Generic classes -------------
achievement(
  title = "Building a Broad Portfolio", id = 426262,
  description = "Over the course of your campaign, have a unit of every human generic class in your army as either a full recruit or a guest unit",
  points = 10,
  trigger = (
    (
      prev(bitcount(0x0D390E)) +
      prev(bitcount(0x0D3910)) +
      prev(bitcount(0x0D3911)) -
      prev(bit0(0x0D390E)) -
      prev(bit5(0x0D3910)) -
      prev(bit6(0x0D3910)) -
      prev(bit7(0x0D3910))
    ) == 19 &&
    measured(
      (
        bitcount(0x0D390E) +
        bitcount(0x0D3910) +
        bitcount(0x0D3911) -
        bit0(0x0D390E) -
        bit5(0x0D3910) -
        bit6(0x0D3910) -
        bit7(0x0D3910)
      ) == 20,
      when = (
        __ornext(
          !cd_audio_playing() ||
          (cd_audio_playing() && cd_audio_track() != 9) // Overture
        ) && 
        load_protection() &&
        !is_music("Chaotic Island") &&
        !is_music("Unit March") &&
        chapter() == prev(chapter())
      )  
    )
  )
)

achievement(
  title = "A Kind of Magic", id = 426284,
  description = "Promote one or more of the Phoraena sisters to the Shaman class",
  points = 3,
  trigger = (
    load_protection() &&
    chapter_stable("C4") &&
    __ornext(
      c4_cerya_promotion() ||
      c4_cistina_promotion() ||
      c4_sherri_promotion() ||
      c4_olivya_promotion()
    )
  )
)

achievement(
  title = "Made in Heaven", id = 431459,
  description = "Add a Divine Knight to your army",
  points = 10,
  trigger = (
    load_protection() &&
    chapter() == prev(chapter()) &&
    class_added_to_roster("DivineKnight")
  )
)

achievement(
  title = "Keep Yourself Unalive", id = 431460,
  description = "Add a Lich to your army",
  points = 10,
  trigger = (
    load_protection() &&
    chapter() == prev(chapter()) &&
    class_added_to_roster("Lich")
  )
)


// ---------------------------------------------------------------------------------------------------
// Collection achievements

achievement(
  title = "Misfire", id = 429379,
  description = "Acquire the Rimfire fusil during the battle with Barbas at Barnicia Castle",
  type = "missable", points = 5,
  trigger = (
    is_game_state("Field Program") &&
    map_id() == Maps["BarniciaCourtyard"] &&
    is_story_encounter("Barbas") &&
    item_added_to_inventory("Rimfire")
  )
)

achievement(
  title = "Talk it Out", id = 429317,
  description = "Use the Persuade skill to convince an enemy unit to join you",
  points = 5,
  trigger = (
    is_game_state("Field Program") &&
    battle_active() &&
    unit_is_active() &&
    active_unit_has_affiliation("Friendly") &&
    prev(string_id()) != 0x0060 &&
    string_id() == 0x0060
    // combat_action() == CombatActions["Persuade"] &&
    // unit_is_special_targeted() &&
    // special_target() == prev(special_target()) &&
    // special_target_affiliation_change()
  )
)

achievement(
  title = "Find Out!", id = 429377,
  description = "Dig up 25 items hidden on the battlefield",
  points = 5,
  trigger = (
    measured(
      (
            bit6(0x0D397B) +     bit7(0x0D397B) + bitcount(0x0D397A) + bitcount(0x0D397C) +
        bitcount(0x0D397D) + bitcount(0x0D397E) + bitcount(0x0D397F) + bitcount(0x0D3980) +
        bitcount(0x0D3981) + bitcount(0x0D3982) + bitcount(0x0D3983) + bitcount(0x0D3984) +
        bitcount(0x0D3985) + bitcount(0x0D3986) + bitcount(0x0D3987) + bitcount(0x0D3988) +
        bitcount(0x0D3989) + bitcount(0x0D398A) + bitcount(0x0D398B) + bitcount(0x0D398C) +
        bitcount(0x0D398D) + bitcount(0x0D398E) + bitcount(0x0D398F) + bitcount(0x0D3991) +
            bit0(0x0D3990) +     bit1(0x0D3990)
      ) >= 25,
      when=(
      __ornext(
          !cd_audio_playing() ||
          (cd_audio_playing() && cd_audio_track() != 9) // Overture
        ) && 
        load_protection() &&
        !is_music("Chaotic Island") &&
        !is_music("Unit March") &&
        chapter() == prev(chapter())
      )
            
    ) &&
    (
          bit6(0x0D397B) +     bit7(0x0D397B) + bitcount(0x0D397A) + bitcount(0x0D397C) +
      bitcount(0x0D397D) + bitcount(0x0D397E) + bitcount(0x0D397F) + bitcount(0x0D3980) +
      bitcount(0x0D3981) + bitcount(0x0D3982) + bitcount(0x0D3983) + bitcount(0x0D3984) +
      bitcount(0x0D3985) + bitcount(0x0D3986) + bitcount(0x0D3987) + bitcount(0x0D3988) +
      bitcount(0x0D3989) + bitcount(0x0D398A) + bitcount(0x0D398B) + bitcount(0x0D398C) +
      bitcount(0x0D398D) + bitcount(0x0D398E) + bitcount(0x0D398F) + bitcount(0x0D3991) +
          bit0(0x0D3990) +     bit1(0x0D3990) -
          
          prev(bit6(0x0D397B)) -     prev(bit7(0x0D397B)) - prev(bitcount(0x0D397A)) -
      prev(bitcount(0x0D397C)) - prev(bitcount(0x0D397D)) - prev(bitcount(0x0D397E)) -
      prev(bitcount(0x0D397F)) - prev(bitcount(0x0D3980)) - prev(bitcount(0x0D3981)) -
      prev(bitcount(0x0D3982)) - prev(bitcount(0x0D3983)) - prev(bitcount(0x0D3984)) -
      prev(bitcount(0x0D3985)) - prev(bitcount(0x0D3986)) - prev(bitcount(0x0D3987)) -
      prev(bitcount(0x0D3988)) - prev(bitcount(0x0D3989)) - prev(bitcount(0x0D398A)) -
      prev(bitcount(0x0D398B)) - prev(bitcount(0x0D398C)) - prev(bitcount(0x0D398D)) -
      prev(bitcount(0x0D398E)) - prev(bitcount(0x0D398F)) - prev(bitcount(0x0D3991)) -
          prev(bit0(0x0D3990)) - prev(bit1(0x0D3990))
    ) == 1
  )
)

achievement(
  title = "When You Were Leveling Your Party, I Studied the Blade", id = 455359,
  description = "Receive the opportunity to learn all ten secret weapon techniques taught by the ghost of King Rodrick",
  points = 10,
  trigger = (
    (
      prev(bitcount(0x0D393F)) -
      prev(bit0(0x0D393F)) -
      prev(bit1(0x0D393F)) +
      prev(bit0(0x0D393E)) +
      prev(bit1(0x0D393E)) +
      prev(bit2(0x0D393E)) +
      prev(bit3(0x0D393E))
    ) == 9 &&
    measured(
      (
        bitcount(0x0D393F) -
        bit0(0x0D393F) -
        bit1(0x0D393F) +
        bit0(0x0D393E) +
        bit1(0x0D393E) +
        bit2(0x0D393E) +
        bit3(0x0D393E)
      ) == 10,
      when = (
        __ornext(
          !cd_audio_playing() ||
          (cd_audio_playing() && cd_audio_track() != 9) // Overture
        ) && 
        load_protection() &&
        !is_music("Chaotic Island") &&
        !is_music("Unit March") &&
        chapter() == prev(chapter()) &&
        is_chapter("C4")
      )    
    )
  )
)

achievement(
  title = "Staving off Death Another Day", id = 426233,
  description = "Acquire the Resurrect spell",
  points = 5,
  trigger = (
    load_protection() &&
    chapter() == prev(chapter()) &&
    __ornext(chapter() == ChapterID["C2L"] || chapter() == ChapterID["C2C"]) &&
    spell_added_to_inventory("Resurrect")
  )
)

achievement(
  title = "Restoration of the Flesh", id = 438416,
  description = "Use the Necromancy spell to raise a fallen unit as an undead horror",
  points = 5,
  trigger = (
    is_game_state("Field Program") &&
    battle_active() &&
    unit_is_active() &&
    !active_unit_has_affiliation("Enemy") &&
    was_active_character_state("Spellcast") &&
    !is_active_character_state("Spellcast") &&
    is_combat_action("Necromancy")
  )
)

achievement(
  title = "Transmigration of the Soul", id = 438417, 
  description = "Use the Reincarnate spell to restore an undead unit to life",
  points = 5,
  trigger = (
    is_game_state("Field Program") &&
    battle_active() &&
    unit_is_active() &&
    !active_unit_has_affiliation("Enemy") &&
    prior(active_character_state()) == ActiveCharacterState["Spellcast"] &&
    is_combat_action("Reincarnate") &&
    prev(string_id()) != 0x0492 &&
    string_id() == 0x0492
  )
)

achievement(
  title = "A Human Bodysnatcher", id = 429378,
  description = "Use the Ogre Blade to swap bodies with another unit on the battlefield",
  points = 5,
  trigger = once (
    unit_is_active() &&
    !active_unit_has_affiliation("Enemy") &&
    active_unit() == acting_unit() &&
    combat_action() == CombatActions["Bodygrab"]
  ) && (
    prev(active_character_state()) == 0x08 &&
    active_character_state() == 0x0F
  ) && never (
    !is_game_state("Field Program") ||
    battle_inactive()
  ) && never (
    active_character_state() != 0x08 &&
    active_character_state() != 0x0F
  )
)

achievement(
  title = "A Sacrificial Blade", id = 429318,
  description = "Use the Snapdragon spell to forge a cursed blade",
  points = 5,
  trigger = (
    is_game_state("Field Program") &&
    battle_active() &&
    unit_is_active() &&
    !active_unit_has_affiliation("Enemy") &&
    was_active_character_state("Spellcast") &&
    !is_active_character_state("Spellcast") &&
    combat_action() == CombatActions["Snapdragon"]
  )
)

achievement(
  title = "Relics of the Ogre Battle", id = 426234,
  description = "Collect all four pieces of the Ogre set (Ogre Blade, Ogre Shield, Ogre Armor, and Ogre Helm) and equip them on a single character",
  points = 10,
  trigger = (
    load_protection() &&
    chapter_stable("C4") &&
    any_of(range(0, 29), unit_has_ogre_set_equipped)
  )
)

achievement(
  title = "Shrouded in Darkness", id = 426235,
  description = "Collect all four pieces of the Dark Road set (Dagda Maul, Ghost Ring, Skull Mask, and Reaper Mail) and equip them on a single character",
  points = 10,
  trigger = (
    load_protection() &&
    chapter_stable("C4") &&
    any_of(range(0, 29), unit_has_dark_road_set_equipped)
  )
)

achievement(
  title = "Sweat-Stained Armour", id = 426236,
  description = "Collect all four foul-smelling pieces of gear (Worn Sword, Itchy Glove, Slimy Helm, and Sweat Armor) and equip them on a single character",
  points = 10,
  trigger = (
    load_protection() &&
    chapter_stable("C4") &&
    any_of(range(0, 29), unit_has_reeking_set_equipped)
  )
)

achievement(
  title = "Was It All Worth It?", id = 426237,
  description = "Defeat Blackmoor and acquire the Fire Crest",
  points = 25,
  trigger = (
    load_protection() &&
    chapter_stable("C4") &&
    item_added_to_inventory("FireCrest")
  )
)


// ---------------------------------------------------------------------------------------------------
// Rich presence

map_location = {
  0x00: "Temple of Ashmedai",
  0x01: "Bortegun Fens",
  0x02: "Belmorose Wilds",
  0x03: "Madura Drift",
  0x04: "Brigantys Castle",
  0x05: "Ndamsa Fortress",
  0x06: "Hagia Banhamuba",
  0x07: "Mount Hedon",
  0x08: "Port Asyton",
  0x09: "Bahanna Highland",
  0x0A: "Coritanae Keep",
  0x0B: "Xeod Moors",
  0x0C: "Balmamusa",
  0x0D: "Lambiss Hill",
  0x0E: "Phidoch Castle",
  0x0F: "Mount Weobry",
  0x10: "Psonji Weald",
  0x11: "Lake Bordu",
  0x12: "Tynemouth Hill",
  0x13: "Krysaro Town",
  0x14: "Qadriga Fortress",
  0x15: "Iorumza Canyon",
  0x16: "Arkhaiopolis of Rhime",
  0x17: "Golborza Plain",
  0x18: "Almorica Castle",
  0x19: "Port Golyat",
  0x1A: "Fortress Geyld",
  0x1B: "Barnicia Castle",
  0x1C: "Boulder Sands",
  0x1D: "Oeram Town",
  0x1E: "The Royal City of Heim",
  0x1F: "Boed Fortress",
  0x20: "Hanging Gardens",
  0x21: "Neimrahava",
  0x22: "Grimsby Town",
  0x23: "Gecho Fortress",
}

hanging_gardens = {
  0x0E00: "Foot of the Gardens",
  0x0E01: "Verdant Stair",
  0x0E02: "Vermillion Stair",
  0x0E03: "The Serpent's Spine",
  0x0E04: "His Fist Upraised",
  0x0E05: "Echoes of Her Passage",
  0x0E06: "Tears of Topaz",
  0x0E07: "Songs of Raven Hair",
  0x0E08: "Enraptured Dreams",
  0x0E09: "Hold High Your Cups",
  0x0E0A: "Halcyon Days",
  0x0E0B: "The Beast Has Fangs",
  0x0E0C: "Ebon Stair",
  0x0E0D: "Faith and Devotion",
  0x0E0E: "Sharp and Cold the Stars",
  0x0E0F: "Sounding of the Hours",
  0x0E10: "Ivory Stair",
  0x0E11: "Twixt Heaven and Earth",
  0x1500: "The Tomb Below",
  0x1501: "Relics of the Past",
  0x1502: "Chamber of the Seal",
  0x1503: "Chamber of the Seal",
}

// month_names = {
//   0x01: "God",
//   0x02: "Earth",
//   0x03: "Water",
//   0x04: "Shadow",
//   0x05: "White",
//   0x06: "Flame",
//   0x07: "Wind",
//   0x08: "Gold",
//   0x09: "Storm",
//   0x0A: "Dark",
//   0x0B: "Sea",
//   0x0C: "Black",
//   0x0D: "Twin",
//   0x0E: "Fire",
//   0x0F: "Light",
// }

days_singular = {
  0x01: "day"
}

hard_mode = {
  0x00: "",
  0x01: " • Hard mode",
}

function location() => word(0xd34d4)

function is_potd()     => location() == 0x00 && chapter() == ChapterID["C4"]
function is_mid_potd() => location() == 0x00 && chapter() == ChapterID["C4"] && byte(0x0D34E2) > 0x00 && byte(0x0D34E2) < 0x64
function is_gardens()  => location() == 0x20

function hard_mode() => byte(0x1FFC01)

function days_elapsed() => (calendar_month() / 3 + calendar_year() * 366 + calendar_month() * 24 + calendar_day() - 0x18)

chapter_name = {
  0x00: "Chapter 1",
  0x01: "Chapter 2 Chaos",
  0x02: "Chapter 2 Law",
  0x03: "Chapter 3 Neutral",
  0x04: "Chapter 3 Chaos",
  0x05: "Chapter 3 Law",
  0x06: "Chapter 4",
}

function is_tutorial_mode() {
  return (
    !cd_audio_playing() &&
    is_music("Harvest Dance") &&
    (
      map_id() == 0x0902 ||
      map_id() == 0x0A03
    )
  )
}

function is_title_screen() {
  return (
  (
    is_game_state("Boot Logos")  ||
    battle_condition_flags() & 0x3 == 0x3 ||
    (cd_audio_playing() && cd_audio_track() == 0x09) || // Overture
    is_music("Chaotic Island") ||
    is_music("Unit March")     ||
    is_music("Fortune Teller 2")
  )) || (
    is_music("Null") &&
    encounter_group() == 0x00
  )
}

function is_data_screen() {
  return (
    is_game_state("Data Management") &&
    cd_audio_playing() &&
    cd_audio_track() == 0x08
  )
}

function is_opening_credits() {
  return (
    chapter() == ChapterID["C1"] &&
    (
      is_music("Catastrophe") ||
      is_music("Rumbling")
    )
  )
}

function is_world_map() {
  return (
    (
      is_game_state("World Map") &&
      !is_music("War Situation")
    ) || (
      is_game_state("Field Program") &&
      is_music("Island Atlas") &&
      word(0x031C60) != 0x0500 &&
      word(0x031C60) != 0x0501 &&
      word(0x031C60) != 0x0502 &&
      word(0x031C60) != 0x0503
    ) || (
      is_game_state("Field Program") &&
      is_music("Island Atlas") &&
      word(0x031C60) == 0x0500 &&
      word(0x0F602E) == 0x0000
    ) || (
      is_game_state("Shop, Edit, Etc") &&
      is_music("Island Atlas") &&
      word(0x031C60) != 0x0500 &&
      word(0x031C60) != 0x0501 &&
      word(0x031C60) != 0x0502 &&
      word(0x031C60) != 0x0503
    )|| (
      is_game_state("Shop, Edit, Etc") &&
      is_music("Island Atlas") &&
      word(0x031C60) == 0x0500 &&
      word(0x0F602E) == 0x0000
    )
  )
}

function is_new_chapter_recap() {
  return (
    is_game_state("World Map") &&
    is_music("War Situation")
  )
}

function is_deploying_units() {
  return (
    (is_game_state("Shop, Edit, Etc") || is_game_state("Field Program")) &&
    is_music("Prepare to Take the Field") &&
    word(0x0F602E) == 0x0000
  )
}

function is_warren_report() {
  return (
    is_game_state("Shop, Edit, Etc") &&
    is_music("Warren Report")
  )
}

function is_shop() {
  return (
    is_game_state("Shop, Edit, Etc") &&
    is_music("Island Atlas") &&
    word(0x031C60) == 0x0500 &&
    word(0x0F602E) != 0x0000
  )
}

function is_edit_screen() {
  return (
    is_game_state("Shop, Edit, Etc") &&
    is_music("Island Atlas") &&
    word(0x031C60) >= 0x0501 &&
    word(0x031C60) <= 0x0503
  )
}

function is_editing_screen_final_battle() {
  return (
    (is_game_state("Shop, Edit, Etc") || is_game_state("Field Program")) &&
    is_music("Deathrattle") &&
    is_encounter("Martym & Barbas") &&
    word(0x0F602E) == 0x0000
  )
}

function is_examining_units() {
  return (
    is_game_state("Shop, Edit, Etc") &&
    byte(0x0DF631) == 0x01
  )
}

function is_first_cutscene() {
  return (
    is_game_state("Field Program") &&
    bit1(0xd3a0e) == 0x00 &&
    chapter() == ChapterID["C1"] &&
    encounter_group() == 0x00
  )
}

function is_two_lanselots_cutscene() {
  return (
    is_game_state("Field Program") &&
    bit1(0xd3a0e) == 0x00 &&
    chapter() == ChapterID["C4"] &&
    is_map("Heim Dungeon") &&
    is_music("War Situation") || is_music("Footsteps from Darkness")
  )
}

function is_epilogue() {
  return (
    is_music("Reminiscence") ||
    is_music("Awakening")    ||
    is_music("Coronation")   &&
    (c4_dorgalua_dead() && battle_halted())
  )
}

function is_battle() {
  return (
    is_game_state("Field Program") &&
    bit1(0xd3a0e) == 0x00
  )
}

function is_training_battle() {
  return (
    is_game_state("Field Program") &&
    bit0(0xd3a0e) == 0x00 &&
    bit1(0xd3a0e) == 0x01
  )
}

rich_presence_conditional_display(is_tutorial_mode(),   "Tutorial")
rich_presence_conditional_display(is_title_screen(),    "Title Screen")
rich_presence_conditional_display(is_data_screen(),     "Managing save data")
rich_presence_conditional_display(is_opening_credits(), "Opening credits • The Sacking of Golyat")

rich_presence_conditional_display(
  is_new_chapter_recap(),
  "{0} • Updates on the war situation • {1}{2}",
  rich_presence_lookup("Chapter", chapter(), chapter_name, "Chapter ??"),
  rich_presence_value("Time", in_game_time(), "FRAMES"),
  rich_presence_lookup("HardMode", hard_mode(), hard_mode, "")
)

rich_presence_conditional_display(
  is_world_map() && is_mid_potd(),
  "{0} • World map • Palace of the Dead - Floor {1} • {2} • Campaign length: {4} {5}{3}",
  rich_presence_lookup("Chapter",  chapter(),  chapter_name, "Chapter ??"),
  rich_presence_value("Floor", potd_floor()),
  rich_presence_value("Time", in_game_time(), "FRAMES"),
  rich_presence_lookup("HardMode", hard_mode(), hard_mode, ""),
  rich_presence_value("CampaignLength", days_elapsed()),
  rich_presence_lookup("Days", days_elapsed(), days_singular, "days")
)

rich_presence_conditional_display(
  is_world_map(),
  "{0} • World map • {1} • {2} • Campaign length: {4} {5}{3}",
  rich_presence_lookup("Chapter",  chapter(),  chapter_name, "Chapter ??"),
  rich_presence_lookup("Location", location(), map_location, "Unknown Location"),
  rich_presence_value("Time", in_game_time(), "FRAMES"),
  rich_presence_lookup("HardMode", hard_mode(), hard_mode, ""),
  rich_presence_value("CampaignLength", days_elapsed()),
  rich_presence_lookup("Days", days_elapsed(), days_singular, "days")
)

rich_presence_conditional_display(
  is_warren_report(),
  "{0} • Warren Report • {1} • {2} • Campaign length: {4} {5}{3}",
  rich_presence_lookup("Chapter",  chapter(),  chapter_name, "Chapter ??"),
  rich_presence_lookup("Location", location(), map_location, "Unknown Location"),
  rich_presence_value("Time", in_game_time(), "FRAMES"),
  rich_presence_lookup("HardMode", hard_mode(), hard_mode, ""),
  rich_presence_value("CampaignLength", days_elapsed()),
  rich_presence_lookup("Days", days_elapsed(), days_singular, "days")
)

rich_presence_conditional_display(
  is_deploying_units() && is_potd(),
  "{0} • Preparing to take the field • Palace of the Dead - Floor {1} • {2} • Campaign length: {4} {5}{3}",
  rich_presence_lookup("Chapter",  chapter(),  chapter_name, "Chapter ??"),
  rich_presence_value("Floor", potd_floor()),
  rich_presence_value("Time", in_game_time(), "FRAMES"),
  rich_presence_lookup("HardMode", hard_mode(), hard_mode, ""),
  rich_presence_value("CampaignLength", days_elapsed()),
  rich_presence_lookup("Days", days_elapsed(), days_singular, "days")
)

rich_presence_conditional_display(
  is_deploying_units() && is_gardens(),
  "{0} • Preparing to take the field • Hanging Gardens - {1} • {2} • Campaign length: {4} {5}{3}",
  rich_presence_lookup("Chapter", chapter(), chapter_name,    "Chapter ??"),
  rich_presence_lookup("Gardens", map_id(),   hanging_gardens, "Hanging Gardens"),
  rich_presence_value("Time", in_game_time(), "FRAMES"),
  rich_presence_lookup("HardMode", hard_mode(), hard_mode, ""),
  rich_presence_value("CampaignLength", days_elapsed()),
  rich_presence_lookup("Days", days_elapsed(), days_singular, "days")
)

rich_presence_conditional_display(
  is_deploying_units() ,
  "{0} • Preparing to take the field • {1} • {2} • Campaign length: {4} {5}{3}",
  rich_presence_lookup("Chapter", chapter(), chapter_name,    "Chapter ??"),
  rich_presence_lookup("Location", location(), map_location, "Unknown Location"),
  rich_presence_value("Time", in_game_time(), "FRAMES"),
  rich_presence_lookup("HardMode", hard_mode(), hard_mode, ""),
  rich_presence_value("CampaignLength", days_elapsed()),
  rich_presence_lookup("Days", days_elapsed(), days_singular, "days")
)

rich_presence_conditional_display(
  is_shop(),
  "{0} • Shopping • {1} • {2} • Campaign length: {4} {5}{3}",
  rich_presence_lookup("Chapter",  chapter(),  chapter_name, "Chapter ??"),
  rich_presence_lookup("Location", location(), map_location, "Unknown Location"),
  rich_presence_value("Time", in_game_time(), "FRAMES"),
  rich_presence_lookup("HardMode", hard_mode(), hard_mode, ""),
  rich_presence_value("CampaignLength", days_elapsed()),
  rich_presence_lookup("Days", days_elapsed(), days_singular, "days")
)

rich_presence_conditional_display(
  is_edit_screen() && is_mid_potd(),
  "{0} • Editing units • Palace of the Dead - Floor {1} • {2} • Campaign length: {4} {5}{3}",
  rich_presence_lookup("Chapter",  chapter(),  chapter_name, "Chapter ??"),
  rich_presence_value("Floor", potd_floor()),
  rich_presence_value("Time", in_game_time(), "FRAMES"),
  rich_presence_lookup("HardMode", hard_mode(), hard_mode, ""),
  rich_presence_value("CampaignLength", days_elapsed()),
  rich_presence_lookup("Days", days_elapsed(), days_singular, "days")
)

rich_presence_conditional_display(
  is_editing_screen_final_battle(),
  "{0} • Editing units • {1} • {2} • Campaign length: {4} {5}{3}",
  rich_presence_lookup("Chapter",  chapter(),  chapter_name, "Chapter ??"),
  rich_presence_lookup("Location", location(), map_location, "Unknown Location"),
  rich_presence_value("Time", in_game_time(), "FRAMES"),
  rich_presence_lookup("HardMode", hard_mode(), hard_mode, ""),
  rich_presence_value("CampaignLength", days_elapsed()),
  rich_presence_lookup("Days", days_elapsed(), days_singular, "days")
)

rich_presence_conditional_display(
  is_edit_screen(),
  "{0} • Editing units • {1} • {2} • Campaign length: {4} {5}{3}",
  rich_presence_lookup("Chapter",  chapter(),  chapter_name, "Chapter ??"),
  rich_presence_lookup("Location", location(), map_location, "Unknown Location"),
  rich_presence_value("Time", in_game_time(), "FRAMES"),
  rich_presence_lookup("HardMode", hard_mode(), hard_mode, ""),
  rich_presence_value("CampaignLength", days_elapsed()),
  rich_presence_lookup("Days", days_elapsed(), days_singular, "days")
)

rich_presence_conditional_display(
  is_examining_units(),
  "{0} • Examining units • {1} • {2} • Campaign length: {4} {5}{3}",
  rich_presence_lookup("Chapter",  chapter(),  chapter_name, "Chapter ??"),
  rich_presence_lookup("Location", location(), map_location, "Unknown Location"),
  rich_presence_value("Time", in_game_time(), "FRAMES"),
  rich_presence_lookup("HardMode", hard_mode(), hard_mode, ""),
  rich_presence_value("CampaignLength", days_elapsed()),
  rich_presence_lookup("Days", days_elapsed(), days_singular, "days")
)

rich_presence_conditional_display(
  is_first_cutscene(),
  "{0} • Fighting it out • Port Golyat • {1} • Campaign length: {3} {4}{2}",
  rich_presence_lookup("Chapter",  chapter(),  chapter_name, "Chapter ??"),
  rich_presence_value("Time", in_game_time(), "FRAMES"),
  rich_presence_lookup("HardMode", hard_mode(), hard_mode, ""),
  rich_presence_value("CampaignLength", days_elapsed()),
  rich_presence_lookup("Days", days_elapsed(), days_singular, "days")
)

rich_presence_conditional_display(
  is_epilogue(),
  "Credits and Epilogue • {0}",
  rich_presence_value("Time", in_game_time(), "FRAMES")
)

rich_presence_conditional_display(
  is_battle() && is_potd(),
  "{0} • Fighting it out • Palace of the Dead - Floor {1} • {2} • Campaign length: {4} {5}{3}",
  rich_presence_lookup("Chapter",  chapter(),  chapter_name, "Chapter ??"),
  rich_presence_value("Floor", potd_floor()),
  rich_presence_value("Time", in_game_time(), "FRAMES"),
  rich_presence_lookup("HardMode", hard_mode(), hard_mode, ""),
  rich_presence_value("CampaignLength", days_elapsed()),
  rich_presence_lookup("Days", days_elapsed(), days_singular, "days")
)

rich_presence_conditional_display(
  is_battle() && is_gardens(),
  "{0} • Fighting it out • Hanging Gardens - {1} • {2} • Campaign length: {4} {5}{3}",
  rich_presence_lookup("Chapter", chapter(), chapter_name,    "Chapter ??"),
  rich_presence_lookup("Gardens", map_id(),   hanging_gardens, "Hanging Gardens"),
  rich_presence_value("Time", in_game_time(), "FRAMES"),
  rich_presence_lookup("HardMode", hard_mode(), hard_mode, ""),
  rich_presence_value("CampaignLength", days_elapsed()),
  rich_presence_lookup("Days", days_elapsed(), days_singular, "days")
)

rich_presence_conditional_display(
  is_battle(),
  "{0} • Fighting it out • {1} • {2} • Campaign length: {4} {5}{3}",
  rich_presence_lookup("Chapter",  chapter(),  chapter_name, "Chapter ??"),
  rich_presence_lookup("Location", location(), map_location, "Unknown Location"),
  rich_presence_value("Time", in_game_time(), "FRAMES"),
  rich_presence_lookup("HardMode", hard_mode(), hard_mode, ""),
  rich_presence_value("CampaignLength", days_elapsed()),
  rich_presence_lookup("Days", days_elapsed(), days_singular, "days")
)

rich_presence_conditional_display(
  is_training_battle(),
  "{0} • Training battle • {1} • {2} • Campaign length: {4} {5}{3}",
  rich_presence_lookup("Chapter",  chapter(),  chapter_name, "Chapter ??"),
  rich_presence_lookup("Location", location(), map_location, "Unknown Location"),
  rich_presence_value("Time", in_game_time(), "FRAMES"),
  rich_presence_lookup("HardMode", hard_mode(), hard_mode, ""),
  rich_presence_value("CampaignLength", days_elapsed()),
  rich_presence_lookup("Days", days_elapsed(), days_singular, "days")
)

rich_presence_display("Peeling the Tactics Onion")


// ---------------------------------------------------------------------------------------------------
// Leaderboards

leaderboard(
  title = "Deep Dungeon Dash", id = 114271,
  description = "Clear floors 1-100 of the Palace of the Dead at Ashmedai as quickly as possible",
  start = (
    mid_battle_load_protection() &&
    is_game_state("Field Program") &&
    is_map_location(0x00) &&
    is_map("PotD Floor 1") &&
    is_potd_floor(1) &&
    battle_start()
  ),
  cancel = (
    is_music("Retreat!") ||
    is_music("A Colour of Chaos") ||
    !is_map_location(0x00) ||
    (
      !is_game_state("Field Program") &&
      !is_game_state("Shop, Edit, Etc") &&
      !is_game_state("World Map")
    ) ||
    (
      is_game_state("Field Program") &&
      is_map_location(0x00) &&
      is_map("PotD Floor 3") &&
      is_potd_floor(3) &&
      !hidden_door_open() &&
      !was_music("Glory") &&
      is_music("Glory")
    )
  ),
  submit = (
    is_game_state("Field Program") &&
    is_map_location(0x00) &&
    is_map("PotD Floor 100") &&
    is_potd_floor(100) &&
    !was_music("Glory") &&
    is_music("Glory")
  ),
  value = (
    battle_active()
  ),
  format = "FRAMES",
  lower_is_better = true
)

leaderboard(
  title = "Fastest Campaign - Chaos Route", id = 108757,
  description = "Finish the game on the chaos route with the fastest in-game time",
  start = (
    is_game_state("Field Program") &&
    is_map("Tomb - Dorgalua") &&
    is_chapter("C4") &&
    on_chaos_route() &&
    c4_dorgalua_battle()
  ),
  cancel = (
    __ornext(
      is_game_state("Boot Logos") ||
      is_game_state("Data Management")
    )
  ),
  submit = (
    always_true()
  ),
  value = (
    in_game_time()
  ),
  format = "FRAMES",
  lower_is_better = true
)

leaderboard(
  title = "Fastest Campaign - Law Route", id = 108759,
  description = "Finish the game on the law route with the fastest in-game time",
  start = (
    is_game_state("Field Program") &&
    is_map("Tomb - Dorgalua") &&
    is_chapter("C4") &&
    on_law_route() &&
    c4_dorgalua_battle()
  ),
  cancel = (
    __ornext(
      is_game_state("Boot Logos") ||
      is_game_state("Data Management")
    )
  ),
  submit = (
    always_true()
  ),
  value = (
    in_game_time()
  ),
  format = "FRAMES",
  lower_is_better = true
)

leaderboard(
  title = "Fastest Campaign - Neutral Route", id = 108758,
  description = "Finish the game on the neutral route with the fastest in-game time",
  start = (
    is_game_state("Field Program") &&
    is_map("Tomb - Dorgalua") &&
    is_chapter("C4") &&
    on_neutral_route() &&
    c4_dorgalua_battle()
  ),
  cancel = (
    __ornext(
      is_game_state("Boot Logos") ||
      is_game_state("Data Management")
    )
  ),
  submit = (
    always_true()
  ),
  value = (
    in_game_time()
  ),
  format = "FRAMES",
  lower_is_better = true
)

leaderboard(
  title = "Shortest Campaign - Chaos Route", id = 114272, 
  description = "Finish the game on the law route with the fewest days elapsed on the in-game calendar",
  start = (
    is_game_state("Field Program") &&
    is_map("Tomb - Dorgalua") &&
    is_chapter("C4") &&
    on_chaos_route() &&
    c4_dorgalua_battle()
  ),
  cancel = (
    __ornext(
      is_game_state("Boot Logos") ||
      is_game_state("Data Management")
    )
  ),
  submit = (
    always_true()
  ),
  value = measured(
    (calendar_month() / 3 + calendar_year() * 366 + calendar_month() * 24 + calendar_day() - 0x18)
  ),
  format = "VALUE",
  lower_is_better = true
)

leaderboard(
  title = "Shortest Campaign - Law Route", id = 114273, 
  description = "Finish the game on the law route with the fewest days elapsed on the in-game calendar",
  start = (
    is_game_state("Field Program") &&
    is_map("Tomb - Dorgalua") &&
    is_chapter("C4") &&
    on_law_route() &&
    c4_dorgalua_battle()
  ),
  cancel = (
    __ornext(
      is_game_state("Boot Logos") ||
      is_game_state("Data Management")
    )
  ),
  submit = (
    always_true()
  ),
  value = measured(
    (calendar_month() / 3 + calendar_year() * 366 + calendar_month() * 24 + calendar_day() - 0x18)
  ),
  format = "VALUE",
  lower_is_better = true
)

leaderboard(
  title = "Shortest Campaign - Neutral Route", id = 114274,
  description = "Finish the game on the neutral route with the fewest days elapsed on the in-game calendar",
  start = (
    is_game_state("Field Program") &&
    is_map("Tomb - Dorgalua") &&
    is_chapter("C4") &&
    on_neutral_route() &&
    c4_dorgalua_battle()
  ),
  cancel = (
    __ornext(
      is_game_state("Boot Logos") ||
      is_game_state("Data Management")
    )
  ),
  submit = (
    always_true()
  ),
  value = measured(
    (calendar_month() / 3 + calendar_year() * 366 + calendar_month() * 24 + calendar_day() - 0x18)
  ),
  format = "VALUE",
  lower_is_better = true
)
