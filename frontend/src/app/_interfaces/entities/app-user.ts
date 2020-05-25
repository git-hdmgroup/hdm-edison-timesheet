import { BaseEntity } from './base-entity';

export interface AppUser extends BaseEntity {
  email: string;
  ldap_id: string;
  name: string;
  role: number;
  surname: string;
  full_name?: string;
}
