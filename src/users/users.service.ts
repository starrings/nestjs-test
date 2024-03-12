import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as uuid from 'uuid';
import { EmailService } from 'src/email/email.service';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserLoginDto } from './dto/user-login.dto';

@Injectable()
export class UsersService {
  constructor(private emailService: EmailService) {};
  
  async createUser(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;
    await this.checkUserExistsByEmail(email);
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

  async getUser(userId: number) {
    // db에서 확인
    // 응답
    throw new Error('Method not implemented.');
  }

  private checkUserExistsByEmail(email: string) {
    // DB 연동
    return false;
  }

  private saveUser(name: string, email: string, password: string, signupVerifyToken: string) {
    // DB 연동
    return;
  }

  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(email, signupVerifyToken);
  }
}
