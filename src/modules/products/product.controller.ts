import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
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
import { ImageService } from './image-upload.service';
import {
  GetProductResponse,
  ProductResponse,
} from 'shared/types/response.type';
@UseGuards(AuthMiddleware)
@Controller('api/product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly imgService: ImageService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllProduct(): Promise<GetProductResponse> {
    return this.productService.getAllProduct();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async GetProductById(@Param('id') id: number): Promise<ProductResponse> {
    return await this.productService.getProductId(id);
  }

  @Post('/create')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(FileInterceptor('image'))
  async createProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body(new ValidationPipe()) body: ProductDto,
  ): Promise<ProductResponse> {
    try {
      if (!file) {
        throw new NotFoundException(`Invalid Image`);
      } else {
        const url = await this.imgService.uploadImage(file);
        const dataCopy = {
          ...body,
          urlImg: url,
          nameImg: file.originalname,
        };
        return this.productService.createProduct(dataCopy);
      }
    } catch (error) {
      throw error;
    }
  }

  @Delete('delete/:id')
  @HttpCode(HttpStatus.OK)
  async DeleteProduct(@Param('id') id: number): Promise<ProductResponse> {
    return await this.productService.deleteProduct(id);
  }

  @Put('update/:id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('image'))
  async updateProduct(
    @Param('id') id: number,
    @Body() body: Partial<ProductDto>,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ProductResponse> {
    let data = {};
    if (file) {
      const url = await this.imgService.uploadImage(file);
      data = { ...body, urlImg: url, nameImg: file.originalname };
    } else {
      data = { ...body };
    }
    return await this.productService.updateProduct(id, data);
  }
}
