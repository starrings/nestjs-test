import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService, private authService: AuthService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<void> {
    console.log(createUserDto);

    await this.userService.createUser(createUserDto);
  }

  @Get('/email-verify')
  async verifyEmail(@Query() verifyEmailDto: VerifyEmailDto) {
    return await this.userService.verifyEmail(verifyEmailDto);
  }
 
  @Post('/login')
  async login(@Body() userLoginDto: UserLoginDto) {
    return await this.userService.login(userLoginDto);
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async getUser(@Param('id') userId: string) {
    return await this.userService.getUser(userId);
  }
}
