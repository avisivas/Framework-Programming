import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../users/entity/user-entity.js';
import { CreateUserDto } from '../users/dto/creat-user-dto.js';
import { UpdateUserDto } from '../users/dto/update-user-dto.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // CREATE
  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email sudah digunakan');
    }

    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  // READ ALL
  async findAll() {
    return await this.userRepository.find();
  }

  // READ ONE
  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    return user;
  }

  // UPDATE
  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email sudah digunakan');
      }
    }

    Object.assign(user, updateUserDto);

    return await this.userRepository.save(user);
  }

  // DELETE
  async remove(id: string) {
    const user = await this.findOne(id);

    await this.userRepository.softRemove(user);

    return {
      message: 'User berhasil dihapus',
    };
  }
}