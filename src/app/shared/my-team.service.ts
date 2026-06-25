import { Injectable, signal, afterNextRender } from '@angular/core';

/** The team a visitor has marked as "their" team (Mein Team). */
export interface MyTeam {
  id: number;
  name: string;
}

const STORAGE_KEY = 'myTeam';

/**
 * Remembers the visitor's favourite team in localStorage. There is no
 * logged-in competitor concept, so "Mein Team" is purely a client-side
 * preference: the bottom nav routes to it, and the competitor page can
 * star/unstar it.
 *
 * The stored value is loaded in `afterNextRender` (not the constructor) so the
 * initial client render matches the server's (which has no localStorage),
 * avoiding a hydration mismatch — the team simply appears once hydrated.
 */
@Injectable({ providedIn: 'root' })
export class MyTeamService {
  readonly team = signal<MyTeam | null>(null);

  constructor() {
    afterNextRender(() => {
      const stored = this.read();
      if (stored) this.team.set(stored);
    });
  }

  set(team: MyTeam) {
    this.team.set(team);
    this.write(team);
  }

  clear() {
    this.team.set(null);
    this.write(null);
  }

  /** Toggle a team as the favourite: stars it, or unstars if it already is. */
  toggle(team: MyTeam) {
    if (this.team()?.id === team.id) {
      this.clear();
    } else {
      this.set(team);
    }
  }

  isMyTeam(id: number): boolean {
    return this.team()?.id === id;
  }

  private read(): MyTeam | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;
      const parsed = JSON.parse(stored) as MyTeam;
      if (typeof parsed?.id === 'number' && typeof parsed?.name === 'string') return parsed;
      return null;
    } catch {
      return null;
    }
  }

  private write(team: MyTeam | null) {
    try {
      if (team) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(team));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // ignore storage failures (e.g. private mode)
    }
  }
}
