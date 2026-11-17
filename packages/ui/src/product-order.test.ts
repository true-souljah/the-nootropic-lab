import { describe, expect, it } from 'vitest';
import { productsByScore } from './templates/productOrder';
describe('productsByScore', () => {
  it('orders descending', () => expect(productsByScore([{ score: 1 }, { score: 3 }]).map(x => x.score)).toEqual([3, 1]));
  it('preserves ties', () => expect(productsByScore([{ score: 2, id: 'a' }, { score: 2, id: 'b' }]).map(x => x.id)).toEqual(['a', 'b']));
  it('does not mutate input', () => { const items = [{ score: 1 }, { score: 2 }]; productsByScore(items); expect(items.map(x => x.score)).toEqual([1, 2]); });
});
