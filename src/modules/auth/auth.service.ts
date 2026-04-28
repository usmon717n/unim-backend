import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SafeUser } from '../users/interfaces/user.interface';
import { JwtPayload } from './interfaces/jwt-payload.interface';

export interface AuthResponse {
  accessToken: string;
  user: SafeUser;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<SafeUser | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const isValid = await this.usersService.validatePassword(user, password);
    if (!isValid) return null;

    return this.usersService.toSafeUser(user);
  }

  async register(dto: CreateUserDto): Promise<AuthResponse> {
    const user = await this.usersService.create(dto);
    return { accessToken: this.signToken(user), user };
  }

  login(user: SafeUser): AuthResponse {
    return { accessToken: this.signToken(user), user };
  }

  private signToken(user: SafeUser): string {
    const payload: JwtPayload = { sub: user.id, email: user.email, name: user.name };
    return this.jwtService.sign(payload);
  }
}
