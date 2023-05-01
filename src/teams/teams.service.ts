import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './entities/team.entity';
import { InjectModel } from '@nestjs/sequelize';
import { HttpException, HttpStatus } from '@nestjs/common';
import { FilesService } from '../files/files.service';
import { League } from '../leagues/entities/league.entity';
@Injectable()
export class TeamsService {
  constructor(
    @InjectModel(Team) private teamRepo: typeof Team,
    @InjectModel(League) private leagueRepo: typeof League,
    private fileService: FilesService,
  ) {}

  async create(createTeamDto: CreateTeamDto, logo: any) {
    const candidate = await this.teamRepo.findOne({
      where: {
        name: createTeamDto.name,
        league_id: createTeamDto.league_id,
      },
    });
    if (candidate) {
      throw new BadRequestException('This team already exists');
    }

    const league = await this.leagueRepo.findOne({
      where: {
        id: createTeamDto.league_id,
        ['$teams.matches.is_finished$']: true,
      },
      include: [
        { association: 'teams', include: [{ all: true }] },
        { all: true },
      ],
    });
    if (league) {
      throw new BadRequestException('League already started');
    }

    const fileName = await this.fileService.createFile(logo);
    const newTeam = await this.teamRepo.create({
      ...createTeamDto,
      logo: fileName,
    });
    return newTeam;
  }

  async findAll(): Promise<Team[]> {
    const allTeams = await this.teamRepo.findAll();
    return allTeams;
  }

  async findOne(id: number): Promise<Team> {
    const oneTeam = await this.teamRepo.findOne({ where: { id } });
    if (!oneTeam) {
      throw new BadRequestException('Team not found');
    }
    return oneTeam;
  }

  async update(id: number, updateTeamDto: UpdateTeamDto, logo: any) {
    const team = await this.findOne(id);
    if (updateTeamDto.name) {
      const candidate = await this.teamRepo.findOne({
        where: {
          name: updateTeamDto.name,
          league_id: team.league_id,
        },
      });
      if (candidate && candidate.id !== id) {
        throw new BadRequestException('This team already exists');
      }
    }
    if (updateTeamDto.league_id) {
      const candidate = await this.teamRepo.findOne({
        where: {
          name: team.name,
          league_id: updateTeamDto.league_id,
        },
      });
      if (candidate && candidate.id !== id) {
        throw new BadRequestException('This team already exists');
      }
    }
    let fileName = team.logo;
    if (logo) {
      await this.fileService.deleteFile(team.logo);
      fileName = await this.fileService.createFile(logo);
    }
    await team.update(updateTeamDto);
    return team;
  }

  async remove(id: number): Promise<Object> {
    const team = await this.findOne(id);
    await this.fileService.deleteFile(team.logo);
    await team.destroy();
    return { message: 'team deleted' };
  }
}
