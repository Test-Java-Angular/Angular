import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RackTable } from './rack-table';
import { MatDialog } from '@angular/material/dialog';
import { of, BehaviorSubject } from 'rxjs';
import { RackStore } from '../../store/rack/rack-store';

describe('RackTable', () => {
  let component: RackTable;
  let fixture: ComponentFixture<RackTable>;
  let rackStore: jasmine.SpyObj<RackStore>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    rackStore = jasmine.createSpyObj<RackStore>('RackStore', [
      'isProcessed',
      'loadAllRacks',
      'deleteRack'
    ], {
      entities: new BehaviorSubject([
        { id: 1, uuid: 'a', type: 'A', name: 'RackA' },
        { id: 2, uuid: 'b', type: 'B', name: 'RackB' }
      ])
    });

    dialogSpy = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      providers: [
        { provide: RackStore, useValue: rackStore },
        { provide: MatDialog, useValue: dialogSpy }
      ],
      declarations: [RackTable]
    }).compileComponents();

    fixture = TestBed.createComponent(RackTable);
    component = fixture.componentInstance;
    // Mocks para los inputs
    spyOn(component, 'warehouseId').and.returnValue(101);
    spyOn(component, 'isEdit').and.returnValue(true);
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('trackByRack debe devolver id si existe o index si no', () => {
    const rack = { id: 123, uuid: 'x', type: 'T' };
    expect(component.trackByRack(1, rack)).toBe(123);
    expect(component.trackByRack(7, {} as any)).toBe(7); // sin id
  });

  it('llama loadAllRacks una vez inicializado si warehouseId o isProcessed', () => {
    rackStore.isProcessed.and.returnValue(true);
    // Se fuerza el efecto llamando al constructor de nuevo
    new component.constructor(); // simula el efecto en constructor
    expect(rackStore.loadAllRacks).toHaveBeenCalledWith({
      warehouseId: 101,
      pageable: { page: 0, size: 100 }
    });
  });

  it('deleteRack abre diálogo y borra en confirmación positiva', () => {
    const rack = { id: 6, uuid: 'rack-uuid', type: 'tipoX' } as any;
    // Simulamos que después de cerrar el diálogo el usuario confirma con 'y'
    dialogSpy.open.and.returnValue({
      afterClosed: () => of('y')
    } as any);

    component.deleteRack(rack);

    expect(dialogSpy.open).toHaveBeenCalled();
    expect(rackStore.deleteRack).toHaveBeenCalledWith({
      warehouseId: 101,
      rackId: 6
    });
  });

  it('deleteRack no borra si el usuario cancela (diferente de "y")', () => {
    const rack = { id: 8, uuid: 'other-uuid', type: 'tipoZ' } as any;
    dialogSpy.open.and.returnValue({
      afterClosed: () => of('n')
    } as any);

    component.deleteRack(rack);

    expect(dialogSpy.open).toHaveBeenCalled();
    expect(rackStore.deleteRack).not.toHaveBeenCalled();
  });
});