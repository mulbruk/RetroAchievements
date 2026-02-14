import { Condition } from "@cruncheevos/core";
import { match } from "ts-pattern";

export function bit0(addr: number): Condition.Value {
  return { type: 'Mem', size: 'Bit0', value: addr }
}

export function bit1(addr: number): Condition.Value {
  return { type: 'Mem', size: 'Bit1', value: addr }
}

export function bit2(addr: number): Condition.Value {
  return { type: 'Mem', size: 'Bit2', value: addr }
}

export function bit3(addr: number): Condition.Value {
  return { type: 'Mem', size: 'Bit3', value: addr }
}

export function bit4(addr: number): Condition.Value {
  return { type: 'Mem', size: 'Bit4', value: addr }
}

export function bit5(addr: number): Condition.Value {
  return { type: 'Mem', size: 'Bit5', value: addr }
}

export function bit6(addr: number): Condition.Value {
  return { type: 'Mem', size: 'Bit6', value: addr }
}

export function bit7(addr: number): Condition.Value {
  return { type: 'Mem', size: 'Bit7', value: addr }
}

export function lower4(addr: number): Condition.Value {
  return { type: 'Mem', size: 'Lower4', value: addr }
}

export function upper4(addr: number): Condition.Value {
  return { type: 'Mem', size: 'Upper4', value: addr }
}

export function byte(addr: number): Condition.Value {
  return { type: 'Mem', size: '8bit', value: addr }
}

export function word(addr: number): Condition.Value {
  return { type: 'Mem', size: '16bit', value: addr }
}

export function tbyte(addr: number): Condition.Value {
  return { type: 'Mem', size: '24bit', value: addr }
}

export function dword(addr: number): Condition.Value {
  return { type: 'Mem', size: '32bit', value: addr }
}

export function word_be(addr: number): Condition.Value {
  return { type: 'Mem', size: '16bitBE', value: addr }
}

export function tbyte_be(addr: number): Condition.Value {
  return { type: 'Mem', size: '24bitBE', value: addr }
}

export function dword_be(addr: number): Condition.Value {
  return { type: 'Mem', size: '32bitBE', value: addr }
}

export function bitcount(addr: number): Condition.Value {
  return { type: 'Mem', size: 'BitCount', value: addr }
}

export function float(addr: number): Condition.Value {
  return { type: 'Mem', size: 'Float', value: addr }
}

export function float_be(addr: number): Condition.Value {
  return { type: 'Mem', size: 'FloatBE', value: addr }
}

export function mbf32(addr: number): Condition.Value {
  return { type: 'Mem', size: 'MBF32', value: addr }
}

export function mbf32_le(addr: number): Condition.Value {
  return { type: 'Mem', size: 'MBF32LE', value: addr }
}

export function double32(addr: number): Condition.Value {
  return { type: 'Mem', size: 'Double32', value: addr }
}

export function double32_be(addr: number): Condition.Value {
  return { type: 'Mem', size: 'Double32BE', value: addr }
}

// -------------------------------------------------------------

export function constant(val: number): Condition.Value {
  return { type: 'Value', size: '', value: val };
}

export function FLOAT(val: number): Condition.Value {
  return { type: 'Float', size: '', value: val} ;
}

export function bit(n: number): ((addr: number) => Condition.Value) {
  return (addr: number) => {
    return match(n)
      .with(0, () => bit0(addr))
      .with(1, () => bit1(addr))
      .with(2, () => bit2(addr))
      .with(3, () => bit3(addr))
      .with(4, () => bit4(addr))
      .with(5, () => bit5(addr))
      .with(6, () => bit6(addr))
      .with(7, () => bit7(addr))
      .otherwise(() => { throw new Error(`Invalid bit number ${n}`); });
  }
}
