import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString } from 'class-validator';

export class UpdateTeamDto {
  @ApiProperty({ example: 'Team123', description: 'Team usename' })
  @IsOptional()
  @IsString()
  name: string;
  //*===================================================================
  @ApiProperty({ example: 'secreypassword', description: 'Team password' })
  @IsOptional()
  @IsString()
  logo: string;
  @ApiProperty({ example: 'secreypassword', description: 'Team password' })
  @IsOptional()
  @IsNumber()
  league_id: number;
}
