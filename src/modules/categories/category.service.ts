import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesEntity } from '../../entities/categories.entity';
import { Category } from '../../models/category.model';
import { Repository } from 'typeorm';
import {
  CategoryResponse,
  CategoryType,
  GetAllCategoryResponse,
} from 'shared/types/response.type';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoriesEntity)
    private categoryRepository: Repository<CategoriesEntity>,
  ) {}

  async findAll(): Promise<GetAllCategoryResponse> {
    const category = await this.categoryRepository.find();
    const categoryCopy: CategoryType[] = category.map((e) => ({
      id: e.id,
      categoryName: e.categoryName,
      description: e.description,
    }));
    return {
      result: categoryCopy,
      message: 'Get All Category!',
    };
  }

  async findById(id: number): Promise<CategoryResponse> {
    const category: CategoryType = await this.categoryRepository.findOneBy({
      id: id,
    });

    if (!category) {
      throw new NotFoundException(`Not Find Category ID ${id}`);
    }
    return {
      result: {
        id: category.id,
        categoryName: category.categoryName,
        description: category.description,
      },
      message: `Detail Category ID ${id}!`,
    };
  }

  async create(body: Category): Promise<CategoryResponse> {
    const category = await this.categoryRepository.save(body);
    return {
      result: category,
      message: 'Create Category Successfully ! ',
    };
  }

  async update(id: number, body: Category): Promise<CategoryResponse> {
    const { result } = await this.findById(id);
    const category = await this.categoryRepository.save({
      ...result,
      ...body,
    });

    return {
      result: {
        id: category.id,
        categoryName: category.categoryName,
        description: category.description,
      },
      message: 'Update Category Successfully',
    };
  }

  async delete(id: number): Promise<CategoryResponse> {
    await this.findById(id);
    await this.categoryRepository.delete(id);
    return { message: `Delete Successfully Category ID ${id}!` };
  }
}
