import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNewsDto {
  @ApiProperty({ example: 'News123', description: 'News usename' })
  @IsNotEmpty()
  @IsString()
  title: string;
  //*===================================================================
  @ApiProperty({ example: 'secreypassword', description: 'News password' })
  @IsNotEmpty()
  @IsString()
  image: string;
  @ApiProperty({ example: 'secreypassword', description: 'News password' })
  @IsNotEmpty()
  @IsString()
  description: string;
}
