import { Component, EventEmitter, Input, Output, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { WorkOrderDocument, WorkOrderStatus } from '../../core/models/work-order.model';
import { addDays } from '../../core/utils/date.utils';

@Component({
  selector: 'app-work-order-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbDatepickerModule, NgSelectModule],
  templateUrl: './work-order-panel.component.html',
  styleUrls: ['./work-order-panel.component.scss'],
})
export class WorkOrderPanelComponent implements OnInit, OnChanges {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() initialData?: WorkOrderDocument | null;
  @Input() clickedDate?: Date | null;

  @Output() save = new EventEmitter<WorkOrderDocument>();
  @Output() cancel = new EventEmitter<void>();

  statusOptions: { label: string; value: WorkOrderStatus }[] = [
    { label: 'Open', value: 'open' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Complete', value: 'complete' },
    { label: 'Blocked', value: 'blocked' },
  ];

  form = this.fb.group({
    name: ['', Validators.required],
    status: ['open' as WorkOrderStatus, Validators.required],
    startDate: [null as NgbDateStruct | null, Validators.required],
    endDate: [null as NgbDateStruct | null, Validators.required],
  });

  constructor(private fb: FormBuilder) {}

  // @upgrade: Implement form auto-save as draft to prevent data loss
  // @upgrade: Add custom date validators for business hours/holidays
  // @upgrade: Add tooltips with helpful hints for each form field

  ngOnInit() {
    this.initializeForm();
  }

  ngOnChanges() {
    this.initializeForm();
  }

  private initializeForm() {
    if (this.mode === 'edit' && this.initialData) {
      const startDate = this.parseDate(this.initialData.data.startDate);
      const endDate = this.parseDate(this.initialData.data.endDate);

      this.form.patchValue({
        name: this.initialData.data.name,
        status: this.initialData.data.status,
        startDate: this.toNgbDate(startDate),
        endDate: this.toNgbDate(endDate),
      });
    } else if (this.mode === 'create' && this.clickedDate) {
      const startDate = this.clickedDate;
      const endDate = addDays(startDate, 7);

      this.form.patchValue({
        name: '',
        status: 'open',
        startDate: this.toNgbDate(startDate),
        endDate: this.toNgbDate(endDate),
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;
    const startDate = this.fromNgbDate(formValue.startDate!);
    const endDate = this.fromNgbDate(formValue.endDate!);

    // @upgrade: Replace alert with inline error message
    if (endDate <= startDate) {
      alert('End date must be after start date');
      return;
    }

    const orderData: WorkOrderDocument = {
      docId: this.initialData?.docId || '',
      docType: 'workOrder',
      data: {
        name: formValue.name!,
        status: formValue.status!,
        workCenterId: this.initialData?.data.workCenterId || '',
        startDate: this.toISODate(startDate),
        endDate: this.toISODate(endDate),
      },
    };

    this.save.emit(orderData);
  }

  onCancel() {
    this.cancel.emit();
  }

  private toNgbDate(date: Date): NgbDateStruct {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
  }

  private fromNgbDate(date: NgbDateStruct): Date {
    return new Date(date.year, date.month - 1, date.day);
  }

  private parseDate(isoString: string): Date {
    const [year, month, day] = isoString.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  private toISODate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  hasError(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }
}