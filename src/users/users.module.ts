import { Logger, Module } from '@nestjs/common';
import { UsersController } from './interface/users.controller';
import { UsersService } from './users.service';
import { EmailModule } from 'src/email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/infra/db/entity/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CqrsModule } from '@nestjs/cqrs';
import { UserEventsHandler } from './application/event/user-event.handler';
import { UserRepository } from './infra/db/repository/user.repository';
import { EmailService } from './infra/adapter/email.service';

@Module({
  imports: [EmailModule, TypeOrmModule.forFeature([UserEntity]), AuthModule, CqrsModule],
  controllers: [UsersController],
  providers: [
    UsersService, 
    Logger, 
    UserEventsHandler, 
    { provide: 'UserRepository', useClass: UserRepository },
    { provide: 'EmailService', useClass: EmailService },
  ],
})
export class UsersModule {}
