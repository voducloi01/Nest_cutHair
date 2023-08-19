import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import { AuthMiddleware } from '../../shared/middlewares/auth.midleware';
import {
  LoginResponse,
  RegisterResponse,
  UserResponse,
} from '../../shared/types/response.type';
import {
  RegisterGuard,
  LoginGuard,
  UserGuard,
} from '../../shared/guards/auth.guard';
import { UserDto } from './dto/user.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller()
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('api/register')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RegisterGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(@Body() params: RegisterDto): Promise<RegisterResponse> {
    return this.userService.register(params);
  }

  @Post('api/login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LoginGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async login(
    @Body() params: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponse> {
    return this.userService.login(params, response);
  }

  @Get('api/users')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthMiddleware, UserGuard)
  async getUsers(): Promise<UserResponse[]> {
    return this.userService.getUsers();
  }

  @Post('api/logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(UserGuard)
  async logout(@Res({ passthrough: true }) response: Response) {
    return this.logout(response);
  }

  @Put('api/user/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthMiddleware)
  async updateUser(
    @Param('id') id: number,
    @Body(new ValidationPipe()) params: UserDto,
  ): Promise<UserResponse> {
    return this.userService.updateUser(id, params);
  }
}
