import type { Role, UserStatus } from './enums';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  phone: string;
  role: Role;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}