import { Component, computed, effect, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { toSignal } from '@angular/core/rxjs-interop';

import { RackTable, WarehouseForm } from '../../../components';
import { Rack, Warehouse } from '../../../entities';
import { WarehouseStore } from '../../../store/warehouse/warehouse-store';
import { CreateDialog } from '../../../components/create-dialog/create-dialog';
import { RackStore } from '../../../store/rack/rack-store';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-warehouse-detail',
  templateUrl: './warehouse-detail.html',
  styleUrl: './warehouse-detail.scss',
  imports: [
    RouterModule,
    WarehouseForm,
    MatButtonModule,
    MatProgressBarModule,
    RackTable,
    MatIcon,
    JsonPipe,
  ],
})
export class WarehouseDetail {
  readonly dialogRef = inject(MatDialog);
  readonly isEdit: boolean;
  readonly warehouseId: number;
  readonly warehouseStore = inject(WarehouseStore);
  readonly rackStore = inject(RackStore);
  readonly route = inject(ActivatedRoute);

  private data = toSignal(this.route.data);

  isLoading = computed(
    () => this.warehouseStore.isPending() || this.rackStore.isPending()
  );

  error = computed(() => this.warehouseStore.error() || this.rackStore.error());

  warehouse = computed(() => this.data().warehouse as Warehouse);

  constructor() {
    this.isEdit = this.route.snapshot.data.isEdit;
    this.warehouseId = this.route.snapshot.params.id;
    effect(() => {
      const isProcessed = this.warehouseStore.isProcessed();
      if (isProcessed) {
        this.warehouseStore.loadAllWarehouses({
          size: 5,
          page: 0,
          sort: 'uuid,desc',
        });
      }
    });
  }

  createRack() {
    const dialog = this.dialogRef.open(CreateDialog, {
      width: '350px',
      data: {
        isWarehouse: false,
      },
    });

    dialog.afterClosed().subscribe(({ rack }: { rack?: Rack }) => {
      if (rack) {
        this.rackStore.addRack({ warehouseId: this.warehouseId, rack });
      }
    });
  }

  saveInfo(warehouse: Warehouse) {
    this.warehouseStore.editWarehouse(warehouse);
  }
}
