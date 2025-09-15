import { Component, inject, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Rack, RackType } from '../../entities';

@Component({
  selector: 'app-rack-form',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './rack-form.html',
  styleUrl: './rack-form.scss',
})
export class RackForm {
  readonly fb = inject(FormBuilder);
  readonly form: FormGroup;

  saveRack = output<Rack>();

  constructor() {
    this.form = this.fb.group({
      type: [RackType.A, Validators.required],
      uuid: [''],
      id: [null],
    });
  }

  protected readonly RackType = RackType;

  onSubmit() {
    if (this.form.valid) {
      this.saveRack.emit(this.form.getRawValue() as Rack);
    }
  }
}
