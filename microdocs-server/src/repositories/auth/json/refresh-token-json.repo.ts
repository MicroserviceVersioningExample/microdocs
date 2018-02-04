import { RefreshToken, RefreshTokenOptions } from "../../../domain/auth/refresh-token.model";
import { BaseJsonRepository } from "../../json/base-json.repo";
import { RefreshTokenRepository } from "../refresh-token.repo";

export class RefreshTokenJsonRepository extends BaseJsonRepository<RefreshToken>
  implements RefreshTokenRepository {

  constructor() {
    super("auth/refresh-tokens");
  }

  protected deserialize(data: string): RefreshToken {
    let json = JSON.parse(data);
    return new RefreshToken(json as RefreshTokenOptions);
  }

}
