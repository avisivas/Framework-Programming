import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../dto/creat-user-dto.js';

export class UpdateUserDto extends PartialType(CreateUserDto) {}