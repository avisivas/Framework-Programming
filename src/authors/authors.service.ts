import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Author } from './entities/author.entity.js';
import { CreateAuthorDto } from './dto/create-author.dto.js';
import { UpdateAuthorDto } from './dto/update-author.dto.js';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
  ) {}

  // Menambahkan author
  async create(createAuthorDto: CreateAuthorDto) {
    const author = this.authorRepository.create(createAuthorDto);

    return await this.authorRepository.save(author);
  }

  // Menampilkan semua author
  async findAll() {
    return await this.authorRepository.find();
  }

  // Menampilkan author berdasarkan ID
  async findOne(id: string) {
    const author = await this.authorRepository.findOne({
      where: { id },
    });

    if (!author) {
      throw new NotFoundException('Author tidak ditemukan');
    }

    return author;
  }

  // Mengubah data author
  async update(id: string, updateAuthorDto: UpdateAuthorDto) {
    const author = await this.findOne(id);

    Object.assign(author, updateAuthorDto);

    return await this.authorRepository.save(author);
  }

  // Menghapus author
  async remove(id: string) {
    const author = await this.authorRepository.findOne({
      where: { id },
      relations: { bookAuthors: true },
    });

    if (!author) {
      throw new NotFoundException('Author tidak ditemukan');
    }

    if (author.bookAuthors.length > 0) {
      throw new ConflictException(
        'Author tidak dapat dihapus karena masih terhubung dengan buku',
      );
    }

    await this.authorRepository.remove(author);

    return {
      message: 'Author berhasil dihapus',
    };
  }
}