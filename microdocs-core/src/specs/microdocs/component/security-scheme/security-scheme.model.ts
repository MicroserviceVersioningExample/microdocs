import { SecurityType } from "./security-types.model";
import { SecurityPlacing } from "./security-placings.model";
import { OAuthFlows } from "./oauth-flows.model";
import { Ref } from "../../ref.model";

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
