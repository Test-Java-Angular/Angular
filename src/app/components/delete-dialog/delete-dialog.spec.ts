import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteDialog } from './delete-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DeleteDialogData } from '../store/common';

// Datos de ejemplo para el diálogo
const mockData: DeleteDialogData = {
  isWarehouse: false,
  uuid: 'uuid-xyz',
  rackType: 'tipoPrueba',
  warehouseId: 123,
  clientName: 'Cliente Test'
};

describe('DeleteDialog', () => {
  let component: DeleteDialog;
  let fixture: ComponentFixture<DeleteDialog>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<DeleteDialog>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [DeleteDialog],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockData }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener los datos inyectados correctamente', () => {
    expect(component.data).toEqual(mockData);
    expect(component.data.isWarehouse).toBe(false);
    expect(component.data.uuid).toBe('uuid-xyz');
    expect(component.data.rackType).toBe('tipoPrueba');
    expect(component.data.warehouseId).toBe(123);
    expect(component.data.clientName).toBe('Cliente Test');
  });

  it('debería tener una referencia a MatDialogRef', () => {
    expect(component.dialogRef).toBe(dialogRefSpy);
  });
});