import { Component, effect, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

import { Rack } from '../../entities';
import { RackStore } from '../../store/rack/rack-store';
import { DeleteDialog } from '../delete-dialog/delete-dialog';

@Component({
  selector: 'app-rack-table',
  imports: [MatIconModule, MatButtonModule, MatSortModule, CommonModule],
  templateUrl: './rack-table.html',
  styleUrl: './rack-table.scss',
})
export class RackTable {
  readonly rackStore = inject(RackStore);
  readonly dialog = inject(MatDialog);

  readonly isEdit = input.required<boolean>();
  readonly warehouseId = input.required<number>();

  readonly racks$ = this.rackStore.entities;

  constructor() {
    effect(() => {
      const warehouseId = this.warehouseId();
      const isProcessed = this.rackStore.isProcessed();
      if (warehouseId || isProcessed) {
        this.rackStore.loadAllRacks({
          warehouseId,
          pageable: {
            page: 0,
            size: 100,
          },
        });
      }
    });
  }

  /**
   * Get track table
   * @param index
   * @param rack
   */
  trackByRack(index: number, rack: Rack) {
    return rack?.id || index;
  }

  /**
   * Delete the rack
   * @param rack
   */
  deleteRack(rack: Rack) {
    const dialog = this.dialog.open(DeleteDialog, {
      data: {
        isWarehouse: false,
        uuid: rack.uuid,
        rackType: rack.type,
        warehouseId: this.warehouseId(),
      },
    });

    dialog.afterClosed().subscribe((result: string) => {
      if (result.toLowerCase() === 'y') {
        this.rackStore.deleteRack({ warehouseId: this.warehouseId(), rackId: rack.id });
      }
    });
  }
}
