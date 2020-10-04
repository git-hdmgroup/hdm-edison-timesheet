import { BaseEntity } from './base-entity';

export interface Project extends BaseEntity {
  city_id: number;
  cost_center_id: number;
  cost_asset: string;
  typology: string;
  description: string;
}
