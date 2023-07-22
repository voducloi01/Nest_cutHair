import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './modules/products/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CategoryModule } from './modules/categories/category.module';
import { CategoriesEntity } from './entities/categories.entity';
import { Module } from '@nestjs/common';
import { userModule } from './modules/auth/user.module';
import { UserEntity } from './entities/user.entity';
import { ProductEntity } from './entities/product.entity';
import { OrderModule } from './modules/orderCut/order.module';
import { OrderCutEntity } from './entities/orderCut.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3309,
      username: 'root',
      password: 'Thuatien500',
      database: 'ohayo_community',
      entities: [CategoriesEntity, UserEntity, ProductEntity, OrderCutEntity],
      synchronize: false,
    }),
    ProductModule,
    CategoryModule,
    userModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
