import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Timescale } from '../../../core/models/timescale.model';
import { getWeekNumber } from '../../../core/utils/date.utils';


@Component({
  selector: 'app-timeline-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline-header.component.html',
  styleUrl: './timeline-header.component.scss'
})
export class TimelineHeaderComponent {
  @Input({ required: true }) dates!: Date[];
  @Input({ required: true }) scale!: Timescale;
  @Input({ required: true }) cellWidth!: number;

  getWeekNumber = getWeekNumber;
}
