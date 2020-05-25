import { Hour } from './hour';

export interface HourView extends Hour {
  city: string;
  cost_center_name: string;
  full_name: string;
  project_name: string;
}
