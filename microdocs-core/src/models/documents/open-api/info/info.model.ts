
import { Contact } from "./contact.model";
import { License } from "./license.model";

export interface Info {

  title?: string;
  version?: string;
  description?: string;
  termsOfService?: string;
  contact?: Contact;
  license?: License;

}
