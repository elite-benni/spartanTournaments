import { Component, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { injectLoad } from '@analogjs/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { GroupStandingsComponent } from '../../components/group-standings.component';
import type { load } from './groups.server';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-groups',
  imports: [CommonModule, GroupStandingsComponent],
  template: `
    <div class="space-y-8">
      <header>
        <h1 class="text-4xl font-bold tracking-tight">Gruppenstände</h1>
        <p class="text-muted-foreground mt-2">Aktuelle Tabellen der Gruppenphase.</p>
      </header>

      <div class="grid gap-12 lg:grid-cols-2">
        @for (group of groupList(); track group.id) {
          <div class="glass-panel rounded-2xl overflow-hidden shadow-sm">
            <!-- Header band: matches the cards on gameplan -->
            <div class="border-b border-border/40 bg-muted/40 backdrop-blur-xs px-4 py-2.5">
              <h2 class="text-lg font-bold leading-none text-primary">Gruppe {{ group.id }}</h2>
            </div>

            <app-group-standings [group]="group" [showGamePoints]="true" [bordered]="false" />
          </div>
        } @empty {
          <div class="col-span-full py-24 text-center border-2 border-dashed rounded-xl text-muted-foreground italic">
            Keine Gruppen eingeteilt.
          </div>
        }
      </div>
    </div>
  `,
})
export default class GroupsPage {
  data = toSignal(injectLoad<typeof load>(), { initialValue: [] });
  groupList = computed(() => this.data() ?? []);
}
