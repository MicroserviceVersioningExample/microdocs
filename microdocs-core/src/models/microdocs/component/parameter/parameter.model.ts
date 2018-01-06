
import { Ref } from "../../ref.model";
import { Example } from "../examples/example.model";
import { Schema } from "../schema/schema.model";
import { Placing } from "./placings.model";
import { Style } from "./styles.model";

export interface Parameter extends Ref {

  name?: string;
  in?: Placing;
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  allowEmptyValue?: boolean;

  // Format
  style?: Style;
  explode?; boolean;
  allowReserved?: boolean;
  schema?: Schema;
  example?: any;
  examples?: {[name: string]: Example};

}
