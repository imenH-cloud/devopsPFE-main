import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findUsers(): Promise<[any[], number]> {
    return this.userRepository.findAndCount();
  }

  async createUser(createUserDto: CreateUserDto) {
    console.log('usser',createUserDto)
    const salt = 10;
    const saltRound = await bcrypt.genSalt(salt);
    const hash = await bcrypt.hash(createUserDto.password, saltRound);

    createUserDto.password = hash;
    createUserDto.saltRounds = saltRound;

    const user = this.userRepository.create(createUserDto);
    console.log('user create ',user)
    try {
        return this.userRepository.save(user);

    } catch (e) {
      if (/(email)[\s\S]+(existe déjà)/.test(e.detail)) {
        throw new BadRequestException(
          'Le compte avec cette adresse e-mail existe déjà.',
        );
      }
      throw e;
    }
  }

  async replaceById(id: any, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id: +id } });
    if (!user) {
      throw new NotFoundException(`User #${id} not found !`);
    }

    if (updateUserDto.password) {
      const salt = 10;
      const saltRounds = await bcrypt.genSalt(salt);
      const hash = await bcrypt.hash(updateUserDto.password, saltRounds);

      updateUserDto.password = hash;
      updateUserDto.saltRounds = saltRounds;
    }

    const userPreload: any = await this.userRepository.preload({
      id: +id,
      ...updateUserDto,
      updatedAt: new Date(),
    });

    try {
      const { token, saltRounds, password, ...result } =
        await this.userRepository.save(userPreload);
      return result;
    } catch (e) {
      if (/(email)[\s\S]+(existe déjà)/.test(e.detail)) {
        throw new BadRequestException(
          'Le compte avec cette adresse e-mail existe déjà.',
        );
      }
      throw e;
    }
  }

  async findById(id: number): Promise<any> {
    const user: any = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) throw new NotFoundException(`User #${id} not found !`);

    const { token, saltRounds, password, ...result } = user;
    return result;
  }

  async remove(id: number) {
    return await this.userRepository.delete(id);
  }

  async findOne(email: string): Promise<any> {
    return await this.userRepository.findOne({
      where: { email: ILike(email) },
    });
  }

  async removeMultiple(toDelete: number[]) {
    let resultDelete: boolean | null = null;
    let resultDisable: boolean | null = null;

    if (toDelete.length !== 0) {
      const res = await this.userRepository.delete(toDelete);
      resultDelete = !!res.affected;
    }

    return {
      resultDelete,
      resultDisable,
    };
  }
}
