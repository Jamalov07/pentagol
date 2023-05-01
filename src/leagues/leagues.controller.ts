import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { LeaguesService } from './leagues.service';
import { CreateLeagueDto } from './dto/create-league.dto';
import { UpdateLeagueDto } from './dto/update-league.dto';
import { AdminGuard } from '../guards/admin.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('league')
export class LeaguesController {
  constructor(private readonly leaguesService: LeaguesService) {}

  @UseGuards(AdminGuard)
  @Post()
  @UseInterceptors(FileInterceptor('logo'))
  create(@Body() createLeagueDto: CreateLeagueDto, @UploadedFile() logo) {
    return this.leaguesService.create(createLeagueDto, logo);
  }

  @Get()
  findAll() {
    return this.leaguesService.findAll();
  }

  @Get('scoreboard/:id')
  getScoreBoard(@Param('id') leagueId: number) {
    return this.leaguesService.getScoreBoard(leagueId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leaguesService.findOne(+id);
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('logo'))
  update(
    @Param('id') id: string,
    @Body() updateLeagueDto: UpdateLeagueDto,
    @UploadedFile() logo,
  ) {
    return this.leaguesService.update(+id, updateLeagueDto, logo);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leaguesService.remove(+id);
  }
}
