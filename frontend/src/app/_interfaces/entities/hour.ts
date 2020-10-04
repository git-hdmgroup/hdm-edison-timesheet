import { BaseEntity } from './base-entity';

export interface Hour extends BaseEntity {
  project_id: number;
  datetime: number;
  description: number;
  user_id: number;
  time: number;
}
