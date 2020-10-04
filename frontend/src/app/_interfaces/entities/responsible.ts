import { BaseEntity } from './base-entity';

export interface Responsible extends BaseEntity {
  id_user: number;
  id_position: number;
  email: string;
}
