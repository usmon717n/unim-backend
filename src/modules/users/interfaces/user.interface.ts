export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

export type SafeUser = Omit<User, 'passwordHash'>;
