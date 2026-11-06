import {
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty({message: 'Nama Category Harus Disi'})
  @MaxLength(100, {message: 'Nama Category Maksimal 100 Karakter'})
  readonly name: string;
}