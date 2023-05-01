import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateNewsDto {
  @ApiProperty({ example: 'News123', description: 'News usename' })
  @IsOptional()
  @IsString()
  title: string;
  //*===================================================================
  @ApiProperty({ example: 'secreypassword', description: 'News password' })
  @IsOptional()
  @IsString()
  image: string;
  @ApiProperty({ example: 'secreypassword', description: 'News password' })
  @IsOptional()
  @IsString()
  description: string;
}
