import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { User, SafeUser } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  async findByPhone(phoneNumber: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { phoneNumber } });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async create(dto: CreateUserDto): Promise<SafeUser> {
    if (!dto.email && !dto.phoneNumber) {
      throw new BadRequestException(
        'Email yoki telefon raqam kiritilishi shart',
      );
    }

    if (dto.email && (await this.findByEmail(dto.email))) {
      throw new ConflictException('Bu email allaqachon ro\'yxatdan o\'tgan');
    }

    if (dto.phoneNumber && (await this.findByPhone(dto.phoneNumber))) {
      throw new ConflictException(
        'Bu telefon raqam allaqachon ro\'yxatdan o\'tgan',
      );
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    try {
      const user = await this.prisma.user.create({
        data: {
          name: dto.name ?? null,
          email: dto.email ?? null,
          phoneNumber: dto.phoneNumber ?? null,
          passwordHash,
        },
      });
      return this.toSafeUser(user);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const target = (error.meta as { target?: string[] } | undefined)
          ?.target;
        if (target?.includes('email')) {
          throw new ConflictException('Bu email allaqachon ro\'yxatdan o\'tgan');
        }
        if (target?.includes('phone_number')) {
          throw new ConflictException(
            'Bu telefon raqam allaqachon ro\'yxatdan o\'tgan',
          );
        }
        throw new ConflictException(
          'Bu ma\'lumotlar allaqachon ro\'yxatdan o\'tgan',
        );
      }
      throw error;
    }
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.passwordHash);
  }

  toSafeUser(user: User): SafeUser {
    const { passwordHash: _, ...safe } = user;
    return safe;
  }
}
