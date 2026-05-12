import { CalcCompetitor, CalcGroup } from '../models/models';

export function calcGroups(competitors: CalcCompetitor[], groupCount: number): CalcGroup[] {
  if (groupCount > competitors.length / 2) {
    throw new Error('too many groups for this count of competitors!');
  }
  const groups: CalcGroup[] = [];
  for (let i = 0; i < groupCount; i++) {
    groups.push({ id: i + 1, competitors: [] });
  }
  competitors.sort((a, b) => (a.drawNumber ?? 0) - (b.drawNumber ?? 0));
  for (const competitor of competitors) {
    let groupIndex = 0;
    let minCompetitors = groups[0].competitors.length;
    for (let i = 1; i < groups.length; i++) {
      if (groups[i].competitors.length < minCompetitors) {
        minCompetitors = groups[i].competitors.length;
        groupIndex = i;
      }
    }
    groups[groupIndex].competitors.push(competitor);
  }
  return groups;
}
