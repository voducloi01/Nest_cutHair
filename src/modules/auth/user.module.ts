import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { UserController } from './user.controller';
import { userService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthMiddleware } from '../../midleware/auth.midleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [UserController],
  providers: [userService],
})
export class userModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'api/users', method: RequestMethod.GET },
        { path: 'api/logout', method: RequestMethod.POST },
        { path: 'api/user/:id', method: RequestMethod.PUT },
      );
  }
}
