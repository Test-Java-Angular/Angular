export enum FamilyType {
  ROB = 'ROB',
  EST = 'EST'
}

export interface Warehouse {
  id: number;
  clientName: string;
  uuid: string;
  capacity: number;
  familyType: FamilyType;
}