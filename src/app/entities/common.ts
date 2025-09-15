export interface DeleteDialogData {
  isWarehouse: boolean;
  uuid: string;
  clientName?: string;
  warehouseId?: number;
  rackType?: string;
}

export type CreateDialogData = {
  isWarehouse: boolean;
};
