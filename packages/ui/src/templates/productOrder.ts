export function productsByScore<T extends { score: number }>(products: readonly T[]): T[] {
  return [...products].sort((a, b) => b.score - a.score);
}
