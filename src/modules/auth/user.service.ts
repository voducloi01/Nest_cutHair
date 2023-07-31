import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { userDTO } from 'src/dto/user.dto';
import { UserEntity } from 'src/entities/user.entity';
import { User } from 'src/models/user.model';
import { ROLE } from 'src/until/constans';
import { Repository, getRepository } from 'typeorm';

@Injectable()
export class userService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(data: User): Promise<UserEntity> {
    const checkMail = await this.userRepository.findOne({
      where: { email: data.email },
    });

    if (checkMail) {
      throw new NotFoundException(`Email này đã tồn tại !`);
    }
    const user = this.userRepository.save(data);
    return user;
  }

  async findUser(data: any): Promise<UserEntity> {
    return this.userRepository.findOne({ where: data });
  }

  async updateUser(id: number, data: userDTO) {
    // Kiểm tra sự tồn tại của sản phẩm với ID tương ứng
    const user = await this.userRepository.findOneBy({ id: id });

    if (!user) {
      throw new NotFoundException(`Không tìm thấy User với ID ${id}`);
    }

    if (data.role) {
      if (data.role !== ROLE.Admin && data.role !== ROLE.Staff) {
        throw new NotFoundException('Role is not exits!');
      }
    }

    const updateUser = await this.userRepository.save({
      ...user,
      ...data,
    });

    return updateUser;
  }
}
