import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { LeaguesModule } from './leagues/leagues.module';
import { TeamsModule } from './teams/teams.module';
import { MatchesModule } from './matches/matches.module';
import { NewsModule } from './news/news.module';
import { AdminsModule } from './admins/admins.module';
import { Admin } from './admins/entities/admin.entity';
import { League } from './leagues/entities/league.entity';
import { Match } from './matches/entities/match.entity';
import { News } from './news/entities/news.entity';
import { Team } from './teams/entities/team.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [Admin, League, Match, News, Team],
      autoLoadModels: true,
      logging: false,
    }),
    LeaguesModule,
    TeamsModule,
    MatchesModule,
    NewsModule,
    AdminsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
