import { codeNote } from '../../common/notes.js';
import { swizzle8BitAccessor } from '../../common/saturn.js';

import { ADDR, stageData } from './data.js';

// ---------------------------------------------------------------------------------------------------

function renderLocalHiddenObjectNotes() {
  const longest_stage_name = stageData.reduce(
    (acc, {name}) => (name.length > acc) ? name.length : acc,
    0
  );
  const padding_width = longest_stage_name;

  const hiddenObject = (stageID: number, n: number) => stageData.filter(
    ({id}) => id === stageID
  )[0].hiddenObjectNames[n];

  for (let n = 0; n < 20; n++) {
    const address = ADDR.local_hidden_objects(0).value + n;
    const buf: string[] = new Array();

    // Preamble
    if (n === 0) {
      buf.push(
        '[20 bytes, 8-bit values] Flags for hidden items/cities/temples on current map',
        '0x00 = Hidden, 0x01 = Found',
        '',
      );
    }
    buf.push(
      '[8-bit] Flags for hidden objects on current map',
      '0x00 = Hidden, 0x01 = Found',
      ''
    );

    // Table header
    buf.push(`..ID | ${'Stage '.padEnd(padding_width, '.')} | Hidden object`);
    buf.push(`-----+${  ''.padEnd(padding_width + 2, '-')  }+----------------------------`);
    
    // Table body
    stageData.forEach(({id, name, hiddenObjectTypes}) => {
      if (hiddenObjectTypes[n] !== '') {
        buf.push(`0x${id.toString(16).padStart(2, '0')} | ${name.padEnd(padding_width, '.')} | ${hiddenObject(id, n)}`);
      }
    });

    console.log(
      codeNote(address, buf.join("\\r\\n"))
    );
  }
}

function renderLocalCityLiberationNotes() {
  const longest_stage_name = stageData.reduce(
    (acc, {name}) => (name.length > acc) ? name.length : acc,
    0
  );
  const padding_width = longest_stage_name;

  const data: {id: number, name: string, citiesData: boolean[]}[] = stageData.map(
    ({id, name, cities}) => {
      const citiesData = new Array(20).fill(false);
      for (let n = 0; n < cities; n++) {
        const offset = swizzle8BitAccessor(2, n);
        citiesData[offset] = true;
      }

      return {id, name, citiesData};
    }
  );

  for (let n = 2; n < 20; n++) {
    const address = ADDR.local_cities_liberated(0).value + n;
    const buf: string[] = new Array();

    // Preamble
    buf.push(
      '[8-bit] Liberation state of cities on current map',
      '0x00 = Liberated, 0x01 = Unliberated',
      '',
      'The table below indicates which maps have a city with a flag at this address',
      '',
    );

    // Table header
    buf.push(`..ID | ${'Stage'.padEnd(padding_width, '.')}`);
    buf.push(`-----+${ ''.padEnd(padding_width + 1, '-') }`);

    // Table body
    data.forEach(({id, name, citiesData}) => {
      if (citiesData[n]) {
        buf.push(`0x${id.toString(16).padStart(2, '0')} | ${name}`);
      }
    });

    console.log(
      codeNote(address, buf.join("\\r\\n"))
    );
  }
}

