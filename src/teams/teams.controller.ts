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
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AdminGuard } from '../guards/admin.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('team')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @UseGuards(AdminGuard)
  @Post()
  @UseInterceptors(FileInterceptor('logo'))
  create(@Body() createTeamDto: CreateTeamDto, @UploadedFile() logo) {
    return this.teamsService.create(createTeamDto, logo);
  }

  @Get()
  findAll() {
    return this.teamsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamsService.findOne(+id);
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('logo'))
  update(
    @Param('id') id: string,
    @Body() updateTeamDto: UpdateTeamDto,
    @UploadedFile() logo,
  ) {
    return this.teamsService.update(+id, updateTeamDto, logo);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamsService.remove(+id);
  }
}
