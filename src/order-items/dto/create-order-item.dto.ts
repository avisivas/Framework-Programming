import {
  IsUUID,
  IsInt,
  IsPositive,
  IsNumber,
} from 'class-validator';

export class CreateOrderItemDto {
  @IsUUID()
  order_id: string;

  @IsUUID()
  book_id: string;

  @IsInt()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
  price: number;
}