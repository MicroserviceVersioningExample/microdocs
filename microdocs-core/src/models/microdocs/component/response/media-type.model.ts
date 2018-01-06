
import { Example } from "../examples/example.model";
import { Schema } from "../schema/schema.model";
import { Encoding } from "./encoding.model";

export interface MediaType {

  schema?: Schema;
  example?: any;
  examples?: {[name: string]: Example};
  encoding?: {[name: string]: Encoding};

}
