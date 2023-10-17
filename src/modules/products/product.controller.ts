import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from '../../modules/products/dto/product.dto';
import { AuthMiddleware } from '../../shared/middlewares/auth.midleware';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  GetProductResponse,
  ProductResponse,
} from 'shared/types/response.type';
@UseGuards(AuthMiddleware)
@Controller('api/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAllProduct(): Promise<GetProductResponse> {
    return this.productService.getAllProduct();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  GetProductById(@Param('id') id: number): Promise<ProductResponse> {
    return this.productService.getProductId(id);
  }

  @Post('/create')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(FileInterceptor('image'))
  createProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body(new ValidationPipe()) body: ProductDto,
  ): Promise<ProductResponse> {
    return this.productService.createProduct(body, file);
  }

  @Delete('delete/:id')
  @HttpCode(HttpStatus.OK)
  DeleteProduct(@Param('id') id: number): Promise<ProductResponse> {
    return this.productService.deleteProduct(id);
  }

  @Put('update/:id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('image'))
  updateProduct(
    @Param('id') id: number,
    @Body() body: Partial<ProductDto>,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ProductResponse> {
    return this.productService.updateProduct(id, body, file);
  }
}
