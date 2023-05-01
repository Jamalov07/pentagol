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

interface NewsAttr {
  title: string;
  image: string;
  description: string;
}
@Table({ tableName: 'news' })
export class News extends Model<News, NewsAttr> {
  @ApiProperty({
    example: 1,
    description: 'News id',
  })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;
  //*===================================================================
  @ApiProperty({ example: 'News123', description: 'News usename' })
  @Column({ type: DataType.STRING })
  title: string;
  //*===================================================================
  @ApiProperty({ example: 'secreypassword', description: 'News password' })
  @Column({ type: DataType.STRING })
  image: string;
  @ApiProperty({ example: 'secreypassword', description: 'News password' })
  @Column({ type: DataType.STRING })
  description: string;
}
