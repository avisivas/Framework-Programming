import { IsUUID } from 'class-validator';

export class CreateBookAuthorDto {
  @IsUUID()
  book_id: string;

  @IsUUID()
  author_id: string;
}