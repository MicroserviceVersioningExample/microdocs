import { AuthorizationCode, AuthorizationCodeOptions } from "../../../domain/auth/authorization-code.model";
import { BaseJsonRepository } from "../../json/base-json.repo";
import { AuthorizationCodeRepository } from "../authorization-code.repo";

export class AuthorizationCodeJsonRepository extends BaseJsonRepository<AuthorizationCode>
  implements AuthorizationCodeRepository {

  constructor() {
    super("auth/codes");
  }

  protected deserialize(data: string): AuthorizationCode {
    let json = JSON.parse(data);
    return new AuthorizationCode(json as AuthorizationCodeOptions);
  }

}
