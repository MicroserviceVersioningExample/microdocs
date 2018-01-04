
import { Ref } from "../../ref.model";

export interface Example extends Ref {

  summary?: string;
  description?: string;
  value?: any;
  externalValue?: string;

}
