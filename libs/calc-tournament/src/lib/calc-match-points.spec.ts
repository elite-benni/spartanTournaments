import { describe, it, expect } from 'vitest';
import { calcMatchPoints } from './calc-match-points';
import { CalcGamePoint } from '../models/models';

describe('calcMatchPoints', () => {
  const baseGamePoint: CalcGamePoint = {
    id: 1,
    pairingID: 10,
    competitor1Points: 0,
    competitor2Points: 0,
    createdAt: new Date(),
  };

  it('should award 2 points to competitor 1 and 0 points to competitor 2 when competitor 1 wins', () => {
    const gp = { ...baseGamePoint, competitor1Points: 5, competitor2Points: 3 };
    const result = calcMatchPoints(gp);
    expect(result.competitor1MatchPoints).toBe(2);
    expect(result.competitor2MatchPoints).toBe(0);
  });

  it('should award 0 points to competitor 1 and 2 points to competitor 2 when competitor 2 wins', () => {
    const gp = { ...baseGamePoint, competitor1Points: 2, competitor2Points: 4 };
    const result = calcMatchPoints(gp);
    expect(result.competitor1MatchPoints).toBe(0);
    expect(result.competitor2MatchPoints).toBe(2);
  });

  it('should award 1 point to both competitors when there is a draw', () => {
    const gp = { ...baseGamePoint, competitor1Points: 3, competitor2Points: 3 };
    const result = calcMatchPoints(gp);
    expect(result.competitor1MatchPoints).toBe(1);
    expect(result.competitor2MatchPoints).toBe(1);
  });
});
