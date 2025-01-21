export function codeNote(address: number, text: string): string {
  const addr = `N0:0x${address.toString(16).padStart(6, '0')}`;
  return `${addr}:"${text}"`;
}
