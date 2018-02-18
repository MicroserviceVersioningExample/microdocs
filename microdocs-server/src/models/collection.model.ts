import { Collection } from "mongodb";
import { Service } from "../services/service.model";
import {Schema} from "jsonschema";

export interface CollectionModel<T = any> {

  name: string;
  parent?: CollectionModel;
  schema?: Schema;
  db?: Collection;
  service?: Service<T>;

}
