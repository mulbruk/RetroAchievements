export function range(start: number, stop: number, step: number = 1): number[] {
  return [...(new Array(stop - start)).keys()].map((n) => start + n * step);
}

export function commaSeparatedList(ls: string[]): string {
  return ls.slice(0, -1).join(', ') + ', and ' + ls.slice(-1);
}

export function identity<T>(x: T): T {
  return x;
}
