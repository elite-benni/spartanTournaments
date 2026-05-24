import { describe, it, expect } from 'vitest';
import { calcFinalistPositions } from './calc-finals-ranking-positions';

describe('calcFinalistPositions', () => {
  it('should return correct seeding positions for 2 finalists', () => {
    const result = calcFinalistPositions(2);
    expect(result).toEqual([1, 2]);
  });

  it('should return correct seeding positions for 4 finalists', () => {
    const result = calcFinalistPositions(4);
    expect(result).toEqual([1, 4, 3, 2]);
  });

  it('should return correct seeding positions for 8 finalists', () => {
    const result = calcFinalistPositions(8);
    // Let's verify:
    // Out array after fr=1: [1, 4, 3, 2]
    // fr = 2:
    // halfSlice = 4
    // i = 0: out[4] = out[3] = 2
    // i = 1: out[5] = out[2] = 3
    // i = 2: out[6] = out[1] = 4
    // i = 3: out[7] = out[0] = 1
    // Array: [1, 4, 3, 2, 2, 3, 4, 1]
    // Next loop i from 0 to 7:
    // out[i] = out[i] * 2
    // if odd index (even i+1): nothing
    // if even index (odd i+1): out[i]--
    // i=0: 1*2 - 1 = 1
    // i=1: 4*2 = 8
    // i=2: 3*2 - 1 = 5
    // i=3: 2*2 = 4
    // i=4: 2*2 - 1 = 3
    // i=5: 3*2 = 6
    // i=6: 4*2 - 1 = 7
    // i=7: 1*2 = 2
    // Expected result: [1, 8, 5, 4, 3, 6, 7, 2]
    expect(result).toEqual([1, 8, 5, 4, 3, 6, 7, 2]);
  });
});
