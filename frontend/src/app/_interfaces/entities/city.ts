import { BaseEntity } from './base-entity';

export interface City extends BaseEntity {
  city: string;
  scope: string;
  id_geo_area: string;
}
