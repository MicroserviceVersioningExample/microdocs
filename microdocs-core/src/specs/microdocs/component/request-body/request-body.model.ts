
import { Ref } from "../../ref.model";

export interface RequestBody extends Ref {

  description?: string;
  content?: { [mediaType: string]: MediaType };
  required?: boolean;

}
