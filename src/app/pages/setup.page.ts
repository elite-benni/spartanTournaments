import { Component, inject, effect, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { injectLoad } from '@analogjs/router';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { lastValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import type { load } from './setup.server';
import { SimpleDialogService } from '../shared/simple-dialog/simple-dialog.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-setup',
  imports: [CommonModule, ReactiveFormsModule, HlmButton, HlmInput, HlmLabel, ...HlmCardImports, ...HlmDatePickerImports, ...HlmFieldImports],
  template: `
    <div class="flex justify-center items-center min-h-screen p-4 bg-muted/40">
      <section hlmCard class="w-full max-w-2xl">
        <header hlmCardHeader>
          <h1 hlmCardTitle>Turnier Setup</h1>
          <p hlmCardDescription>Initialisiere dein Boccia-Turnier. Diese Seite ist nur einmalig erreichbar.</p>
        </header>

        <form [formGroup]="setupForm" (ngSubmit)="onSubmit()" hlmCardContent class="grid gap-6">
          <div class="grid gap-2">
            <label hlmLabel for="name">Turnier Name</label>
            <input hlmInput id="name" formControlName="name" placeholder="z.B. Spartan 4Kids 2026" />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="grid gap-2">
              <label hlmLabel for="numberOfParallelGames">Anzahl paralleler Spiele</label>
              <input hlmInput type="number" id="numberOfParallelGames" formControlName="numberOfParallelGames" />
            </div>

            <div class="grid gap-2">
              <label hlmLabel for="minutesPerGame">Dauer pro Spiel (Minuten)</label>
              <input hlmInput type="number" id="minutesPerGame" formControlName="minutesPerGame" />
            </div>

            <div class="grid gap-2">
              <label hlmLabel for="minutesAvailForGroupsPhase">Verfügbare Zeit Gruppenphase (Minuten)</label>
              <input
                hlmInput
                type="number"
                id="minutesAvailForGroupsPhase"
                formControlName="minutesAvailForGroupsPhase"
              />
            </div>

            <div class="grid gap-2">
              <label hlmLabel for="finalistCount">Anzahl Finalisten</label>
              <input hlmInput type="number" id="finalistCount" formControlName="finalistCount" />
            </div>

            <div class="grid gap-2">
              <label hlmLabel>Turnier Startzeit</label>
              <hlm-field-group class="flex-row">
                <hlm-field>
                  <label hlmFieldLabel for="tournamentStartDate">Datum</label>
                  <hlm-date-picker formControlName="tournamentStartDate">
                    <hlm-date-picker-trigger buttonId="tournamentStartDate">Datum wählen</hlm-date-picker-trigger>
                  </hlm-date-picker>
                </hlm-field>
                <hlm-field>
                  <label hlmFieldLabel for="tournamentStartTimeInput">Uhrzeit</label>
                  <input
                    hlmInput
                    id="tournamentStartTimeInput"
                    type="time"
                    step="60"
                    class="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    [value]="tournamentTime()"
                    (change)="tournamentTime.set($any($event.target).value)"
                  />
                </hlm-field>
              </hlm-field-group>
            </div>

            <div class="grid gap-2">
              <label hlmLabel>Finalspiele Startzeit</label>
              <hlm-field-group class="flex-row">
                <hlm-field>
                  <label hlmFieldLabel for="finalsStartDate">Datum</label>
                  <hlm-date-picker formControlName="finalsStartDate">
                    <hlm-date-picker-trigger buttonId="finalsStartDate">Datum wählen</hlm-date-picker-trigger>
                  </hlm-date-picker>
                </hlm-field>
                <hlm-field>
                  <label hlmFieldLabel for="finalsStartTimeInput">Uhrzeit</label>
                  <input
                    hlmInput
                    id="finalsStartTimeInput"
                    type="time"
                    step="60"
                    class="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    [value]="finalsTime()"
                    (change)="finalsTime.set($any($event.target).value)"
                  />
                </hlm-field>
              </hlm-field-group>
            </div>
          </div>

          <hr class="border-border" />

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="grid gap-2">
              <label hlmLabel for="adminPassword">Admin Passwort</label>
              <input hlmInput type="password" id="adminPassword" formControlName="adminPassword" />
            </div>

            <div class="grid gap-2">
              <label hlmLabel for="refereePassword">Schiedsrichter Passwort</label>
              <input hlmInput type="password" id="refereePassword" formControlName="refereePassword" />
            </div>
          </div>

          <button hlmBtn type="submit" [disabled]="loading() || setupForm.invalid">
            @if (loading()) {
              Lädt...
            } @else {
              Turnier anlegen
            }
          </button>
        </form>
      </section>
    </div>
  `,
})
export default class SetupPage {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  private dialogService = inject(SimpleDialogService);

  data = toSignal(injectLoad<typeof load>());
  loading = signal(false);
  tournamentTime = signal('10:00');
  finalsTime = signal('10:00');

  setupForm = this.fb.group({
    name: ['', Validators.required],
    numberOfParallelGames: [2, [Validators.required, Validators.min(1)]],
    minutesPerGame: [15, [Validators.required, Validators.min(1)]],
    minutesAvailForGroupsPhase: [120, [Validators.required, Validators.min(1)]],
    finalistCount: [4, [Validators.required, Validators.min(2)]],
    tournamentStartDate: [null as Date | null, Validators.required],
    finalsStartDate: [null as Date | null, Validators.required],
    adminPassword: ['', [Validators.required, Validators.minLength(4)]],
    refereePassword: ['', [Validators.required, Validators.minLength(4)]],
  });

  constructor() {
    // If tournament already exists, redirect to home
    effect(() => {
      const tournamentData = this.data();
      if (tournamentData && tournamentData.tournament) {
        this.router.navigate(['/']);
      }
    });
  }

  async onSubmit() {
    if (this.setupForm.invalid) return;
    this.loading.set(true);
    try {
      const combineDateTime = (date: Date, time: string): string => {
        const [hours, minutes] = time.split(':').map(Number);
        const result = new Date(date);
        result.setHours(hours, minutes, 0, 0);
        return result.toISOString();
      };
      const { tournamentStartDate, finalsStartDate, ...rest } = this.setupForm.value;
      const payload = {
        ...rest,
        tournamentStartTime: combineDateTime(tournamentStartDate!, this.tournamentTime()),
        finalsStartTime: combineDateTime(finalsStartDate!, this.finalsTime()),
      };
      await lastValueFrom(this.http.post('/api/tournament/setup', payload));
      this.router.navigate(['/admin']);
    } catch (err) {
      console.error('Setup failed', err);
      await this.dialogService.alert('Setup fehlgeschlagen', 'Bitte prüfe die Eingaben.', 'error');
    } finally {
      this.loading.set(false);
    }
  }
}
