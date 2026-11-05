import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';

import { BookAuthorsService } from './book-authors.service.js';
import { CreateBookAuthorDto } from './dto/create-book-authors.dto.js';

@Controller('book-authors')
export class BookAuthorsController {
  constructor(
    private readonly bookAuthorsService: BookAuthorsService,
  ) {}

  // Menambahkan relasi buku dan penulis
  @Post()
  create(@Body() dto: CreateBookAuthorDto) {
    return this.bookAuthorsService.create(dto);
  }

  // Menampilkan semua relasi
  @Get()
  findAll() {
    return this.bookAuthorsService.findAll();
  }

  // Menampilkan relasi berdasarkan ID buku dan ID penulis
  @Get(':bookId/:authorId')
  findOne(
    @Param('bookId', ParseUUIDPipe) bookId: string,
    @Param('authorId', ParseUUIDPipe) authorId: string,
  ) {
    return this.bookAuthorsService.findOne(bookId, authorId);
  }

  // Menghapus relasi
  @Delete(':bookId/:authorId')
  remove(
    @Param('bookId', ParseUUIDPipe) bookId: string,
    @Param('authorId', ParseUUIDPipe) authorId: string,
  ) {
    return this.bookAuthorsService.remove(bookId, authorId);
  }
}