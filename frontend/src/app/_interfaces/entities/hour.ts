import { BaseEntity } from './base-entity';

export interface Hour extends BaseEntity {
  city_id: number;
  project_id: number;
  cost_center_id: number;
  responsible_id: number;
  datetime: number;
  description: number;
  user_id: number;
  time: number;
}
