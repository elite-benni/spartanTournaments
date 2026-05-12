export interface CalcCompetitor {
  id: number;
  name: string;
  drawNumber: number;
  groupID: number;
  diff: number;
  matchPoints?: number;
  gamePoints?: number;
  finalPosition?: number;
  groupRanking?: number;
  pairingHistory?: CompetitorPairingHistory[];
  createdAt: Date;
}
export interface CalcTournamentDetails {
  id: number;
  name: string;
  numberOfParallelGames: number;
  minutesPerGame: number;
  minutesAvailForGroupsPhase: number;
  finalistCount: number;
  tournamentStartTime: Date;
  finalsStartTime: Date;
  adminPassword: string;
  refereePassword: string;
  createdAt: Date;
}
export interface CalcPairing {
  id: number;
  gamenumber: number;
  competitor1ID: number;
  competitor2ID: number;
  round: number;
  groupID: number;
  startTime: Date;
  court: number;
}
export interface CalcGroup {
  id: number;
  competitors: CalcCompetitor[];
}

export interface CalcGamePoint {
  id: number;
  competitor1Points: number;
  competitor2Points: number;
  pairingID: number;
  createdAt: Date;
}

export interface CalcedMatchPoints extends CalcGamePoint {
  competitor1MatchPoints: number;
  competitor2MatchPoints: number;
}

export interface CompetitorPairingHistory {
  opponentID: number;
  gamePoints: number;
  opponentGamePoints: number;
  matchPoints: number;
  diff: number;
}
