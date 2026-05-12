import { Component, inject, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { injectLoad } from '@analogjs/router';
import { CommonModule } from '@angular/common';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { toSignal } from '@angular/core/rxjs-interop';
import { lastValueFrom } from 'rxjs';

export const load = () => {
  return lastValueFrom(inject(HttpClient).get<any[]>('/api/pairings'));
};

@Component({
  selector: 'app-gameplan',
  standalone: true,
  imports: [CommonModule, ...HlmTableImports],
  template: `
    <div class="space-y-8">
      <header>
        <h1 class="text-4xl font-bold tracking-tight">Spielplan</h1>
        <p class="text-muted-foreground mt-2">Alle Spiele der Gruppenphase und der Finalrunde.</p>
      </header>

      @if (groups().length > 0) {
        <section class="space-y-6">
          <h2 class="text-2xl font-bold border-b pb-2">Gruppenphase</h2>
          
          <div class="grid gap-8">
            @for (group of groups(); track group.id) {
              <div class="space-y-4">
                <h3 class="text-xl font-semibold px-2">Gruppe {{ group.id }}</h3>
                <div hlmTableContainer class="border rounded-lg overflow-hidden">
                  <table hlmTable>
                    <thead hlmTHead>
                      <tr hlmTr>
                        <th hlmTh class="w-20">Nr.</th>
                        <th hlmTh class="w-32">Zeit</th>
                        <th hlmTh class="w-24 text-center">Court</th>
                        <th hlmTh>Begegnung</th>
                      </tr>
                    </thead>
                    <tbody hlmTBody>
                      @for (p of group.pairings; track p.id) {
                        <tr hlmTr>
                          <td hlmTd class="w-20 text-muted-foreground font-mono">{{ p.gamenumber }}</td>
                          <td hlmTd class="w-32 font-medium">{{ p.startTime | date:'HH:mm' }} Uhr</td>
                          <td hlmTd class="w-24 text-center">{{ p.court }}</td>
                          <td hlmTd>
                            <div class="flex items-center gap-4">
                              <span class="flex-1 text-right">{{ p.competitor1.name }}</span>
                              <span class="text-muted-foreground/50 text-xs font-bold">VS</span>
                              <span class="flex-1">{{ p.competitor2.name }}</span>
                            </div>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            }
          </div>
        </section>
      }

      @if (finals().length > 0) {
        <section class="space-y-6">
          <h2 class="text-2xl font-bold border-b pb-2">Finalrunde</h2>
          
          <div class="grid gap-8">
            @for (phase of finals(); track phase.id) {
              <div class="space-y-4">
                <h3 class="text-xl font-semibold px-2">{{ getPhaseName(phase.id) }}</h3>
                <div hlmTableContainer class="border rounded-lg overflow-hidden">
                  <table hlmTable>
                    <thead hlmTHead>
                      <tr hlmTr>
                        <th hlmTh class="w-20">Nr.</th>
                        <th hlmTh class="w-32">Zeit</th>
                        <th hlmTh class="w-24 text-center">Court</th>
                        <th hlmTh>Begegnung</th>
                      </tr>
                    </thead>
                    <tbody hlmTBody>
                      @for (p of phase.pairings; track p.id) {
                        <tr hlmTr>
                          <td hlmTd class="w-20 text-muted-foreground font-mono">{{ p.gamenumber }}</td>
                          <td hlmTd class="w-32 font-medium">{{ p.startTime | date:'HH:mm' }} Uhr</td>
                          <td hlmTd class="w-24 text-center">{{ p.court }}</td>
                          <td hlmTd>
                            <div class="flex items-center gap-4">
                              <span class="flex-1 text-right">{{ p.competitor1.name }}</span>
                              <span class="text-muted-foreground/50 text-xs font-bold">VS</span>
                              <span class="flex-1">{{ p.competitor2.name }}</span>
                            </div>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            }
          </div>
        </section>
      }

      @if (pairings().length === 0) {
        <div class="py-24 text-center border-2 border-dashed rounded-xl">
          <p class="text-muted-foreground text-lg">Der Spielplan wurde noch nicht generiert.</p>
        </div>
      }
    </div>
  `,
})
export default class GameplanPage {
  pairings = toSignal(injectLoad<typeof load>(), { initialValue: [] });

  groups = computed(() => {
    const p = this.pairings() ?? [];
    const groupMap = new Map<number, any[]>();
    p.filter(x => x.groupID > 0).forEach(x => {
      if (!groupMap.has(x.groupID)) groupMap.set(x.groupID, []);
      groupMap.get(x.groupID)!.push(x);
    });
    return Array.from(groupMap.entries())
      .map(([id, pairings]) => ({ id, pairings }))
      .sort((a, b) => a.id - b.id);
  });

  finals = computed(() => {
    const p = this.pairings() ?? [];
    const finalMap = new Map<number, any[]>();
    p.filter(x => x.groupID < 0).forEach(x => {
      if (!finalMap.has(x.groupID)) finalMap.set(x.groupID, []);
      finalMap.get(x.groupID)!.push(x);
    });
    return Array.from(finalMap.entries())
      .map(([id, pairings]) => ({ id, pairings }))
      .sort((a, b) => b.id - a.id); // Sort by negative value: -8, -4, -2, -1
  });

  getPhaseName(id: number): string {
    switch (id) {
      case -1: return 'Finale';
      case -2: return 'Halbfinale';
      case -4: return 'Viertelfinale';
      case -8: return 'Achtelfinale';
      default: return 'KO-Runde';
    }
  }
}
