import { SATURN_ADDRESS_SPACE, swizzle8BitAccessor } from '../../common/saturn.js';
import { byte, word, dword, bit4 }  from '../../common/value.js';

// ---------------------------------------------------------------------------------------------------

export const ADDR = {
  // 0x130000: [32-bit] Start of region main program binaries load into
  //   0x8C638C63 = Saturn boot screen
  //   0x00000000 = "PRODUCED BY or UNDER LICENSE FROM SEGA ENTERPRISES,LTD." / Difficulty selection
  //   0x2FD62FE6 = TITLE.BIN (title screen)
  //   0xD207DF08 = OGRE_E.BIN / OGRE_P.bin (main gameplay)
  program_binary: dword(0x130000),

  // 0xaa991: [8-bit] Partial game state
  //   0x02 = World map
  //   0x06 = Fighting it out / Stage map
  //   0x60 = Character creation/Data load
  //   0x62 = Stage map (before any combat)
  game_state: byte(0xaa991),

  // 0x1ddc39: [8-bit] Status byte used for various things in the engine
  //   Can be used for RP to distinguish states for New Game/Continue/Now Loading following from title screen
  // 
  //   0x00 = Data load
  //   0x80 = Now loading
  //   0xFF = Character creation
  misc_state: byte(0x1ddc39),

  // 0x1ddb15: [8-bit bitfield] Stage map - status byte
  //   Determines whether map receives update ticks to advance unit movement/passage of time
  //
  //   0x00 = Update ticks active
  //   0x01 = Selecting movement target
  //   0x80 = Dialogue box or menu open, or fighting a battle
  //   0xC0 = Title card/BOSS!/READY display at start of battle
  stage_map_status: byte(0x1ddb15),

  // 0xb090: [16-bit] Partial game state
  //   0x00 = Not in stage map
  //   0x01 = In stage map
  //
  //   Checking that this value is 0x01 works as load protection when paired with checking main game
  //   binary is loaded at 0x130000.
  stage_map_active: word(0xb090),

  // 0x20bf6: [16-bit] Partial game state
  //   0x00 = Not fighting it out
  //   0x01 = Fighting it out
  combat_active: word(0x20bf6),

  // 0x1f5624: [16-bit] World map - related to menu selection state
  //   0xc671 = Data
  map_menu_state: word(0x1f5624),

  // 0x1f7cd0: [16-bit] Menu state
  //    0x0013 = Use Item
  menu_state: word(0x1f7cd0),

  // 0x1c8efc: [4 bytes, 8-bit values]
  // Flags to indicate whether termites have been used to destroy city walls on a map
  termite_flags: (n: number) => byte( swizzle8BitAccessor(0x1c8efc + n) ),

  // -----------------------------------------------------------

  // 0x1e08dd: [8-bit] Stage ID
  stage_id: byte(0x1e08dd),

  // 0x1e08e9: [8-bit] Ending ID
  ending_id: byte(0x1e08e9),

  // 0x1f5600: [36 bytes, 8-bit values] Stage completion flags
  //   Index for a given stage is stage id +/- 1 due to swizzled ordering
  //   0x00 = Stage incomplete, 0x01 = Stage complete
  stage_complete: (n: number) => byte( swizzle8BitAccessor(0x1f5600 + n) ),

  // 0x1ddd79: [8-bit] Chaos frame (0-100)
  chaos_frame: byte(0x1ddd79),

  // 0x1e16a4 [16-bit] War funds (upper two bytes)
  // 0x1e16a6 [16-bit] War funds (lower two bytes)
  war_funds_upper: word(0x1e16a4),
  war_funds_lower: word(0x1e16a6),

  // 0x1e13d8 :[16-bit] Campaign length (days)
  campaign_length: word(0x1e13d8),

  // 0x1fa864: [16-bit] Stage clock - days elapsed
  // 0x1e5525: [8-bit]  Stage clock - hours
  // 0x1ddd75: [8-bit]  Stage clock - minutes
  stage_clock_days:    word(0x1fa864),
  stage_clock_hours:   byte(0x1e5525),
  stage_clock_minutes: byte(0x1ddd75),

  // -----------------------------------------------------------

  // 0x1c64a4: [8-bit] Inventory slot 1 - quantity
  // 0x1c64a5: [8-bit] Inventory slot 1 - item ID
  inventory_qty:  (n: number) => byte(0x1c64a4 + 2 * n),
  inventory_item: (n: number) => byte(0x1c64a5 + 2 * n),

  // 0x1cd46c: [14 bytes, 8-bit values] Tarot card inventory
  //   0xFF = (empty)
  tarot_inventory: (n: number) => byte(0x1cd46c + n),

  // -----------------------------------------------------------
  
  // 0x1e0bd0: [8-bit] Character roster - equpped items
  equipped_items: (n: number) => byte( swizzle8BitAccessor(0x1e0bd0 + n) ),

  // 0x1e5560: [8-bit] Character roster - class
  roster_class: (n: number) => byte( swizzle8BitAccessor(0x1e5560 + n) ),

  // 0x1e5768: [8-bit] Character roster - appearance / special unit ID
  roster_ids: (n: number) => byte( swizzle8BitAccessor(0x1e5768 + n) ),

  // 0x1e580c [200 bytes, 16-bit values] Unit roster - current HP
  roster_current_hp: (n: number) => word(0x1e580c + 2 * n),

  // 0x1ecd38 :[8-bit] Character roster - CHA
  roster_charisma: (n: number) => byte( swizzle8BitAccessor(0x1e5768 + n) ),

  // 0x1ecd9c: [8-bit] Character roster - ALI
  roster_alignment: (n: number) => byte( swizzle8BitAccessor(0x1ecd9c + n) ),

  // 0x1f96b4: [8-bit] Character roster - level
  roster_level: (n: number) => byte( swizzle8BitAccessor(0x1f96b4 + n) ),

  // 0x1f97c4: [100 bytes, 8-bit values] Character roster - Status flags
  //   Bit7 = Unit leader
  //   Bit6 = Large unit
  //   Bit4 = Werewolf
  //   Bit3 = Weretiger
  roster_werewolf: (n: number) => bit4( swizzle8BitAccessor(0x1f97c4 + n) ),

  // 0x1cd058: [125 bytes, 5-byte values] Unit roster - Unit membership data
  unit_membership_data: (n: number, i: number) => byte(0x1cd058 + 5 * n + i),

  // 0x1e91a0: [20-bytes, 8-bit values] Deployed units - Index of unit (in deployed units table)
  //   currently in battle with (0xFF when not battling)
  //
  // [10] = Index of unit that stage boss is in battle with
  in_combat_with: (n: number) => byte( swizzle8BitAccessor(0x1e91a0 + n) ),

  // ---------------------------

  // 0x1e5529: [8-bit] Stage boss status flag
  //   Determines whether to show the boss' actual sprite on the map or the mystery icon
  //   0x00 = Not encountered, 0x01 = Encountered
  stage_boss_encountered: byte(0x1e5529),

  // 0x1ccf1c: [20 bytes, 8-bit values] Unit template to deployed unit mapping
  //   10 bytes for friendly units (unused)
  //   10 bytes for enemy units - Indicates which unit is instantiated in each of the enemy unit
  //   deploy slots. Stale values remain when no enemy units left to be deployed. Notable unit
  //   template IDs include:
  //
  //   -- Xytegenia --
  //   0x01 = Gareth clones
  deployed_enemies_mapping: (n: number) => byte( swizzle8BitAccessor(0x1ccf1c + 10 + n) ),
  
  // 0x1e55c4: [60-bytes, 8-bit values] Deployed enemies - Class
  deployed_enemies_class: (n: number) => byte( swizzle8BitAccessor(0x1e55c4 + n) ),

  // 0x1e56d8: [10 bytes, 8-bit values] Enemy unit redeploy counts
  //   Indicates how many more times an enemy unit of a given formation can be spawned after any
  //   currently spawned instances are defeated. Notable values include:
  //
  //   -- Xytegenia --
  //   [0] = Gareth clones
  enemy_redeploy_counts: (n: number) => byte( swizzle8BitAccessor(0x1e56d8 + n) ),

  // 0x1e58d4 [120 bytes, 16-bit values] Deployed enemies - Current HP
  deployed_enemies_hp: (n: number) => word(0x1e58d4 + n * 2),

  // ---------------------------
  
  // 0x1dd6d6: [10 bytes, 8-bit values] Enemy deployed unit IDs
  swz_deployed_units: (n: number) => byte(0x1dd6cc + n),

  // 0x1cd058: [125 bytes, 5-byte values] Unit roster - Unit membership data
  swz_unit_membership_data: (n: number) => byte(0x1cd058 + n),

  // 0x1e0bd0: [8-bit] Character roster - equpped items
  swz_equipped_items: (n: number) => byte(0x1e0bd0 + n),

  // 0x1e5560: [100 bytes, 8-bit values] Character roster - Class data
  swz_roster_class: (n: number) => byte(0x1e5560 + n),

  // 0x1e5768: [8-bit] Character roster - appearance / special unit ID
  swz_roster_id: (n: number) => byte(0x1e5768 + n),

  // 0x1f96b4: [8-bit] Character roster - level
  swz_roster_level: (n: number) => byte(0x1f96b4 + n),

  // 0x1ecd9c: [8-bit] Character roster - ALI
  swz_roster_alignment: (n: number) => byte(0x1ecd9c + n),

  // -----------------------------------------------------------

  // 0x1ddb51: [8-bit] Number of Roshfel temples on current map
  local_temples_count: byte(0x1ddb51),

  // 0x1f95fd: [8-bit] Number of cities on current map
  //   Does not include player headquarters or enemy capital
  local_cities_count: byte(0x1f95fd),

  // 0x1f9754: [20 bytes, 8-bit values] Flags for hidden items/cities/temples on current map
  //   0x00 = Hidden, 0x01 = Found
  local_hidden_objects: (n: number) => byte( swizzle8BitAccessor(0x1f9754 + n) ),

  // 0x1e1210: [20 bytes, 8-bit values] Liberation state of cities on currently loaded map
  //   0x00 = Liberated, 0x01 = Unliberated
  //
  //   First entry is always enemy headquarters, second entry is always rebel headquarters.
  local_cities_liberated: (n: number) => byte( swizzle8BitAccessor(0x1e1210 + n) ),

  // 0x1f8744: [20 bytes, 8-bit values] Liberation state of Roshfel temples on currently loaded map
  //   0x00 = Liberated, 0x01 = Unliberated
  local_temples_liberated: (n: number) => byte( swizzle8BitAccessor(0x1f8744 + n) ),

  // 0x1dd7b8: [700 bytes, 8-bit values] State of all hidden items/cities/temples
  //   0x00 = Hidden, 0x01 = Found
  //
  //   20 bytes allocated per stage. On transition from world map to stage map, 20 bytes of flags from
  //   an offset derived according to stage ID are copied into 0x1f9754, on transition from stage map
  //   to world map those 20 bytes of flags are copied back from 0x1f9754 to the appropriate offset in
  //   this array.
  global_hidden_objects: (stage: number, n: number) => byte(
    swizzle8BitAccessor(0x1dd7b8 + stage * 20 + n)
  ),

  // 0x1e869c: [700 bytes, 8-bit values] Liberation state of all cities
  //   0x00 = Liberated, 0x01 = Unliberated
  // 
  //   20 bytes allocated per stage. On transition from world map to stage map, 20 bytes of flags from
  //   an offset derived according to stage ID are copied into 0x1e1210, on transition from stage map
  //   to world map those 20 bytes of flags are copied back from 0x1e1210 to the appropriate offset in
  //   this array.
  global_cities_liberated: (stage: number, n: number) => byte(
    swizzle8BitAccessor(0x1e869c + stage * 20 + n)
  ),

  // 0x1e0ddc: [700 bytes, 8-bit values] Liberation state of all Roshfel temples
  //   0x00 = Liberated, 0x01 = Unliberated
  // 
  //   20 bytes allocated per stage. On transition from world map to stage map, 20 bytes of flags from
  //   an offset derived according to stage ID are copied into 0x1f8744, on transition from stage map
  //   to world map those 20 bytes of flags are copied back from 0x1f8744 to the appropriate offset in
  //   this array.
  global_temples_liberated: (stage: number, n: number) => byte(
    swizzle8BitAccessor(0x1e0ddc + stage * 20 + n)
  ),
}

