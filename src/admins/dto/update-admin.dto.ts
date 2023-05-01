import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateAdminDto {
  @ApiProperty({ example: 'Noname', description: 'Admin email' })
  @IsOptional()
  @IsEmail()
  email: string;
  //*===================================================================
  @ApiProperty({ example: 'Nonamejonov', description: 'Admin token' })
  @ApiProperty({ example: 'Admin123', description: 'Admin usename' })
  @IsOptional()
  @IsString()
  username: string;
  //*===================================================================
  @ApiProperty({ example: 'secreypassword', description: 'Admin password' })
  @IsOptional()
  @IsString()
  password: string;
  @IsOptional()
  @IsBoolean()
  is_active: boolean;
}
