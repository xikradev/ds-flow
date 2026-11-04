import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';

type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly currentTheme = signal<Theme>(this.readTheme());
  readonly theme = this.currentTheme.asReadonly();

  constructor() {
    this.applyTheme(this.currentTheme());
  }

  toggle(): void {
    const theme = this.currentTheme() === 'light' ? 'dark' : 'light';
    this.currentTheme.set(theme);
    this.applyTheme(theme);
    try {
      this.document.defaultView?.localStorage.setItem('ds-flow-theme', theme);
    } catch {
      // The theme still works when browser storage is unavailable.
    }
  }

  private readTheme(): Theme {
    try {
      return this.document.defaultView?.localStorage.getItem('ds-flow-theme') === 'dark'
        ? 'dark'
        : 'light';
    } catch {
      return 'light';
    }
  }

  private applyTheme(theme: Theme): void {
    this.document.documentElement.dataset['theme'] = theme;
    this.document.documentElement.style.colorScheme = theme;
  }
}
