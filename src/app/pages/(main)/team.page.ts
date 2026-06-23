import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { injectLoad } from '@analogjs/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { HlmInput } from '@spartan-ng/helm/input';
import type { load } from './team.server';
import { MyTeamService, type MyTeam } from '../../shared/my-team.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-team-picker',
  imports: [HlmInput],
  template: `
    <div class="max-w-2xl mx-auto space-y-6">
      <header>
        <h1 class="text-4xl font-bold tracking-tight">Mein Team</h1>
        <p class="text-muted-foreground mt-2">
          Wähle dein Team aus — es wird gemerkt, damit du es jederzeit schnell aufrufen kannst.
        </p>
      </header>

      @if (current(); as t) {
        <div class="flex items-center justify-between gap-3 rounded-xl border bg-primary/5 px-4 py-3">
          <div class="min-w-0">
            <div class="text-xs font-semibold uppercase tracking-wider text-primary">Aktuell gemerkt</div>
            <div class="truncate font-bold">{{ t.name }}</div>
          </div>
          <button
            type="button"
            (click)="clear()"
            class="shrink-0 text-sm font-medium text-muted-foreground hover:text-destructive transition-colors"
          >
            Entfernen
          </button>
        </div>
      }

      <input
        hlmInput
        type="search"
        [value]="query()"
        (input)="query.set($any($event.target).value)"
        placeholder="Team suchen…"
        class="w-full"
        autocomplete="off"
      />

      <div class="border rounded-lg overflow-hidden shadow-sm divide-y">
        @for (team of filtered(); track team.id) {
          <button
            type="button"
            (click)="choose(team)"
            class="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-accent transition-colors"
            [class.bg-primary/10]="isMyTeam(team.id)"
          >
            <span class="min-w-0 break-words font-medium">{{ team.name }}</span>
            @if (isMyTeam(team.id)) {
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 shrink-0 text-primary"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M11.48 3.5a.56.56 0 011.04 0l2.12 4.92 5.34.46c.49.04.69.66.31.99l-4.05 3.51 1.21 5.22c.11.48-.41.86-.83.6L12 16.9l-4.62 2.8c-.42.26-.94-.12-.83-.6l1.21-5.22-4.05-3.51c-.38-.33-.18-.95.31-.99l5.34-.46L11.48 3.5z"
                />
              </svg>
            }
          </button>
        } @empty {
          <div class="px-4 py-12 text-center text-muted-foreground italic">
            @if (teams().length === 0) {
              Es sind noch keine Teams angelegt.
            } @else {
              Kein Team gefunden.
            }
          </div>
        }
      </div>
    </div>
  `,
})
export default class TeamPickerPage {
  private router = inject(Router);
  private myTeam = inject(MyTeamService);

  private data = toSignal(injectLoad<typeof load>());
  protected teams = computed(() => this.data()?.teams ?? []);

  protected query = signal('');
  protected current = this.myTeam.team;

  protected filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const teams = this.teams();
    return q ? teams.filter((t) => t.name.toLowerCase().includes(q)) : teams;
  });

  protected isMyTeam(id: number) {
    return this.myTeam.isMyTeam(id);
  }

  // Picking a team both stores it and opens its profile — the natural flow.
  protected choose(team: MyTeam) {
    this.myTeam.set(team);
    this.router.navigate(['/competitor', team.id]);
  }

  protected clear() {
    this.myTeam.clear();
  }
}
