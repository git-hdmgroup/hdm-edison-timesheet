import { BaseEntity } from './base-entity';

export interface Position extends BaseEntity {
  name: string;
  cost: number;
}
