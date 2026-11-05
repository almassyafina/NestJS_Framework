import {
  IsInt,
  IsNumber,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateOrderItemDto {
  @IsUUID()
  orderId: string;

  @IsUUID()
  bookId: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  subtotal: number;
}