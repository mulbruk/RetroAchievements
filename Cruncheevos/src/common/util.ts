export function range(start: number, stop: number, step: number = 1): number[] {
  return [...(new Array(stop - start)).keys()].map((n) => start + n * step);
}

export function commaSeparatedList(ls: string[]): string {
  return ls.slice(0, -1).join(', ') + ', and ' + ls.slice(-1);
}

export function identity<T>(x: T): T {
  return x;
}

export function timeToFramesNTSC(
  opts: Partial<{hours: number, minutes: number, seconds: number}>
): number {
  const hh = opts.hours ?? 0;
  const mm = opts.minutes ?? 0;
  const ss = opts.seconds ?? 0;
  
  return ((hh * 60 + mm) * 60 + ss) * 60;
}

export function timeToMilliseconds(
  opts: Partial<{hours: number, minutes: number, seconds: number}>
): number {
  const hh = opts.hours ?? 0;
  const mm = opts.minutes ?? 0;
  const ss = opts.seconds ?? 0;

  return ((hh * 60 + mm) * 60 + ss) * 1000;
}

export function strToDwordBE(s: string): number {
  if (s.length !== 4) {
    throw new Error(`String must be exactly 4 characters long.`);
  }

  return s[0].charCodeAt(0) << 24 |
         s[1].charCodeAt(0) << 16 |
         s[2].charCodeAt(0) << 8  |
         s[3].charCodeAt(0);
}
