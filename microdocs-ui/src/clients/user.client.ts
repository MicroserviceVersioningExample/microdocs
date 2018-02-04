
import { Token } from "../domain/token.model";
import { User } from "../domain/user.model";

export interface UserClient {

  login(username: string, password: string): Promise<Token>;

  getUser(username: string): Promise<User>;

}
