import { RichPresence, define, andNext, orNext } from "@cruncheevos/core";

import { eq, neq, gt, lt, gte, lte } from "../../common/comparison.js";
import { richPresenceLookup } from "../../common/rich-presence.js";
import { byte } from "../../common/value.js";
import { SYSTEM } from "./data.js";

// ---------------------------------------------------------------------------------------------------

const mapLocations: { id: number, name: string }[] = [
  { id: 0x00, name: "The Royal City of Lesalia" },
  { id: 0x01, name: "Riovanes Castle" },
  { id: 0x02, name: "Eagrose Castle" },
  { id: 0x03, name: "Lionel Castle" },
  { id: 0x04, name: "Limberry Castle" },
  { id: 0x05, name: "Zeltennia Castle" },
  { id: 0x06, name: "The Magick City of Gariland" },
  { id: 0x07, name: "The Walled City of Yardrow" },
  { id: 0x08, name: "The Mining Town of Gollund" },
  { id: 0x09, name: "The Merchant City of Dorter" },
  { id: 0x0A, name: "The Castled City of Zaland" },
  { id: 0x0B, name: "The Clockwork City of Goug" },
  { id: 0x0C, name: "The Port City of Warjilis" },
  { id: 0x0D, name: "The Free City of Bervenia" },
  { id: 0x0E, name: "The Trade City of Sal Ghidos" },
  { id: 0x0F, name: "Ziekden Fortress" },
  { id: 0x10, name: "Mullonde" },
  { id: 0x11, name: "Brigand's Den" },
  { id: 0x12, name: "Orbonne Monastery" },
  { id: 0x13, name: "Golgollada Gallows" },
  { id: 0x14, name: "The Necrohol of Mullonde" },
  { id: 0x15, name: "Fort Besselat" },
  { id: 0x16, name: "Midlight's Deep" },
  { id: 0x17, name: "Nelveska Temple" },
  { id: 0x18, name: "Mandalia Plain" },
  { id: 0x19, name: "Fovoham Windflats" },
  { id: 0x1A, name: "The Siedge Weald" },
  { id: 0x1B, name: "Mount Bervenia" },
  { id: 0x1C, name: "Zeklaus Desert" },
  { id: 0x1D, name: "Lenalian Plateau" },
  { id: 0x1E, name: "Tchigolith Fenlands" },
  { id: 0x1F, name: "The Yuguewood" },
  { id: 0x20, name: "Araguay Woods" },
  { id: 0x21, name: "Grogh Heights" },
  { id: 0x22, name: "Beddha Sandwaste" },
  { id: 0x23, name: "Zeirchele Falls" },
  { id: 0x24, name: "Dorvauldar Marsh" },
  { id: 0x25, name: "Balias Tor" },
  { id: 0x26, name: "Dugeura Pass" },
  { id: 0x27, name: "Balias Swale" },
  { id: 0x28, name: "Finnath Creek" },
  { id: 0x29, name: "Lake Poescas" },
  { id: 0x2A, name: "Mount Germinas" },
];