export const FLAGS = {
  // 0x1f8e58: [664 bytes, 8-bit values] Event flags
  //   0x00 = Unset, 0x01 = Set
  // 0x1f8ece: [8-bit] Event flag - Diaspora - Finished Golden Beehive fetch quest
  golden_beehive_quest: byte(0x1f8ece),

  // 0x1f8f52: [8-bit] Event flag - Shangrila Temple - Received item from Iuria
  shangrila_iuria_item: byte(0x1f8f52),

  // 0x1f8fdd: [8-bit] Event flag - Xytegenia - Gareth dialogue at NE temple
  xytegenia_gareth_conversation: byte(0x1f8fdd),

  // 0x1f900a: [8-bit] Event flag - Muspelm - Received Dream Crown
  // 0x1f900d: [8-bit] Event flag - Muspelm - Received Book of the Dead
  muspelm_crown: byte(0x1f900a),
  muspelm_book:  byte(0x1f900d),

  // 0x1f9021: [8-bit] Event flag - Sigurd - Recieved Dragon's Gem
  // 0x1f9022: [8-bit] Event flag - Sigurd - Got request from Toad for Dragon's Gem
  // 0x1f902d: [8-bit] Event flag - Sigurd - Traded Dragon's Gem for Undead Ring
  // 0x1f902f: [8-bit] Event flag - Sigurd - Sold Dragon's Gem to Toad
  sigurd_toad_request: byte(0x1f9022),
  sigurd_received_gem: byte(0x1f9021),
  sigurd_traded_gem:   byte(0x1f902d),
  sigurd_sold_gem:     byte(0x1f902f),

  // 0x1f90be: [8-bit] Event flag - Seujit District - Chose not to spare Gospel
  killed_gospel: byte(0x1f90be),

  // 0x1f90bf: [8-bit] Event flag - Thanos Sea - Received reward from Ruchenbein I
  ruchenbein_reward: byte(0x1f90bf),
}

