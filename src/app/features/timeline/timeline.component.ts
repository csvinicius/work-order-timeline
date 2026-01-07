import { Component, computed, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  addDays,
  addWeeks,
  addMonths,
  startOfDay,
  startOfWeek,
  startOfMonth,
  diffInDays,
  diffInWeeks,
  diffInMonths,
  toDate
} from '../../core/utils/date.utils';

import { Timescale, TimescaleConfig } from '../../core/models/timescale.model';
import { WorkOrderDocument } from '../../core/models/work-order.model';
import { WorkOrderService } from '../../core/services/work-order.service';

import { TimelineHeaderComponent } from './timeline-header/timeline-header.component';
import { WorkOrderPanelComponent } from '../work-order-panel/work-order-panel.component';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [
    CommonModule,
    TimelineHeaderComponent,
    WorkOrderPanelComponent
  ],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss'
})
export class TimelineComponent {

  timescaleOptions = [
    { label: 'Day', value: 'day' as Timescale },
    { label: 'Week', value: 'week' as Timescale },
    { label: 'Month', value: 'month' as Timescale }
  ];

  timescale = signal<Timescale>('day');

  onTimescaleChange(value: Timescale) {
    this.timescale.set(value);
  }

  readonly TIMESCALE_CONFIG: Record<Timescale, TimescaleConfig> = {
    day: { cellWidth: 120, range: 14, unit: 'day' },
    week: { cellWidth: 160, range: 8, unit: 'week' },
    month: { cellWidth: 240, range: 6, unit: 'month' }
  };

  cellWidth = computed(
    () => this.TIMESCALE_CONFIG[this.timescale()].cellWidth
  );

  dates = computed(() => {
    const { unit, range } = this.TIMESCALE_CONFIG[this.timescale()];
    const today = startOfDay(new Date());
    const result: Date[] = [];

    for (let i = -range; i <= range; i++) {
      if (unit === 'day') {
        result.push(addDays(today, i));
      }
      if (unit === 'week') {
        result.push(startOfWeek(addWeeks(today, i)));
      }
      if (unit === 'month') {
        result.push(startOfMonth(addMonths(today, i)));
      }
    }

    return result;
  });

  showPanel = signal(false);
  panelMode = signal<'create' | 'edit'>('create');
  selectedOrder = signal<WorkOrderDocument | null>(null);
  clickedDate = signal<Date | null>(null);
  activeWorkCenterId = signal<string | null>(null);
  openDropdownId = signal<string | null>(null);

  today = new Date();

  constructor(
    private readonly workOrderService: WorkOrderService
  ) {
    effect(() => {
      const orders = this.workOrders();
      this.workOrderService.saveToLocalStorage(orders);
    });

    if (typeof window !== 'undefined') {
      window.addEventListener('click', () => this.closeDropdown());
    }
  }

  // @upgrade: Implement infinite horizontal scroll - dynamically load more dates as user scrolls
  // @upgrade: Add drag & drop functionality to resize/move work orders
  // @upgrade: Implement keyboard navigation (Tab, Enter, Escape for panel, Arrow keys for cell navigation)

  workCenters = this.workOrderService.workCenters;
  workOrders = this.workOrderService.workOrders;

  workOrdersByCenter = computed(() => {
    const map = new Map<string, WorkOrderDocument[]>();

    this.workOrders().forEach(order => {
      const centerId = order.data.workCenterId;
      if (!map.has(centerId)) {
        map.set(centerId, []);
      }
      map.get(centerId)!.push(order);
    });

    return map;
  });

  getOrdersForCenter(centerId: string) {
    return this.workOrdersByCenter().get(centerId) || [];
  }

  onCellClick(workCenterId: string, date: Date) {
    this.panelMode.set('create');
    this.selectedOrder.set(null);
    this.clickedDate.set(date);
    this.activeWorkCenterId.set(workCenterId);
    this.showPanel.set(true);
  }

  onEditOrder(order: WorkOrderDocument) {
    this.panelMode.set('edit');
    this.selectedOrder.set(order);
    this.clickedDate.set(null);
    this.showPanel.set(true);
    this.openDropdownId.set(null);
  }

  onDeleteOrder(orderId: string) {
    // @upgrade: Replace alert/confirm with custom modal component for better UX
    if (confirm('Are you sure you want to delete this work order?')) {
      this.workOrderService.delete(orderId);
    }
    this.openDropdownId.set(null);
  }

  onSaveOrder(order: WorkOrderDocument) {
    if (this.panelMode() === 'create') {
      const workCenterId = this.activeWorkCenterId();

      if (!workCenterId) {
        return;
      }

      const newOrder: WorkOrderDocument = {
        ...order,
        docId: `wo-${Date.now()}`,
        data: {
          ...order.data,
          workCenterId
        }
      };

      // @upgrade: Replace alert with toast notification system for better UX feedback
      if (this.hasOverlap(newOrder)) {
        alert('This work order overlaps with an existing order on the same work center.');
        return;
      }

      this.workOrderService.create(newOrder);
    } else {
      if (this.hasOverlap(order, order.docId)) {
        alert('This work order overlaps with an existing order on the same work center.');
        return;
      }

      this.workOrderService.update(order);
    }

    this.onCancelPanel();
  }

  onCancelPanel() {
    this.showPanel.set(false);
    this.selectedOrder.set(null);
    this.clickedDate.set(null);
    this.activeWorkCenterId.set(null);
  }

  toggleDropdown(orderId: string, event: Event) {
    event.stopPropagation();
    this.openDropdownId.set(this.openDropdownId() === orderId ? null : orderId);
  }

  closeDropdown() {
    this.openDropdownId.set(null);
  }

  isDropdownOpen(orderId: string): boolean {
    return this.openDropdownId() === orderId;
  }

  private hasOverlap(order: WorkOrderDocument, excludeId?: string): boolean {
    const ordersInCenter = this.workOrdersByCenter().get(order.data.workCenterId) || [];

    const orderStart = toDate(order.data.startDate);
    const orderEnd = toDate(order.data.endDate);

    return ordersInCenter.some(existing => {
      if (existing.docId === excludeId) return false;

      const existingStart = toDate(existing.data.startDate);
      const existingEnd = toDate(existing.data.endDate);

      return orderStart <= existingEnd && orderEnd >= existingStart;
    });
  }

  getOrderStyle(order: WorkOrderDocument) {
    const scale = this.timescale();
    const width = this.cellWidth();
    const start = new Date(order.data.startDate);
    const end = new Date(order.data.endDate);
    const base = this.dates()[0];

    let offset = 0;
    let duration = 1;

    if (scale === 'day') {
      offset = diffInDays(start, base);
      duration = diffInDays(end, start) + 1;
    }

    if (scale === 'week') {
      offset = diffInWeeks(start, base);
      duration = diffInWeeks(end, start) + 1;
    }

    if (scale === 'month') {
      offset = diffInMonths(start, base);
      duration = diffInMonths(end, start) + 1;
    }

    return {
      left: `${offset * width}px`,
      width: `${duration * width}px`
    };
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  isToday(date: Date): boolean {
    return date.toDateString() === this.today.toDateString();
  }

  trackByWorkCenter = (_: number, item: any) => item.docId;
  trackByOrder = (_: number, item: any) => item.docId;
  trackByDate = (_: number, date: Date) => date.getTime();
}