const randomBattles: { id: number, name: string }[] = [
  // 0x001 - 0x009
  { id: 0x001, name: "Dorvauldar Marsh" },
  { id: 0x002, name: "Dorvauldar Marsh" },
  { id: 0x003, name: "Dorvauldar Marsh" },
  { id: 0x004, name: "Dorvauldar Marsh" },
  { id: 0x005, name: "Dorvauldar Marsh" },
  { id: 0x006, name: "Dorvauldar Marsh" },
  { id: 0x007, name: "Dorvauldar Marsh" },
  { id: 0x008, name: "Dorvauldar Marsh" },

  // 0x00d - 0x018
  { id: 0x00d, name: "Fovoham Windflats" },
  { id: 0x00e, name: "Fovoham Windflats" },
  { id: 0x00f, name: "Fovoham Windflats" },
  { id: 0x010, name: "Fovoham Windflats" },
  { id: 0x011, name: "Fovoham Windflats" },
  { id: 0x012, name: "Fovoham Windflats" },
  { id: 0x013, name: "Fovoham Windflats" },
  { id: 0x014, name: "Fovoham Windflats" },
  { id: 0x015, name: "Fovoham Windflats" },
  { id: 0x016, name: "Fovoham Windflats" },
  { id: 0x017, name: "Fovoham Windflats" },
  { id: 0x018, name: "Fovoham Windflats" },

  // 0x019 - 0x020
  { id: 0x019, name: "The Siedge Weald" },
  { id: 0x01a, name: "The Siedge Weald" },
  { id: 0x01b, name: "The Siedge Weald" },
  { id: 0x01c, name: "The Siedge Weald" },
  { id: 0x01d, name: "The Siedge Weald" },
  { id: 0x01e, name: "The Siedge Weald" },
  { id: 0x01f, name: "The Siedge Weald" },
  { id: 0x020, name: "The Siedge Weald" },

  // 0x025 - 0x02c
  { id: 0x025, name: "Mount Bervenia" },
  { id: 0x026, name: "Mount Bervenia" },
  { id: 0x027, name: "Mount Bervenia" },
  { id: 0x028, name: "Mount Bervenia" },
  { id: 0x029, name: "Mount Bervenia" },
  { id: 0x02a, name: "Mount Bervenia" },
  { id: 0x02b, name: "Mount Bervenia" },
  { id: 0x02c, name: "Mount Bervenia" },

  // 0x031 - 0x03c
  { id: 0x031, name: "Zeklaus Desert" },
  { id: 0x032, name: "Zeklaus Desert" },
  { id: 0x033, name: "Zeklaus Desert" },
  { id: 0x034, name: "Zeklaus Desert" },
  { id: 0x035, name: "Zeklaus Desert" },
  { id: 0x036, name: "Zeklaus Desert" },
  { id: 0x037, name: "Zeklaus Desert" },
  { id: 0x038, name: "Zeklaus Desert" },
  { id: 0x039, name: "Zeklaus Desert" },
  { id: 0x03a, name: "Zeklaus Desert" },
  { id: 0x03b, name: "Zeklaus Desert" },
  { id: 0x03c, name: "Zeklaus Desert" },

  // 0x03d - 0x044
  { id: 0x03d, name: "Lenalian Plateau" },
  { id: 0x03e, name: "Lenalian Plateau" },
  { id: 0x03f, name: "Lenalian Plateau" },
  { id: 0x040, name: "Lenalian Plateau" },
  { id: 0x041, name: "Lenalian Plateau" },
  { id: 0x042, name: "Lenalian Plateau" },
  { id: 0x043, name: "Lenalian Plateau" },
  { id: 0x044, name: "Lenalian Plateau" },

  // 0x049 - 0x050
  { id: 0x049, name: "Tchigolith Fenlands" },
  { id: 0x04a, name: "Tchigolith Fenlands" },
  { id: 0x04b, name: "Tchigolith Fenlands" },
  { id: 0x04c, name: "Tchigolith Fenlands" },
  { id: 0x04d, name: "Tchigolith Fenlands" },
  { id: 0x04e, name: "Tchigolith Fenlands" },
  { id: 0x04f, name: "Tchigolith Fenlands" },
  { id: 0x050, name: "Tchigolith Fenlands" },

  // 0x052 - 0x054
  { id: 0x052, name: "Zeirchele Falls" },
  { id: 0x053, name: "Balias Tor" },
  { id: 0x054, name: "Lenalian Plateau" },

  // 0x055 - 0x05c
  { id: 0x055, name: "The Yuguewood" },
  { id: 0x056, name: "The Yuguewood" },
  { id: 0x057, name: "The Yuguewood" },
  { id: 0x058, name: "The Yuguewood" },
  { id: 0x059, name: "The Yuguewood" },
  { id: 0x05a, name: "The Yuguewood" },
  { id: 0x05b, name: "The Yuguewood" },
  { id: 0x05c, name: "The Yuguewood" },

  // 0x05d - 0x060
  { id: 0x05d, name: "Dorvauldar Marsh" },
  { id: 0x05e, name: "Grogh Heights" },
  { id: 0x05f, name: "Mount Bervenia" },
  { id: 0x060, name: "Balias Swale" },

  // 0x061 - 0x068
  { id: 0x061, name: "Araguay Woods" },
  { id: 0x062, name: "Araguay Woods" },
  { id: 0x063, name: "Araguay Woods" },
  { id: 0x064, name: "Araguay Woods" },
  { id: 0x065, name: "Araguay Woods" },
  { id: 0x066, name: "Araguay Woods" },
  { id: 0x067, name: "Araguay Woods" },
  { id: 0x068, name: "Araguay Woods" },

  // 0x069 - 0x06c
  { id: 0x069, name: "Finnath Creek" },
  { id: 0x06a, name: "Mount Germinas" },
  { id: 0x06b, name: "Araguay Woods" },
  { id: 0x06c, name: "The Yuguewood" },

  // 0x06d - 0x078
  { id: 0x06d, name: "Grogh Heights" },
  { id: 0x06e, name: "Grogh Heights" },
  { id: 0x06f, name: "Grogh Heights" },
  { id: 0x070, name: "Grogh Heights" },
  { id: 0x071, name: "Grogh Heights" },
  { id: 0x072, name: "Grogh Heights" },
  { id: 0x073, name: "Grogh Heights" },
  { id: 0x074, name: "Grogh Heights" },
  { id: 0x075, name: "Grogh Heights" },
  { id: 0x076, name: "Grogh Heights" },
  { id: 0x077, name: "Grogh Heights" },
  { id: 0x078, name: "Grogh Heights" },

  // 0x079 - 0x080
  { id: 0x079, name: "Beddha Sandwaste" },
  { id: 0x07a, name: "Beddha Sandwaste" },
  { id: 0x07b, name: "Beddha Sandwaste" },
  { id: 0x07c, name: "Beddha Sandwaste" },
  { id: 0x07d, name: "Beddha Sandwaste" },
  { id: 0x07e, name: "Beddha Sandwaste" },
  { id: 0x07f, name: "Beddha Sandwaste" },
  { id: 0x080, name: "Beddha Sandwaste" },

  // 0x081 - 0x084
  { id: 0x081, name: "Beddha Sandwaste" },
  { id: 0x082, name: "Fovoham Windflats" },
  { id: 0x083, name: "Dugeura Pass" },
  { id: 0x084, name: "The Siedge Weald" },
  
  // 0x085 - 0x090
  { id: 0x085, name: "Zeirchele Falls" },
  { id: 0x086, name: "Zeirchele Falls" },
  { id: 0x087, name: "Zeirchele Falls" },
  { id: 0x088, name: "Zeirchele Falls" },
  { id: 0x089, name: "Zeirchele Falls" },
  { id: 0x08a, name: "Zeirchele Falls" },
  { id: 0x08b, name: "Zeirchele Falls" },
  { id: 0x08c, name: "Zeirchele Falls" },
  { id: 0x08d, name: "Zeirchele Falls" },
  { id: 0x08e, name: "Zeirchele Falls" },
  { id: 0x08f, name: "Zeirchele Falls" },
  { id: 0x090, name: "Zeirchele Falls" },

  // 0x091 - 0x098
  { id: 0x091, name: "Balias Tor" },
  { id: 0x092, name: "Balias Tor" },
  { id: 0x093, name: "Balias Tor" },
  { id: 0x094, name: "Balias Tor" },
  { id: 0x095, name: "Balias Tor" },
  { id: 0x096, name: "Balias Tor" },
  { id: 0x097, name: "Balias Tor" },
  { id: 0x098, name: "Balias Tor" },

  // 0x099 - 0x09c
  { id: 0x099, name: "Lake Poescas" },
  { id: 0x09a, name: "Tchigolith Fenlands" },
  { id: 0x09b, name: "Mandalia Plain" },
  { id: 0x09c, name: "Zeklaus Desert" },

  // 0x09d - 0x0a8
  { id: 0x09d, name: "Mandalia Plain" },
  { id: 0x09e, name: "Mandalia Plain" },
  { id: 0x09f, name: "Mandalia Plain" },
  { id: 0x0a0, name: "Mandalia Plain" },
  { id: 0x0a1, name: "Mandalia Plain" },
  { id: 0x0a2, name: "Mandalia Plain" },
  { id: 0x0a3, name: "Mandalia Plain" },
  { id: 0x0a4, name: "Mandalia Plain" },
  { id: 0x0a5, name: "Mandalia Plain" },
  { id: 0x0a6, name: "Mandalia Plain" },
  { id: 0x0a7, name: "Mandalia Plain" },
  { id: 0x0a8, name: "Mandalia Plain" },

  // 0x0a9 - 0x0b0
  { id: 0x0a9, name: "Dugeura Pass" },
  { id: 0x0aa, name: "Dugeura Pass" },
  { id: 0x0ab, name: "Dugeura Pass" },
  { id: 0x0ac, name: "Dugeura Pass" },
  { id: 0x0ad, name: "Dugeura Pass" },
  { id: 0x0ae, name: "Dugeura Pass" },
  { id: 0x0af, name: "Dugeura Pass" },
  { id: 0x0b0, name: "Dugeura Pass" },

  // 0x0b1 - 0x0b4
  { id: 0x0b1, name: "Midlight's Deep: Terminus" },
  { id: 0x0b2, name: "Midlight's Deep: Terminus" },
  { id: 0x0b3, name: "Midlight's Deep: Terminus" },
  { id: 0x0b4, name: "Midlight's Deep: Terminus" },

  // 0x0b5 - 0x0c0
  { id: 0x0b5, name: "Balias Swale" },
  { id: 0x0b6, name: "Balias Swale" },
  { id: 0x0b7, name: "Balias Swale" },
  { id: 0x0b8, name: "Balias Swale" },
  { id: 0x0b9, name: "Balias Swale" },
  { id: 0x0ba, name: "Balias Swale" },
  { id: 0x0bb, name: "Balias Swale" },
  { id: 0x0bc, name: "Balias Swale" },
  { id: 0x0bd, name: "Balias Swale" },
  { id: 0x0be, name: "Balias Swale" },
  { id: 0x0bf, name: "Balias Swale" },
  { id: 0x0c0, name: "Balias Swale" },

  // 0x0c1 - 0x0c8
  { id: 0x0c1, name: "Finnath Creek" },
  { id: 0x0c2, name: "Finnath Creek" },
  { id: 0x0c3, name: "Finnath Creek" },
  { id: 0x0c4, name: "Finnath Creek" },
  { id: 0x0c5, name: "Finnath Creek" },
  { id: 0x0c6, name: "Finnath Creek" },
  { id: 0x0c7, name: "Finnath Creek" },
  { id: 0x0c8, name: "Finnath Creek" },

  // 0x0c9 - 0x0cc
  { id: 0x0c9, name: "Midlight's Deep: The Interstice" },
  { id: 0x0ca, name: "Midlight's Deep: The Interstice" },
  { id: 0x0cb, name: "Midlight's Deep: The Interstice" },
  { id: 0x0cc, name: "Midlight's Deep: The Interstice" },

  // 0x0cd - 0x0d4
  { id: 0x0cd, name: "Lake Poescas" },
  { id: 0x0ce, name: "Lake Poescas" },
  { id: 0x0cf, name: "Lake Poescas" },
  { id: 0x0d0, name: "Lake Poescas" },
  { id: 0x0d1, name: "Lake Poescas" },
  { id: 0x0d2, name: "Lake Poescas" },
  { id: 0x0d3, name: "Lake Poescas" },
  { id: 0x0d4, name: "Lake Poescas" },

  // 0x0d5 - 0x0d8
  { id: 0x0d5, name: "Midlight's Deep: The Switchback" },
  { id: 0x0d6, name: "Midlight's Deep: The Switchback" },
  { id: 0x0d7, name: "Midlight's Deep: The Switchback" },
  { id: 0x0d8, name: "Midlight's Deep: The Switchback" },

  // 0x0d9 - 0x0e0
  { id: 0x0d9, name: "Mount Germinas" },
  { id: 0x0da, name: "Mount Germinas" },
  { id: 0x0db, name: "Mount Germinas" },
  { id: 0x0dc, name: "Mount Germinas" },
  { id: 0x0dd, name: "Mount Germinas" },
  { id: 0x0de, name: "Mount Germinas" },
  { id: 0x0df, name: "Mount Germinas" },
  { id: 0x0e0, name: "Mount Germinas" },

  // 0x0e1 - 0x0e4
  { id: 0x0e1, name: "Midlight's Deep: The Crossing" },
  { id: 0x0e2, name: "Midlight's Deep: The Crossing" },
  { id: 0x0e3, name: "Midlight's Deep: The Crossing" },
  { id: 0x0e4, name: "Midlight's Deep: The Crossing" },

  // 0x0e5 - 0x0e8
  { id: 0x0e5, name: "Midlight's Deep: The Palings" },
  { id: 0x0e6, name: "Midlight's Deep: The Palings" },
  { id: 0x0e7, name: "Midlight's Deep: The Palings" },
  { id: 0x0e8, name: "Midlight's Deep: The Palings" },

  // 0x0e9 - 0x0ec
  { id: 0x0e9, name: "Midlight's Deep: The Oubliette" },
  { id: 0x0ea, name: "Midlight's Deep: The Oubliette" },
  { id: 0x0eb, name: "Midlight's Deep: The Oubliette" },
  { id: 0x0ec, name: "Midlight's Deep: The Oubliette" },

  // 0x0ed - 0x0f0
  { id: 0x0ed, name: "Midlight's Deep: The Catacombs" },
  { id: 0x0ee, name: "Midlight's Deep: The Catacombs" },
  { id: 0x0ef, name: "Midlight's Deep: The Catacombs" },
  { id: 0x0f0, name: "Midlight's Deep: The Catacombs" },

  // 0x0f1 - 0x0f4
  { id: 0x0f1, name: "Midlight's Deep: The Hollow" },
  { id: 0x0f2, name: "Midlight's Deep: The Hollow" },
  { id: 0x0f3, name: "Midlight's Deep: The Hollow" },
  { id: 0x0f4, name: "Midlight's Deep: The Hollow" },

  // 0x0f5 - 0x0f8
  { id: 0x0f5, name: "Midlight's Deep: The Stair" },
  { id: 0x0f6, name: "Midlight's Deep: The Stair" },
  { id: 0x0f7, name: "Midlight's Deep: The Stair" },
  { id: 0x0f8, name: "Midlight's Deep: The Stair" },

  // 0x0f9 - 0x0fc
  { id: 0x0f9, name: "Midlight's Deep: The Crevasse" },
  { id: 0x0fa, name: "Midlight's Deep: The Crevasse" },
  { id: 0x0fb, name: "Midlight's Deep: The Crevasse" },
  { id: 0x0fc, name: "Midlight's Deep: The Crevasse" },
];

