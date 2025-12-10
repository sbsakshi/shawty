
const BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function toBase62(num: number): string {
  if (num === 0) return BASE62[0];
  
  const arr: string[] = [];
  const base = BASE62.length;
  
  while (num > 0) {
    const rem = num % base;
    num = Math.floor(num / base);
    arr.push(BASE62[rem]);
  }
  
  return arr.reverse().join("");
}