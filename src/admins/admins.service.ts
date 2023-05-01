import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Admin } from './entities/admin.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ReqWithAdmin } from '../interfaces/ReqWithAdmin';
import { Response } from 'express';

@Injectable()
export class AdminsService {
  constructor(
    @InjectModel(Admin) private adminRepo: typeof Admin,
    private jwtService: JwtService,
  ) {}

  async create(createAdminDto: CreateAdminDto, req: ReqWithAdmin, str: string) {
    let isCreator = true;
    if (str === 'no') {
      isCreator = false;
      if (req.admin) {
        if (!req.admin.is_creator) {
          throw new BadRequestException('Admin is not creator');
        }
      }
    }
    const candidate_username = await this.adminRepo.findOne({
      where: {
        username: createAdminDto.username,
      },
    });
    if (candidate_username) {
      throw new BadRequestException('Admin already exists with this username');
    }
    const candidate_email = await this.adminRepo.findOne({
      where: {
        username: createAdminDto.email,
      },
    });
    if (candidate_email) {
      throw new BadRequestException('Admin already exists with this email');
    }

    const hashed_password = await bcrypt.hash(createAdminDto.password, 7);
    const newAdmin = await this.adminRepo.create({
      ...createAdminDto,
      is_creator: isCreator,
      is_active: true,
      password: hashed_password,
    });

    return newAdmin;
  }

  async findAll() {
    const admins = await this.adminRepo.findAll();
    return admins;
  }

  async findOne(id: number) {
    const admin = await this.adminRepo.findOne({ where: { id } });
    if (!admin) {
      throw new BadRequestException('Admin not found');
    }
    return admin;
  }

  async update(id: number, updateAdminDto: UpdateAdminDto, req: ReqWithAdmin) {
    if (!req.admin.is_creator) {
      if (req.admin.id !== id) {
        throw new BadRequestException('You do not have permission to do this');
      }
    }

    const admin = await this.findOne(id);
    if (updateAdminDto.username) {
      const candidate_username = await this.adminRepo.findOne({
        where: {
          username: updateAdminDto.username,
        },
      });
      if (candidate_username && candidate_username.id !== id) {
        throw new BadRequestException(
          'Admin already exists with this username',
        );
      }
    }
    if (updateAdminDto.email) {
      const candidate_email = await this.adminRepo.findOne({
        where: {
          username: updateAdminDto.email,
        },
      });
      if (candidate_email && candidate_email.id !== id) {
        throw new BadRequestException('Admin already exists with this email');
      }
    }
    let password = admin.password;
    if (updateAdminDto.password) {
      password = await bcrypt.hash(updateAdminDto.password, 7);
    }
    console.log(password);
    await admin.update({
      ...updateAdminDto,
      is_creator: admin.is_creator,
      password: password,
    });
    return admin;
  }

  async remove(id: number, req: ReqWithAdmin) {
    if (!req.admin.is_creator) {
      if (req.admin.id !== id) {
        throw new BadRequestException('You do not have permission to do this');
      }
    }
    const admin = await this.findOne(id);
    await admin.destroy();
    return { message: 'admin deleted' };
  }

  async login(
    loginBody: { username: string; password: string },
    res: Response,
  ) {
    const { username, password } = loginBody;

    const admin = await this.adminRepo.findOne({ where: { username } });
    if (!admin) {
      throw new BadRequestException('admin unauthorized1');
    }
    const compare = await bcrypt.compare(password, admin.password);
    if (!compare) {
      throw new ForbiddenException('admin unauthorized2');
    }
    const tokens = await this.getTokens(
      admin.id,
      admin.is_active,
      admin.is_creator,
    );
    const updatedAdmin = await this.updateHashedToken(
      admin.id,
      tokens.refresh_token,
    );

    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return { admin: updatedAdmin, tokens };
  }

  async activate(id: number) {
    const admin = await this.findOne(id);
    await admin.update({ is_active: true });
    return { message: 'admin is activated', admin };
  }

  async deActivate(id: number) {
    const admin = await this.findOne(id);
    await admin.update({ is_active: false });
    return { message: 'Admin is inactivated', admin };
  }

  // ======================================

  async getTokens(id: number, is_active: boolean, is_creator: boolean) {
    const jwtPayload = {
      id: id,
      is_active,
      is_creator,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async updateHashedToken(adminId: number, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 7);
    await this.adminRepo.update(
      { token: hashedRefreshToken },
      { where: { id: adminId } },
    );
    return this.findOne(adminId);
  }

  async checkToken(token: string) {
    try {
      const data = new JwtService().verify(token, {
        secret: process.env.ACCESS_TOKEN_KEY,
      });

      if (data) {
        console.log(data);
        if (data.id && data.is_active) {
          const admin = await this.adminRepo.findOne({
            where: { id: data.id },
            include: { all: true },
          });
          if (admin) {
            return {
              isValid: true,
              tokenData: data,
              admin: admin,
            };
          }
        }
      }
      return { isValid: false };
    } catch (error) {
      return { isValid: false, message: error };
    }
  }
}
