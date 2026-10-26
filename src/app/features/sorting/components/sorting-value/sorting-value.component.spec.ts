import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { SortingValueComponent } from './sorting-value.component';

describe('SortingValueComponent', () => {
  it('opens and closes its actions menu', () => {
    const fixture = TestBed.createComponent(SortingValueComponent);
    fixture.componentRef.setInput('value', 42);
    const component = fixture.componentInstance;

    component.openMenu();
    expect(component.isMenuOpen()).toBe(true);

    component.closeMenu();
    expect(component.isMenuOpen()).toBe(false);
  });

  it('emits a delete request and closes the menu', () => {
    const fixture = TestBed.createComponent(SortingValueComponent);
    fixture.componentRef.setInput('value', 42);
    const component = fixture.componentInstance;
    const deleted = jest.fn();

    component.deleteRequested.subscribe(deleted);

    component.openMenu();
    component.requestDelete();

    expect(deleted).toHaveBeenCalledTimes(1);
    expect(component.isMenuOpen()).toBe(false);
  });

  it('emits a valid edited value and returns to display mode', () => {
    const fixture = TestBed.createComponent(SortingValueComponent);
    fixture.componentRef.setInput('value', 42);
    const component = fixture.componentInstance;
    const edited = jest.fn();

    component.valueEdited.subscribe(edited);
    component.startEditing();
    component.updateEditingValue('55');
    component.saveEdit();

    expect(edited).toHaveBeenCalledWith(55);
    expect(component.isEditing()).toBe(false);
  });

  it('shows invalid feedback for five seconds when the edited value is invalid', fakeAsync(() => {
    const fixture = TestBed.createComponent(SortingValueComponent);
    fixture.componentRef.setInput('value', 42);
    const component = fixture.componentInstance;

    component.startEditing();
    component.updateEditingValue('100');
    component.saveEdit();

    expect(component.hasInvalidValue()).toBe(true);
    expect(component.isEditing()).toBe(true);

    tick(5_000);

    expect(component.hasInvalidValue()).toBe(false);
  }));
});