// 0x0fc - 0x0ff: Tutorial

const storyEvents: { id: number, description: string }[] = [
  // -- Prologue --
  { id: 0x100, description: "Orbonne Monastery - Opening cutscene" },
  { id: 0x101, description: "Orbonne Monastery - Opening battle" },

  // -- Chapter 1 --
  { id: 0x102, description: "Royal Military Akademy - Chapter 1 opening" },
  { id: 0x103, description: "(unused?)" },
  { id: 0x104, description: "The Magick City of Gariland - Story battle" },
  { id: 0x105, description: "The Beoulve Manse in the waning days of the Fifty Years' War... (death of Barbaneth)" },
  { id: 0x106, description: "Mandalia Plain - story battle" },
  { id: 0x107, description: "Mandalia Plain - post-battle cutscene" },
  { id: 0x108, description: "Eagrose Castle - cutscene with Dycedarg" },
  { id: 0x109, description: "Eagrose Castle - cutscene with Zalbaag, Alma, and Tietra" },
  { id: 0x10a, description: "The Siedge Weald - story battle" },
  { id: 0x10b, description: "Slums of Dorter - story battle" },
  { id: 0x10c, description: "Slums of Dorter - post-battle cutscene" },
  { id: 0x10d, description: "Zeklaus Desert - story battle" },
  { id: 0x10e, description: "Zeklaus Desert - post-battle cutscene" },
  { id: 0x10f, description: "Eagrose Castle - Conversation with Dycedarg after Sand Rat's Sietch" },
  { id: 0x110, description: "Brigand's Den - story battle" },
  { id: 0x111, description: "Brigand's Den - post-battle cutscene" },
  { id: 0x112, description: "Eagrose Castle - Tietra is abducted" },
  { id: 0x113, description: "Eagrose Castle - cutscene on returning from Brigand's Den" },
  { id: 0x114, description: "Mandalia Plain - reed flute cutscene" },
  { id: 0x115, description: "Lanalian Plateau - story battle" },
  { id: 0x116, description: "Fovoham Windflats - pre-battle cutscene" },
  { id: 0x117, description: "Fovoham Windflats - story battle" },
  { id: 0x118, description: "Fovoham Windflats - post-battle cutscene" },
  { id: 0x119, description: "Ziekden Fortress - story battle" },
  { id: 0x11a, description: "Ziekden Fortress - post-battle cutscene" },
  
  // -- Chapter 2 --
  { id: 0x11b, description: "Orbonne Monastery - start of chapter 2" },
  { id: 0x11d, description: "The Merchant City of Dorter - story battle" },
  { id: 0x11e, description: "Araguay Woods - story battle" },
  { id: 0x11f, description: "Zeirchele Falls - story battle" },
  { id: 0x120, description: "Zeirchele Falls - post-battle cutscene" },
  { id: 0x121, description: "The Castled City of Zaland - story battle" },
  { id: 0x122, description: "The Castled City of Zaland - post-battle cutscene" },
  { id: 0x123, description: "The Castled City of Zaland - reed flute cutscene" },
  { id: 0x124, description: "Balias Tor - story battle" },
  { id: 0x125, description: "Eagrose Castle - Dycedarg meets with Gafgarion" },
  { id: 0x126, description: "Lionel Castle - cutscene on first arrival" },
  { id: 0x127, description: "Flashback cutscene with Besrodio and Mustadio" },
  { id: 0x128, description: "Tchigolith Fenlands - story battle" },
  { id: 0x129, description: "The Clockwork City of Goug - initial story cutscenes" },
  { id: 0x12a, description: "The Clockwork City of Goug - story battle" },
  { id: 0x12b, description: "The Clockwork City of Goug - post-battle cutscenes" },
  { id: 0x12d, description: "The Port City of Warjilis - cutscene in port with Delita" },
  { id: 0x12e, description: "Lionel Castle - Scene with Draclau, Gafgarion, and Rudvish (when leaving Warjilis)" },
  { id: 0x12f, description: "Balias Swale - story battle" },
  { id: 0x130, description: "Golgollada Gallows - story battle" },
  { id: 0x131, description: "Cutscene at Lenalia Plateau where Wiegraf gets recruited by Rofel" },
  { id: 0x132, description: "Cutscene in Lionel dungeon - Delita, Ovelia, Draclau, Vormav" },
  { id: 0x133, description: "Gates of Lionel Castle - story battle" },
  { id: 0x134, description: "Interlude - Deltta and Ovelia at Zirekile Falls" },
  { id: 0x135, description: "Inside of Lionel Castle - story battle" },
  { id: 0x136, description: "Inside of Zeltenia Castle - cutscene after Queklain battle / End of Chapter 2" },

  // -- Chapter 3 --
  { id: 0x137, description: "Start of Chapter 3 - cutscene at Fort Besselat" },
  { id: 0x138, description: "The Mining Town of Gollund - story battle" },
  { id: 0x139, description: "The Mining Town of Gollund - post-battle cutscene" },
  { id: 0x13a, description: "The Royal City of Lesalia - meeting with Zalbag" },
  { id: 0x13b, description: "The Royal City of Lesalia - story battle" },
  { id: 0x13c, description: "The Royal City of Lesalia - post-battle cutscene" },
  { id: 0x13d, description: "Monastery Vaults - pre-battle cutscene with Simon and Alma" },
  { id: 0x13e, description: "Monastery Vaults - story battle #1" },
  { id: 0x13f, description: "Monastery Vaults - story battle #2" },
  { id: 0x140, description: "Monastery Vaults - story battle #3" },
  { id: 0x143, description: "Orbonne Monastery - post-battle cutscene" },
  { id: 0x144, description: "The Merchant City of Dorter - Marach confronts Ramza" },
  { id: 0x145, description: "Zeltennia Castle - Delita and Ovelia cutcene" },
  { id: 0x141, description: "Zeklaus Desert - Ashley Riot battle" },
  { id: 0x142, description: "Zeklaus Desert - post-battle cutscene" },
  { id: 0x146, description: "Grogh Heights - story battle" },
  { id: 0x147, description: "Grogh Heights - post-battle cutscene" },
  { id: 0x148, description: "The Walled City of Yardrow - story battle" },
  { id: 0x14a, description: "The Walled City of Yardrow - post-battle cutscene" },
  { id: 0x149, description: "Zeltennia Castle - Delita and Ovelia vs ninja assassins" },
  { id: 0x14b, description: "The Yuguewood - story battle" },
  { id: 0x14c, description: "Riovanes Castle - Barrington meets with Folmarv" },
  { id: 0x14d, description: "Riovanes Castle Gate - story battle" },
  { id: 0x14e, description: "Riovanes Castle - Alma escapes from her cell" },
  { id: 0x14f, description: "Riovanes Castle Keep - story battle" },
  { id: 0x150, description: "Riovanes Castle - Alma discovers the wounded Isilud" },
  { id: 0x151, description: "Riovanes Castle Roof - story battle" },
  { id: 0x152, description: "Riovanes Castle Roof - post-battle cutscene" },
  { id: 0x154, description: "Riovanes Castle - end of chapter cutscene" },
  
  // -- Chapter 4 --
  { id: 0x155, description: "Riovanes Castle - start of chapter 4 cutscene" },
  { id: 0x156, description: "Zeltennia Castle - cutscene with Orran and Orlandeau" },
  { id: 0x157, description: "Dugeura Pass - story battle" },
  { id: 0x158, description: "The Free City of Bervenia - story battle" },
  { id: 0x159, description: "Zeltennia Castle - cutscene with Delita and Ovelia" },
  { id: 0x15a, description: "Finnath Creek - story battle" },
  { id: 0x15b, description: "Zeltennia Castle - cutcene with Ramza and Delita in church" },
  { id: 0x15c, description: "Zeltennia Castle - story battle" },
  { id: 0x15d, description: "Zeltennia Castle - post-battle cutscene" },
  { id: 0x15e, description: "Beddha Sandwaste - story battle" },
  { id: 0x15f, description: "Fort Besselat - Orlandeau is taken into custody" },
  { id: 0x160, description: "Fort Besselat South Wall - story battle" },
  { id: 0x161, description: "Fort Besselat North Wall - story battle" },
  { id: 0x162, description: "Fort Besselat 'Darg shanks Larg" },
  { id: 0x163, description: "Fort Besselat Sluice - story battle" },
  { id: 0x164, description: "Fort Besselat - Orlandeau is rescued" },
  { id: 0x165, description: "Fort Besselat - Goltanna's death" },
  { id: 0x166, description: "Mount Germinas - story battle" },
  { id: 0x167, description: "Lake Poescas - story battle" },
  { id: 0x168, description: "Eagrose Castle - Dycedarg meets with Loffrey" },
  { id: 0x169, description: "Limberry Castle Gate - story battle" },
  { id: 0x16a, description: "Limberry Castle - cutscene with Elmdore and Folmarv" },
  { id: 0x16b, description: "Limberry Castle Keep - story battle" },
  { id: 0x16c, description: "Limberry Castle Inner Court - story battle" },
  { id: 0x16d, description: "Limberry Castle Undercroft - story battle" },
  { id: 0x16e, description: "Limberry Castle Undercroft - post-battle cutscene" },
  { id: 0x170, description: "Zeltennia - Cutscene with Ovelia, Orran, and Delita" },
  { id: 0x171, description: "Eagrose Castle - Zalbaag investigates Barbaneth's grave" },
  { id: 0x172, description: "Eagrose Castle - Ramza recognizes Zalbaag's chocobo" },
  { id: 0x173, description: "Eagrose Castle - story battle" },
  { id: 0x174, description: "Mullonde Cathedral - Folmarv stabs High Confessor Marcel" },
  { id: 0x175, description: "Mullonde Cathedral - story battle" },
  { id: 0x176, description: "Mullonde Cathedral Nave - story battle" },
  { id: 0x177, description: "Mullonde Cathedral Sanctuary - story battle" },
  { id: 0x178, description: "Mullonde Cathedra - death of High Confessor Funebris" },
  { id: 0x179, description: "Monastery Vaults Fourth Level - story battle" },
  { id: 0x17a, description: "Monastery Vaults Fifth Level - story battle" },
  { id: 0x17b, description: "Necrohol of Mullonde - chaos gate cutscene" },
  { id: 0x17c, description: "Necrohol of Mullonde - story battle" },
  { id: 0x17d, description: "Lost Halidom - story battle" },
  { id: 0x17e, description: "Airship Graveyard - story battle (Hashmal)" },
  { id: 0x17f, description: "Airship Graveyard - story battle (Ultima)" },
  { id: 0x180, description: "Ending - Funeral scene" },

  // -- Sidequests --
  { id: 0x182, description: "Midlight's Deep - Terminus - Elidibus battle" },
  { id: 0x183, description: "The Clockwork City of Goug - Discovered Construct 8" },
  { id: 0x184, description: "The Clockwork City of Goug - Activating Construct 8" },
  { id: 0x185, description: "The Clockwork City of Goug - Discovered Orrery" },
  { id: 0x186, description: "The Clockwork City of Goug - Activating Orrery" },
  { id: 0x187, description: "The Trade City of Sal Ghidos - Encounter with Aerith / Cloud battle (use event flags to disambiguate)" },
  { id: 0x188, description: "The Port City of Warjilis - Midlight's Deep intro" },
  { id: 0x189, description: "The Royal City of Lesalia - cutscene in tavern where Ramza meets Beowulf" },
  { id: 0x18a, description: "Gollund Colliery - battle 1" },
  { id: 0x18b, description: "Gollund Colliery - battle 2" },
  { id: 0x18c, description: "Gollund Colliery - battle 3" },
  { id: 0x18d, description: "Gollund Colliery - battle 4" },
  { id: 0x18e, description: "Gollund Colliery - post-battle cutscene / Beowulf & Reis recruitment" },
  { id: 0x18f, description: "Nelveska Temple battle" },
  { id: 0x190, description: "Nelveska Temple - Reis is restored to human form" },
  { id: 0x192, description: "Slums of Dorter - Balthier battle" },
  { id: 0x191, description: "Slums of Dorter - post-battle cutscene / Balthier recruitment" },
  { id: 0x193, description: "Merchant City of Dorter - Cletienne battle" },
  { id: 0x194, description: "Zeltennia Castle - Ovelia and Agrias' reunion" },
  { id: 0x195, description: "Lionel Castle - Reis gets kidnapped" },
  { id: 0x196, description: "Lionel Castle - Liege Lord quest battle 1" },
  { id: 0x197, description: "Agrias' birthday" },
  { id: 0x198, description: "Lionel Castle - Liege Lord quest battle 2" },
  { id: 0x199, description: "Lionel Castle - Liege Lord post-battles cutscene" },
  { id: 0x19a, description: "Brigand's Den - Disorder in the Order battle" },

  // -- Bonus content --
  { id: 0x19b, description: "Rendevous: Chocobo Defense" },
  { id: 0x19c, description: "Rendevous: Chicken Race" },
  { id: 0x19d, description: "Rendevous: Treasure Hunt" },
  { id: 0x19e, description: "Rendevous: Teioh" },
  { id: 0x19f, description: "Rendevous: Lost Heirloom" },
  { id: 0x1a0, description: "Rendevous: The Fete" },
  { id: 0x1a1, description: "Rendevous: Desert Minefield" },
  { id: 0x1a2, description: "Rendevous: Littering" },
  { id: 0x1a3, description: "Rendevous: Shades of the Past" },
  { id: 0x1a4, description: "Rendevous: The Knights Templar" },
  { id: 0x1a8, description: "Rendevous: All-Star Melee" },
  { id: 0x1a9, description: "Rendevous: The Guarded Temple" },
  { id: 0x1aa, description: "Rendevous: Nightmares" },
  { id: 0x1ab, description: "Rendevous: Brave Story" },
  { id: 0x1b5, description: "Rendevous: An Ill Wind" },
  { id: 0x1b6, description: "Treasure Wheel" },
  { id: 0x1b7, description: "Rendevous: Mirror Match" },
  { id: 0x1b8, description: "Rendevous: Of Vagrants" },
  { id: 0x1b9, description: "Rendevous: Be a Beta" },

  { id: 0x1c0, description: "Rendevous introduction" },
  { id: 0x1c3, description: "Depths of Murond" }
];

