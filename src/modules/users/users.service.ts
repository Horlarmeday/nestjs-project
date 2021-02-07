import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { USER_REPOSITORY } from '../../core/constants';
import { User } from './entities/user.entity';
import { Op } from 'sequelize';

@Injectable()
export class UsersService {
  constructor(@Inject(USER_REPOSITORY) private userRepository: typeof User) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return await this.userRepository.create<User>(createUserDto);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.findAll<User>();
  }

  async findOneById(id: number): Promise<User> {
    return await this.userRepository.findByPk<User>(id);
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne<User>({ where: { email } });
  }

  async findOneByEmailAndPhone(email: string, phone: string): Promise<User> {
    return await this.userRepository.findOne<User>({
      where: {
        [Op.or]: [
          {
            email,
          },
          {
            phone,
          },
        ],
      },
    });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<[number, User[]]> {
    return await this.userRepository.update<User>(updateUserDto, {
      where: { id },
    });
  }

  async remove(id: number): Promise<number> {
    return this.userRepository.destroy<User>({ where: { id } });
  }
}
