import { MinLength, IsNotEmpty, IsNumber } from 'class-validator';

export class ProductDto {
  @IsNotEmpty()
  categoryId?: number;

  @MinLength(1, { message: 'This field must be than 5 character Nine Dev!' })
  productName?: string;

  @IsNotEmpty()
  price?: number;
}
