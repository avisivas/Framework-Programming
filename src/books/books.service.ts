import { Injectable } from '@nestjs/common';
import { Book } from './entitas/book-entity.js';
import { CreateBookDto } from './dto/create-book.dto.js';

@Injectable()
export class BooksService {
  // sample data
  private books: Book[] = [
    {
      id: 1,
      title: 'Islam Ala Prabowo',
      author: 'MUI',
      isbn: '888-98-9619',
      publisherYear: 2025,
      isAvailable: true,
    },
    {
      id: 2,
      title: 'MBG Keren',
      author: 'Wowo',
      isbn: '888-98-9630',
      publisherYear: 2026,
      isAvailable: true,
    },
  ];

  // logic untuk menampilkan data
  findAll(): Book[] {
    return this.books;
  }

  // simpan data
  simpanData(createBookDto: CreateBookDto): Book {
    const newBook: Book = {
        id: this.books.length + 1,
        title: createBookDto.title,
        author: createBookDto.author,
        isbn: createBookDto.isbn,
        publisherYear: new Date().getFullYear(),
        isAvailable: true,
    };
    this.books.push(newBook);
    return newBook;
    }

    //update data
    updateData(
      createBookDto: CreateBookDto & { id: number; isAvailable?: boolean },
    ): Book {
        const bookIndex = this.books.findIndex(book => book.id === createBookDto.id);
        if (bookIndex === -1) {
            throw new Error('Book not found');
        }

        const updatedBook: Book = {
            ...this.books[bookIndex],
            title: createBookDto.title,
            author: createBookDto.author,
            isbn: createBookDto.isbn,
            publisherYear: createBookDto.publisherYear,
            isAvailable: createBookDto.isAvailable ?? this.books[bookIndex].isAvailable,
        };
        this.books[bookIndex] = updatedBook;
        return updatedBook;
    }

    //hapus data
    hapusData(
        id: number
    ): void {
        const bookIndex = this.books.findIndex(book => book.id === id);
        if (bookIndex === -1) {
            throw new Error('Book not found');
        }
        this.books.splice(bookIndex, 1);
    }
}