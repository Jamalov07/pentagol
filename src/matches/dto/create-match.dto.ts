import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateMatchDto {
  @ApiProperty({ example: 'Match123', description: 'Match usename' })
  @IsNotEmpty()
  @IsNumber()
  round: number;
  @ApiProperty({ example: 'Match123', description: 'Match usename' })
  @IsNotEmpty()
  @IsDateString()
  match_date: Date;
  @ApiProperty({ example: 'Match123', description: 'Match usename' })
  @IsNotEmpty()
  @IsNumber()
  league_id: number;
  @ApiProperty({ example: 'Match123', description: 'Match usename' })
  @IsNotEmpty()
  @IsNumber()
  first_team_id: number;
  @ApiProperty({ example: 'Match123', description: 'Match usename' })
  @IsNotEmpty()
  @IsNumber()
  second_team_id: number;
  @ApiProperty({ example: 'Match123', description: 'Match usename' })
  @IsNotEmpty()
  @IsNumber()
  first_team_goals: number;
  @ApiProperty({ example: 'Match123', description: 'Match usename' })
  @IsNotEmpty()
  @IsNumber()
  second_team_goals: number;
}
