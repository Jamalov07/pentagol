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

interface LeagueAttr {
  name: string;
  logo: string;
}
@Table({ tableName: 'league' })
export class League extends Model<League, LeagueAttr> {
  @ApiProperty({
    example: 1,
    description: 'League id',
  })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;
  //*===================================================================
  @ApiProperty({ example: 'League123', description: 'League usename' })
  @Column({ type: DataType.STRING })
  name: string;
  //*===================================================================
  @ApiProperty({ example: 'secreypassword', description: 'League password' })
  @Column({ type: DataType.STRING })
  logo: string;

  @HasMany(() => Team)
  teams: Team[];
}