export enum GameState {
  WorldMap    = 0x02,
  StageMap    = 0x06,
  NewGame     = 0x60,
  StageMapAlt = 0x62,
}

// ---------------------------------------------------------------------------------------------------

const stageIdentifiers = [
  { id: 0x00, name: "Warren's Castle",   },
  { id: 0x01, name: "Charlom Border",    },
  { id: 0x02, name: "Charlom District",  },
  { id: 0x03, name: "Pogrom Forest",     },
  { id: 0x04, name: "Lake Jansenia",     },
  { id: 0x05, name: "Deneb's Garden",    },
  { id: 0x06, name: "Slums of Xenobia",  },
  { id: 0x07, name: "Island of Avalon",  },
  { id: 0x08, name: "Kastolatian Sea",   },
  { id: 0x09, name: "Diaspora",          },
  { id: 0x0A, name: "Galvian Peninsula", },
  { id: 0x0B, name: "Valley of Kastro",  },
  { id: 0x0C, name: "Balmorian Ruins",   },
  { id: 0x0D, name: "City of Malano",    },
  { id: 0x0E, name: "Permafrost",        },
  { id: 0x0F, name: "Antalya",           },
  { id: 0x10, name: "Shangrila Temple",  },
  { id: 0x11, name: "Fort Alamut",       },
  { id: 0x12, name: "Dalmuhd Desert",    },
  { id: 0x13, name: "Ryhan Sea",         },
  { id: 0x14, name: "Fort Shramana",     },
  { id: 0x15, name: "Kulyn Temple",      },
  { id: 0x16, name: "City of Xandu",     },
  { id: 0x17, name: "Xytegenia",         },
  { id: 0x18, name: "Sharia Temple",     },
  { id: 0x19, name: "Muspelm",           },
  { id: 0x1A, name: "Organa",            },
  { id: 0x1B, name: "Sigurd",            },
  { id: 0x1C, name: "Antanjyl",          },
  { id: 0x1D, name: "Dragon's Haven",    },
  { id: 0x1E, name: "Thanos Sea",        },
  { id: 0x1F, name: "Seujit District",   },
  { id: 0x20, name: "Zargan District",   },
  { id: 0x21, name: "Eizensen District", },
  { id: 0x22, name: "Tsargem Island",    },
] as const;

