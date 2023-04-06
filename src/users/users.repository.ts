import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserRequestDto } from './dto/user.request.dto';
import { User } from './users.schema';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async existByEmail(email: string): Promise<any> {
    try {
      const result = await this.userModel.exists({ email });
      return result;
    } catch (error) {
      throw new HttpException('db error', 400);
    }
  }

  async create(user: UserRequestDto): Promise<User> {
    return await this.userModel.create(user);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email });
    return user;
  }

  async findUserByIdWithoutPassword(
    userId: string | Types.ObjectId,
  ): Promise<User | null> {
    const user = await this.userModel.findById(userId);
    return user;
  }

  async findTopTenUsers() {
    return await this.userModel.find().sort({ money: -1 }).limit(10);
  }

  async plusMoney(id: string, money: number) {
    try {
      const user = await this.userModel.findById(id);
      user.money += money;
      return await user.save();
    } catch (error) {
      throw new HttpException('db error : 해당 하는 유저 없음', 400);
    }
  }

  async buyTool(strong: number, money: number, id: string) {
    const user = await this.userModel.findById(id);
    if (user.money > money) {
      user.money -= money;
      user.strong += strong;
      return await user.save();
    } else {
      throw new HttpException('돈이 부족합니다.', 400);
    }
  }
}
