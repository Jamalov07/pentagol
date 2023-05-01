import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTeamDto {
  @ApiProperty({ example: 'Team123', description: 'Team usename' })
  @IsNotEmpty()
  @IsString()
  name: string;
  //*===================================================================
  @ApiProperty({ example: 'secreypassword', description: 'Team password' })
  @IsOptional()
  @IsString()
  logo: string;
  @ApiProperty({ example: 'secreypassword', description: 'Team password' })
  @IsNotEmpty()
  league_id: number;
}