export type StageID   = typeof stageIdentifiers[number]['id'];
export type StageName = typeof stageIdentifiers[number]['name'];

export function getStageID(stageName: StageName): StageID {
  return stageIdentifiers.find(({name}) => name === stageName)!.id;
}

const characterIdentifiers = [
  // Generic characters
  { id: 0x03, name: "Paladin"       },
  { id: 0x05, name: "Black Knight"  },
  { id: 0x07, name: "Daimyo"        },
  { id: 0x09, name: "Shinobi"       },
  { id: 0x0C, name: "Freya"         },
  { id: 0x10, name: "Dragon Master" },
  { id: 0x12, name: "Enchanter"     },
  { id: 0x16, name: "Lich"          },
  { id: 0x17, name: "Witch"         },
  { id: 0x18, name: "Cleric"        },
  { id: 0x1A, name: "Bishop"        },
  { id: 0x22, name: "Princess"      },
  { id: 0x35, name: "Flarebrass"    },
  { id: 0x37, name: "Death Bahamut" },
  { id: 0x39, name: "Zombie Dragon" },
  { id: 0x42, name: "Throne"        },
  // Special characters
  { id: 0x6A, name: "Lancelot" }, 
  { id: 0x6C, name: "Warren"   },   
  { id: 0x6D, name: "Canopus"  },  
  { id: 0x70, name: "Gilbald"  },  
  { id: 0x73, name: "Deneb"    },    
  { id: 0x6B, name: "Lyon"     },     
  { id: 0x66, name: "Ashe"     },     
  { id: 0x68, name: "Ayesha"   },   
  { id: 0x75, name: "Norn"     },     
  { id: 0x67, name: "Rauny"    },    
  { id: 0x69, name: "Saradin"  },  
  { id: 0x63, name: "Tristan"  },  
  { id: 0x6E, name: "Yushis"   },   
  { id: 0x64, name: "Debonair" }, 
  { id: 0x7B, name: "Slust"    },    
  { id: 0x7C, name: "Fenrir"   },   
  { id: 0x65, name: "Vogel"    },    
  { id: 0x7D, name: "Galf"     },     
  { id: 0x83, name: "Arwind"   },   
  { id: 0x84, name: "Cynos"    },
] as const;

export type CharacterID   = typeof characterIdentifiers[number]['id'];
export type CharacterName = typeof characterIdentifiers[number]['name'];

export function getCharacterID(characterName: CharacterName): CharacterID {
  return characterIdentifiers.find(({name}) => name === characterName)!.id;
}

const itemIdentifiers = [
  // Equippable
  { id: 0x02, name: "Durandal" },
  { id: 0x07, name: "Brunhild" },
  // Not equippable
  { id: 0x67, name: "Olden Orb"        },
  { id: 0x6E, name: "The Saga"         },
  { id: 0x77, name: "Moon Rose"        },
  { id: 0x86, name: "Key of Destiny"   },
  { id: 0x89, name: "Golden Beehive"   },
  { id: 0x8C, name: "Dragon's Jewel"   },
  { id: 0x8D, name: "Gem of Doun"      },
  { id: 0x8E, name: "Tablet of Yaru"   },
  { id: 0x8F, name: "Book of the Dead" },
  { id: 0x90, name: "Gem of Truth"     },
  { id: 0x99, name: "Undead Ring"      },
  { id: 0x9B, name: "Dream Crown"      },
  { id: 0xBA, name: "Grail"            },
  { id: 0xBB, name: "Mystic Armband"   },
  { id: 0xC9, name: "Porthos' Glaive"  },
  { id: 0xCA, name: "Demon Drake Horn" },
] as const;

export type ItemID   = typeof itemIdentifiers[number]['id'];
export type ItemName = typeof itemIdentifiers[number]['name']; 

export function getItemID(itemName: ItemName): ItemID {
  return itemIdentifiers.find(({name}) => name === itemName)!.id;
}

export type EndingID = 0x00 | 0x01 | 0x02 | 0x03 | 0x04 | 0x05 | 0x06 |
                       0x07 | 0x08 | 0x09 | 0x0A | 0x0B | 0x0C | 0x0D;
export type EndingStageID = 0x22 | 0x25 | 0x26;

// ---------------------------------------------------------------------------------------------------

type HiddenObject = 'item' | 'city' | 'temple' | 'gate' | '';

interface StageData {
  id:        StageID;
  article:   '' | 'the ';
  name:      StageName;
  timeLimit: number;
  cities:    number;
  temples:   number;
  hiddenObjectCount: number;
  hiddenObjectTypes: [
    HiddenObject, HiddenObject, HiddenObject, HiddenObject, HiddenObject,
    HiddenObject, HiddenObject, HiddenObject, HiddenObject, HiddenObject,
    HiddenObject, HiddenObject, HiddenObject, HiddenObject, HiddenObject,
    HiddenObject, HiddenObject, HiddenObject, HiddenObject, HiddenObject,
  ];
  hiddenObjectNames: [
    string, string, string, string, string,
    string, string, string, string, string,
    string, string, string, string, string,
    string, string, string, string, string,
  ]
}

