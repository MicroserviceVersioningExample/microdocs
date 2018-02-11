import { Header } from "../header/header.model";
import { Style } from "../parameter/styles.model";

export interface Encoding {

  contentType?: string;
  headers?: { [name: string]: Header };
  style?: Style;
  explode?: boolean;
  allowReserved?: boolean;

}
