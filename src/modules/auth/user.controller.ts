import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { userService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { userDTO } from 'src/dto/user.dto';
import { AuthMiddleware } from '../../midleware/auth.midleware';
import { LoginDto } from 'src/dto/login.dto';
import { HttpMessage } from 'src/global/globalEnum';
import { User } from 'src/models/user.model';
import { ResponseData } from 'src/global/globalClass';
import { LoginResponse, ResponseType } from 'src/global/globalType';

@UseGuards(AuthMiddleware)
@Controller()
export class UserController {
  constructor(
    private readonly UserService: userService,
    private jwtService: JwtService,
  ) {}

  @Post('api/register')
  async register(
    @Body() UserDto: userDTO,
    @Res() res: Response,
  ): Promise<ResponseType<User>> {
    const { name, email, password } = UserDto;
    const hashedPassword = await bcrypt.hash(password, 12);
    try {
      const userCopy = this.UserService.create({
        name,
        email,
        password: hashedPassword,
      });
      delete (await userCopy).password;

      return res.json(new ResponseData(userCopy));
    } catch (error) {
      return res.json(new ResponseData(error));
    }
  }

  @Post('api/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(new ValidationPipe()) body: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponse> {
    const { email, password } = body;
    const user = await this.UserService.findUser({ email });

    if (!user) {
      throw new BadRequestException('User not exit');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Invalid password');
    }

    const jwt = await this.jwtService.signAsync({ id: user.id });
    response.cookie('jwt', jwt, { httpOnly: true });

    const res = {
      userInfo: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: jwt,
    };

    return res;
  }

  @Get('api/users')
  async user(
    @Res({ passthrough: true }) response: Response,
  ): Promise<ResponseType<User>> {
    try {
      const user = await this.UserService.getAllUser();
      return response.json(
        new ResponseData({
          result: user,
        }).getResponse(),
      );
    } catch (e) {
      return response.json(
        new ResponseData({
          e,
        }).getResponse(),
      );
    }
  }

  @Post('api/logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
    return {
      message: 'success',
    };
  }
  @Put('api/user/:id')
  async updateUser(
    @Param('id') id: number,
    @Body(new ValidationPipe()) body: userDTO,
  ): Promise<ResponseType<User>> {
    try {
      const user = await this.UserService.updateUser(id, body);
      return new ResponseData(user);
    } catch (error) {
      return new ResponseData(error);
    }
  }
}
