import { BaseEntity } from './base-entity';

export interface AppUser extends BaseEntity {
  email: string;
  id_position: number;
  name: string;
  role: number;
  surname: string;
  cost_center_sender: string;
  full_name?: string;
}
