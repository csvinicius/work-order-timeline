export type WorkOrderStatus =
  | 'open'
  | 'in-progress'
  | 'complete'
  | 'blocked';

export interface WorkOrderDocument {
  docId: string;
  docType: 'workOrder';
  data: {
    name: string;
    workCenterId: string;
    status: WorkOrderStatus;
    startDate: string; // ISO
    endDate: string;   // ISO
  };
}