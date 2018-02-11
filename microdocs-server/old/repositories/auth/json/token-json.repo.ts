import { Token, TokenOptions } from "../../../domain/auth/token.model";
import { BaseJsonRepository } from "../../json/base-json.repo";
import { TokenRepository } from "../token.repo";

export class TokenJsonRepository extends BaseJsonRepository<Token>
  implements TokenRepository {

  constructor() {
    super("auth/tokens");
  }

  protected deserialize(data: string): Token {
    let json = JSON.parse(data);
    return new Token(json as TokenOptions);
  }

}
