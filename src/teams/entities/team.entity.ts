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
import { League } from '../../leagues/entities/league.entity';
import { Match } from '../../matches/entities/match.entity';

interface TeamAttr {
  name: string;
  logo: string;
  league_id: number;
}
@Table({ tableName: 'team' })
export class Team extends Model<Team, TeamAttr> {
  @ApiProperty({
    example: 1,
    description: 'Team id',
  })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;
  //*===================================================================
  @ApiProperty({ example: 'Team123', description: 'Team usename' })
  @Column({ type: DataType.STRING })
  name: string;
  //*===================================================================
  @ApiProperty({ example: 'secreypassword', description: 'Team password' })
  @Column({ type: DataType.STRING })
  logo: string;
  @ApiProperty({ example: 'secreypassword', description: 'Team password' })
  @ForeignKey(() => League)
  @Column({ type: DataType.INTEGER })
  league_id: number;
  @BelongsTo(() => League)
  league: League;

  @HasMany(() => Match)
  matches: Match[];
}