export const stageData: StageData[] = [
  { id: 0x00, article: "",     name: "Warren's Castle",   timeLimit: 3, cities: 0x02, temples: 0x01, hiddenObjectCount: 0x03, hiddenObjectTypes: [  'item',   'city',       '',   'item',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       ''], hiddenObjectNames: ['Item', 'Fortress City Zeltenia', '', 'Item', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''] },
  { id: 0x01, article: "the ", name: "Charlom Border",    timeLimit: 3, cities: 0x05, temples: 0x02, hiddenObjectCount: 0x04, hiddenObjectTypes: [  'city', 'temple',   'city',   'item',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       ''], hiddenObjectNames: ['Magic City Ererli', 'Roshfel Temple', 'Autonomous City Falsara', 'Item', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''] },
  { id: 0x02, article: "the ", name: "Charlom District",  timeLimit: 3, cities: 0x06, temples: 0x03, hiddenObjectCount: 0x05, hiddenObjectTypes: [  'item',   'item',   'city', 'temple',       '',   'item',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       ''], hiddenObjectNames: ['Item', 'Item', 'Autonomous City Anatolya', 'Roshfel Temple', '', 'Item', '', '', '', '', '', '', '', '', '', '', '', '', '', ''] },
  { id: 0x03, article: "",     name: "Pogrom Forest",     timeLimit: 4, cities: 0x07, temples: 0x03, hiddenObjectCount: 0x04, hiddenObjectTypes: [  'city',   'city',   'item',   'item',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       ''], hiddenObjectNames: ['Trading City Minasgeras', 'Holy City Sergipp', 'Item', 'Item', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''] },
  { id: 0x04, article: "",     name: "Lake Jansenia",     timeLimit: 3, cities: 0x05, temples: 0x02, hiddenObjectCount: 0x02, hiddenObjectTypes: ['temple',   'item',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       ''], hiddenObjectNames: ['Roshfel Temple', 'Item', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''] },
  { id: 0x05, article: "",     name: "Deneb's Garden",    timeLimit: 3, cities: 0x05, temples: 0x01, hiddenObjectCount: 0x03, hiddenObjectTypes: [  'city',   'item',       '',   'item',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       ''], hiddenObjectNames: ['Fortress City Ankud', 'Item', '', 'Item', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''] },
  { id: 0x06, article: "the ", name: "Slums of Xenobia",  timeLimit: 4, cities: 0x08, temples: 0x03, hiddenObjectCount: 0x09, hiddenObjectTypes: [  'item',   'item',   'city',   'item',   'item',   'item', 'temple',   'city',       '',   'item',       '',       '',       '',       '',       '',       '',       '',       '',       '',       ''], hiddenObjectNames: ['Item', 'Item', 'Trading City Karlobach', 'Item', 'Item', 'Item', 'Roshfel Temple', 'Magic City Parmanova', '', 'Item', '', '', '', '', '', '', '', '', '', ''] },
  { id: 0x07, article: "the ", name: "Island of Avalon",  timeLimit: 4, cities: 0x08, temples: 0x03, hiddenObjectCount: 0x04, hiddenObjectTypes: ['temple',   'item',   'item',   'item',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       ''], hiddenObjectNames: ['Roshfel Temple', 'Item', 'Item', 'Item', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''] },
  { id: 0x08, article: "the ", name: "Kastolatian Sea",   timeLimit: 4, cities: 0x0B, temples: 0x03, hiddenObjectCount: 0x0A, hiddenObjectTypes: [  'city', 'temple',   'city',   'city',   'city',   'city',   'city',   'city', 'temple',   'city',       '',       '',       '',       '',       '',       '',       '',       '',       '',       ''], hiddenObjectNames: ['Trading City Fakarab', 'Roshfel Temple', 'Holy City Pitcaern', 'Religious City Salasgomez', 'Autonomous City Tongareva', 'Free City Papette', 'Industrial City Tokelaw', 'Fortress City Marden', 'Roshfel Temple', 'Trading City Hivaoah', '', '', '', '', '', '', '', '', '', ''] },
  { id: 0x09, article: "",     name: "Diaspora",          timeLimit: 4, cities: 0x09, temples: 0x04, hiddenObjectCount: 0x05, hiddenObjectTypes: [  'item',   'city',   'item',   'city',       '', 'temple',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       ''], hiddenObjectNames: ['Item', 'Magic City Angoule', 'Item', 'Fortress City Ajen', '', 'Roshfel Temple', '', '', '', '', '', '', '', '', '', '', '', '', '', ''] },
  { id: 0x0A, article: "the ", name: "Galvian Peninsula", timeLimit: 5, cities: 0x0A, temples: 0x01, hiddenObjectCount: 0x06, hiddenObjectTypes: [  'item',   'gate',   'city',   'item',   'item',   'item',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       ''], hiddenObjectNames: ['Item', 'Item', '', 'Chaos Gate', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''] },
  { id: 0x0B, article: "the ", name: "Valley of Kastro",  timeLimit: 4, cities: 0x07, temples: 0x04, hiddenObjectCount: 0x03, hiddenObjectTypes: [  'item',   'item',       '',   'gate',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       ''], hiddenObjectNames: ['Chaos Gate', 'Item', 'Item', 'Item', 'Item', 'Fortress City Callyao', '', '', '', '', '', '', '', '', '', '', '', '', '', ''] },
  { id: 0x0C, article: "the ", name: "Balmorian Ruins",   timeLimit: 5, cities: 0x0B, temples: 0x04, hiddenObjectCount: 0x06, hiddenObjectTypes: [  'gate',   'item',   'item',   'item',   'item',   'city',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       ''], hiddenObjectNames: ['Item', 'Chaos Gate', 'Magic City Zollmstein', 'Item', 'Item', 'Item', '', '', '', '', '', '', '', '', '', '', '', '', '', ''] },
  { id: 0x0D, article: "the ", name: "City of Malano",    timeLimit: 5, cities: 0x0E, temples: 0x05, hiddenObjectCount: 0x0C, hiddenObjectTypes: [  'item',   'item',   'item',   'item',   'city',   'city',   'item',   'item',   'item',   'item',   'item',   'item',       '',       '',       '',       '',       '',       '',       '',       ''], hiddenObjectNames: ['Item', 'Item', 'Item', 'Item', 'Roshfel Temple', 'Chaos Gate', '', '', '', '', '', '', '', '', '', '', '', '', '', ''] },
  { id: 0x0E, article: "the ", name: "Permafrost",        timeLimit: 5, cities: 0x0D, temples: 0x04, hiddenObjectCount: 0x08, hiddenObjectTypes: [  'item',   'item',   'item',   'item',   'item',   'item', 'temple',   'item',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       ''], hiddenObjectNames: ['Magic City Moyaleh', 'Item', 'Roshfel Temple', 'Autonomous City Albaminch', 'Chaos Gate', 'Religious City Dembidol', 'Roshfel Temple', 'Item', '', 'Item', '', '', '', '', '', '', '', '', '', ''] },
  { id: 0x0F, article: "",     name: "Antalya",           timeLimit: 4, cities: 0x08, temples: 0x01, hiddenObjectCount: 0x06, hiddenObjectTypes: [  'item',   'gate',   'item', 'temple',   'item',   'item',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       ''], hiddenObjectNames: ['Item', 'Item', 'Item', 'Item', 'Autonomous City Senbernard', 'Magic City Chamonix', 'Item', 'Item', 'Item', 'Item', 'Item', 'Item', '', '', '', '', '', '', '', ''] },
  { id: 0x10, article: "",     name: "Shangrila Temple",  timeLimit: 4, cities: 0x08, temples: 0x01, hiddenObjectCount: 0x07, hiddenObjectTypes: [  'item',   'item',   'item',   'item',   'item', 'temple',       '',   'item',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       ''], hiddenObjectNames: ['Item', 'Item', 'Item', 'Item', 'Item', 'Item', 'Roshfel Temple', 'Item', '', '', '', '', '', '', '', '', '', '', '', ''] },
  { id: 0x11, article: "",     name: "Fort Alamut",       timeLimit: 5, cities: 0x0F, temples: 0x05, hiddenObjectCount: 0x0A, hiddenObjectTypes: [  'item',   'item',   'item',   'city',   'item',   'city',   'item', 'temple',   'gate', 'temple',       '',       '',       '',       '',       '',       '',       '',       '',       '',       ''], hiddenObjectNames: ['Item', 'Chaos Gate', 'Item', 'Roshfel Temple', 'Item', 'Item', '', '', '', '', '', '', '', '', '', '', '', '', '', ''] },
  { id: 0x12, article: "the ", name: "Dalmuhd Desert",    timeLimit: 4, cities: 0x08, temples: 0x01, hiddenObjectCount: 0x06, hiddenObjectTypes: [  'item',   'city',   'item',   'item',   'item',   'city',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       ''], hiddenObjectNames: ['Trading City Moana', 'Religious City Kinshas', 'Religious City Yaundeh', 'Industrial City Gabon', 'Trading City Portarcour', 'Magic City Oshogbo', 'Roshfel Temple', 'Holy City Pontenoir', 'Roshfel Temple', 'Autonomous City Bossangoh', 'Roshfel Temple', 'Roshfel Temple', 'Item', 'Item', '', '', '', '', '', ''] },
  { id: 0x13, article: "the ", name: "Ryhan Sea",         timeLimit: 5, cities: 0x0C, temples: 0x05, hiddenObjectCount: 0x08, hiddenObjectTypes: ['temple',   'item',   'item',   'item',   'item',   'item', 'temple',   'item',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       ''], hiddenObjectNames: ['Item', 'Item', 'Item', 'Item', 'Item', 'Roshfel Temple', '', 'Item', '', '', '', '', '', '', '', '', '', '', '', ''] },
  { id: 0x14, article: "",     name: "Fort Shramana",     timeLimit: 4, cities: 0x09, temples: 0x03, hiddenObjectCount: 0x03, hiddenObjectTypes: ['temple',   'item',       '',   'item',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       ''], hiddenObjectNames: ['Item', 'Item', '', 'Item', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''] },
  { id: 0x15, article: "",     name: "Kulyn Temple",      timeLimit: 4, cities: 0x09, temples: 0x03, hiddenObjectCount: 0x0D, hiddenObjectTypes: ['temple',   'city', 'temple',   'item',   'city',   'item',   'city',   'city',   'item',   'city', 'temple',   'item',       '',   'city',       '',       '',       '',       '',       '',       ''], hiddenObjectNames: ['Item', 'Item', 'Item', 'Item', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''] },
  { id: 0x16, article: "the ", name: "City of Xandu",     timeLimit: 6, cities: 0x0F, temples: 0x03, hiddenObjectCount: 0x0E, hiddenObjectTypes: [  'item',   'item',   'item',   'item',   'city',   'item',   'city', 'temple',   'item',   'item',   'item',   'item',   'city',   'item',       '',       '',       '',       '',       '',       ''], hiddenObjectNames: ['Item', 'Item', '', 'Item', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''] },
  { id: 0x17, article: "",     name: "Xytegenia",         timeLimit: 6, cities: 0x10, temples: 0x03, hiddenObjectCount: 0x07, hiddenObjectTypes: [  'item', 'temple',   'city',   'city',   'city',   'item',       '',   'city',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       ''], hiddenObjectNames: ['Item', 'Item', 'Item', 'Holy City Plahermosa', 'Item', 'Magic City Huascarans', 'Item', 'Roshfel Temple', 'Chaos Gate', 'Roshfel Temple', '', '', '', '', '', '', '', '', '', ''] },
  { id: 0x18, article: "",     name: "Sharia Temple",     timeLimit: 7, cities: 0x0F, temples: 0x05, hiddenObjectCount: 0x07, hiddenObjectTypes: [  'item', 'temple',   'city',   'item',   'city',   'city',       '', 'temple',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       ''], hiddenObjectNames: ['Magic City Rwenzol', 'Holy City Morogol', 'Item', 'Roshfel Temple', 'Item', 'Item', '', '', '', '', '', '', '', '', '', '', '', '', '', ''] },
  { id: 0x19, article: "",     name: "Muspelm",           timeLimit: 3, cities: 0x06, temples: 0x03, hiddenObjectCount: 0x06, hiddenObjectTypes: [  'item',   'item',   'item',   'item', 'temple',   'gate',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       ''], hiddenObjectNames: ['Item', 'Magic City Alyabad', 'Item', 'Item', 'Item', 'Fortress City Saydabad', '', '', '', '', '', '', '', '', '', '', '', '', '', ''] },
  { id: 0x1A, article: "",     name: "Organa",            timeLimit: 3, cities: 0x09, temples: 0x03, hiddenObjectCount: 0x09, hiddenObjectTypes: [  'city',   'item', 'temple',   'city',   'gate',   'city', 'temple',   'item',       '',   'item',       '',       '',       '',       '',       '',       '',       '',       '',       '',       ''], hiddenObjectNames: ['Roshfel Temple', 'Item', '', 'Item', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''] },
  { id: 0x1B, article: "",     name: "Sigurd",            timeLimit: 4, cities: 0x09, temples: 0x03, hiddenObjectCount: 0x06, hiddenObjectTypes: [  'city',   'city',   'item', 'temple',   'item',   'item',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       ''], hiddenObjectNames: ['Roshfel Temple', 'Item', 'Item', 'Item', 'Item', 'Item', 'Roshfel Temple', 'Item', '', '', '', '', '', '', '', '', '', '', '', ''] },
  { id: 0x1C, article: "",     name: "Antanjyl",          timeLimit: 3, cities: 0x09, temples: 0x04, hiddenObjectCount: 0x0E, hiddenObjectTypes: [  'city',   'city',   'city',   'city',   'city',   'city', 'temple',   'city', 'temple',   'city', 'temple', 'temple',   'item',   'item',       '',       '',       '',       '',       '',       ''], hiddenObjectNames: ['Roshfel Temple', 'Autonomous City Marigarland', 'Roshfel Temple', 'Item', 'Holy City Martinic', 'Item', 'Free City Lasuncion', 'Holy City Grenadeen', 'Item', 'Magic City Trinidard', 'Roshfel Temple', 'Item', '', 'Religious City Roques', '', '', '', '', '', ''] },
  { id: 0x1D, article: "",     name: "Dragon's Haven",    timeLimit: 3, cities: 0x03, temples: 0x01, hiddenObjectCount: 0x03, hiddenObjectTypes: [  'item',   'item',       '',   'city',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       ''], hiddenObjectNames: ['Item', 'Item', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''] },
  { id: 0x1E, article: "the ", name: "Thanos Sea",        timeLimit: 4, cities: 0x08, temples: 0x02, hiddenObjectCount: 0x02, hiddenObjectTypes: [  'item',   'item',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       ''], hiddenObjectNames: ['Item', 'Item', 'Item', 'Item', 'Fortress City Cerroazure', 'Item', 'Holy City Karangol', 'Roshfel Temple', 'Item', 'Item', 'Item', 'Item', 'Religious City Pesana', 'Item', '', '', '', '', '', ''] },
  { id: 0x1F, article: "the ", name: "Seujit District",   timeLimit: 3, cities: 0x07, temples: 0x03, hiddenObjectCount: 0x04, hiddenObjectTypes: [  'item',   'item',   'item',   'item',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       ''], hiddenObjectNames: ['Item', 'Roshfel Temple', 'Magic City Mislatha', 'Trading City Qaddahia', 'Religious City Alkhoms', 'Item', '', 'Fortress City Azzawiyah', '', '', '', '', '', '', '', '', '', '', '', ''] },
  { id: 0x20, article: "the ", name: "Zargan District",   timeLimit: 5, cities: 0x07, temples: 0x02, hiddenObjectCount: 0x03, hiddenObjectTypes: [  'item',   'item',       '',   'item',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       ''], hiddenObjectNames: ['Item', 'Roshfel Temple', 'Magic City Azors', 'Item', 'Trading City Dungee', 'Religious City Hebrids', '', 'Roshfel Temple', '', '', '', '', '', '', '', '', '', '', '', ''] },
  { id: 0x21, article: "the ", name: "Eizensen District", timeLimit: 4, cities: 0x04, temples: 0x02, hiddenObjectCount: 0x03, hiddenObjectTypes: [  'item',   'item',       '',   'item',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       ''], hiddenObjectNames: ['Item', 'Item', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''] },
  { id: 0x22, article: "",     name: "Tsargem Island",    timeLimit: 3, cities: 0x02, temples: 0x01, hiddenObjectCount: 0x02, hiddenObjectTypes: [  'item',   'item',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       '',       ''], hiddenObjectNames: ['Item', 'Item', '', 'Holy City Madswan', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''] }
] as const;

