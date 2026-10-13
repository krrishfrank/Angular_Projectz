import { Routes } from '@angular/router';
import { adminGaurd } from './core/gaurds/admin-gaurd';

export const routes: Routes = [
    {
    path: '',
    redirectTo: 'characters',
    pathMatch: 'full'
  },
  {
    path: 'characters',
    loadComponent: () => import('./features/character-list/character-list/character-list.component').then(m => m.CharacterListComponent)
  },
  {
    path: 'characters/:id',
    loadComponent: () => import('./features/character-details/character-details/character-details.component').then(m => m.CharacterDetailsComponent),
    canActivate: [adminGaurd]
  },
  {
    path: 'access-denied',
    loadComponent: () => import('./features/access-denied/access-denied.component').then(m => m.AccessDeniedComponent)
  },
  {
    path: '**',
    redirectTo: 'characters'
  }
];