const aries: {state: number, icon: string}[] = [
  { state: 0x01, icon: '♈' }
];
const taurus: {state: number, icon: string}[] = [
  { state: 0x01, icon: '♉' }
];
const gemini: {state: number, icon: string}[] = [
  { state: 0x01, icon: '♊' }
];
const cancer: {state: number, icon: string}[] = [
  { state: 0x01, icon: '♋' }
];
const leo: {state: number, icon: string}[] = [
  { state: 0x01, icon: '♌' }
];
const virgo: {state: number, icon: string}[] = [
  { state: 0x01, icon: '♍' }
];
const libra: {state: number, icon: string}[] = [
  { state: 0x01, icon: '♎' }
];
const scorpio: {state: number, icon: string}[] = [
  { state: 0x01, icon: '♏' }
];
const sagittarius: {state: number, icon: string}[] = [
  { state: 0x01, icon: '♐' }
];
const capricorn: {state: number, icon: string}[] = [
  { state: 0x01, icon: '♑' }
];
const aquarius: {state: number, icon: string}[] = [
  { state: 0x01, icon: '♒' }
];
const pisces: {state: number, icon: string}[] = [
  { state: 0x01, icon: '♓' }
];
const serpentarius: {state: number, icon: string}[] = [
  { state: 0x01, icon: '⛎' }
];

