import {
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

      return res.json(
        new ResponseData(userCopy, HttpStatus.SUCCESS, HttpMessage.SUCCESS),
      );
    } catch (error) {
      return res.json(
        new ResponseData(error, HttpStatus.ERROR, HttpMessage.ERROR),
      );
    }
  }

  @Post('api/login')
  async login(
    @Body(new ValidationPipe()) body: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ResponseType<User>> {
    try {
      const { email, password } = body;
      const user = await this.UserService.findUser({ email });

      if (!user) {
        return response
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'User not found' });
      }

      if (!(await bcrypt.compare(password, user.password))) {
        return response
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'InValid Password!' });
      }

      const jwt = await this.jwtService.signAsync({ id: user.id });
      response.cookie('jwt', jwt, { httpOnly: true });

      const res = new ResponseData(
        {
          userInfo: {
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token: jwt,
        },
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );

      return res.getResponseLogin();
    } catch (error) {
      const res = new ResponseData(error, HttpStatus.ERROR, HttpMessage.ERROR);
      return res.getResponseLogin();
    }
  }

  @Get('api/users')
  async user(): Promise<any> {
    try {
      const users = await this.UserService.getAllUser();

      const responseData = new ResponseData<User[]>(
        users,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );

      return responseData.getResponse();
    } catch (error) {
      const errorResponse = new ResponseData(
        error.message || error.toString(),
        HttpStatus.ERROR,
        HttpMessage.ERROR,
      );

      return errorResponse.getResponse();
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
      return new ResponseData(user, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }
}
