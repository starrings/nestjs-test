import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<void> {
    await this.userService.createUser(createUserDto);
  }

  @Post('/email-verify')
  async verifyEmail(@Query() verifyEmailDto: VerifyEmailDto): Promise<string> {
    console.log(verifyEmailDto);  
    return;
  }

  @Post('login')
  async login(@Body() userLoginDto: UserLoginDto): Promise<string> {
    console.log(userLoginDto);
    return;
  }

  @Get('/:id')
  async getUser(@Param('id') userId: string): Promise<UserDto> {
    console.log(userId);
    return;
  }
}
