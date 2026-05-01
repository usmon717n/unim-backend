import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { normalizePhone } from '../../../common/helpers/phone.helper';

export class CreateUserDto {
  @ApiPropertyOptional({ example: 'Ali Valiyev' })
  @IsString()
  @IsOptional()
  @MinLength(2, { message: 'Ism kamida 2 ta belgidan iborat bo\'lishi kerak' })
  @MaxLength(50, { message: 'Ism ko\'pi bilan 50 ta belgidan iborat bo\'lishi kerak' })
  name?: string;

  @ApiPropertyOptional({ example: 'ali@example.com' })
  @IsEmail({}, { message: 'Email manzili noto\'g\'ri' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.toLowerCase() : value))
  email?: string;

  @ApiPropertyOptional({ example: '+998901234567' })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? normalizePhone(value) : value))
  @Matches(/^\+998\d{9}$/, {
    message: 'Telefon raqam formati noto\'g\'ri. Namuna: +998901234567',
  })
  phoneNumber?: string;

  @ApiProperty({ example: 'Password1' })
  @IsString()
  @MinLength(8, { message: 'Parol kamida 8 ta belgidan iborat bo\'lishi kerak' })
  @MaxLength(100)
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)/, {
    message: 'Parolda kamida bitta harf va bitta raqam bo\'lishi kerak',
  })
  password!: string;
}
