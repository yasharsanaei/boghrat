import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./routes/home/home.component').then((c) => c.HomeComponent),
  },
  {
    path: 'document/:id',
    loadComponent: () =>
      import('./routes/document/document.component').then(
        (c) => c.DocumentComponent,
      ),
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '',
  },
];
