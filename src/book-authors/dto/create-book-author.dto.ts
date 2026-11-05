import {
  IsNotEmpty,
  IsUUID,
} from 'class-validator';

export class CreateBookAuthorDto {
  @IsUUID()
  @IsNotEmpty()
  bookId: string;

  @IsUUID()
  @IsNotEmpty()
  authorId: string;
}