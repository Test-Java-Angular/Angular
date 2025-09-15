import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { warehouseResolver } from './warehouse-resolver';

describe('warehouseResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => warehouseResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
