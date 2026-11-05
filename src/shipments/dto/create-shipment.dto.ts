import {
  IsUUID,
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreateShipmentDto {
  @IsUUID()
  order_id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  courier: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  tracking_number?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  status: string;
}