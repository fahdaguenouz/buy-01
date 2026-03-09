export enum UserRole {
  CLIENT = 'CLIENT',
  SELLER = 'SELLER',
  ADMIN = 'ADMIN'
}

export interface User {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}