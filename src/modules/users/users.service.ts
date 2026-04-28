import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { User, SafeUser } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((u) => u.email === email.toLowerCase());
  }

  async findById(id: string): Promise<User | undefined> {
    return this.users.find((u) => u.id === id);
  }

  async create(dto: CreateUserDto): Promise<SafeUser> {
    const existing = await this.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Bu email allaqachon ro\'yxatdan o\'tgan');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user: User = {
      id: crypto.randomUUID(),
      name: dto.name,
      email: dto.email.toLowerCase(),
      passwordHash,
      createdAt: new Date(),
    };

    this.users.push(user);
    return this.toSafeUser(user);
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.passwordHash);
  }

  toSafeUser(user: User): SafeUser {
    const { passwordHash: _, ...safe } = user;
    return safe;
  }
}
