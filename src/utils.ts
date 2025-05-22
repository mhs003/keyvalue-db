export function isValidKey(key: string): boolean {
  return /^[a-zA-Z][a-zA-Z0-9_]*$/.test(key);
}
