import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2, { message: 'Ism kamida 2 ta belgidan iborat bo\'lishi kerak' })
  @MaxLength(50, { message: 'Ism ko\'pi bilan 50 ta belgidan iborat bo\'lishi kerak' })
  name: string;

  @IsEmail({}, { message: 'Email manzili noto\'g\'ri' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Parol kamida 8 ta belgidan iborat bo\'lishi kerak' })
  @MaxLength(100)
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)/, {
    message: 'Parolda kamida bitta harf va bitta raqam bo\'lishi kerak',
  })
  password: string;
}
