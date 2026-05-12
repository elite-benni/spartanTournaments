import { defineEventHandler, getQuery } from 'h3';
import { db, competitors, pairings, gamePoints } from '../../../db';
import { calcAllMatchPoints, CalcCompetitor, CalcGroup } from 'calc-tournament';

export default defineEventHandler(async (event) => {
  const { competitorId } = getQuery(event);
  return getGroups(competitorId ? Number(competitorId) : 0);
});

export async function getGroups(competitorFilter: number): Promise<CalcGroup[]> {
  const [allComps, allPairings, allGps] = await Promise.all([
    db.select().from(competitors),
    db.select().from(pairings),
    db.select().from(gamePoints),
  ]);

  const calcComps: CalcCompetitor[] = allComps.map((c) => ({
    id: c.id,
    name: c.name,
    drawNumber: c.drawNumber ?? 0,
    groupID: c.groupID ?? 0,
    createdAt: c.createdAt,
    diff: 0,
  }));

  calcAllMatchPoints(calcComps, allGps, allPairings);

  let filteredGroupId = 0;
  if (competitorFilter > 0) {
    filteredGroupId = allComps.find((c) => c.id === competitorFilter)?.groupID ?? 0;
  }

  const groupMap = new Map<number, CalcCompetitor[]>();
  for (const c of calcComps) {
    const groupId = c.groupID ?? 0;
    if (groupId === 0) continue; // Skip unassigned
    if (filteredGroupId > 0 && groupId !== filteredGroupId) continue;
    const group = groupMap.get(groupId) ?? [];
    group.push(c);
    groupMap.set(groupId, group);
  }

  return [...groupMap.entries()]
    .sort(([a], [b]) => a - b)
    .map(([id, comps]) => ({
      id,
      competitors: comps,
    }));
}