// ---------------------------------------------------------------------------------------------------

function isWorldMap() {
  return define(
    eq( SYSTEM.world_map_overlay, 0x70735f73)
  )
}

function isEvent() {
  return define(
    neq( SYSTEM.world_map_overlay, 0x70735f73)
  )
}

// ---------------------------------------------------------------------------------------------------

function makeRichPresence() {
  const MapLocation = richPresenceLookup(
    'MapLocation',
    mapLocations, 'id', 'name',
    { defaultAt: SYSTEM.location_id },
  );

  const RandomBattle = richPresenceLookup(
    'RandomBattle',
    randomBattles, 'id', 'name',
    { defaultAt: SYSTEM.event_id },
  );

  // Zodiac Stone lookups
  const Aries = richPresenceLookup(
    'Aries', aries, 'state', 'icon',
    { defaultValue: '', defaultAt: SYSTEM.auracite(0) }
  );
  const Taurus = richPresenceLookup(
    'Taurus', taurus, 'state', 'icon',
    { defaultValue: '', defaultAt: SYSTEM.auracite(1) }
  );
  const Gemini = richPresenceLookup(
    'Gemini', gemini, 'state', 'icon',
    { defaultValue: '', defaultAt: SYSTEM.auracite(2) }
  );
  const Cancer = richPresenceLookup(
    'Cancer', cancer, 'state', 'icon',
    { defaultValue: '', defaultAt: SYSTEM.auracite(3) }
  );
  const Leo = richPresenceLookup(
    'Leo', leo, 'state', 'icon',
    { defaultValue: '', defaultAt: SYSTEM.auracite(4) }
  );
  const Virgo = richPresenceLookup(
    'Virgo', virgo, 'state', 'icon',
    { defaultValue: '', defaultAt: SYSTEM.auracite(5) }
  );
  const Libra = richPresenceLookup(
    'Libra', libra, 'state', 'icon',
    { defaultValue: '', defaultAt: SYSTEM.auracite(6) }
  );
  const Scorpio = richPresenceLookup(
    'Scorpio', scorpio, 'state', 'icon',
    { defaultValue: '', defaultAt: SYSTEM.auracite(7) }
  );
  const Sagittarius = richPresenceLookup(
    'Sagittarius', sagittarius, 'state', 'icon',
    { defaultValue: '', defaultAt: SYSTEM.auracite(8) }
  );
  const Capricorn = richPresenceLookup(
    'Capricorn', capricorn, 'state', 'icon',
    { defaultValue: '', defaultAt: SYSTEM.auracite(9) }
  );
  const Aquarius = richPresenceLookup(
    'Aquarius', aquarius, 'state', 'icon',
    { defaultValue: '', defaultAt: SYSTEM.auracite(10) }
  );
  const Pisces = richPresenceLookup(
    'Pisces', pisces, 'state', 'icon',
    { defaultValue: '', defaultAt: SYSTEM.auracite(11) }
  );
  const Serpentarius = richPresenceLookup(
    'Serpentarius', serpentarius, 'state', 'icon',
    { defaultValue: '', defaultAt: SYSTEM.auracite(12) }
  );

  return RichPresence({
    format: {
      IGT: 'SECS',
    },
    lookupDefaultParameters: { keyFormat: 'hex', compressRanges: false },
    lookup: {
      MapLocation,
      RandomBattle,

      Aries,
      Taurus,
      Gemini,
      Cancer,
      Leo,
      Virgo,
      Libra,
      Scorpio,
      Sagittarius,
      Capricorn,
      Aquarius,
      Pisces,
      Serpentarius,
    },
    displays: ({ lookup, format, macro, tag }) => {
      // const playTime = tag`${format.IGT.at(
      //   define(
      //     cond('AddSource', GAME_STATE_EN.in_game_time, '/', 1000),
      //     cond('Measured', 0)
      //   )
      // )}`;

      const auracite = tag`${lookup.Aries}${lookup.Taurus}${lookup.Gemini}${lookup.Cancer}${lookup.Leo}${lookup.Virgo}${lookup.Libra}${lookup.Scorpio}${lookup.Sagittarius}${lookup.Capricorn}${lookup.Aquarius}${lookup.Pisces}${lookup.Serpentarius}`;

      return [
        [
          define( orNext(eq(SYSTEM.event_id, 0x00), gt(SYSTEM.event_id, 0x1ff)) ),
          tag`Title screen ~ The Zodiac Brave Story`
        ],
        [
          define( gte(SYSTEM.event_id, 0x0fd), lte(SYSTEM.event_id, 0x0ff) ),
          tag`Napping through Master Darlavon's tutorial...`
        ],

        [
          define(
            andNext(
              gte(SYSTEM.event_id, 0x100),
              lte(SYSTEM.event_id, 0x19a),
              neq(SYSTEM.event_id, 0x103),
              neq(SYSTEM.event_id, 0x11c),
              neq(SYSTEM.event_id, 0x12c),
              neq(SYSTEM.event_id, 0x142),
              neq(SYSTEM.event_id, 0x153),
              neq(SYSTEM.event_id, 0x16f),
              neq(SYSTEM.event_id, 0x181),
            )
          ),
          tag``
        ],


        [
          define(
            isEvent(),
            gte(SYSTEM.event_id, 0x001),
            lte(SYSTEM.event_id, 0x009)
          ),
          tag`Ramza is engaged in a random battle at ${lookup.RandomBattle} • Zodiac Stones: [${auracite}]`
        ],
        [
          define(
            isEvent(),
            gte(SYSTEM.event_id, 0x00d),
            lte(SYSTEM.event_id, 0x018)
          ),
          tag`Ramza is engaged in a random battle at ${lookup.RandomBattle} • Zodiac Stones: [${auracite}]`
        ],
        [
          define(
            isEvent(),
            gte(SYSTEM.event_id, 0x025),
            lte(SYSTEM.event_id, 0x02c)
          ),
          tag`Ramza is engaged in a random battle at ${lookup.RandomBattle} • Zodiac Stones: [${auracite}]`
        ],
        [
          define(
            isEvent(),
            gte(SYSTEM.event_id, 0x031),
            lte(SYSTEM.event_id, 0x044)
          ),
          tag`Ramza is engaged in a random battle at ${lookup.RandomBattle} • Zodiac Stones: [${auracite}]`
        ],
        [
          define(
            isEvent(),
            gte(SYSTEM.event_id, 0x049),
            lte(SYSTEM.event_id, 0x050)
          ),
          tag`Ramza is engaged in a random battle at ${lookup.RandomBattle} • Zodiac Stones: [${auracite}]`
        ],
        [
          define(
            isEvent(),
            gte(SYSTEM.event_id, 0x052),
            lte(SYSTEM.event_id, 0x0fc)
          ),
          tag`Ramza is engaged in a random battle at ${lookup.RandomBattle} • Zodiac Stones: [${auracite}]`
        ],


        [
          define(
            isWorldMap()
          ),
          tag`Ramza is idling on the world map at ${lookup.MapLocation} • Zodiac Stones: [${auracite}]`
        ],
       
        "The Lion War of the Lions"
      ]
    }
  });
}

export default makeRichPresence;
