import { Component, inject, input, OnInit, output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { FamilyType, Warehouse } from '../../entities';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-warehouse-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButton,
  ],
  templateUrl: './warehouse-form.html',
  styleUrl: './warehouse-form.scss',
})
export class WarehouseForm implements OnInit {
  isNew = input(false);
  isEdit = input.required<boolean>();
  warehouse = input.required<Warehouse | null>();
  saveWarehouse = output<Warehouse>()

  readonly fb = inject(FormBuilder);
  readonly form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      capacity: ['', [Validators.required, Validators.min(0)]],
      clientName: [''],
      familyType: [FamilyType.EST, Validators.required],
      uuid: [''],
      id: [null],
    });
  }

  ngOnInit(): void {
    const warehouseItem = this.warehouse();
    if (warehouseItem) {
      this.form.patchValue(warehouseItem);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.saveWarehouse.emit(this.form.getRawValue() as Warehouse);
    }
  }

  protected readonly FamilyType = FamilyType;
}
