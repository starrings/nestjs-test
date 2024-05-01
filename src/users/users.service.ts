import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as uuid from 'uuid';
import { EmailService } from 'src/email/email.service';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entity/user.entity';
import { DataSource, Repository } from 'typeorm';
import { ulid } from 'ulid';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    private emailService: EmailService,
    @InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>,
    private dataSource: DataSource,
    private authService: AuthService,
  ) {};
  
  async createUser(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;
    const userExist = await this.checkUserExistsByEmail(email);
    console.log(userExist);
    
    if (userExist) {
      throw new UnprocessableEntityException('해당 이메일로는 가입할 수 없습니다.');
    }
    const signupVerifyToken = uuid.v1();  

    await this.saveUser(name, email, password, signupVerifyToken);
    await this.sendMemberJoinEmail(email, signupVerifyToken);
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const { signupVerifyToken } = verifyEmailDto;
    const user = await this.usersRepository.findOne({
      where: { signupVerifyToken }
    });

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }

    return this.authService.login({
      id: user.id,
      name: user.name,
      email: user.email,
    })
  }

  async login(userLoginDto: UserLoginDto) {
    const { email, password } = userLoginDto;

    const user = await this.usersRepository.findOne({
      where: { email, password }
    });

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }

    return this.authService.login({
      id: user.id,
      name: user.name,
      email: user.email,
    })
  }

  async getUser(userId: string) {
    return await this.usersRepository.findOne({
      where: { id: userId }
    });
  }

  private async checkUserExistsByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email: email }
    });

    return user != undefined;
  }

   private async saveUser(name: string, email: string, password: string, signupVerifyToken: string) {
    const user = new UserEntity();
    user.id = ulid();
    user.name = name;
    user.email = email;
    user.password = password;
    user.signupVerifyToken = signupVerifyToken;
    await this.usersRepository.save(user);
  }

  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(email, signupVerifyToken);
  }
}
