import { BaseEntity } from './base-entity';

export interface Project extends BaseEntity {
  name: string;
  start_date: number;
  end_date: number;
  duration?: number;
}
