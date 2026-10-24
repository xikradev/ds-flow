import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'bubble-sort',
    title: 'Bubble Sort | DSflow',
    loadComponent: () =>
      import('./features/sorting/pages/bubble-sort/bubble-sort.page').then((module) => module.BubbleSortPage),
  },
  { path: '', pathMatch: 'full', redirectTo: 'bubble-sort' },
];
