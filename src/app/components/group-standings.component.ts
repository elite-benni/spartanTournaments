import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmTableImports } from '@spartan-ng/helm/table';
import type { CalcGroup } from 'calc-tournament';

/**
 * Single group's standings/ranking, shown as a mobile card list and a desktop
 * table. Shared by the Gruppenstände page and the competitor detail "Gruppe &
 * Ranking" tab so the two stay in sync.
 *
 * - `showGamePoints` adds the GP column (group overview wants it; the compact
 *   competitor view does not).
 * - `highlightId` marks one competitor as the current one: highlights the row
 *   and appends a "(Du)" label.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-group-standings',
  imports: [RouterLink, ...HlmTableImports],
  template: `
    <!-- Mobile: Karten-Liste -->
    <div
      class="md:hidden divide-y"
      [class.border]="bordered()"
      [class.rounded-lg]="bordered()"
      [class.overflow-hidden]="bordered()"
      [class.shadow-sm]="bordered()"
    >
      @for (c of group().competitors; track c.id; let i = $index) {
        <div class="flex items-center gap-3 p-3" [class.bg-primary/10]="c.id === highlightId()">
          <span class="w-6 text-center font-bold shrink-0">{{ i + 1 }}</span>
          <a
            [routerLink]="['/competitor', c.id]"
            class="flex-1 min-w-0 font-medium break-words hover:underline hover:text-primary transition-colors"
          >
            {{ c.name }}
            @if (c.id === highlightId()) {
              <span class="text-xs text-muted-foreground">(Du)</span>
            }
          </a>
          <div class="flex gap-3 shrink-0 text-center leading-tight">
            <div class="w-9">
              <div class="font-bold text-sm">{{ c.matchPoints }}</div>
              <div class="text-[10px] uppercase text-muted-foreground">MP</div>
            </div>
            @if (showGamePoints()) {
              <div class="w-9">
                <div class="text-sm">{{ c.gamePoints }}</div>
                <div class="text-[10px] uppercase text-muted-foreground">GP</div>
              </div>
            }
            <div class="w-10">
              <div class="text-sm font-mono" [class.text-green-600]="c.diff > 0" [class.text-red-600]="c.diff < 0">
                {{ c.diff > 0 ? '+' : '' }}{{ c.diff }}
              </div>
              <div class="text-[10px] uppercase text-muted-foreground">Diff</div>
            </div>
          </div>
        </div>
      }
    </div>

    <!-- Desktop: Tabelle -->
    <div
      hlmTableContainer
      class="hidden md:block"
      [class.border]="bordered()"
      [class.rounded-lg]="bordered()"
      [class.overflow-hidden]="bordered()"
      [class.shadow-sm]="bordered()"
    >
      <table hlmTable>
        <thead hlmTHead>
          <tr hlmTr>
            <th hlmTh class="w-12 text-center">#</th>
            <th hlmTh>Name</th>
            <th hlmTh class="w-20 text-center">MP</th>
            @if (showGamePoints()) {
              <th hlmTh class="w-20 text-center">GP</th>
            }
            <th hlmTh class="w-20 text-center border-l">Diff</th>
          </tr>
        </thead>
        <tbody hlmTBody>
          @for (c of group().competitors; track c.id; let i = $index) {
            <tr hlmTr [class.bg-primary/10]="c.id === highlightId()">
              <td hlmTd class="w-12 text-center font-bold">{{ i + 1 }}</td>
              <td hlmTd>
                <a
                  [routerLink]="['/competitor', c.id]"
                  class="font-medium hover:underline hover:text-primary transition-colors"
                >
                  {{ c.name }}
                  @if (c.id === highlightId()) {
                    <span class="text-xs text-muted-foreground ml-1">(Du)</span>
                  }
                </a>
              </td>
              <td hlmTd class="w-20 text-center font-bold">{{ c.matchPoints }}</td>
              @if (showGamePoints()) {
                <td hlmTd class="w-20 text-center">{{ c.gamePoints }}</td>
              }
              <td
                hlmTd
                class="w-20 text-center font-mono border-l"
                [class.text-green-600]="c.diff > 0"
                [class.text-red-600]="c.diff < 0"
              >
                {{ c.diff > 0 ? '+' : '' }}{{ c.diff }}
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class GroupStandingsComponent {
  readonly group = input.required<CalcGroup>();
  readonly showGamePoints = input(false);
  readonly highlightId = input<number | undefined>(undefined);
  /** Wraps the list/table in its own border + shadow. Off when a parent card already provides the frame. */
  readonly bordered = input(true);
}
