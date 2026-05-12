import { CalcGamePoint, CalcedMatchPoints } from '../models/models';

export function calcMatchPoints(gamepoint: CalcGamePoint): CalcedMatchPoints {
  if (gamepoint.competitor1Points > gamepoint.competitor2Points) {
    return { ...gamepoint, competitor1MatchPoints: 2, competitor2MatchPoints: 0 };
  }
  if (gamepoint.competitor1Points < gamepoint.competitor2Points) {
    return { ...gamepoint, competitor1MatchPoints: 0, competitor2MatchPoints: 2 };
  }
  return { ...gamepoint, competitor1MatchPoints: 1, competitor2MatchPoints: 1 };
}
