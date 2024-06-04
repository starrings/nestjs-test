import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetUserQuery } from "./get-user.query";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../entity/user.entity";
import { Repository } from "typeorm";
import { NotFoundException } from "@nestjs/common";

@QueryHandler(GetUserQuery)
export class GetUserQueryHandler implements IQueryHandler<GetUserQuery> {
  constructor(
    @InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>
  ) { }

  async execute(query: GetUserQuery) {
    const { userId } = query;

    const user = await this.usersRepository.findOne({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}