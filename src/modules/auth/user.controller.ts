import {
  BadRequestException,
  Body,
  Controller,
  Get,
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
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { User } from 'src/models/user.model';
import { ResponseData } from 'src/global/globalClass';
import { ResponseType } from 'src/global/globalType';

@UseGuards(AuthMiddleware)
@Controller('users')
export class UserController {
  constructor(
    private readonly UserService: userService,
    private jwtService: JwtService,
  ) {}

  @Post('register')
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

      return res.json(
        new ResponseData(userCopy, HttpStatus.SUCCESS, HttpMessage.SUCCESS),
      );
    } catch (error) {
      return res.json(
        new ResponseData(error, HttpStatus.ERROR, HttpMessage.ERROR),
      );
    }
  }

  @Post('login')
  async login(
    @Body(new ValidationPipe()) body: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ResponseType<User>> {
    try {
      const { email, password } = body;
      const user = await this.UserService.findUser({ email });

      if (!user) {
        throw new BadRequestException('Not valid User !');
      }

      if (!(await bcrypt.compare(password, user.password))) {
        throw new BadRequestException('Password sai !');
      }

      const jwt = await this.jwtService.signAsync({ id: user.id });
      response.cookie('jwt', jwt, { httpOnly: true });
      const res = new ResponseData({
        jwt,
        user,
        HttpStatus: HttpStatus.SUCCESS,
        message: HttpMessage.SUCCESS,
      });

      return response.json(res.getRespon());
    } catch (error) {
      return response.json(
        new ResponseData(error, HttpStatus.ERROR, HttpMessage.ERROR),
      );
    }
  }

  @Get('user')
  async user(@Req() request: Request): Promise<ResponseType<User>> {
    try {
      const cookie = request.cookies['jwt'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const user = await this.UserService.findUser({ id: data?.id });

      const { password, ...result } = user;

      return new ResponseData(result, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (e) {
      return new ResponseData(e, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
    return {
      message: 'success',
    };
  }
  @Put('/update/:id')
  async updateUser(
    @Param('id') id: number,
    @Body(new ValidationPipe()) body: userDTO,
  ): Promise<ResponseType<User>> {
    try {
      const user = await this.UserService.updateUser(id, body);
      return new ResponseData(user, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }
}
