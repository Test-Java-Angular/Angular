import { PageableType } from './pagination-result';

export enum RackType {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D'
}

export interface Rack {
  id: number;
  uuid: string;
  type: RackType;
}

export type RackSearchType = {
  warehouseId: number;
  pageable: PageableType;
};

export type RackDeleteType = {
  warehouseId: number;
  rackId: number;
};

export type RackAddType = {
  warehouseId: number;
  rack: Rack;
};