export const hiddenItemsLookup = stageData.map(({id, article, name, hiddenObjectTypes}) => {
  const indices = hiddenObjectTypes.reduce((acc, obj, n) =>
    (obj === 'item') ? [...acc, swizzle8BitAccessor(n)] : acc,
    new Array<number>());
  
  return {id, article, name, indices};
});

export const endingRPData: {id: EndingID, stageID: EndingStageID, name: string}[] = [
  { id: 0x00, stageID: 0x25, name: "WORLD"      },
  { id: 0x01, stageID: 0x25, name: "EMPEROR"    },
  { id: 0x02, stageID: 0x25, name: "EMPRESS"    },
  { id: 0x03, stageID: 0x25, name: "HIEROPHANT" },
  { id: 0x04, stageID: 0x25, name: "PRIESTESS"  },
  { id: 0x05, stageID: 0x26, name: "SUN"        },
  { id: 0x06, stageID: 0x26, name: "MOOON"      },
  { id: 0x07, stageID: 0x26, name: "CHARIOT"    },
  { id: 0x08, stageID: 0x26, name: "HANGED MAN" },
  { id: 0x09, stageID: 0x26, name: "DEVIL"      },
  { id: 0x0A, stageID: 0x26, name: "DEATH"      },
  { id: 0x0B, stageID: 0x26, name: "TOWER"      },
  { id: 0x0C, stageID: 0x26, name: "FORTUNE"    },
  { id: 0x0D, stageID: 0x22, name: "JUSTICE",   },
] as const;

