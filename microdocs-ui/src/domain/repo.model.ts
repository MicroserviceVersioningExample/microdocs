import { BaseModel } from "./base.model";
import { Tag } from "./tag.model";

/**
 * Repo Model
 */
export interface Repo extends BaseModel {

  id: string;
  name: string;
  latestTag?: string;
  tags?: Tag[];
  type: string;
  externalUrl?: string;

}
