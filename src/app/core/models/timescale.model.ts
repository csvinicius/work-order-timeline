export type Timescale = 'day' | 'week' | 'month';

export interface TimescaleConfig {
  cellWidth: number;
  range: number;
  unit: Timescale;
}
