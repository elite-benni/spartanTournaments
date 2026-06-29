import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { MyTeamService } from '../shared/my-team.service';

/**
 * Mobile-only bottom navigation: Mein Team / Gruppen / Spielplan.
 *
 * "Mein Team" routes to the visitor's starred team (if any) or to the team
 * picker otherwise. Hidden on md+ where the top navbar carries the same links.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-bottom-nav',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav
      class="md:hidden fixed bottom-3 inset-x-4 max-w-sm mx-auto z-50 rounded-2xl border border-border/70 bg-background/50 backdrop-blur-3xl shadow-lg py-1.5 px-3 pb-[calc(0.35rem+env(safe-area-inset-bottom))] transition-all duration-300"
    >
      <div class="grid grid-cols-3 gap-1">
        <!-- Mein Team -->
        <button
          type="button"
          (click)="goToMyTeam()"
          class="bottom-nav-item flex flex-col items-center justify-center gap-0.5 py-1 text-[10px] font-semibold transition-all duration-200 active:scale-90"
          [class.text-primary]="isTeamActive()"
          [class.active-link]="isTeamActive()"
          [class.text-muted-foreground]="!isTeamActive()"
        >
          @if (team(); as t) {
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 transition-transform duration-200 group-active:scale-90"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="currentColor"
              stroke-width="1"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M11.48 3.5a.56.56 0 011.04 0l2.12 4.92 5.34.46c.49.04.69.66.31.99l-4.05 3.51 1.21 5.22c.11.48-.41.86-.83.6L12 16.9l-4.62 2.8c-.42.26-.94-.12-.83-.6l1.21-5.22-4.05-3.51c-.38-.33-.18-.95.31-.99l5.34-.46L11.48 3.5z"
              />
            </svg>
            <span class="max-w-[5.5rem] truncate">{{ t.name }}</span>
          } @else {
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 transition-transform duration-200 group-active:scale-90"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11.48 3.5a.56.56 0 011.04 0l2.12 4.92 5.34.46c.49.04.69.66.31.99l-4.05 3.51 1.21 5.22c.11.48-.41.86-.83.6L12 16.9l-4.62 2.8c-.42.26-.94-.12-.83-.6l1.21-5.22-4.05-3.51c-.38-.33-.18-.95.31-.99l5.34-.46L11.48 3.5z"
              />
            </svg>
            <span>Mein Team</span>
          }
          <span class="active-dot h-1 w-1 rounded-full bg-transparent transition-all duration-300" [class.bg-primary]="isTeamActive()"></span>
        </button>
 
        <!-- Gruppen -->
        <a
          routerLink="/groups"
          routerLinkActive="text-primary active-link"
          class="bottom-nav-item flex flex-col items-center justify-center gap-0.5 py-1 text-[10px] font-semibold text-muted-foreground transition-all duration-200 active:scale-90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform duration-200 group-active:scale-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4zm6 0a3 3 0 10-2.5-1.34M7 11a3 3 0 11.5-5.97"
            />
          </svg>
          <span>Gruppen</span>
          <span class="active-dot h-1 w-1 rounded-full bg-transparent transition-all duration-300"></span>
        </a>
 
        <!-- Spielplan -->
        <a
          routerLink="/gameplan"
          routerLinkActive="text-primary active-link"
          class="bottom-nav-item flex flex-col items-center justify-center gap-0.5 py-1 text-[10px] font-semibold text-muted-foreground transition-all duration-200 active:scale-90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform duration-200 group-active:scale-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>Spielplan</span>
          <span class="active-dot h-1 w-1 rounded-full bg-transparent transition-all duration-300"></span>
        </a>
      </div>
    </nav>
 
    <style>
      .bottom-nav-item.active-link .active-dot {
        background-color: var(--primary);
        box-shadow: 0 0 8px var(--primary);
      }
    </style>
  `,
})
export class BottomNavComponent {
  private router = inject(Router);
  private myTeam = inject(MyTeamService);

  protected team = this.myTeam.team;

  private currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects.split('?')[0]),
      startWith(this.router.url.split('?')[0]),
    ),
    { initialValue: this.router.url.split('?')[0] },
  );

  // Highlighted while viewing the starred team's profile or the picker.
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
}
