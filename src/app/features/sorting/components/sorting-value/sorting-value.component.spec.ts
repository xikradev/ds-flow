import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { SortingValueComponent } from './sorting-value.component';

describe('SortingValueComponent', () => {
  it('closes an open menu or edit and cancels a pending deletion when disabled', fakeAsync(() => {
    const fixture = TestBed.createComponent(SortingValueComponent);
    fixture.componentRef.setInput('value', 42);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    const deleted = jest.fn();
    const edited = jest.fn();
    component.deleteRequested.subscribe(deleted);
    component.valueEdited.subscribe(edited);
    component.openMenu();
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(component.isMenuOpen()).toBe(false);
    component.startEditing();
    component.requestDelete();
    expect(component.isEditing()).toBe(false);
    fixture.componentRef.setInput('disabled', false);
    fixture.detectChanges();
    component.startEditing();
    component.updateEditingValue('55');
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    component.saveEdit();
    expect(component.isEditing()).toBe(false);
    expect(edited).not.toHaveBeenCalled();
    fixture.componentRef.setInput('disabled', false);
    fixture.detectChanges();
    component.requestDelete();
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    tick(200);
    expect(deleted).not.toHaveBeenCalled();
    expect(component.isRemoving()).toBe(false);
  }));
  it('opens and closes its actions menu', () => {
    const fixture = TestBed.createComponent(SortingValueComponent);
    fixture.componentRef.setInput('value', 42);
    const component = fixture.componentInstance;

    component.openMenu();
    expect(component.isMenuOpen()).toBe(true);

    component.closeMenu();
    expect(component.isMenuOpen()).toBe(false);
  });

  it('plays the exit duration before emitting a delete request', fakeAsync(() => {
    const fixture = TestBed.createComponent(SortingValueComponent);
    fixture.componentRef.setInput('value', 42);
    const component = fixture.componentInstance;
    const deleted = jest.fn();

    component.deleteRequested.subscribe(deleted);

    component.openMenu();
    component.requestDelete();

    expect(component.isRemoving()).toBe(true);
    expect(deleted).not.toHaveBeenCalled();
    expect(component.isMenuOpen()).toBe(false);

    tick(200);

    expect(deleted).toHaveBeenCalledTimes(1);
  }));

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
