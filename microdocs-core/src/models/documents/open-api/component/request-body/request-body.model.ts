
import { Ref } from "../../ref.model";
import { MediaType } from "../response/media-type.model";

export interface RequestBody extends Ref {

  description?: string;
  content?: { [mediaType: string]: MediaType };
  required?: boolean;

}
