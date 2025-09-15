import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WarehouseDetail } from './warehouse-detail';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { FamilyType, Warehouse } from '../../../entities';
import { WarehouseStore } from '../../../store/warehouse/warehouse-store';
import { RackStore } from '../../../store/rack/rack-store';

describe('WarehouseDetail', () => {
  let component: WarehouseDetail;
  let fixture: ComponentFixture<WarehouseDetail>;
  let warehouseStore: jasmine.SpyObj<typeof WarehouseStore>;
  let rackStore: jasmine.SpyObj<typeof RackStore>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let activatedRoute: any;

  beforeEach(async () => {
    warehouseStore = jasmine.createSpyObj<typeof WarehouseStore>('WarehouseStore', [
      'isPending',
      'error',
      'isProcessed',
      'loadAllWarehouses',
      'editWarehouse'
    ]);
    rackStore = jasmine.createSpyObj<typeof RackStore>('RackStore', [
      'isPending',
      'error',
      'addRack'
    ]);
    dialogSpy = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

    activatedRoute = {
      snapshot: {
        data: {
          isEdit: true,
        },
        params: { id: 1 }
      },
      data: of({ warehouse: { id: 1, name: 'Test Ware' } })
    };

    await TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: WarehouseStore, useValue: warehouseStore },
        { provide: RackStore, useValue: rackStore },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ],
      declarations: [WarehouseDetail]
    }).compileComponents();

    fixture = TestBed.createComponent(WarehouseDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente con datos iniciales', () => {
    expect(component).toBeTruthy();
    expect(component.isEdit).toBeTrue();
    expect(component.warehouseId).toBe(1);
  });

  it('al crear rack y cerrar el diálogo con rack, llama a RackStore.addRack', () => {
    dialogSpy.open.and.returnValue({
      afterClosed: () => of({ rack: { id: 2, name: 'Nuevo rack' } })
    } as any);
    component.createRack();
    expect(rackStore.addRack).toHaveBeenCalledWith({ warehouseId: 1, rack: { id: 2, name: 'Nuevo rack' } });
  });

  it('al guardar almacén llama a WarehouseStore.editWarehouse', () => {
    const warehouse = { id: 1, clientName: 'Editado', uuid: 'uuid', familyType: FamilyType.ROB } as Warehouse;
    component.saveInfo(warehouse);
    expect(warehouseStore.editWarehouse).toHaveBeenCalledWith(warehouse);
  });

  it('isLoading es true si alguna store está pending', () => {
    warehouseStore.isPending.and.returnValue(true);
    rackStore.isPending.and.returnValue(false);
    expect(component.isLoading()).toBeTrue();
  });

  it('error refleja el error de alguna store', () => {
    warehouseStore.error.and.returnValue('Err 1');
    rackStore.error.and.returnValue(null);
    expect(component.error()).toBe('Err 1');
  });

  it('warehouse refleja correctamente los datos de la ruta', () => {
    expect(component.warehouse()).toEqual(jasmine.objectContaining({ id: 1, name: 'Test Ware' }));
  });
});