import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { Match } from './entities/match.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { League } from '../leagues/entities/league.entity';
import { Team } from '../teams/entities/team.entity';

@Module({
  imports: [SequelizeModule.forFeature([Match, League, Team])],
  controllers: [MatchesController],
  providers: [MatchesService],
})
export class MatchesModule {}
