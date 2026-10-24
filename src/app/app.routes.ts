import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'sort',
    loadComponent: () =>
      import('./features/sorting/pages/sorting-layout/sorting-layout.page').then(
        (module) => module.SortingLayoutPage,
      ),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'bubble' },
      {
        path: 'bubble',
        title: 'Bubble Sort | DSflow',
        loadComponent: () =>
          import('./features/sorting/pages/bubble-sort/bubble-sort.page').then(
            (module) => module.BubbleSortPage,
          ),
      },
    ],
  },
  { path: 'bubble-sort', pathMatch: 'full', redirectTo: 'sort/bubble' },
  { path: '', pathMatch: 'full', redirectTo: 'sort/bubble' },
  {
    path: '**',
    redirectTo: 'sort/bubble',
  },
];
