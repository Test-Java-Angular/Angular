import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { MatRippleModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialog } from '@angular/material/dialog';

import { merge, Subject, takeUntil } from 'rxjs';

import { WarehouseStore } from '../../../store/warehouse/warehouse-store';
import { Warehouse } from '../../../entities';
import { DeleteDialog } from '../../../components';
import { CreateDialog } from '../../../components/create-dialog/create-dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-warehouse-list',
  templateUrl: './warehouse-list.html',
  styleUrl: './warehouse-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatRippleModule,
    MatProgressBarModule,

    RouterModule,
    RouterLink,
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class WarehouseList implements AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;

  dialogRef = inject(MatDialog);
  readonly _changeDetectorRef = inject(ChangeDetectorRef);
  private readonly warehouseStore = inject(WarehouseStore);

  isLoading = this.warehouseStore.isPending;

  warehouses$ = this.warehouseStore.entities;
  currentPage = this.warehouseStore.page;
  size = this.warehouseStore.size;
  total$ = this.warehouseStore.totalItems;

  error = this.warehouseStore.error;

  private _unsubscribeAll: Subject<unknown> = new Subject<unknown>();

  constructor() {
    effect(() => {
      const isProcessed = this.warehouseStore.isProcessed();
      if (isProcessed) {
        this.warehouseStore.loadAllWarehouses({
          size: this._paginator.pageSize,
          page: this._paginator.pageIndex,
          sort: `${this._sort.active},${this._sort.direction}`,
        });
      }
    });
  }

  ngAfterViewInit(): void {
    if (this._sort && this._paginator) {
      this._sort.sort({
        id: 'uuid',
        start: 'desc',
        disableClear: true,
      });

      this._changeDetectorRef.markForCheck();

      this._sort.sortChange
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(() => {
          this._paginator.pageIndex = 0;
        });

      merge(this._sort.sortChange, this._paginator.page).subscribe(() => {
        this.warehouseStore.loadAllWarehouses({
          size: this._paginator.pageSize,
          page: this._paginator.pageIndex,
          sort: `${this._sort.active},${this._sort.direction}`,
        });
      });
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: Warehouse): number | undefined {
    return item.id || index;
  }

  /**
   * Delete the warehouse after confirm
   * @param warehouse
   */
  deleteWarehouse(warehouse: Warehouse) {
    this.warehouseStore.setSelectedId(warehouse.id);
    const dialog = this.dialogRef.open(DeleteDialog, {
      data: {
        isWarehouse: true,
        clientName: warehouse.clientName,
        uuid: warehouse.uuid,
      },
    });

    dialog.afterClosed().subscribe((result: string) => {
      if (result.toLowerCase() === 'y') {
        this.warehouseStore.deleteWarehouse(warehouse.id);
      }
    });
  }

  createWarehouse() {
    const dialog = this.dialogRef.open(CreateDialog, {
      width: '350px',
      data: {
        isWarehouse: true,
      },
    });

    dialog
      .afterClosed()
      .subscribe(({ warehouse }: { warehouse?: Warehouse }) => {
        if (warehouse) {
          this.warehouseStore.addWarehouse(warehouse);
        }
      });
  }
}
