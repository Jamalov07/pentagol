import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsOptional, IsNumber } from 'class-validator';

export class UpdateMatchDto {
  @ApiProperty({ example: 'Match123', description: 'Match usename' })
  @IsOptional()
  @IsNumber()
  round: number;
  @ApiProperty({ example: 'Match123', description: 'Match usename' })
  @IsOptional()
  @IsDateString()
  match_date: Date;
  @ApiProperty({ example: 'Match123', description: 'Match usename' })
  @IsOptional()
  @IsBoolean()
  is_finished: boolean;
  @ApiProperty({ example: 'Match123', description: 'Match usename' })
  @IsOptional()
  @IsNumber()
  league_id: number;
  @ApiProperty({ example: 'Match123', description: 'Match usename' })
  @IsOptional()
  @IsNumber()
  first_team_id: number;
  @ApiProperty({ example: 'Match123', description: 'Match usename' })
  @IsOptional()
  @IsNumber()
  second_team_id: number;
  @ApiProperty({ example: 'Match123', description: 'Match usename' })
  @IsOptional()
  @IsNumber()
  first_team_goals: number;
  @ApiProperty({ example: 'Match123', description: 'Match usename' })
  @IsOptional()
  @IsNumber()
  second_team_goals: number;
}
