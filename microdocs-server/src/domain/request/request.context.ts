
import { User } from "../users/user.model";
import { Group } from "../groups/group.model";

/**
 * Request context
 */
export class RequestContext {

  private _user: User;
  private _group: Group;

  constructor(user: User, group: Group) {
    this._user = user;
    this._group = group;
  }

  get user(): User {
    return this._user;
  }

  get group(): Group {
    return this._group;
  }

}
