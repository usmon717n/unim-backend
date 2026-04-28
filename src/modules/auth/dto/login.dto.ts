import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email manzili noto\'g\'ri' })
  email: string;

  @IsString()
  @MinLength(1, { message: 'Parol kiritilishi shart' })
  password: string;
}
