import { Callback } from "../component/callback/callback.model";
import { Parameter } from "../component/parameter/parameter.model";
import { RequestBody } from "../component/request-body/request-body.model";
import { Response } from "../component/response/response.model";
import { ExternalDocs } from "../external-doc/external-doc.model";
import { Ref } from "../ref.model";
import { SecurityRequirement } from "../security/security-requirement.model";
import { Server } from "../server/server.model";

export interface Path {
  [path: string]: Method;
}

export interface Method {

  summary?: string;
  description?: string;
  servers?: Server[];
  parameters?: Parameter[];

  get?: PathModel;
  put?: PathModel;
  post?: PathModel;
  delete?: PathModel;
  options?: PathModel;
  head?: PathModel;
  patch?: PathModel;
  trace?: PathModel;

}

export interface PathModel extends Ref {

  tags?: string[];
  summary?: string;
  description?: string;
  externalDocs?: ExternalDocs;
  operationId?: string;
  deprecated?: boolean;

  // Components
  parameters?: Parameter[];
  requestBody?: RequestBody;
  responses?: { [statusCode: string]: Response };
  callbacks?: { [name: string]: Callback };
  security?: SecurityRequirement[];
  servers?: Server[];

}
