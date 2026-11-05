import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BookAuthor } from './entities/book-authors.entity.js';
import { Book } from '../books/entities/book-entity.js';
import { Author } from '../authors/entities/author.entity.js';

import { CreateBookAuthorDto } from './dto/create-book-authors.dto.js';

@Injectable()
export class BookAuthorsService {
  constructor(
    @InjectRepository(BookAuthor)
    private readonly bookAuthorRepository: Repository<BookAuthor>,

    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,

    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
  ) {}

  // Menambahkan relasi buku dengan penulis
  async create(dto: CreateBookAuthorDto) {
    const book = await this.bookRepository.findOne({
      where: { id: dto.book_id },
    });

    if (!book) {
      throw new NotFoundException('Book tidak ditemukan');
    }

    const author = await this.authorRepository.findOne({
      where: { id: dto.author_id },
    });

    if (!author) {
      throw new NotFoundException('Author tidak ditemukan');
    }

    const existing = await this.bookAuthorRepository.findOne({
      where: {
        book_id: dto.book_id,
        author_id: dto.author_id,
      },
    });

    if (existing) {
      throw new ConflictException('Relasi buku dan author sudah ada');
    }

    const bookAuthor = this.bookAuthorRepository.create(dto);

    return await this.bookAuthorRepository.save(bookAuthor);
  }

  // Menampilkan semua relasi buku dan penulis
  async findAll() {
    return await this.bookAuthorRepository.find({
      relations: {
        book: true,
        author: true,
      },
    });
  }

  // Menampilkan relasi berdasarkan ID buku dan ID penulis
  async findOne(book_id: string, author_id: string) {
    const bookAuthor = await this.bookAuthorRepository.findOne({
      where: {
        book_id,
        author_id,
      },
      relations: {
        book: true,
        author: true,
      },
    });

    if (!bookAuthor) {
      throw new NotFoundException('Relasi buku dan author tidak ditemukan');
    }

    return bookAuthor;
  }

  // Menghapus relasi buku dan penulis
  async remove(book_id: string, author_id: string) {
    const bookAuthor = await this.findOne(book_id, author_id);

    await this.bookAuthorRepository.remove(bookAuthor);

    return {
      message: 'Relasi buku dan author berhasil dihapus',
    };
  }
}