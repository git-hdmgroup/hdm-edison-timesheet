import { AppUser } from './entities/app-user';

export interface LoginResponse {
  user: AppUser;
  token: string;
}
