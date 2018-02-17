import { Collection } from "mongodb";
import { Service } from "../services/service.model";

export interface CollectionModel<T = any> {

  name: string;
  parent?: CollectionModel;
  db?: Collection;
  service?: Service<T>;

}
