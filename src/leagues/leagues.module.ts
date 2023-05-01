import { Module } from '@nestjs/common';
import { LeaguesService } from './leagues.service';
import { LeaguesController } from './leagues.controller';
import { League } from './entities/league.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { FilesModule } from '../files/files.module';
import { Match } from '../matches/entities/match.entity';
import { Team } from '../teams/entities/team.entity';

@Module({
  imports: [
    FilesModule,
    JwtModule.register({}),
    SequelizeModule.forFeature([League, Match, Team]),
  ],
  controllers: [LeaguesController],
  providers: [LeaguesService],
})
export class LeaguesModule {}
