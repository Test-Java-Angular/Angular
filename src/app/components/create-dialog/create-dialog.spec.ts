import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateDialog } from './create-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CreateDialogData } from '../../entities';

describe('CreateDialog', () => {
  let component: CreateDialog;
  let fixture: ComponentFixture<CreateDialog>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<CreateDialog>>;

  const mockData: CreateDialogData = {
    isWarehouse: true
  };

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [CreateDialog],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockData }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener los datos inyectados correctamente', () => {
    expect(component.data).toEqual(mockData);
    expect(component.data.isWarehouse).toBe(true);
  });

  it('saveInfo cierra el diálogo enviando Warehouse si esWarehouse es true', () => {
    const warehouseMock = { id: 1, name: 'WH1' } as any;
    component.saveInfo(warehouseMock, true);
    expect(dialogRefSpy.close).toHaveBeenCalledWith({
      warehouse: warehouseMock,
      rack: undefined
    });
  });

  it('saveInfo cierra el diálogo enviando Rack si esWarehouse es false', () => {
    const rackMock = { id: 5, uuid: 'abc' } as any;
    component.saveInfo(rackMock, false);
    expect(dialogRefSpy.close).toHaveBeenCalledWith({
      warehouse: undefined,
      rack: rackMock
    });
  });
});