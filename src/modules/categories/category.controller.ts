import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  ValidationPipe,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto } from './dto/category.dto';
import {
  CategoryResponse,
  GetAllCategoryResponse,
} from 'shared/types/response.type';
import { CreateCategoryGuards } from 'shared/guards/category.guard';
import { Category } from 'models/category.model';

@Controller('api/categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllCategory(): Promise<GetAllCategoryResponse> {
    return await this.categoryService.findAll();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async detail(@Param('id') id: number): Promise<CategoryResponse> {
    return await this.categoryService.findById(id);
  }

  @Post('/create')
  @HttpCode(HttpStatus.OK)
  @UseGuards(CreateCategoryGuards)
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() body: CategoryDto): Promise<CategoryResponse> {
    return this.categoryService.create(body);
  }

  @Put('update/:id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Param('id') id: number,
    @Body() body: Partial<Category>,
  ): Promise<CategoryResponse> {
    return await this.categoryService.update(id, body);
  }

  @Delete('/delete/:id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: number): Promise<CategoryResponse> {
    return await this.categoryService.delete(id);
  }
}
