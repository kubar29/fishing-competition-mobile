export type UserRole =
  | 'ADMIN'
  | 'ORGANIZER'
  | 'JUDGE'
  | 'USER';

export interface User {
  id: number;
  email: string;
  role: UserRole;
}