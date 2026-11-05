import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MaxLength,
} from 'class-validator';

export class CreatePublisherDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(150)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phone: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}