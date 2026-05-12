import { CalcCompetitor } from '../models/models';

export const sortCompetitorsRanking = (a: CalcCompetitor, b: CalcCompetitor) => {
  if (a.groupRanking && b.groupRanking) {
    const rankingDiff = a.groupRanking - b.groupRanking;
    if (rankingDiff !== 0) {
      return rankingDiff;
    }
  }
  const matchpoints = (a.matchPoints ?? 0) - (b.matchPoints ?? 0);
  if (matchpoints !== 0) {
    return -matchpoints;
  }
  const gamepoints = (a.gamePoints ?? 0) - (b.gamePoints ?? 0);
  if (gamepoints !== 0) {
    return -gamepoints;
  }
  const diff = (a.diff ?? 0) - (b.diff ?? 0);
  if (diff !== 0) {
    return -diff;
  }
  const pairingInfo = a.pairingHistory?.filter((pairing) => pairing.opponentID === b.id);
  if (pairingInfo) {
    let gp = 0;
    for (const pairing of pairingInfo) {
      gp += pairing.gamePoints - pairing.opponentGamePoints;
    }
    if (gp !== 0) {
      return -gp;
    }
  }
  return 0;
};
