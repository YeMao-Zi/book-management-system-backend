import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { DbService } from 'src/db/db.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  @Inject(DbService)
  private readonly dbService: DbService;

  async register(data: RegisterUserDto) {
    const users: User[] = await this.dbService.read();
    const foundUser = users.find((user) => user.username === data.username);
    if (foundUser) {
      throw new BadRequestException('该用户已经注册');
    }
    const user = new User();
    user.username = data.username;
    user.password = data.password;
    users.push(user);
    await this.dbService.write(users);
    return user;
  }

  async login(data: LoginUserDto) {
    const users: User[] = await this.dbService.read();
    const foundUser = users.find((user) => user.username === data.username);
    if (!foundUser) {
      throw new BadRequestException('用户不存在');
    }

    if (foundUser.password !== data.password) {
      throw new BadRequestException('密码错误');
    }

    return foundUser;
  }
}
