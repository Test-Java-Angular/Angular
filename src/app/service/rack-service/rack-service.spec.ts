import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RackService } from './rack-service';

describe('RackService', () => {
  let service: RackService;
  let httpMock: HttpTestingController;

  const warehouseId = 10;
  const rackId = 5;
  const rack = { id: rackId, name: 'Rack de prueba', uuid: 'uuu', type: 'tipoA' } as any;
  const pageable = { page: 1, size: 20 };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RackService]
    });
    service = TestBed.inject(RackService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getRacks DEBE hacer un GET a /warehouse/:warehouseId/racks con params', () => {
    const response = { content: [rack], total: 2 };

    service.getRacks(warehouseId, pageable).subscribe(res => {
      expect(res).toEqual(response);
    });

    const req = httpMock.expectOne(
      r =>
        r.method === 'GET' &&
        r.url === `/warehouse/${warehouseId}/racks` &&
        r.params.get('page') === '1' &&
        r.params.get('size') === '20'
    );
    expect(req.request.method).toBe('GET');
    req.flush(response);
  });

  it('addRack DEBE hacer un POST a /warehouse/:warehouseId/racks', () => {
    service.addRack(warehouseId, rack).subscribe(res => {
      expect(res).toEqual(rack);
    });

    const req = httpMock.expectOne(`/warehouse/${warehouseId}/racks`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(rack);
    req.flush(rack);
  });

  it('deleteRack DEBE hacer un DELETE a /warehouse/:warehouseId/racks/:rackId', () => {
    service.deleteRack(warehouseId, rackId).subscribe(res => {
      expect(res).toBeUndefined(); // porque seria void
    });

    const req = httpMock.expectOne(`/warehouse/${warehouseId}/racks/${rackId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});