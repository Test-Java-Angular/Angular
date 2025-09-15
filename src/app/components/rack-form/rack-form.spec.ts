import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RackForm } from './rack-form';
import { ReactiveFormsModule } from '@angular/forms';
import { RackType } from '../../entities'; // Cambia el path si tu enum está en otra carpeta

describe('RackForm', () => {
  let component: RackForm;
  let fixture: ComponentFixture<RackForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [RackForm],
    }).compileComponents();

    fixture = TestBed.createComponent(RackForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente y tener valores por defecto', () => {
    expect(component).toBeTruthy();
    expect(component.form).toBeDefined();
    expect(component.form.get('type')?.value).toBe(RackType.A);
    expect(component.form.get('uuid')?.value).toBe('');
    expect(component.form.get('id')?.value).toBeNull();
  });

  it('el campo "type" es requerido', () => {
    const typeControl = component.form.get('type');
    typeControl?.setValue(null);
    expect(typeControl?.valid).toBeFalse();
    typeControl?.setValue(RackType.B);
    expect(typeControl?.valid).toBeTrue();
  });

  it('no debe emitir evento si el formulario es inválido', () => {
    spyOn(component.saveRack, 'emit');
    component.form.get('type')?.setValue(null);
    component.onSubmit();
    expect(component.saveRack.emit).not.toHaveBeenCalled();
  });

  it('debe emitir saveRack con los valores del formulario cuando es válido', () => {
    spyOn(component.saveRack, 'emit');
    component.form.setValue({
      type: RackType.C,
      uuid: 'rack-123',
      id: 77
    });
    component.onSubmit();
    expect(component.saveRack.emit).toHaveBeenCalledWith({
      type: RackType.C,
      uuid: 'rack-123',
      id: 77
    });
  });
});