
import { Info } from "../../info/info.model";
import { Contact } from "./contact.model";
import { License } from "./license.model";

export interface MicroDocsInfo extends Info {

  termsOfService?: string;
  contact?: Contact;
  license?: License;

}