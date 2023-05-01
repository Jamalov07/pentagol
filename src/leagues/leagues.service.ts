import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLeagueDto } from './dto/create-league.dto';
import { UpdateLeagueDto } from './dto/update-league.dto';
import { League } from './entities/league.entity';
import { InjectModel } from '@nestjs/sequelize';
import { FilesService } from '../files/files.service';
import { Team } from '../teams/entities/team.entity';
import { Match } from '../matches/entities/match.entity';
import { Op } from 'sequelize';

@Injectable()
export class LeaguesService {
  constructor(
    @InjectModel(League) private leagueRepo: typeof League,
    @InjectModel(Team) private teamRepo: typeof Team,
    @InjectModel(Match) private matchRepo: typeof Match,
    private fileService: FilesService,
  ) {}

  async create(createLeagueDto: CreateLeagueDto, logo: any) {
    const candidate = await this.leagueRepo.findOne({
      where: { name: createLeagueDto.name },
    });
    if (candidate) {
      throw new BadRequestException('This league name already exists');
    }
    const fileName = await this.fileService.createFile(logo);
    const newLeague = await this.leagueRepo.create({
      ...createLeagueDto,
      logo: fileName,
    });
    return newLeague;
  }

  async findAll() {
    const leagues = await this.leagueRepo.findAll({ include: { all: true } });
    return leagues;
  }

  async findOne(id: number) {
    const league = await this.leagueRepo.findOne({
      where: { id },
      include: { all: true },
    });
    if (!league) {
      throw new BadRequestException('League not found');
    }
    return league;
  }

  async update(id: number, updateLeagueDto: UpdateLeagueDto, logo: any) {
    const league = await this.findOne(id);

    if (updateLeagueDto.name) {
      const candidate = await this.leagueRepo.findOne({
        where: { name: updateLeagueDto.name },
      });
      if (candidate && candidate.id !== id) {
        throw new BadRequestException('This league name already exists');
      }
    }
    let fileName = league.logo;
    if (logo) {
      await this.fileService.deleteFile(league.logo);
      fileName = await this.fileService.createFile(logo);
    }
    await league.update({ ...updateLeagueDto, logo: fileName });
    console.log(league);
    return league;
  }

  async remove(id: number) {
    const league: League = await this.findOne(id);
    await this.fileService.deleteFile(league.logo);
    await league.destroy();
    return { message: 'league deleted' };
  }

  async getScoreBoard(leagueId: number) {
    const league = await this.findOne(leagueId);

    const teams = await this.teamRepo.findAll({
      where: { league_id: leagueId },
    });

    if (!teams.length) {
      throw new BadRequestException('League is empty');
    }

    let scoreBoard: any = [];
    for (let i = 0; i < teams.length; i++) {
      const teamMatches = await this.matchRepo.findAll({
        where: {
          [Op.or]: [
            { first_team_id: teams[i].id },
            { second_team_id: teams[i].id },
          ],
          is_finished: true,
        },
      });
      let point = 0;
      let scored_goals = 0;
      let conceded_goals = 0;
      teamMatches.forEach((match) => {
        if (match.first_team_id === teams[i].id) {
          if (match.first_team_goals > match.second_team_goals) {
            point += 3;
          } else if (match.first_team_goals === match.second_team_goals) {
            point += 1;
          }
          scored_goals += match.first_team_goals;
          conceded_goals += match.second_team_goals;
        } else {
          if (match.first_team_goals < match.second_team_goals) {
            point += 3;
          } else if (match.first_team_goals === match.second_team_goals) {
            point += 1;
          }
          scored_goals += match.second_team_goals;
          conceded_goals += match.first_team_goals;
        }
      });
      scoreBoard.push({
        team: teams[i].name,
        games: teamMatches.length,
        scored: scored_goals,
        conceded: conceded_goals,
        points: point,
      });
    }

    await scoreBoard.sort((a, b) => {
      if (a.points > b.points) {
        return -1;
      } else if (a.points < b.points) {
        return 1;
      } else {
        const aTopRatio = a.scored / a.conceded;
        const bTopRatio = b.scored / b.conceded;
        if (aTopRatio > bTopRatio) {
          return -1;
        } else if (aTopRatio < bTopRatio) {
          return 1;
        } else {
          return 0;
        }
      }
    });
    console.log(scoreBoard);
    return scoreBoard;
  }
}
