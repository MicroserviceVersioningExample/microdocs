import { Inject, Service } from "typedi";
import { Document, DocumentOptions } from "../domain/documents/document.model";
import { Repo } from "../domain/index";
import { Project } from "../domain/projects/project.model";
import { BaseService } from "./base.service";
import { DocumentRepository } from "../repositories/document.repo";

/**
 * Document Service
 *
 * @author S. Hermans <s.hermans@maxxton.com>
 */
@Service()
export class DocumentService extends BaseService<Document, DocumentOptions, Project, Repo> {

  constructor(@Inject("document.repo") private documentRepo: DocumentRepository) {
    super(Document, documentRepo);
  }

}
