import { Logger, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { EmailModule } from 'src/email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entity/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CqrsModule } from '@nestjs/cqrs';
import { UserEventsHandler } from './event/user-event.handler';

@Module({
  imports: [EmailModule, TypeOrmModule.forFeature([UserEntity]), AuthModule, CqrsModule],
  controllers: [UsersController],
  providers: [UsersService, Logger, UserEventsHandler],
})
export class UsersModule {}
