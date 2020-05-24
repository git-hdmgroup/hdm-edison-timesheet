import { BaseEntity } from './base-entity';

export interface CostCenter extends BaseEntity {
  name: string;
  type: number;
  active: number;
}