export const endingData: {id: EndingID| EndingID[], stageID: EndingStageID, finalStage: StageName, name: string | string[], points: 1 | 2 | 3 | 5 | 10, title: string}[] = [
  { id:  0x00,        stageID: 0x25, finalStage: "Sharia Temple",  name:  "World",                    points: 10, title: "The Journey Has Just Begun..."},
  { id: [0x01, 0x02], stageID: 0x25, finalStage: "Sharia Temple",  name: ["Emperor",    "Empress"],   points:  5, title: "The True Path of a Royal"},
  { id: [0x03, 0x04], stageID: 0x25, finalStage: "Sharia Temple",  name: ["Hierophant", "Priestess"], points:  5, title: "A Name Chiseled in History"},
  { id: [0x05, 0x06], stageID: 0x26, finalStage: "Sharia Temple",  name: ["Sun",        "Moon"],      points:  5, title: "The Courage to Attain This Peace"},
  { id:  0x07,        stageID: 0x26, finalStage: "Sharia Temple",  name:  "Chariot",                  points:  5, title: "The Right Hand of the New King"},
  { id:  0x08,        stageID: 0x26, finalStage: "Sharia Temple",  name:  "Hanged Man",               points:  5, title: "The Hero Lost to History"},
  { id:  0x09,        stageID: 0x26, finalStage: "Sharia Temple",  name:  "Devil",                    points:  5, title: "The Return of the Ogre Battle"},
  { id:  0x0A,        stageID: 0x26, finalStage: "Sharia Temple",  name:  "Death",                    points:  5, title: "The Power of the Dark Path"},
  { id:  0x0B,        stageID: 0x26, finalStage: "Sharia Temple",  name:  "Tower",                    points:  5, title: "Live By the Sword, Die by the Sword"},
  { id:  0x0C,        stageID: 0x26, finalStage: "Dragon's Haven", name:  "Fortune",                  points:  5, title: "But the Battle Has Just Begun..."},
  // { id: 0x0D, stageID: 0x22, name: "Justice", },
] as const;

// ---------------------------------------------------------------------------------------------------

if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;

  test.for(stageData)(
    'Hidden object count matches flags for $name',
    ({hiddenObjectCount, hiddenObjectTypes}) => {
      const derivedCount = hiddenObjectTypes.reduce((acc, val) => (val !== '') ? acc + 1 : acc, 0);

      expect(derivedCount).toBe(hiddenObjectCount);
  });

  test.for(Object.entries(ADDR))(
    'Address constant `%s` is within Saturn memory space',
    ([_name, addr]) => {
      expect(addr).toBeGreaterThanOrEqual(SATURN_ADDRESS_SPACE.min);
      expect(addr).toBeLessThanOrEqual(SATURN_ADDRESS_SPACE.max);
    }
  );
}
