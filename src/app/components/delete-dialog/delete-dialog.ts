import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { DeleteDialogData } from '../../entities';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.html',
  styleUrl: './delete-dialog.scss',
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteDialog {
  readonly dialogRef = inject(MatDialogRef<DeleteDialog>);
  readonly data = inject<DeleteDialogData>(MAT_DIALOG_DATA);
}
