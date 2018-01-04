
import { Info } from "./info/info.model";

/**
 * Abstract Root Document
 */
export interface Document {

  apiVersion?: string;
  info?: Info;

}
