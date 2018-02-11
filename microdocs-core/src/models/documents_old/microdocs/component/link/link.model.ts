import { Ref } from "../../ref.model";
import { Server } from "../../server/server.model";

export interface Link extends Ref {

  operationRef?: string;
  operationId?: string;
  parameters?: { [name: string]: any };
  requestBody?: any;
  description?: string;
  server?: Server;

}
