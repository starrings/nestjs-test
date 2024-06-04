import { ICommand } from "@nestjs/cqrs";
import { CreateUserDto } from "../dto/create-user.dto";

export class CreateUserCommand implements ICommand {
  constructor(
    readonly createUserDto: CreateUserDto,
  ) { }
}