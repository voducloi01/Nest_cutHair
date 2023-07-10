import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'src/entities/product.entity';
import { Product } from 'src/models/product.model';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  getAllproduct() {
    return this.productRepository.find();
  }

  async getProductId(productId: number): Promise<Product> {
    const product = await this.productRepository.findOneBy({
      id: productId,
    });
    return product;
  }

  createProduct(data: Product): Promise<Product> {
    return this.productRepository.save(data);
  }

  async deleteProduct(productId: number): Promise<void> {
    // Kiểm tra sự tồn tại của sản phẩm với ID tương ứng
    const product = await this.productRepository.findOneBy({
      id: productId,
    });
    if (!product) {
      throw new NotFoundException(
        `Không tìm thấy sản phẩm với ID ${productId}`,
      );
    }
    await this.productRepository.delete(productId);
  }

  async updateProduct(
    productId: number,
    updatedProduct: Partial<Product>,
  ): Promise<Product> {
    // Kiểm tra sự tồn tại của sản phẩm với ID tương ứng
    const product = await this.productRepository.findOneBy({ id: productId });
    if (!product) {
      throw new NotFoundException(
        `Không tìm thấy sản phẩm với ID ${productId}`,
      );
    }

    const updatedProductEntity = await this.productRepository.save({
      ...product,
      ...updatedProduct,
    });

    return updatedProductEntity;
  }
}
