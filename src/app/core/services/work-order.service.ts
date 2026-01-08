import { Injectable, signal, computed } from '@angular/core';
import { WorkCenterDocument } from '../models/work-center.model';
import { WorkOrderDocument } from '../models/work-order.model';

const STORAGE_KEY = 'work-orders-timeline';

const DEFAULT_WORK_ORDERS: WorkOrderDocument[] = [
  {
    docId: 'wo-1',
    docType: 'workOrder',
    data: {
      name: 'Order Alpha',
      workCenterId: 'wc-1',
      status: 'complete',
      startDate: '2025-12-28',
      endDate: '2026-01-01',
    },
  },
  {
    docId: 'wo-2',
    docType: 'workOrder',
    data: {
      name: 'Order Beta',
      workCenterId: 'wc-1',
      status: 'in-progress',
      startDate: '2026-01-06',
      endDate: '2026-01-13',
    },
  },
  {
    docId: 'wo-3',
    docType: 'workOrder',
    data: {
      name: 'Order Gamma',
      workCenterId: 'wc-2',
      status: 'open',
      startDate: '2026-01-02',
      endDate: '2026-01-05',
    },
  },
  {
    docId: 'wo-4',
    docType: 'workOrder',
    data: {
      name: 'Order Delta',
      workCenterId: 'wc-3',
      status: 'blocked',
      startDate: '2025-01-08',
      endDate: '2025-01-15',
    },
  },
  {
    docId: 'wo-5',
    docType: 'workOrder',
    data: {
      name: 'Order Epsilon',
      workCenterId: 'wc-2',
      status: 'in-progress',
      startDate: '2026-01-18',
      endDate: '2026-01-25',
    },
  },
  {
    docId: 'wo-6',
    docType: 'workOrder',
    data: {
      name: 'Order Zeta',
      workCenterId: 'wc-3',
      status: 'complete',
      startDate: '2025-12-25',
      endDate: '2025-12-27',
    },
  },
  {
    docId: 'wo-7',
    docType: 'workOrder',
    data: {
      name: 'Order Eta',
      workCenterId: 'wc-1',
      status: 'open',
      startDate: '2026-01-20',
      endDate: '2026-01-22',
    },
  },
  {
    docId: 'wo-8',
    docType: 'workOrder',
    data: {
      name: 'Order Theta',
      workCenterId: 'wc-4',
      status: 'blocked',
      startDate: '2026-01-05',
      endDate: '2026-01-08',
    },
  },
  {
    docId: 'wo-9',
    docType: 'workOrder',
    data: {
      name: 'Order Iota',
      workCenterId: 'wc-5',
      status: 'in-progress',
      startDate: '2026-01-16',
      endDate: '2026-01-25',
    },
  },
];

@Injectable({ providedIn: 'root' })
export class WorkOrderService {
  private _workCenters = signal<WorkCenterDocument[]>([
    {
      docId: 'wc-1',
      docType: 'workCenter',
      data: { name: 'Genesis Hardware'},
    },
    {
      docId: 'wc-2',
      docType: 'workCenter',
      data: { name: 'Rodriques Electrics' },
    },
    {
      docId: 'wc-3',
      docType: 'workCenter',
      data: { name: 'Konsulting Inc' },
    },
    {
      docId: 'wc-4',
      docType: 'workCenter',
      data: { name: 'McMarrow Distribution' },
    },
    {
      docId: 'wc-5',
      docType: 'workCenter',
      data: { name: 'Spartan Manufacturin' },
    },
  ]);

  private _workOrders = signal<WorkOrderDocument[]>(this.loadFromLocalStorage());

  workCenters = computed(() => this._workCenters());
  workOrders = computed(() => this._workOrders());

  // @upgrade: Implement undo/redo functionality with action history
  // @upgrade: Add optimistic updates with rollback on error for better UX
  // @upgrade: Implement batch operations (create/update/delete multiple orders at once)

  create(order: WorkOrderDocument) {
    this._workOrders.update(list => [...list, order]);
  }

  update(order: WorkOrderDocument) {
    this._workOrders.update(list =>
      list.map(o => (o.docId === order.docId ? order : o))
    );
  }

  delete(id: string) {
    this._workOrders.update(list =>
      list.filter(o => o.docId !== id)
    );
  }

  saveToLocalStorage(orders: WorkOrderDocument[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  private loadFromLocalStorage(): WorkOrderDocument[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
    return DEFAULT_WORK_ORDERS;
  }
}