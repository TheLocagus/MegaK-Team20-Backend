import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { UserObj } from '../decorators/user-obj.decorator';
import { Admin } from '../admin/admin.entity';
import { Student } from '../student/student.entity';
import { Recruiter } from '../recruiter/recruiter.entity';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() req: AuthLoginDto, @Res() res: Response): Promise<any> {
    return this.authService.login(req, res);
  }

  @Get('/logout')
  @UseGuards(AuthGuard('logout'))
  async logout(
    @UserObj() user: Admin | Student | Recruiter,
    @Res() res: Response,
  ) {
    console.log('logout controller');
    return this.authService.logout(user, res);
  }
  @Get('/check-user/:id/:token')
  async checkUser(@Param('id') id: string, @Param('token') token: string) {
    return this.authService.checkUser(id, token);
  }
  @Post('/forgot-password')
  async retrievePassword(@Body() email: ForgotPasswordDto) {
    return this.authService.forgotPassword(email);
  }
  @Post('/change-password')
  async changePassword(@Body() userCheck: ChangePasswordDto) {
    return this.authService.changePassword(userCheck);
  }
}
