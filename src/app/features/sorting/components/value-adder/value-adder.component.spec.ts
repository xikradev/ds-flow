import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ValueAdderComponent } from './value-adder.component';

describe('ValueAdderComponent', () => {
  it('shows invalid feedback for out-of-range values and restores the hint after five seconds', fakeAsync(() => {
    const fixture = TestBed.createComponent(ValueAdderComponent);
    const component = fixture.componentInstance;
    const addedValues: number[] = [];

    component.valueAdded.subscribe((value) => addedValues.push(value));
    component.updateValue('100');
    component.add();

    expect(component.hasInvalidValue()).toBe(true);
    expect(addedValues).toEqual([]);

    tick(5_000);

    expect(component.hasInvalidValue()).toBe(false);
  }));

  it('emits integer values within the allowed range', () => {
    const fixture = TestBed.createComponent(ValueAdderComponent);
    const component = fixture.componentInstance;
    const addedValues: number[] = [];

    component.valueAdded.subscribe((value) => addedValues.push(value));
    component.updateValue('99');
    component.add();

    expect(addedValues).toEqual([99]);
    expect(component.hasInvalidValue()).toBe(false);
  });

  it('restores the information feedback when the value changes', () => {
    const fixture = TestBed.createComponent(ValueAdderComponent);
    const component = fixture.componentInstance;

    component.updateValue('100');
    component.add();
    component.updateValue('99');

    expect(component.hasInvalidValue()).toBe(false);
  });
});
