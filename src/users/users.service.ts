import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}
  create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }
  async findOne(id: number) {
    if (!id) return;
    return this.repo.findOneBy({ id: id });
  }
  find(email: string) {
    return this.repo.find({ where: { email } });
  }
  async update(id: number, data: Partial<User>) {
    const userExists = await this.repo.findOneBy({ id });
    if (!userExists) {
      throw new NotFoundException('user not found');
    }
    Object.assign(userExists, data);
    return this.repo.save(userExists);
  }
  async remove(id: number) {
    const userExists = await this.repo.findOneBy({ id });
    if (!userExists) {
      throw new NotFoundException('user not found');
    }
    return this.repo.remove(userExists);
  }
}
