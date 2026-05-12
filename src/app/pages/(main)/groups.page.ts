import { Component, inject, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { injectLoad } from '@analogjs/router';
import { CommonModule } from '@angular/common';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { toSignal } from '@angular/core/rxjs-interop';
import { lastValueFrom } from 'rxjs';

export const load = () => {
  return lastValueFrom(inject(HttpClient).get<any[]>('/api/competitors/groups'));
};

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [CommonModule, ...HlmTableImports],
  template: `
    <div class="space-y-8">
      <header>
        <h1 class="text-4xl font-bold tracking-tight">Gruppenstände</h1>
        <p class="text-muted-foreground mt-2">Aktuelle Tabellen der Gruppenphase.</p>
      </header>

      <div class="grid gap-12 lg:grid-cols-2">
        @for (group of groupList(); track group.id) {
          <div class="space-y-4">
            <h2 class="text-2xl font-bold px-2">Gruppe {{ group.id }}</h2>
            <div hlmTableContainer class="border rounded-lg overflow-hidden">
              <table hlmTable>
                <thead hlmTHead>
                  <tr hlmTr>
                    <th hlmTh class="w-12 text-center">#</th>
                    <th hlmTh>Name</th>
                    <th hlmTh class="w-20 text-center">MP</th>
                    <th hlmTh class="w-20 text-center">GP</th>
                    <th hlmTh class="w-20 text-center">Diff</th>
                  </tr>
                </thead>
                <tbody hlmTBody>
                  @for (c of group.competitors; track c.id; let i = $index) {
                    <tr hlmTr [class.bg-primary/5]="i < 2">
                      <td hlmTd class="w-12 text-center font-bold">{{ i + 1 }}</td>
                      <td hlmTd class="font-medium">{{ c.name }}</td>
                      <td hlmTd class="w-20 text-center font-bold">{{ c.matchPoints }}</td>
                      <td hlmTd class="w-20 text-center">{{ c.gamePoints }}</td>
                      <td hlmTd class="w-20 text-center" [class.text-green-600]="c.diff > 0" [class.text-red-600]="c.diff < 0">
                        {{ c.diff > 0 ? '+' : '' }}{{ c.diff }}
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        } @empty {
          <div class="col-span-full py-24 text-center border-2 border-dashed rounded-xl">
            <p class="text-muted-foreground text-lg">Keine Gruppen eingeteilt.</p>
          </div>
        }
      </div>
    </div>
  `,
})
export default class GroupsPage {
  groupList = toSignal(injectLoad<typeof load>(), { initialValue: [] });
}
