import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { News } from './entities/news.entity';
import { JwtModule } from '@nestjs/jwt';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [
    FilesModule,
    JwtModule.register({}),
    SequelizeModule.forFeature([News]),
  ],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule {}
