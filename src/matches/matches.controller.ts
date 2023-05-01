import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';

@Controller('match')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post('random/:id')
  radnomForSeason(@Param('id') id: number) {
    return this.matchesService.randomPositionForLeaguematches(id);
  }

  @Get()
  findAll() {
    return this.matchesService.findAll();
  }

  @Get('league/:id')
  findLeaguematches(@Param('id') id: number) {
    return this.matchesService.leagueMatches(id);
  }

  @Get('lastround/:id')
  lastMatches(@Param('id') id: number) {
    return this.matchesService.getLeagueLastRound(id);
  }

  @Get('nextround/:id')
  nextMatches(@Param('id') id: number) {
    return this.matchesService.getLeagueNextRound(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matchesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMatchDto: UpdateMatchDto) {
    return this.matchesService.updateForFinish(+id, updateMatchDto);
  }

  @Delete('league/:id')
  remove(@Param('id') id: string) {
    return this.matchesService.remove(+id);
  }
}
