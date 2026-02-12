import { codeNote } from "../../common/notes.js";

import { fieldData, roomData, potData } from "./data.js";

function generateScreenIDs() {
  fieldData.forEach(({field, fieldName}) => {
    console.log(`-- 0x${field.toString(16).padStart(2, '0')}: ${fieldName} --`);
    const rooms = roomData.filter(r => r.field === field);
    rooms.forEach(({room, screen, name}) => {
      const screenID = room * 0x100 + screen;
      console.log(`0x${screenID.toString(16).padStart(4, '0')} = ${name}`);
    });
    console.log(``);
  });
}

function generatePotFlags() {
  const baseAddress = 0x374b88;
  const formatContents = (id: number, qty: number) => {
    switch (id) {
      case 0x01: return `Coins x ${qty}`;
      case 0x02: return `Weight`;
      case 0x03: return `Shuriken Ammo x ${qty}`;
      case 0x04: return `Rolling Shuriken Ammo x ${qty}`;
      case 0x05: return `Earth Spear Ammo x ${qty}`;
      case 0x06: return `Flare Gun Ammo x ${qty}`;
      case 0x07: return `Bomb Ammo x ${qty}`;
      case 0x08: return `Chakram Ammo x ${qty}`;
      case 0x09: return `Caltrop Ammo x ${qty}`;
      default: return `Empty`;
    }
  };

  const results = new Map<number, string[]>();
  const update = (map: Map<number, string[]>, key: number, value: string) => {
    if (!map.has(key)) {
      map.set(key, [value]);
    } else {
      map.get(key)!.push(value);
    }
  };

  const flaggedPots = potData.filter(p => p.parameters[2] !== -1);

  flaggedPots.map(pot => {
    const flagNum = pot.parameters[2];
    const flagBit = Math.log2(pot.parameters[3]);
    
    const field = fieldData.find(f => f.field === pot.field)?.fieldName;
    const mapReference = roomData.find(r => r.field === pot.field && r.room === pot.room && r.screen === pot.screen)?.mapReference;

    update(results, flagNum, `Bit${flagBit} = ${field} ${mapReference} - ${formatContents(pot.parameters[0], pot.parameters[1])}`);
  });

  const notes: string[] = [];
  results.forEach((r, key) => {
    notes.push(
      codeNote(baseAddress + key, `[8-bit] Flag ${key} - Item pots:\\r\\n${ r.sort().join("\\r\\n") }`)
    );
  });

  notes.sort().forEach(n => console.log(n));
}

// generateScreenIDs();
generatePotFlags();
