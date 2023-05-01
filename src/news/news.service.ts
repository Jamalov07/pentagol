import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { InjectModel } from '@nestjs/sequelize';
import { News } from './entities/news.entity';
import { FilesService } from '../files/files.service';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News) private newsRepo: typeof News,
    private filesService: FilesService,
  ) {}

  async create(createNewsDto: CreateNewsDto, image: string): Promise<News> {
    const candidate = await this.newsRepo.findOne({
      where: { title: createNewsDto.title },
    });
    if (candidate) {
      throw new BadRequestException('This info already exists');
    }
    const fileName = await this.filesService.createFile(image);
    return await this.newsRepo.create({ ...createNewsDto, image: fileName });
  }

  async findAll(): Promise<News[]> {
    const allNews = await this.newsRepo.findAll();
    return allNews;
  }

  async findOne(id: number): Promise<News> {
    const oneNews = await this.newsRepo.findOne({ where: { id } });
    if (!oneNews) {
      throw new BadRequestException('News not found');
    }
    return oneNews;
  }

  async update(id: number, updateNewsDto: UpdateNewsDto, image: any) {
    const oneNews = await this.findOne(id);
    if (updateNewsDto.title) {
      const candidate = await this.newsRepo.findOne({
        where: { title: updateNewsDto.title },
      });
      if (candidate && candidate.id !== id) {
        throw new BadRequestException('This info already exists');
      }
    }
    let fileName = oneNews.image;
    if (image) {
      await this.filesService.deleteFile(oneNews.image);
      fileName = await this.filesService.createFile(image);
    }
    await oneNews.update({ ...updateNewsDto, image: fileName });
    return oneNews;
  }

  async remove(id: number): Promise<Object> {
    const oneNews = await this.findOne(id);
    await oneNews.destroy();
    return { message: 'news deleted' };
  }

  async getNewsByLimit(): Promise<News[]> {
    const datas = await this.newsRepo.findAll({
      limit: 15,
      order: [['createdAt', 'DESC']],
    });
    return datas;
  }
}
