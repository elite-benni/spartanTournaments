import { Component, inject, computed, effect, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { HlmButton } from '@spartan-ng/helm/button';
import { toSignal } from '@angular/core/rxjs-interop';
import { firstValueFrom, filter, map, startWith } from 'rxjs';
import { ThemeService } from '../shared/theme.service';
import { MyTeamService } from '../shared/my-team.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive, HlmButton],
  template: `
    <nav class="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <div class="flex items-center gap-8">
            <a routerLink="/" class="text-xl font-bold tracking-tight shrink-0 flex items-center gap-2">
              <span aria-hidden="true">🏆</span>{{ tournamentName() }}
            </a>

            <!-- Desktop nav -->
            <div class="hidden md:flex items-center gap-4">
              <a
                routerLink="/"
                routerLinkActive="text-primary"
                [routerLinkActiveOptions]="{ exact: true }"
                class="text-sm font-medium transition-colors hover:text-primary"
                >Home</a
              >
              <button
                type="button"
                (click)="goToMyTeam()"
                class="text-sm font-medium transition-colors hover:text-primary inline-flex items-center gap-1"
                [class.text-primary]="isTeamActive()"
              >
                @if (team()) {
                  <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path
                      d="M11.48 3.5a.56.56 0 011.04 0l2.12 4.92 5.34.46c.49.04.69.66.31.99l-4.05 3.51 1.21 5.22c.11.48-.41.86-.83.6L12 16.9l-4.62 2.8c-.42.26-.94-.12-.83-.6l1.21-5.22-4.05-3.51c-.38-.33-.18-.95.31-.99l5.34-.46L11.48 3.5z"
                    />
                  </svg>
                } @else {
                  <svg
                    class="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M11.48 3.5a.56.56 0 011.04 0l2.12 4.92 5.34.46c.49.04.69.66.31.99l-4.05 3.51 1.21 5.22c.11.48-.41.86-.83.6L12 16.9l-4.62 2.8c-.42.26-.94-.12-.83-.6l1.21-5.22-4.05-3.51c-.38-.33-.18-.95.31-.99l5.34-.46L11.48 3.5z"
                    />
                  </svg>
                }
                Mein Team
              </button>
              <a
                routerLink="/gameplan"
                routerLinkActive="text-primary"
                class="text-sm font-medium transition-colors hover:text-primary"
                >Spielplan</a
              >
              <a
                routerLink="/groups"
                routerLinkActive="text-primary"
                class="text-sm font-medium transition-colors hover:text-primary"
                >Gruppen</a
              >
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              hlmBtn
              variant="ghost"
              size="sm"
              class="px-2"
              [attr.aria-label]="theme.theme() === 'dark' ? 'Heller Modus' : 'Dunkler Modus'"
              (click)="theme.toggle()"
            >
              @if (theme.theme() === 'dark') {
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              } @else {
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              }
            </button>
            @if (role() === 'admin') {
              <a hlmBtn variant="outline" size="sm" routerLink="/admin" class="px-2.5 h-8 text-xs gap-1 border-primary/40 hover:border-primary/80">
                <svg class="h-3.5 w-3.5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.888.282 2.035-.536 2.572-1.372.909-1.372 2.91 0 3.82.818.537 1.077 1.684.536 2.572-.836 1.372.734 2.942 2.106 2.106a1.533 1.533 0 012.287.947c.379 1.56 2.6 1.56 2.98 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.536-2.572c1.372-.909 1.372-2.91 0-3.82a1.533 1.533 0 01-.536-2.572c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
                </svg>
                <span class="hidden sm:inline">Admin</span>
              </a>
            }
            @if (role()) {
              <button hlmBtn variant="ghost" size="sm" (click)="logout()" class="px-2.5 h-8 text-xs gap-1" title="Logout">
                <svg class="h-3.5 w-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span class="hidden sm:inline">Logout</span>
              </button>
            } @else {
              <a hlmBtn variant="ghost" size="sm" routerLink="/login" class="px-2.5 h-8 text-xs gap-1">
                <svg class="h-3.5 w-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Login</span>
              </a>
            }
          </div>
        </div>
      </div>
    </nav>
  `,
})
export class NavbarComponent {
  private http = inject(HttpClient);
  private title = inject(Title);
  private router = inject(Router);
  private myTeam = inject(MyTeamService);
  protected theme = inject(ThemeService);

  protected team = this.myTeam.team;

  private currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects.split('?')[0]),
      startWith(this.router.url.split('?')[0]),
    ),
    { initialValue: this.router.url.split('?')[0] },
  );

  protected isTeamActive = computed(() => {
    const url = this.currentUrl();
    if (url === '/team') return true;
    const t = this.team();
    return t != null && url === `/competitor/${t.id}`;
  });

  protected goToMyTeam() {
    const t = this.team();
    this.router.navigateByUrl(t ? `/competitor/${t.id}` : '/team');
  }

  private _session = toSignal(this.http.get<{ role: 'admin' | 'referee' | null }>('/api/auth/session'));
  role = computed(() => this._session()?.role ?? null);

  private _tournament = toSignal(this.http.get<{ tournament: { name: string } | null }>('/api/tournament'));
  tournamentName = computed(() => this._tournament()?.tournament?.name ?? 'spartanTournaments');

  constructor() {
    effect(() => this.title.setTitle(this.tournamentName()));
  }

  async logout() {
    try {
      await firstValueFrom(this.http.post('/api/auth/logout', {}));
      window.location.href = '/';
    } catch (err) {
      console.error('Logout failed', err);
    }
  }
}
