import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ValueAdderComponent } from './value-adder.component';

describe('ValueAdderComponent', () => {
  it('cancels an open addition and prevents emission when disabled', () => {
    const fixture = TestBed.createComponent(ValueAdderComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    const added = jest.fn();
    component.valueAdded.subscribe(added);
    component.startAdding();
    component.updateValue('42');
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    component.add();
    component.startAdding();
    expect(component.isAdding()).toBe(false);
    expect(added).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('button').disabled).toBe(true);
  });
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
