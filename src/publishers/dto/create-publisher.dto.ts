import {
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreatePublisherDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;
}