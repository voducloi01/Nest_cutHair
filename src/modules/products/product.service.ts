import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../../entities/product.entity';
import { Product } from '../../models/product.model';
import { Repository } from 'typeorm';
import {
  GetProductResponse,
  ProductResponse,
  ProductType,
} from 'shared/types/response.type';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async getAllProduct(): Promise<GetProductResponse> {
    const productAll = await this.productRepository.find();
    const productResponses: ProductType[] = productAll.map((product) => ({
      id: product.id,
      productName: product.productName,
      price: product.price,
      categoryID: product.categoryId,
      urlImg: product.urlImg,
      nameImg: product.nameImg,
    }));
    return {
      result: productResponses,
      message: 'Get All Product Successfully !',
    };
  }

  async getProductId(productId: number): Promise<ProductResponse> {
    const product = await this.productRepository.findOneBy({
      id: productId,
    });

    if (!product) {
      throw new NotFoundException(`Not Find ID ${productId}`);
    }
    return {
      result: {
        id: product.id,
        productName: product.productName,
        price: product.price,
        categoryID: product.categoryId,
        urlImg: product.urlImg,
        nameImg: product.nameImg,
      },
      message: `Detail Product ID ${productId}!`,
    };
  }

  async createProduct(data: Product): Promise<ProductResponse> {
    const product = await this.productRepository.save(data);
    return {
      result: {
        id: product.id,
        productName: product.productName,
        price: product.price,
        categoryID: product.categoryId,
        urlImg: product.urlImg,
        nameImg: product.nameImg,
      },
      message: 'Create Product Successfully',
    };
  }

  async deleteProduct(productId: number): Promise<ProductResponse> {
    await this.getProductId(productId);
    await this.productRepository.delete(productId);
    return { message: `Delete Successfully Product ID ${productId}!` };
  }

  async updateProduct(
    productId: number,
    updatedProduct: Partial<Product>,
  ): Promise<ProductResponse> {
    const { result } = await this.getProductId(productId);
    const product = await this.productRepository.save({
      ...result,
      ...updatedProduct,
    });

    return {
      result: {
        id: product.id,
        productName: product.productName,
        price: product.price,
        categoryID: product.categoryId,
        urlImg: product.urlImg,
        nameImg: product.nameImg,
      },
      message: 'Update Product Successfully',
    };
  }
}
