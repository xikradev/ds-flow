import { TestBed } from '@angular/core/testing';
import { SortingListService } from './sorting-list.service';

describe('SortingListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('starts with five values between 1 and 99', () => {
    const service = TestBed.inject(SortingListService);

    expect(service.values()).toHaveLength(5);
    expect(service.values().every((value) => value >= 1 && value <= 99)).toBe(true);
  });

  it('adds a value while preserving the existing list', () => {
    const service = TestBed.inject(SortingListService);
    const previousValues = service.values();

    service.addValue(42);

    expect(service.values()).toEqual([...previousValues, 42]);
  });

  it('removes the value at the requested index', () => {
    const service = TestBed.inject(SortingListService);
    const previousValues = service.values();

    service.removeValueAt(2);

    expect(service.values()).toEqual([...previousValues.slice(0, 2), ...previousValues.slice(3)]);
  });

  it('updates the value at the requested index', () => {
    const service = TestBed.inject(SortingListService);
    const previousValues = service.values();

    service.updateValueAt(2, 42);

    expect(service.values()).toEqual([...previousValues.slice(0, 2), 42, ...previousValues.slice(3)]);
  });
});
