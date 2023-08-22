import { MinLength, IsString, IsNotEmpty } from 'class-validator';

export class CategoryDto {
  @MinLength(5, { message: 'This field must be than 5 character Nine Dev!' })
  @IsNotEmpty({ message: 'category Name is not empty' })
  categoryName: string;

  @IsString()
  @IsNotEmpty({ message: 'description  is not empty' })
  description: string;
}
