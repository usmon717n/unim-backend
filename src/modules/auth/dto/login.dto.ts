import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Email yoki telefon raqam (+998XXXXXXXXX)',
    example: 'ali@example.com',
  })
  @IsString({ message: 'Identifier kiritilishi shart' })
  identifier!: string;

  @ApiProperty({ example: 'Password1' })
  @IsString()
  @MinLength(1, { message: 'Parol kiritilishi shart' })
  password!: string;
}
