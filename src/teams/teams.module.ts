import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Team } from './entities/team.entity';
import { JwtModule } from '@nestjs/jwt';
import { FilesModule } from '../files/files.module';
import { League } from '../leagues/entities/league.entity';

@Module({
  imports: [
    JwtModule.register({}),
    FilesModule,
    SequelizeModule.forFeature([Team,League]),
  ],
  controllers: [TeamsController],
  providers: [TeamsService],
})
export class TeamsModule {}
