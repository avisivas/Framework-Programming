import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsNumber,
  IsPositive,
  MaxLength,
} from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  customer_id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  order_number: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  status: string;

  @IsNumber()
  @IsPositive()
  total_amount: number;
}