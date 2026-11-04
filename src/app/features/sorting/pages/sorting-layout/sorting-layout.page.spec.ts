import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SortingListService } from '../../services/sorting-list.service';
import { SortingLayoutPage } from './sorting-layout.page';

describe('SortingLayoutPage simulation controls', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  afterEach(() => jest.useRealTimers());

  it('connects playback and navigation to the persistent footer', () => {
    const fixture = TestBed.createComponent(SortingLayoutPage);
    const list = fixture.debugElement.injector.get(SortingListService);
    list.applySnapshot([{ id: 1, value: 2 }, { id: 2, value: 1 }]);
    fixture.detectChanges();
    const buttons = Array.from(fixture.nativeElement.querySelectorAll('footer button')) as HTMLButtonElement[];
    const [previous, playback, next] = buttons;

    expect(previous.disabled).toBe(true);
    expect(next.disabled).toBe(true);
    expect(playback.textContent).toContain('Start');
    playback.click();
    fixture.detectChanges();
    expect(playback.textContent).toContain('Pause');
    jest.advanceTimersByTime(1000);
    fixture.detectChanges();
    expect(previous.disabled).toBe(false);
    next.click();
    fixture.detectChanges();
    expect(playback.textContent).toContain('Start');
    expect(list.values()).toEqual([1, 2]);
    previous.click();
    fixture.detectChanges();
    expect(list.values()).toEqual([2, 1]);
    playback.click();
    jest.advanceTimersByTime(10000);
    fixture.detectChanges();
    expect(playback.textContent).toContain('Restart');
    expect(next.disabled).toBe(true);
    playback.click();
    fixture.detectChanges();
    expect(playback.textContent).toContain('Pause');
    expect(list.values()).toEqual([2, 1]);
    fixture.destroy();
  });

  it('disables start when fewer than two values are present', () => {
    const fixture = TestBed.createComponent(SortingLayoutPage);
    fixture.debugElement.injector.get(SortingListService).applySnapshot([{ id: 1, value: 1 }]);
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('footer button') as NodeListOf<HTMLButtonElement>;
    expect(Array.from(buttons).every((button) => button.disabled)).toBe(true);
    fixture.destroy();
  });
});
