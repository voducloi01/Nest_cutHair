import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class userService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(data: any): Promise<UserEntity> {
    return this.userRepository.save(data);
  }

  async findUser(data: any): Promise<UserEntity> {
    return this.userRepository.findOne({ where: data });
  }
}
