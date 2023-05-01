import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({ example: 'Noname', description: 'Admin email' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
  //*===================================================================
  @ApiProperty({ example: 'Admin123', description: 'Admin usename' })
  @IsNotEmpty()
  @IsString()
  username: string;
  //*===================================================================
  @ApiProperty({ example: 'secreypassword', description: 'Admin password' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
