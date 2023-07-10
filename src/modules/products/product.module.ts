import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductEntity } from 'src/entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from 'src/midleware/auth.midleware';
import { MulterModule } from '@nestjs/platform-express';
import { ImageService } from './image-upload.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]),
    MulterModule.registerAsync({
      useClass: ImageService,
    }),
  ],
  controllers: [ProductController],
  providers: [ProductService, ImageService],
})
export class ProductModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(ProductController);
  }
}
