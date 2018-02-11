import { Ref } from "../../ref.model";
import { OAuthFlows } from "./oauth-flows.model";
import { SecurityPlacing } from "./security-placings.model";
import { SecurityType } from "./security-types.model";

export interface SecurityScheme extends Ref {

  type?: SecurityType;
  description?: string;
  name?: string;
  in?: SecurityPlacing;
  scheme?: "http" | "https";
  bearerFormat?: string;
  flows?: OAuthFlows;
  openIdConnectionUrl?: string;

}
