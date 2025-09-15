import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { CreateDialogData, Rack, Warehouse } from '../../entities';
import { WarehouseForm } from '../warehouse-form/warehouse-form';
import { RackForm } from '../rack-form/rack-form';

@Component({
  selector: 'app-create-dialog',
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    WarehouseForm,
    RackForm,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './create-dialog.html',
  styleUrl: './create-dialog.scss',
})
export class CreateDialog {
  readonly dialogRef = inject(MatDialogRef<CreateDialog>);
  readonly data = inject<CreateDialogData>(MAT_DIALOG_DATA);

  warehouse = signal<Warehouse | undefined>(undefined);
  rack = signal<Rack | undefined>(undefined);

  saveInfo(dataSaved: Warehouse | Rack, isWarehouse: boolean) {
    this.dialogRef.close({
      warehouse: isWarehouse ? dataSaved : undefined,
      rack: !isWarehouse ? dataSaved : undefined,
    });
  }
}
