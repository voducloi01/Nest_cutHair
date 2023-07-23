import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
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

@UseGuards(AuthMiddleware)
@Controller('users')
export class UserController {
  constructor(
    private readonly UserService: userService,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body(new ValidationPipe()) UserDto: userDTO) {
    const { name, email, password } = UserDto;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = this.UserService.create({
      name,
      email,
      password: hashedPassword,
    });

    delete (await user).password;
    return user;
  }

  @Post('login')
  async login(
    @Body(new ValidationPipe()) body: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { email, password } = body;
    const user = await this.UserService.findUser({ email });

    if (!user) {
      throw new BadRequestException('Is not email');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Is not password');
    }

    const jwt = await this.jwtService.signAsync({ id: user.id });
    response.cookie('jwt', jwt, { httpOnly: true });
    return {
      status: 'success',
      data: { token: jwt },
    };
  }

  @Get('user')
  async user(@Req() request: Request) {
    try {
      const cookie = request.cookies['jwt'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      const user = await this.UserService.findUser({ id: data?.id });

      const { password, ...result } = user;

      return result;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');

    return {
      message: 'success',
    };
  }
}
