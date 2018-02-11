
import { Body, Delete, Get, JsonController, NotFoundError, OnUndefined, Param, Post, Put } from "routing-controllers";
import { Stream } from "stream";
import { Inject } from "typedi";
import { User, UserOptions } from "../domain/users/user.model";
import { observableToJsonStream } from "../helpers/stream.helper";
import { UserService } from "../services/user.service";

@JsonController("/api/v2")
export class UserController {

  constructor(@Inject("user.service") private userService: UserService) {

  }

  /**
   * Get all users
   * @returns {"stream".internal.Stream}
   */
  @Get("/users")
  public getUsers(): Stream {
    return observableToJsonStream(this.userService.getAllAsStream());
  }

  /**
   * Create user
   * @param {UserOptions} user
   * @returns {User}
   */
  @Post("/users")
  public createUser(@Body() user: UserOptions): Promise<User> {
    return this.userService.create(user);
  }

  /**
   * Get user
   * @param {string} id
   * @returns {Promise<User>}
   */
  @Get("/users/:id")
  public getUser(@Param("id") id: string): Promise<User> {
    return this.userService.getById(id);
  }

  /**
   * Create or edit user
   * @param {string} id
   * @param {UserOptions} user
   * @returns {Promise<User>}
   */
  @Put("/users/:id")
  public editUser(@Param("id") id: string, @Body() user: UserOptions): Promise<User> {
    return this.userService.editOrCreate(id, user);
  }

  /**
   * Delete user
   * @param {string} id
   * @returns {Promise<void>}
   */
  @Delete("/users/:id")
  @OnUndefined(204)
  public async deleteUser(@Param("id") id: string): Promise<void> {
    if (!await this.userService.delete(id)) {
      throw new NotFoundError();
    }
  }

}
