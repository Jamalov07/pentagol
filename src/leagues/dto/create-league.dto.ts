import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLeagueDto {
  @ApiProperty({ example: 'League123', description: 'League usename' })
  @IsNotEmpty()
  @IsString()
  name: string;
  //*===================================================================
  @ApiProperty({ example: 'secreypassword', description: 'League password' })
  @IsOptional()
  @IsString()
  logo: string;
}
