import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WarehouseService } from './warehouse-service';

describe('WarehouseService', () => {
  let service: WarehouseService;
  let httpMock: HttpTestingController;

  const warehouse = { id: 1, name: 'Almacén de Prueba' } as any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WarehouseService]
    });
    service = TestBed.inject(WarehouseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('listWarehouses DEBE hacer un GET a /warehouses', () => {
    service.listWarehouses({ page: 0, size: 5 }).subscribe((result) => {
      expect(result).toEqual({ content: [warehouse], total: 1 });
    });
    const req = httpMock.expectOne(r => r.method === 'GET' && r.url === '/warehouses');
    expect(req.request.params.get('page')).toBe('0');
    expect(req.request.params.get('size')).toBe('5');
    req.flush({ content: [warehouse], total: 1 });
  });

  it('getWarehouse DEBE hacer un GET a /warehouses/:id', () => {
    service.getWarehouse(1).subscribe(result => {
      expect(result).toEqual(warehouse);
    });
    const req = httpMock.expectOne('/warehouses/1');
    expect(req.request.method).toBe('GET');
    req.flush(warehouse);
  });

  it('deleteWarehouse DEBE hacer un DELETE a /warehouses/:id', () => {
    service.deleteWarehouse(1).subscribe(result => {
      expect(result).toBeUndefined();
    });
    const req = httpMock.expectOne('/warehouses/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('editWarehouse DEBE hacer un PUT a /warehouses/:id', () => {
    service.editWarehouse(warehouse).subscribe(result => {
      expect(result).toEqual(warehouse);
    });
    const req = httpMock.expectOne('/warehouses/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(warehouse);
    req.flush(warehouse);
  });

  it('addWarehouse DEBE hacer un POST a /warehouses', () => {
    service.addWarehouse(warehouse).subscribe(result => {
      expect(result).toEqual(warehouse);
    });
    const req = httpMock.expectOne('/warehouses');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(warehouse);
    req.flush(warehouse);
  });
});