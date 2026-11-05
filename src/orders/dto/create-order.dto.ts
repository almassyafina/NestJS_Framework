import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  customerId: string;

  @IsString()
  @IsNotEmpty()
  orderNumber: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  totalAmount: number;
}