import { Component, computed, inject, resource, PLATFORM_ID, DestroyRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { injectLoad } from '@analogjs/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import type { load } from './gameplan.server';
import { getPhaseName } from '../../shared/phase-name';

type PairingRow = Awaited<ReturnType<typeof load>>[number];

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-gameplan',
  imports: [CommonModule, RouterLink, ...HlmTableImports],
  template: `
    <div class="space-y-8">
      <header>
        <h1 class="text-4xl font-bold tracking-tight">Spielplan</h1>
        <p class="text-muted-foreground mt-2">Vollständiger Zeitplan des Turniers (chronologisch).</p>
      </header>

      <div hlmTableContainer class="border rounded-lg overflow-hidden shadow-sm">
        <table hlmTable>
          <thead hlmTHead>
            <tr hlmTr>
              <th hlmTh class="w-16">Nr.</th>
              <th hlmTh class="w-32 text-center text-primary">Runde</th>
              <th hlmTh class="w-32">Zeit</th>
              <th hlmTh class="w-24 text-center">Court</th>
              <th hlmTh>Begegnung</th>
            </tr>
          </thead>
          <tbody hlmTBody>
            @for (p of pairings(); track p.id) {
              <tr hlmTr [class]="p.groupID < 0 ? 'bg-primary/5' : ''">
                <td hlmTd class="w-16 text-muted-foreground font-mono">{{ p.gamenumber > 0 ? p.gamenumber : '-' }}</td>
                <td hlmTd class="w-32 text-center">
                  <span class="px-2 py-1 rounded text-xs font-bold"
                        [class.bg-secondary]="p.groupID > 0"
                        [class.bg-primary]="p.groupID < 0"
                        [class.text-primary-foreground]="p.groupID < 0">
                    {{ p.groupID > 0 ? 'Gruppe ' + p.groupID : getPhaseName(p.round) }}
                  </span>
                </td>
                <td hlmTd class="w-32 font-medium">{{ p.startTime | date:'HH:mm' }} Uhr</td>
                <td hlmTd class="w-24 text-center">{{ p.court }}</td>
                <td hlmTd>
                  <div class="flex items-center gap-4 text-lg">
                    @if (p.competitor1 && p.competitor1.id && p.competitor1.id > 0) {
                      <a [routerLink]="['/competitor', p.competitor1.id]"
                         class="flex-1 text-right font-semibold hover:underline hover:text-primary transition-colors">
                        {{ p.competitor1.name }}
                      </a>
                    } @else {
                      <span class="flex-1 text-right font-semibold text-muted-foreground italic">Offen</span>
                    }
                    <span class="text-muted-foreground/50 text-xs font-black italic">VS</span>
                    @if (p.competitor2 && p.competitor2.id && p.competitor2.id > 0) {
                      <a [routerLink]="['/competitor', p.competitor2.id]"
                         class="flex-1 font-semibold hover:underline hover:text-primary transition-colors">
                        {{ p.competitor2.name }}
                      </a>
                    } @else {
                      <span class="flex-1 font-semibold text-muted-foreground italic">Offen</span>
                    }
                  </div>
                </td>
              </tr>
            } @empty {
              <tr hlmTr>
                <td hlmTd colspan="5" class="text-center py-24 text-muted-foreground italic">Der Spielplan wurde noch nicht generiert.</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export default class GameplanPage {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private destroyRef = inject(DestroyRef);

  private ssrData = toSignal(injectLoad<typeof load>(), { initialValue: [] as PairingRow[] });

  // Only fetch in the browser: on the server the relative URL has no host, and
  // the SSR render already has its data via injectLoad(). Returning undefined
  // keeps value() empty so the computed falls back to ssrData() during SSR.
  private liveResource = resource({
    loader: () =>
      isPlatformBrowser(this.platformId)
        ? firstValueFrom(this.http.get<PairingRow[]>('/api/pairings'))
        : Promise.resolve(undefined),
  });

  pairings = computed(() => this.liveResource.value() ?? this.ssrData());

  protected getPhaseName = getPhaseName;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const intervalId = setInterval(() => this.liveResource.reload(), 30_000);
      this.destroyRef.onDestroy(() => clearInterval(intervalId));
    }
  }
}
