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
});
