
import { Callback } from "./callback/callback.model";
import { Example } from "./examples/example.model";
import { Header } from "./header/header.model";
import { Link } from "./link/link.model";
import { Parameter } from "./parameter/parameter.model";
import { RequestBody } from "./request-body/request-body.model";
import { Response } from "./response/response.model";
import { Schema } from "./schema/schema.model";
import { SecurityScheme } from "./security-scheme/security-scheme.model";

export interface Components {

  schemas?: {[name: string]: Schema};
  responses?: {[name: string]: Response};
  parameters?: {[name: string]: Parameter};
  examples?: {[name: string]: Example};
  requestBodies?: {[name: string]: RequestBody};
  headers?: {[name: string]: Header};
  securitySchemes?: {[name: string]: SecurityScheme};
  links?: {[name: string]: Link};
  callbacks?: {[name: string]: Callback};

}
