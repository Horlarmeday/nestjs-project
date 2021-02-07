import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string) {
    // find if user exist with this email
    const user = await this.usersService.findOneByEmail(username);
    if (user && (await AuthService.comparePassword(pass, user.password))) {
      const { password, ...result } = user['dataValues'];
      return result;
    }

    return null;
  }

  private static async comparePassword(enteredPassword, dbPassword) {
    return await bcrypt.compare(enteredPassword, dbPassword);
  }

  async login(user: any) {
    const payload = { name: user.name, sub: user.id };

    const token = await this.generateToken(payload);
    return { user, token };
  }

  async create(user: any) {
    // hash the password
    const pass = await AuthService.hashPassword(user.password);

    // create the user
    const newUser = await this.usersService.create({ ...user, password: pass });

    const payload = { name: newUser.name, sub: newUser.id };
    // generate token
    const token = await this.generateToken(payload);

    const { password, ...result } = newUser['dataValues'];
    // return the user and the token
    return { user: result, token };
  }

  private async generateToken(user) {
    return await this.jwtService.signAsync(user);
  }

  private static async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }
}
