import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { Product } from 'src/models/product.model';
import { ProductDto } from 'src/dto/product.dto';
import { AuthMiddleware } from 'src/midleware/auth.midleware';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image-upload.service';
@UseGuards(AuthMiddleware)
@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly imgservice: ImageService,
  ) {}

  @Get()
  async getAllProduct(): Promise<ResponseData<Product>> {
    try {
      return new ResponseData<Product>(
        await this.productService.getAllproduct(),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Product>(
        error,
        HttpStatus.ERROR,
        HttpMessage.ERROR,
      );
    }
  }

  @Get('/:id')
  async GetProductById(
    @Param('id') id: number,
  ): Promise<ResponseData<Product>> {
    try {
      return new ResponseData<Product>(
        await this.productService.getProductId(id),
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Product>(
        null,
        HttpStatus.ERROR,
        HttpMessage.ERROR,
      );
    }
  }

  @Post('create')
  @UseInterceptors(FileInterceptor('image'))
  async createProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body(new ValidationPipe()) productDto: ProductDto,
  ): Promise<ResponseData<Product>> {
    try {
      if (file) {
        const url = await this.imgservice.uploadImage(file);
        const dataCopy = {
          ...productDto,
          urlImg: url,
          nameImg: file.originalname,
        };
        return new ResponseData<Product>(
          await this.productService.createProduct(dataCopy),
          HttpStatus.SUCCESS,
          HttpMessage.SUCCESS,
        );
      }
    } catch (error) {
      return new ResponseData<Product>(
        null,
        HttpStatus.ERROR,
        HttpMessage.ERROR,
      );
    }
  }

  @Delete('delete/:id')
  async DeleteProduct(@Param('id') id: number): Promise<ResponseData<Product>> {
    try {
      await this.productService.deleteProduct(id);
      return new ResponseData<Product>(
        null,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Put('update/:id')
  @UseInterceptors(FileInterceptor('image'))
  async updateProduct(
    @Param('id') id: number,
    @Body() updatedProduct: Partial<Product>,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseData<Product>> {
    try {
      let data = null;
      const product = await this.productService.getProductId(id);

      if (product.nameImg !== file.originalname) {
        const url = await this.imgservice.uploadImage(file);

        data = { ...updatedProduct, urlImg: url, nameImg: file.originalname };
      } else {
        data = { ...updatedProduct };
      }
      const updatedProductEntity = await this.productService.updateProduct(
        id,
        data,
      );
      return new ResponseData<Product>(
        updatedProductEntity,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData<Product>(
        null,
        HttpStatus.ERROR,
        HttpMessage.ERROR,
      );
    }
  }
}
