import { BaseModel } from "./base.model";

/**
 * Tag Model
 */
export interface Tag extends BaseModel {

  taggedOn?: string;
  ref: string;

}