function renderLocalTempleLiberationNotes() {
  const longest_stage_name = stageData.reduce(
    (acc, {name}) => (name.length > acc) ? name.length : acc,
    0
  );
  const padding_width = longest_stage_name;

  const data: {id: number, name: string, templesData: boolean[]}[] = stageData.map(
    ({id, name, temples}) => {
      const templesData = new Array(20).fill(false);
      for (let n = 0; n < temples; n++) {
        const offset = swizzle8BitAccessor(0, n);
        templesData[offset] = true;
      }

      return {id, name, templesData};
    }
  );

  for (let n = 0; n < 20; n++) {
    const address = ADDR.local_temples_liberated(0).value + n;
    const buf: string[] = new Array();

    // Preamble
    if (n == 0) {
      buf.push(
        '[20 bytes, 8-bit values] Liberation state of Roshfel temples on currently loaded map',
        '0x00 = Liberated, 0x01 = Unliberated',
        '',
      );
    }
    buf.push(
      '[8-bit] Liberation state of Roshfel temples on current map',
      '0x00 = Liberated, 0x01 = Unliberated',
      '',
      'The table below indicates which maps have a temple with a flag at this address',
      '',
    );

    // Table header
    buf.push(`..ID | ${'Stage'.padEnd(padding_width, '.')}`);
    buf.push(`-----+${ ''.padEnd(padding_width + 1, '-') }`);

    // Table body
    data.forEach(({id, name, templesData}) => {
      if (templesData[n]) {
        buf.push(`0x${id.toString(16).padStart(2, '0')} | ${name}`);
      }
    });

    console.log(
      codeNote(address, buf.join("\\r\\n"))
    );
  }
}

function renderGlobalCityLiberationNotes() {
  const buf: string[] = new Array();

  // Preamble
  buf.push(
    '[700 bytes, 8-bit values] Liberation state of all cities',
    '0x00 = Liberated, 0x01 = Enemy controlled',
    '',
    '20 bytes allocated per stage. On transition from world map to stage map, 20 bytes of flags from an offset derived according to stage ID are copied into 0x1e1210, on transition from stage map to world map those 20 bytes of flags are copied back from 0x1e1210 to the appropriate offset in this array.',
    '',
  );

  // Indices
  stageData.forEach(({id, name, cities}) => {
    const stageBuf: string[] = new Array();
    for (let n = 0; n < cities; n++) {
      const offset = swizzle8BitAccessor(id * 20, n + 2);
      stageBuf.push(`[${offset}] = ${name}`);
    }
    stageBuf.sort();
    buf.push(...stageBuf);

  });
  console.log(
    codeNote(ADDR.global_cities_liberated(0, 0).value, buf.join("\\r\\n"))
  );
}

function renderGlobalTempleLiberationNotes() {
  const buf: string[] = new Array();

  // Preamble
  buf.push(
    '[700 bytes, 8-bit values] Liberation state of all Roshfel temples',
    '0x00 = Liberated, 0x01 = Enemy controlled',
    '',
    '20 bytes allocated per stage. On transition from world map to stage map, 20 bytes of flags from an offset derived according to stage ID are copied into 0x1f8744, on transition from stage map to world map those 20 bytes of flags are copied back from 0x1f8744 to the appropriate offset in this array.',
    '',
  );

  // Indices
  stageData.forEach(({id, name, temples}) => {
    const stageBuf: string[] = new Array();
    for (let n = 0; n < temples; n++) {
      const offset = swizzle8BitAccessor(id * 20, n);
      stageBuf.push(`[${offset}] = ${name}`);
    }
    stageBuf.sort();
    buf.push(...stageBuf);

  });
  console.log(
    codeNote(ADDR.global_temples_liberated(0, 0).value, buf.join("\\r\\n"))
  );
}

export function renderNotes() {
  const notes_mapping: {addr: number, f: () => void}[] = [
    { addr: ADDR.local_hidden_objects(0).value,        f: renderLocalHiddenObjectNotes      },
    { addr: ADDR.local_cities_liberated(0).value,      f: renderLocalCityLiberationNotes    },
    { addr: ADDR.local_temples_liberated(0).value,     f: renderLocalTempleLiberationNotes  },
    { addr: ADDR.global_cities_liberated(0, 0).value,  f: renderGlobalCityLiberationNotes   },
    { addr: ADDR.global_temples_liberated(0, 0).value, f: renderGlobalTempleLiberationNotes },
  ].sort((a, b) => a.addr - b.addr);

  notes_mapping.forEach(({f}) => f())
}

renderNotes();
