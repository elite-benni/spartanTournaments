import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../components/navbar.component';
import { defineRouteMeta } from '@analogjs/router';
import { setupGuard } from '../setup.guard';

export const routeMeta = defineRouteMeta({
  canActivate: [setupGuard],
});

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar />
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-outlet />
    </main>
  `,
})
export default class MainLayoutComponent {}
