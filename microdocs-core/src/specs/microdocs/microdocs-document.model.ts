import { Document } from "../document.model";
import { Components } from "./component/components.model";
import { ExternalDocs } from "./external-doc/external-doc.model";
import { MicroDocsInfo } from "./info/info.model";
import { Path } from "./path/path.model";
import { Ref } from "./ref.model";
import { SecurityRequirement } from "./security/security-requirement.model";
import { Server } from "./server/server.model";
import { Tag } from "./tag/tag.model";

/**
 * MicroDocs root document
 */
export interface MicroDocsDocument extends Document, Ref {

  info?: MicroDocsInfo;
  servers?: Server[];
  externalDocs?: ExternalDocs;
  tags?: Tag[];
  security?: SecurityRequirement[];
  components?: Components;
  paths?: Path;

}
