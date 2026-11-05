import {
  IsUUID,
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  MaxLength,
} from 'class-validator';

export class CreatePaymentDto {
  @IsUUID()
  order_id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  payment_method: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  status: string;
}