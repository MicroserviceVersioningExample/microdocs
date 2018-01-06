
import { Document, DocumentOptions } from "../../domain/document/document.model";
import { Repo } from "../../domain/index";
import { Project } from "../../domain/projects/project.model";
import { DocumentRepository } from "../document.repo";
import { BaseJsonRepository } from "./base-json.repo";

export class DocumentJsonRepository extends BaseJsonRepository<Document, Project, Repo> implements DocumentRepository {

  constructor() {
    super("documents", Project);
  }

  protected deserialize(data: string): Document {
    let json = JSON.parse(data);
    return new Document(json as DocumentOptions);
  }

}
