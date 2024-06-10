import { Inject, Injectable, UnprocessableEntityException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { CreateUserCommand } from "./user-create.command";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../../infra/db/entity/user.entity";
import { Repository } from "typeorm";
import { ulid } from "ulid";
import * as uuid from 'uuid';
import { UserCreatedEvent } from "../../domain/user-created.event";
import { IUserRepository } from "../../domain/repository/iuser.repository";
import { UserFactory } from "../../domain/user.factory";

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private userFactory: UserFactory,
    @Inject('UserRepository') private usersRepository: IUserRepository,
  ) {}
  async execute(command: CreateUserCommand): Promise<any> {
    const { name, email, password } = command.createUserDto;
    
    const user = await this.usersRepository.findByEmail(email);
    
    if (user !== null) {
      throw new UnprocessableEntityException('해당 이메일로는 가입할 수 없습니다.');
    }
    const id = ulid();
    const signupVerifyToken = uuid.v1();  

    await this.usersRepository.save(id, name, email, password, signupVerifyToken);

    this.userFactory.create(id, name, email, password, signupVerifyToken);
  }
}