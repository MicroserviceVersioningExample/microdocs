import {
  Components,
  ExternalDocs,
  MicroDocsDocument,
  MicroDocsInfo,
  Path,
  SecurityRequirement,
  Server,
  Tag
} from "@maxxton/microdocs-core";
import { BaseModel, BaseOptions } from "../common/base.model";

/**
 * /api/v2/projects/:project/repos/:repo/documents
 *
 * @author S. Hermans <s.hermans@maxxton.com
 */
export class Document extends BaseModel<DocumentOptions> implements MicroDocsDocument {

  public info?: MicroDocsInfo;
  public servers?: Server[];
  public externalDocs?: ExternalDocs;
  public tags?: Tag[];
  public security?: SecurityRequirement[];
  public components?: Components;
  public paths?: Path;

  /**
   * Update properties of this project
   * @param {ProjectOptions} options
   */
  public edit(options: DocumentOptions) {
    super.edit(options);
    if (options) {
      this.info = options.info;
      if (options.info && options.info.title) {
        this.name = options.info.title;
      }
      this.servers = options.servers;
      this.externalDocs = options.externalDocs;
      this.tags = options.tags;
      this.security = options.security;
      this.components = options.components;
      this.paths = options.paths;
    }
  }

}

export interface DocumentOptions extends BaseOptions, MicroDocsDocument {

}
