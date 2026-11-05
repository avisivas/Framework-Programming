import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Publisher } from './entities/publisher.entity.js';
import { CreatePublisherDto } from './dto/create-publisher.dto.js';
import { UpdatePublisherDto } from './dto/update-publisher.dto.js';

@Injectable()
export class PublishersService {
  constructor(
    @InjectRepository(Publisher)
    private readonly publisherRepository: Repository<Publisher>,
  ) {}

  async create(createPublisherDto: CreatePublisherDto) {
    const publisher = this.publisherRepository.create(createPublisherDto);
    return await this.publisherRepository.save(publisher);
  }

  async findAll() {
    return await this.publisherRepository.find();
  }

  async findOne(id: string) {
    const publisher = await this.publisherRepository.findOne({
      where: { id },
    });

    if (!publisher) {
      throw new NotFoundException('Publisher tidak ditemukan');
    }

    return publisher;
  }

  async update(id: string, updatePublisherDto: UpdatePublisherDto) {
    const publisher = await this.findOne(id);

    Object.assign(publisher, updatePublisherDto);

    return await this.publisherRepository.save(publisher);
  }

  async remove(id: string) {
    const publisher = await this.publisherRepository.findOne({
      where: { id },
      relations: { books: true },
    });

    if (!publisher) {
      throw new NotFoundException('Publisher tidak ditemukan');
    }

    if (publisher.books.length > 0) {
      throw new ConflictException(
        'Publisher tidak dapat dihapus karena masih memiliki buku',
      );
    }

    await this.publisherRepository.remove(publisher);

    return {
      message: 'Publisher berhasil dihapus',
    };
  }
}