import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    TestBed.resetTestingModule();
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.style.removeProperty('color-scheme');
  });

  it('toggles and saves the selected theme', () => {
    const service = TestBed.inject(ThemeService);
    expect(service.theme()).toBe('light');
    service.toggle();
    expect(service.theme()).toBe('dark');
    expect(document.documentElement.dataset['theme']).toBe('dark');
    expect(localStorage.getItem('ds-flow-theme')).toBe('dark');
    service.toggle();
    expect(document.documentElement.dataset['theme']).toBe('light');
  });

  it('restores a saved dark theme', () => {
    localStorage.setItem('ds-flow-theme', 'dark');
    const service = TestBed.inject(ThemeService);
    expect(service.theme()).toBe('dark');
    expect(document.documentElement.dataset['theme']).toBe('dark');
  });
});
