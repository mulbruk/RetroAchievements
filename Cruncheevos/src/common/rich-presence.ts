import { Condition, ConditionBuilder, RichPresence } from '@cruncheevos/core';

import { match } from 'ts-pattern';

function memorySize(size: Condition.Size): string {
  return match(size)
  .with('Bit0',       () => '0xM')
  .with('Bit1',       () => '0xN')
  .with('Bit2',       () => '0xO')
  .with('Bit3',       () => '0xP')
  .with('Bit4',       () => '0xQ')
  .with('Bit5',       () => '0xR')
  .with('Bit6',       () => '0xS')
  .with('Bit7',       () => '0xT')
  .with('Lower4',     () => '0xL')
  .with('Upper4',     () => '0xU')
  .with('8bit',       () => '0xH')
  .with('16bit',      () => '0x')
  .with('24bit',      () => '0xW')
  .with('32bit',      () => '0xX')
  .with('16bitBE',    () => '0xI')
  .with('24bitBE',    () => '0xJ')
  .with('32bitBE',    () => '0xG')
  .with('BitCount',   () => '0xK')
  .with('Float',      () => 'fF')
  .with('FloatBE',    () => 'fB')
  .with('MBF32',      () => 'fM')
  .with('MBF32LE',    () => 'fL')
  .with('Double32',   () => 'fH')
  .with('Double32BE', () => 'fI')
  .otherwise(() => '0x');
}

export function addrStr(addr: Condition.Value) : string {
  return `${memorySize(addr.size)}${addr.value.toString(16)}`;
}

function atAddress(
  addr: ConditionBuilder | Condition.Value | undefined
): RichPresence.LookupParams['defaultAt'] {
  return addr && !(addr instanceof ConditionBuilder) ? addrStr(addr) : addr;
}

export function richPresenceLookup<T, K extends keyof T, V extends keyof T>(
  name: string,
  data: T[], key: K, val: V,
  opts?: Partial<{
    defaultValue: string,
    defaultAt: Condition.Value | ConditionBuilder
    compressRanges: boolean,
  }>
): RichPresence.LookupParams {
  const lookup: Record<string | number, string> = opts?.defaultValue ? { '*': opts.defaultValue } : {}

  const atAddr = atAddress(opts?.defaultAt);
  
  return {
    name,
    values: data.reduce(
      (acc, datum) => ( {...acc, ...{ [`${datum[key]}`]: `${datum[val]}` }} ),
      lookup
    ),
    defaultAt: atAddr,
    compressRanges: opts?.compressRanges,
  };
}

export function richPresencePluralize(
  name: string,
  singular: string,
  plural: string,
  defaultAt?: Condition.Value | ConditionBuilder
): RichPresence.LookupParams {
  const atAddr = atAddress(defaultAt);

  return {
    name,
    values: {
      1: singular,
      '*': plural,
    },
    defaultAt: atAddr,
    compressRanges: false,
  }
}
