import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as uuid from 'uuid';
import { EmailService } from 'src/email/email.service';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entity/user.entity';
import { DataSource, Repository } from 'typeorm';
import { ulid } from 'ulid';

@Injectable()
export class UsersService {
  constructor(
    private emailService: EmailService,
    @InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>,
    private dataSource: DataSource,
  ) {};
  
  async createUser(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;
    const userExist = await this.checkUserExistsByEmail(email);
    if (userExist) {
      throw new UnprocessableEntityException('해당 이메일로는 가입할 수 없습니다.');
    }
    const signupVerifyToken = uuid.v1();  

    await this.saveUser(name, email, password, signupVerifyToken);
    await this.sendMemberJoinEmail(email, signupVerifyToken);
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const { signupVerifyToken } = verifyEmailDto;
    // 회원 가입 요청 유저 조회
    // jwt 발급
   throw new Error('Method not implemented'); 
  }

  async login(userLoginDto: UserLoginDto) {
    // db에서 확인
    // jwt 발급
    throw new Error('Method not implemented.');
  }

  async getUser(userId: string) {
    // db에서 확인
    // 응답
    throw new Error('Method not implemented.');
  }

  private async checkUserExistsByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email: email }
    });

    return user !== undefined;
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
