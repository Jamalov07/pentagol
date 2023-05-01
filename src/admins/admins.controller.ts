import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Res,
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { CheckAccess } from '../decorators/checkAccess';
import { ReqWithAdmin } from '../interfaces/ReqWithAdmin';
import { CreatorGuard } from '../guards/creator.guard';
import { AdminGuard } from '../guards/admin.guard';
import { Response } from 'express';

@Controller('admin')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post()
  create(
    @Body() createAdminDto: CreateAdminDto,
    @CheckAccess() str: string,
    @Req() req: ReqWithAdmin,
  ) {
    return this.adminsService.create(createAdminDto, req, str);
  }

  @Post('login')
  login(
    @Body() authBody: { username: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminsService.login(authBody, res);
  }

  @UseGuards(CreatorGuard)
  @Get()
  findAll() {
    return this.adminsService.findAll();
  }

  @UseGuards(AdminGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminsService.findOne(+id);
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
    @Req() req: ReqWithAdmin,
  ) {
    return this.adminsService.update(+id, updateAdminDto, req);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: ReqWithAdmin) {
    return this.adminsService.remove(+id, req);
  }

  @UseGuards(CreatorGuard)
  @Post('activate/:id')
  activate(@Param('id') adminId: number) {
    return this.adminsService.activate(adminId);
  }

  @UseGuards(CreatorGuard)
  @Post('deactivate/:id')
  deactivate(@Param('id') adminId: number) {
    return this.adminsService.deActivate(adminId);
  }

  @Post('check/:token')
  checkToken(@Param('token') token: string) {
    return this.adminsService.checkToken(token);
  }
}
