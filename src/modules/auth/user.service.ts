import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { ROLE } from 'src/until/constans';
import { IFUser } from 'src/until/interface';
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

  async updateUser(id: number, data: Partial<IFUser>) {
    // Kiểm tra sự tồn tại của sản phẩm với ID tương ứng
    const user = await this.userRepository.findOneBy({ id: id });

    if (!user) {
      throw new NotFoundException(`Không tìm thấy User với ID ${id}`);
    }

    if (data.role !== ROLE.Admin && data.role !== ROLE.Staff) {
      throw new NotFoundException('Role is not exits!');
    }

    const updateUser = await this.userRepository.save({
      ...user,
      ...data,
    });

    return updateUser;
  }
}
