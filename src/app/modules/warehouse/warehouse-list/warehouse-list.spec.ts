import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WarehouseList } from './warehouse-list';
import { WarehouseStore } from '../../../store/warehouse/warehouse-store';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

describe('WarehouseList', () => {
  let fixture: ComponentFixture<WarehouseList>;
  let component: WarehouseList;
  let store: any;

  beforeEach(async () => {
    store = {
      warehouses$: () => [{ id: 1, clientName: 'A', uuid: 'b', capacity: 10 }],
      deleteWarehouse: jasmine.createSpy('deleteWarehouse'),
      total$: () => 1,
      isLoading: () => false,
      currentPage: () => 0,
      size: () => 10,
      setPage: jasmine.createSpy('setPage')
    };
    await TestBed.configureTestingModule({
      imports: [WarehouseList],
      providers: [
        { provide: WarehouseStore, useValue: store },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => of('y') }) } }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(WarehouseList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('llama deleteWarehouse cuando se confirma', () => {
    spyOn(component['dialog'], 'open').and.returnValue({ afterClosed: () => of('y') });
    component.deleteWarehouse({ id: 1, clientName: 'A', uuid: 'b' } as any);
    expect(store.deleteWarehouse).toHaveBeenCalledWith(1);
  });

  it('no llama deleteWarehouse cuando se cancela', () => {
    spyOn(component['dialog'], 'open').and.returnValue({ afterClosed: () => of('n') });
    component.deleteWarehouse({ id: 2, clientName: '', uuid: '' } as any);
    expect(store.deleteWarehouse).not.toHaveBeenCalled();
  });

  it('check page is initialized', () => {
    expect(store.setPage).toHaveBeenCalledWith(0);
  });
});