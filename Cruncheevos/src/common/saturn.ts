export const SATURN_ADDRESS_SPACE = {
  min: 0x000000,
  max: 0x1fffff,
};

export function swizzle8BitAccessor(base: number, offset: number = 0): number {
  const n = (base + offset) % 2 === 0 ? offset + 1 : offset - 1;
  return base + n;
}

if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;

  test('Swizzled 8-bit array accessors have the correct order', () => {
    const offsets  = [0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07];
    const swizzled = [0x01, 0x00, 0x03, 0x02, 0x05, 0x04, 0x07, 0x06];

    const swizzledOffsets = offsets.map(n => swizzle8BitAccessor(0, n));
    expect(swizzledOffsets).toEqual(swizzled);
  });

  test('Swizzled 8-bit array accessors have the correct offset', () => {
    expect(swizzle8BitAccessor(0x1f0000)).toBe(0x1f0001);
  })
}
