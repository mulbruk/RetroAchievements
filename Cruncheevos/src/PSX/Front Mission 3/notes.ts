import { codeNote } from '../../common/notes.js';

import { PILOT, PilotID, pilotData, WANZER } from './data.js';

// ---------------------------------------------------------------------------------------------------

function renderPilotNotes() {
  const ids: PilotID[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  
  ids.forEach((id) => {
    const pilotName = pilotData.find(({id: pilotID}) => pilotID === id)!.name;
    const pilotNote = (offset: number, size: string, text: string) => console.log(
      codeNote(
        PILOT.base_addr + PILOT.data_size * id + offset,
        `[${size}]` + ` Pilot data - ${pilotName} - ` + text
      )
    );
    
    pilotNote(0x3c, '16-bit', 'Equipped battle computer');
    pilotNote(0x40, '16-bit', 'Battle computer - part name');
    pilotNote(0x42, '8-bit',  'Battle computer - part type');
    pilotNote(0x48, '32-bit', 'Battle computer - pointer into parts data lookup');
    pilotNote(0x62, '16-bit', 'Melee EXP');
    pilotNote(0x66, '16-bit', 'Rifle EXP');
    pilotNote(0x68, '16-bit', 'Machine gun EXP');
    pilotNote(0x6a, '16-bit', 'Shotgun EXP');
    pilotNote(0x6c, '16-bit', 'Flamethrower EXP');
    pilotNote(0x6e, '16-bit', 'Missile EXP');
    pilotNote(0x70, '16-bit', 'Cannon EXP');
    pilotNote(0x72, '16-bit', 'Beam EXP');
    pilotNote(0x7a, '16-bit', 'Grenade EXP');
    pilotNote(0x86, '16-bit', 'Current HP');
    pilotNote(0x88, '16-bit', 'Max HP');
    pilotNote(0x8a, '16-bit', 'Ace rank medals count');
    pilotNote(0x96, '8-bit',  'Portrait ID\\r\\n(see 0x000001 for list of values)');
    pilotNote(0x9c, '8-bit',  'Current AP');
    pilotNote(0x9d, '8-bit',  'Max AP');
    pilotNote(0x9e, '8-bit',  'AP assigned to defense');
    pilotNote(0x9f, '8-bit',  'AP assigned to accuracy');
    pilotNote(0xa0, '8-bit',  'AP assigned to evasion');
    pilotNote(0xae, '8-bit',  'Affiliation\\r\\n0x00 = Not in party\\r\\n0x01 = In party\\r\\n0x02 = Not eligible for recruitment on current route');
    pilotNote(0xaf, '8-bit',  'Equipped battle skill - slot 1\\r\\n(see 0x000002 for list of values)');
    pilotNote(0xb0, '8-bit',  'Equipped battle skill - slot 2\\r\\n(see 0x000002 for list of values)');
    pilotNote(0xb1, '8-bit',  'Equipped battle skill - slot 3\\r\\n(see 0x000002 for list of values)');
    pilotNote(0xb2, '8-bit',  'Equipped battle skill - slot 4\\r\\n(see 0x000002 for list of values)');
    pilotNote(0xb3, '8-bit',  'Equipped battle skill - slot 5\\r\\n(see 0x000002 for list of values)');
    pilotNote(0xb4, '8-bit',  'Equipped battle skill - slot 6\\r\\n(see 0x000002 for list of values)');
    pilotNote(0xc0, '8-bit',  'Surrendering status\\r\\n>= 0x20 = surrendering');
    pilotNote(0xc1, '8-bit',  'Stun status\\r\\n>= 0x20 = stunned\\r\\nWhile stunned, ticks down by 0x20 at the start of each turn');
    pilotNote(0xc2, '8-bit',  'Confuse status\\r\\n>= 0x20 = confused\\r\\nWhile confused, ticks down by 0x20 at the start of each turn');
    
    pilotNote(0xd0, '96 bytes, 8-bit values', 'Number of each battle skill available\\r\\nIndexed by (battle skill ID - 1) (see 0x000002 for list of values)\\r\\n0x00 = Unlearned\\r\\n0x01 = No stock available\\r\\n>= 0x02 = Available stock + 1');

    pilotNote(0x130, 'ASCII, 17 bytes', 'First name');
    pilotNote(0x141, 'ASCII, 17 bytes', 'Last name');
    pilotNote(0x152, 'ASCII, 17 bytes', 'First name (variant)');
    pilotNote(0x163, 'ASCII, 17 bytes', 'First name (variant)')
  });
}

function renderWanzerNotes() {
  const ids: PilotID[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  
  ids.forEach((id) => {
    const pilotName = pilotData.find(({id: pilotID}) => pilotID === id)!.name;
    const wanzerNote = (offset: number, size: string, text: string) => console.log(
      codeNote(
        WANZER.base_addr + WANZER.data_size * id + offset,
        `[${size}]` + ` Wanzer data - ${pilotName} - ` + text
      )
    );

    wanzerNote(0x007, '8-bit', 'Machine colour');
    wanzerNote(0x009, 'ASCII, 17 bytes', 'Machine name');
    
    wanzerNote(0x038, '32-bit', 'Pointer to body data');
    wanzerNote(0x03c, '32-bit', 'Pointer to legs data');
    wanzerNote(0x040, '32-bit', 'Pointer to left arm data');
    wanzerNote(0x044, '32-bit', 'Pointer to right arm data');
    wanzerNote(0x048, '32-bit', 'Pointer to left hand weapon data');
    wanzerNote(0x04C, '32-bit', 'Pointer to left shoulder weapon data');
    wanzerNote(0x050, '32-bit', 'Pointer to right hand weapon data');
    wanzerNote(0x054, '32-bit', 'Pointer to right shoulder weapon data');
    wanzerNote(0x058, '32-bit', 'Pointer to backpack data');
    
    wanzerNote(0x064, '48 bytes', 'Body data');
    // wanzerNote(0x064 + 0x02, '16-bit', 'Body - Part appearance');
    // wanzerNote(0x064 + 0x04, '16-bit', 'Body - Part name\\r\\nIndexes string table at 0x0d0620');
    // wanzerNote(0x064 + 0x06,  '8-bit', 'Body - Part type\\r\\n(See 0x000004 for list of values');
    // wanzerNote(0x064 + 0x08, '16-bit', 'Body - Weight');
    // wanzerNote(0x064 + 0x10,  '8-bit', 'Body - Def-C upgrade level');
    // wanzerNote(0x064 + 0x11,  '8-bit', 'Body - HP-C upgrade level');
    // wanzerNote(0x064 + 0x14, '16-bit', 'Body - Max Def-C');
    // wanzerNote(0x064 + 0x16, '16-bit', 'Body - Max HP multiplier');
    // wanzerNote(0x064 + 0x18, '16-bit', 'Body - Spark table index for battle skills learned from this part');
    // wanzerNote(0x064 + 0x22, '16-bit', 'Body - Current HP');
    // wanzerNote(0x064 + 0x24, '16-bit', 'Body - Max HP');
    // wanzerNote(0x064 + 0x2C, '16-bit', 'Body - Power');
    // wanzerNote(0x064 + 0x2E,  '8-bit', 'Body - Def-C damage class\\r\\n| ..... 0x01 = Penetrating\\r\\n| ..... 0x02 = Impact\\r\\n| ..... 0x04 = Flame');
    
    wanzerNote(0x094, '48 bytes', 'Legs data');
    // wanzerNote(0x064 + 0x02, '16-bit', 'Legs - Part appearance');
    // wanzerNote(0x064 + 0x04, '16-bit', 'Legs - Part name\\r\\nIndexes string table at 0x0d0620');
    // wanzerNote(0x064 + 0x06,  '8-bit', 'Legs - Part type\\r\\n(See 0x000004 for list of values');
    // wanzerNote(0x064 + 0x08, '16-bit', 'Legs - Weight');
    // Wher is max Bst upgrade level?
    // wanzerNote(0x064 + 0x10,  '8-bit', 'Legs - Eva upgrade level');
    // wanzerNote(0x064 + 0x11,  '8-bit', 'Legs - HP upgrade level');
    // wanzerNote(0x064 + 0x13,  '8-bit', 'Legs - Bst upgrade level');
    // wanzerNote(0x064 + 0x14, '16-bit', 'Legs - Max Eva');
    // wanzerNote(0x064 + 0x16, '16-bit', 'Legs - Max Eva');
    // wanzerNote(0x064 + 0x18, '16-bit', 'Legs - Spark table index for battle skills learned from this part');
    // wanzerNote(0x064 + 0x22, '16-bit', 'Legs - Current HP');
    // wanzerNote(0x064 + 0x24, '16-bit', 'Legs - Max HP');
    // wanzerNote(0x064 + 0x2C, '16-bit', 'Legs - Power');
    // wanzerNote(0x064 + 0x2E,  '8-bit', 'Legs - Def-C damage class\\r\\n| ..... 0x01 = Penetrating\\r\\n| ..... 0x02 = Impact\\r\\n| ..... 0x04 = Flame');
    
    wanzerNote(0x0C4, '48 bytes', 'Left arm data');
    
    wanzerNote(0x0F4, '48 bytes', 'Right arm data');
    
    wanzerNote(0x124, '44 bytes', 'Left hand weapon data');
    
    wanzerNote(0x150, '44 bytes', 'Left shoulder weapon data');
    
    wanzerNote(0x17c, '44 bytes', 'Right hand weapon data');
    
    wanzerNote(0x1a8, '44 bytes', 'Right shoulder weapon data');
    
    wanzerNote(0x1d4, '20 bytes', 'Backpack data');

    wanzerNote(0x25c, '8 bytes, 8-bit values', 'Backpack items')
  });
}

// renderPilotNotes();
renderWanzerNotes();
