
import { User, UserOptions } from "../../domain/users/user.model";
import { UserRepository } from "../user.repo";
import { BaseJsonRepository } from "./base-json.repo";

export class UserJsonRepository extends BaseJsonRepository<User> implements UserRepository {

  constructor() {
    super("users");
  }

  protected deserialize(data: string): User {
    let json = JSON.parse(data);
    return new User(json as UserOptions);
  }

}
