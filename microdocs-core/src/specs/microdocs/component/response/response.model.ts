import { Ref } from "../../ref.model";
import { Link } from "../link/link.model";
import { Header } from "../header/header.model";

export interface Response extends Ref {

  description?: string;
  headers?: { [name: string]: Header };
  content?: { [mediaType: string]: MediaType };
  links?: { [name: string]: Link };

}
