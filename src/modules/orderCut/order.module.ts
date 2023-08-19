import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderCutEntity } from 'src/entities/orderCut.entity';
import { AuthMiddleware } from 'src/shared/middlewares/auth.midleware';
import { OrderCotroller } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderCutEntity])],
  controllers: [OrderCotroller],
  providers: [OrderService],
})
export class OrderModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    //consumer.apply(AuthMiddleware).forRoutes(OrderCotroller);
  }
}
