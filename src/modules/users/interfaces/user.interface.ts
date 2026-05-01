export interface User {
  id: string;
  name: string | null;
  email: string | null;
  phoneNumber: string | null;
  passwordHash: string;
  createdAt: Date;
}

export type SafeUser = Omit<User, 'passwordHash'>;
