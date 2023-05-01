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

interface AdminAttr {
  username: string;
  password: string;
  email: string;
  token: string;
  is_active: boolean;
  is_creator: boolean;
}
@Table({ tableName: 'admin' })
export class Admin extends Model<Admin, AdminAttr> {
  @ApiProperty({
    example: 1,
    description: 'Admin id',
  })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;
  //*===================================================================
  @ApiProperty({ example: 'Noname', description: 'Admin email' })
  @Column({ type: DataType.STRING })
  email: string;
  //*===================================================================
  @ApiProperty({ example: 'Nonamejonov', description: 'Admin token' })
  @Column({ type: DataType.STRING })
  token: string;
  //*===================================================================
  @ApiProperty({ example: 'Admin123', description: 'Admin usename' })
  @Column({ type: DataType.STRING })
  username: string;
  //*===================================================================
  @ApiProperty({ example: 'secreypassword', description: 'Admin password' })
  @Column({ type: DataType.STRING })
  password: string;
  @ApiProperty({ example: 'secreypassword', description: 'Admin password' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  is_active: boolean;
  @ApiProperty({ example: 'secreypassword', description: 'Admin password' })
  @Column({ type: DataType.BOOLEAN })
  is_creator: boolean;
}
