import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Team } from '../../teams/entities/team.entity';

interface MatchAttr {
  round: number;
  match_date: Date;
  is_finished: boolean;
  first_team_id: number;
  second_team_id: number;
  first_team_goals: number;
  second_team_goals: number;
}
@Table({ tableName: 'match' })
export class Match extends Model<Match, MatchAttr> {
  @ApiProperty({
    example: 1,
    description: 'Match id',
  })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ApiProperty({ example: 'Match123', description: 'Match usename' })
  @Column({ type: DataType.INTEGER })
  round: number;
  @ApiProperty({ example: 'Match123', description: 'Match usename' })
  @Column({ type: DataType.DATE })
  match_date: Date;
  @ApiProperty({ example: 'Match123', description: 'Match usename' })
  @Column({ type: DataType.BOOLEAN })
  is_finished: boolean;
  @ApiProperty({ example: 'Match123', description: 'Match usename' })
  @ForeignKey(() => Team)
  @Column({ type: DataType.INTEGER })
  first_team_id: number;
  @BelongsTo(() => Team, 'first_team_id')
  first_team: Team;
  @ApiProperty({ example: 'Match123', description: 'Match usename' })
  @ForeignKey(() => Team)
  @Column({ type: DataType.INTEGER })
  second_team_id: number;
  @BelongsTo(() => Team, 'second_team_id')
  second_team: Team;
  @ApiProperty({ example: 'Match123', description: 'Match usename' })
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  first_team_goals: number;
  @ApiProperty({ example: 'Match123', description: 'Match usename' })
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  second_team_goals: number;
}
