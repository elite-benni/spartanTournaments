import { Component, ChangeDetectionStrategy, computed } from '@angular/core';
import { injectLoad } from '@analogjs/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { HlmButton } from '@spartan-ng/helm/button';
import type { load } from './index.server';
import { injectLivePairings } from '../../shared/live-pairings';
import { PairingHeaderComponent } from '../../shared/pairing-header.component';

type LoadData = Awaited<ReturnType<typeof load>>;
type ActivePairing = LoadData['active'][number];
type GamePoint = LoadData['gamepoints'][number];

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-home',
  imports: [CommonModule, RouterLink, HlmButton, PairingHeaderComponent],
  template: `
    <div class="space-y-12">
      <header>
        <h1 class="text-4xl font-bold tracking-tight">Aktuelle Spiele</h1>
        <p class="text-muted-foreground mt-2">Die nächsten Begegnungen auf den Bahnen.</p>
      </header>
 
      @if (activePairings().length > 0) {
        <!-- Laufende Spiele -->
        <section class="space-y-4">
          <div class="flex items-center gap-3">
            <span class="relative flex h-3 w-3">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <h2 class="text-2xl font-bold tracking-tight">Laufende Spiele</h2>
          </div>
 
          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            @for (pairing of runningPairings(); track pairing.id) {
              <ng-container [ngTemplateOutlet]="card" [ngTemplateOutletContext]="{ pairing, live: true }" />
            } @empty {
              <div class="col-span-full py-10 text-center border-2 border-dashed rounded-xl">
                <p class="text-muted-foreground">Aktuell läuft kein Spiel.</p>
              </div>
            }
          </div>
        </section>
 
        <!-- Demnächst -->
        <section class="space-y-4">
          <h2 class="text-2xl font-bold tracking-tight text-muted-foreground">Demnächst</h2>
 
          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            @for (pairing of upcomingPairings(); track pairing.id) {
              <ng-container [ngTemplateOutlet]="card" [ngTemplateOutletContext]="{ pairing, live: false }" />
            } @empty {
              <div class="col-span-full py-10 text-center border-2 border-dashed rounded-xl">
                <p class="text-muted-foreground">Keine anstehenden Spiele.</p>
              </div>
            }
          </div>
        </section>
      } @else {
        <!-- Premium welcome dashboard empty state -->
        <div class="glass-panel rounded-3xl p-8 md:p-12 text-center max-w-2xl mx-auto space-y-6 shadow-xl relative overflow-hidden">
          <div class="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute -bottom-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
 
          <div class="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-3xl shadow-inner">
            🏆
          </div>
          
          <div class="space-y-2">
            <h2 class="text-3xl font-extrabold tracking-tight">Willkommen</h2>
            @if (hasPairings()) {
              <p class="text-muted-foreground max-w-md mx-auto">
                Derzeit finden keine aktiven oder anstehenden Spiele statt. Du kannst dir jedoch den vollständigen Spielplan oder die Gruppen ansehen.
              </p>
            } @else {
              <p class="text-muted-foreground max-w-md mx-auto">
                Der Turnier-Spielplan wird in Kürze erstellt. Sobald die Gruppen ausgelost und Spiele angesetzt wurden, siehst du sie hier.
              </p>
            }
          </div>
 
          <div class="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            @if (hasPairings()) {
              <a hlmBtn routerLink="/gameplan" class="px-6 py-2.5 h-11 bg-primary text-primary-foreground rounded-xl shadow-md">
                Zum Spielplan
              </a>
              <a hlmBtn routerLink="/groups" variant="outline" class="px-6 py-2.5 h-11 rounded-xl">
                Gruppen & Tabellen
              </a>
            } @else {
              <a hlmBtn routerLink="/groups" class="px-6 py-2.5 h-11 bg-primary text-primary-foreground rounded-xl shadow-md">
                Gruppen ansehen
              </a>
              <a hlmBtn routerLink="/team" variant="outline" class="px-6 py-2.5 h-11 rounded-xl">
                Mein Team wählen
              </a>
            }
          </div>
        </div>
      }
    </div>
 
    <ng-template #card let-pairing="pairing" let-live="live">
      <div class="glass-panel rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.01]" [class.active-pulse-border]="live">
        <!-- Header band: time (primary accent) + phase left, court in its own panel right -->
        <app-pairing-header [pairing]="pairing" />
 
        <!-- Matchup (with result, if one has been entered) -->
        @let points = pointsFor(pairing.id);
        <div class="relative p-5 space-y-2">
          @if (points) {
            <div class="flex items-baseline justify-between gap-3">
              <span
                class="min-w-0 break-words font-semibold"
                [class.font-bold]="points.competitor1Points > points.competitor2Points"
                [class.text-muted-foreground]="!pairing.competitor1?.id"
                [class.italic]="!pairing.competitor1?.id"
                >{{ pairing.competitor1?.name ?? 'Offen' }}</span
              >
              <span class="font-black text-xl tabular-nums shrink-0">{{ points.competitor1Points }}</span>
            </div>
            <div class="flex items-baseline justify-between gap-3">
              <span
                class="min-w-0 break-words font-semibold"
                [class.font-bold]="points.competitor2Points > points.competitor1Points"
                [class.text-muted-foreground]="!pairing.competitor2?.id"
                [class.italic]="!pairing.competitor2?.id"
                >{{ pairing.competitor2?.name ?? 'Offen' }}</span
              >
              <span class="font-black text-xl tabular-nums shrink-0">{{ points.competitor2Points }}</span>
            </div>
          } @else {
            <div class="text-center space-y-1">
              <div
                class="font-semibold break-words"
                [class.text-muted-foreground]="!pairing.competitor1?.id"
                [class.italic]="!pairing.competitor1?.id"
              >
                {{ pairing.competitor1?.name ?? 'Offen' }}
              </div>
              <div class="text-muted-foreground/50 text-xs font-black italic">VS</div>
              <div
                class="font-semibold break-words"
                [class.text-muted-foreground]="!pairing.competitor2?.id"
                [class.italic]="!pairing.competitor2?.id"
              >
                {{ pairing.competitor2?.name ?? 'Offen' }}
              </div>
            </div>
          }
          <span class="absolute bottom-1.5 right-2 font-mono text-[10px] text-muted-foreground/40"
            >#{{ pairing.gamenumber > 0 ? pairing.gamenumber : '-' }}</span
          >
        </div>
      </div>
    </ng-template>
  `,
})
export default class HomeComponent {
  private ssrData = toSignal(injectLoad<typeof load>());
 
  private activeSsr = computed(() => this.ssrData()?.active ?? []);
  private gamepointsSsr = computed(() => this.ssrData()?.gamepoints ?? []);
  protected hasPairings = computed(() => this.ssrData()?.hasPairings ?? false);
 
  activePairings = injectLivePairings<ActivePairing[]>('/api/pairings/active', this.activeSsr);
  private gamepoints = injectLivePairings<GamePoint[]>('/api/gamepoints', this.gamepointsSsr);
 
  // Result for a pairing, if one has been entered yet (undefined otherwise).
  protected pointsFor(pairingId: number): GamePoint | undefined {
    return this.gamepoints().find((g) => g.pairingID === pairingId);
  }
 
  // A game is "running" once its start time has passed; everything still in the
  // future within the active window is "upcoming".
  protected runningPairings = computed(() => {
    const now = Date.now();
    return this.activePairings().filter((p) => new Date(p.startTime).getTime() <= now);
  });
 
  protected upcomingPairings = computed(() => {
    const now = Date.now();
    return this.activePairings().filter((p) => new Date(p.startTime).getTime() > now);
  });
}
