import { BaseEntity } from './base-entity';

export interface City extends BaseEntity {
  city: string;
  province_state: string;
  zip_code: string;
  nation: string;
}
