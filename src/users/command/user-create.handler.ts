import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { CreateUserCommand } from "./user-create.command";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../entity/user.entity";
import { Repository } from "typeorm";
import { ulid } from "ulid";
import * as uuid from 'uuid';
import { UserCreatedEvent } from "../event/user-created.event";
import { TestEvent } from "../event/test.event";

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private eventBus: EventBus,
    @InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>,
  ) {}
  async execute(command: CreateUserCommand): Promise<any> {
    const { name, email, password } = command.createUserDto;
    
    const userExist = await this.checkUserExistsByEmail(email);
    console.log(userExist);
    
    if (userExist) {
      throw new UnprocessableEntityException('해당 이메일로는 가입할 수 없습니다.');
    }
    const signupVerifyToken = uuid.v1();  

    await this.saveUser(name, email, password, signupVerifyToken);

    this.eventBus.publish(new UserCreatedEvent(email, signupVerifyToken));
    this.eventBus.publish(new TestEvent());
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
}