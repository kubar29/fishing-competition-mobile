export type UserRole = 'ADMIN' | 'ORGANIZER' | 'JUDGE' | 'USER';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}