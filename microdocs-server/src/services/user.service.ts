import { BaseService } from "./base.service";
import { User, UserOptions } from "../domain/users/user.model";
import { Inject, Service } from "typedi";
import { UserRepository } from "../repositories/user.repo";
import { ValidationException } from "../domain/common/validation.error";

@Service("user.service")
export class UserService extends BaseService<User, UserOptions> {

  constructor(@Inject("user.repo") private userRepository: UserRepository) {
    super(User, userRepository);
  }

  /**
   * Add permissions to a user
   * @param {string} id
   * @param {string[]} permissions
   * @returns {User|null}
   */
  public async addPermission(id: string, permissions: string[]): Promise<User | null> {
    let user = await this.getById(id);
    if (!user) {
      return null;
    }

    permissions.forEach(permission => user.addPermission(permission));

    let errors = await user.validate();
    if (errors.length > 0) {
      throw new ValidationException("Model is invalid", errors);
    }
    return user;
  }

  public async getById(id: string): Promise<User | null> {
    let user = await super.getById(id);
    return user.getSafeUser();
  }

  /**
   * Find user with matching username and password
   * @param {string} username
   * @param {string} password
   * @returns {Promise<User>}
   */
  public async authenticate(username: string, password: string): Promise<User | null> {
    let user = await this.userRepository.find(username.toLowerCase());
    if(user && user.password === password){
      return user;
    }
    return null;
  }


}
