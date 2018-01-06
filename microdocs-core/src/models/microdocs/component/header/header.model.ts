
import { Parameter } from "../parameter/parameter.model";
import { Placing } from "../parameter/placings.model";

export interface Header extends Parameter {

  name?: never;
  in?: Placing.Header;

}
