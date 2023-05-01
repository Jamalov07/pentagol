import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateLeagueDto {
  @ApiProperty({ example: 'League123', description: 'League usename' })
  @IsOptional()
  @IsString()
  name: string;
  //*===================================================================
  @ApiProperty({ example: 'secreypassword', description: 'League password' })
  @IsOptional()
  @IsString()
  logo: string;
}
