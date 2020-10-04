import { BaseEntity } from './base-entity';

export interface CostCenter extends BaseEntity {
  name: string;
  description: string;
  garrison: string;
  id_geo_area: string;
}
