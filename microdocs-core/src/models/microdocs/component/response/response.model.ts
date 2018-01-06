import { Ref } from "../../ref.model";
import { Header } from "../header/header.model";
import { Link } from "../link/link.model";
import { MediaType } from "./media-type.model";

export interface Response extends Ref {

  description?: string;
  headers?: { [name: string]: Header };
  content?: { [mediaType: string]: MediaType };
  links?: { [name: string]: Link };

}
