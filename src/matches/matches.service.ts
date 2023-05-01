import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { Match } from './entities/match.entity';
import { InjectModel } from '@nestjs/sequelize';
import { Team } from '../teams/entities/team.entity';
import { League } from '../leagues/entities/league.entity';

@Injectable()
export class MatchesService {
  constructor(
    @InjectModel(Match) private matchRepo: typeof Match,
    @InjectModel(Team) private teamRepo: typeof Team,
    @InjectModel(League) private leagueRepo: typeof League,
  ) {}

  async create(createMatchDto: CreateMatchDto) {
    const newmatch = await this.matchRepo.create(createMatchDto);
    return newmatch;
  }

  async randomPositionForLeaguematches(leagueId: number) {
    const matches = await this.matchRepo.findAll({
      where: { ['$first_team.league_id$']: leagueId },
      include: [{ all: true }],
    });
    if (matches.length) {
      throw new BadRequestException('This league already started');
    }
    const league = await this.leagueRepo.findOne({ where: { id: leagueId } });

    const teams = await this.teamRepo.findAll({
      where: { league_id: league.id },
    });
    let teamsForRandom = [...teams];
    const n = teamsForRandom.length;

    const rounds = [];

    for (let i = 0; i < n - 1; i++) {
      let round = [];
      for (let j = 0; j < n / 2; j++) {
        const home = teamsForRandom[j].id;
        const away = teamsForRandom[n - 1 - j].id;

        if (i % 2 === 1) {
          round.push([away, home]);
        } else {
          round.push([home, away]);
        }
      }
      rounds.push(round);
      teamsForRandom.splice(1, 0, teamsForRandom.pop());
    }

    for (let i = 0; i < n - 1; i++) {
      const round = [];
      for (let j = 0; j < n / 2; j++) {
        const home = teams[n - 1 - j].id;
        const away = teams[j].id;
        if (i % 2 === 1) {
          round.push([home, away]);
        } else {
          round.push([away, home]);
        }
      }
      rounds.push(round);
      teams.splice(1, 0, teams.pop());
    }

    console.log(rounds);

    for (let i = 0; i < rounds.length; i++) {
      let league_round = i + 1;
      for (let j = 0; j < rounds[i].length; j++) {
        await this.create({
          round: league_round,
          first_team_id: rounds[i][j][0],
          second_team_id: rounds[i][j][1],
          match_date: new Date(),
          first_team_goals: 0,
          second_team_goals: 0,
          league_id: leagueId,
        });
      }
    }

    return await this.leagueMatches(leagueId);
  }

  async findAll() {
    const matches = await this.matchRepo.findAll();
    return matches;
  }

  async leagueMatches(id: number) {
    const leagueMatches = await this.matchRepo.findAll({
      where: {
        ['$first_team.league_id$']: id,
      },
      include: [{ all: true }],
    });

    console.log(leagueMatches);
    return leagueMatches;
  }

  async findOne(id: number) {
    const match = await this.matchRepo.findOne({ where: { id } });
    if (!match) {
      throw new BadRequestException('Match not found');
    }
    return match;
  }

  async updateForFinish(id: number, updateMatchDto: UpdateMatchDto) {
    const match = await this.findOne(id);

    await match.update({
      first_team_goals: updateMatchDto.first_team_goals,
      second_team_goals: updateMatchDto.second_team_goals,
      is_finished: true,
    });
    return match;
  }

  async remove(id: number) {
    const leagueMatches = await this.matchRepo.findAll({
      where: {
        ['$first_team.league_id$']: id,
      },
      include: [{ all: true }],
    });

    if (leagueMatches.length) {
      leagueMatches.forEach(async (match) => {
        match.destroy();
      });
      return { message: 'All games in the league have been deleted' };
    } else {
      throw new BadRequestException('League not found');
    }
  }

  async getLeagueLastRound(id: number) {
    const leagueMatches = await this.matchRepo.findAll({
      where: {
        ['$first_team.league_id$']: id,
        is_finished: true,
      },
      include: [{ all: true }],
      order: [['updatedAt', 'DESC']],
    });
    if (!leagueMatches.length) {
      throw new BadRequestException('league not found');
    }

    let roundMatches = await this.matchRepo.findAll({
      where: {
        ['$first_team.league_id$']: id,
        round: leagueMatches[0].round,
      },
      include: [{ all: true }],
      order: [['updatedAt', 'DESC']],
    });
    console.log(roundMatches);
    let isAllFinished = true;
    for (let i = 0; i > roundMatches.length; i++) {
      if (roundMatches[i].is_finished) {
        isAllFinished = false;
        break;
      }
    }
    if (isAllFinished || leagueMatches[0].round === 1) {
      return roundMatches;
    } else {
      roundMatches = await this.matchRepo.findAll({
        where: {
          ['$first_team.league_id$']: id,
          round: leagueMatches[0].round - 1,
        },
        include: [{ all: true }],
        order: [['updatedAt', 'DESC']],
      });
      return roundMatches;
    }
  }

  async getLeagueNextRound(id: number) {
    const leagueMatches = await this.matchRepo.findAll({
      where: {
        ['$first_team.league_id$']: id,
        is_finished: true,
      },
      include: [{ all: true }],
      order: [['updatedAt', 'DESC']],
    });

    if (!leagueMatches.length) {
      throw new BadRequestException('league not found');
    }

    let lastPlayedMatchs = await this.matchRepo.findAll({
      where: {
        ['$first_team.league_id$']: id,
        round: leagueMatches[0].round,
      },
      include: [{ all: true }],
      order: [['updatedAt', 'DESC']],
    });

    let isExistsnoFinished = false;
    for (let i = 0; i > lastPlayedMatchs.length; i++) {
      if (!lastPlayedMatchs[i].is_finished) {
        isExistsnoFinished = true;
        break;
      }
    }
    if (isExistsnoFinished || leagueMatches[0].round === 1) {
      return lastPlayedMatchs;
    } else {
      let nextMatchs2 = await this.matchRepo.findAll({
        where: {
          ['$first_team.league_id$']: id,
          round: leagueMatches[0].round + 1,
        },
        include: [{ all: true }],
        order: [['updatedAt', 'DESC']],
      });
      if (lastPlayedMatchs.length) {
        return nextMatchs2;
      } else {
        return lastPlayedMatchs;
      }
    }
  }
}
