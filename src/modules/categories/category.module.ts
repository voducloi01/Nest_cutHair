import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoriesEntity } from '../../entities/categories.entity';
import { AuthMiddleware } from 'shared/middlewares/auth.midleware';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forFeature([CategoriesEntity]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: 'api/categories/create',
        method: RequestMethod.POST,
      },
      {
        path: 'api/categories/update/:id',
        method: RequestMethod.PUT,
      },
      {
        path: 'api/categories/delete/:id',
        method: RequestMethod.DELETE,
      },
    );
  }
}
