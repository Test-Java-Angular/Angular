import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WarehouseForm } from './warehouse-form';
import { ReactiveFormsModule } from '@angular/forms';
import { FamilyType } from '../../entities'; // ajusta si tu enum está en otra ruta

describe('WarehouseForm', () => {
  let component: WarehouseForm;
  let fixture: ComponentFixture<WarehouseForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [WarehouseForm]
    }).compileComponents();

    fixture = TestBed.createComponent(WarehouseForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
    expect(component.form).toBeDefined();
    expect(component.form.get('familyType')?.value).toBe(FamilyType.EST);
  });

  it('debe inicializar el formulario con datos de almacén en ngOnInit', () => {
    const warehouse = {
      capacity: 30,
      clientName: 'Cliente',
      familyType: FamilyType.ROB,
      uuid: 'abc-def',
      id: 10
    };
    spyOn(component, 'warehouse').and.returnValue(warehouse);
    component.ngOnInit();
    expect(component.form.value).toEqual(warehouse);
  });

  it('no debe emitir evento si el formulario es inválido', () => {
    spyOn(component.saveWarehouse, 'emit');
    component.form.patchValue({ capacity: null }); // required & min(0)
    component.onSubmit();
    expect(component.saveWarehouse.emit).not.toHaveBeenCalled();
  });

  it('debe emitir evento saveWarehouse con el valor correcto cuando es válido', () => {
    spyOn(component.saveWarehouse, 'emit');
    component.form.patchValue({
      capacity: 100,
      clientName: 'Test Client',
      familyType: FamilyType.ROB,
      uuid: 'test-uuid',
      id: 2
    });
    component.onSubmit();
    expect(component.saveWarehouse.emit).toHaveBeenCalledWith({
      capacity: 100,
      clientName: 'Test Client',
      familyType: FamilyType.ROB,
      uuid: 'test-uuid',
      id: 2
    });
  });

  it('el campo capacity debe ser requerido y no negativo', () => {
    const control = component.form.get('capacity');
    control?.setValue(null);
    expect(control?.valid).toBeFalse();
    control?.setValue(-1);
    expect(control?.valid).toBeFalse();
    control?.setValue(0);
    expect(control?.valid).toBeTrue();
    control?.setValue(10);
    expect(control?.valid).toBeTrue();
  });

  it('el campo familyType debe ser requerido', () => {
    const control = component.form.get('familyType');
    control?.setValue(null);
    expect(control?.valid).toBeFalse();
    control?.setValue(FamilyType.EST);
    expect(control?.valid).toBeTrue();
  });
});