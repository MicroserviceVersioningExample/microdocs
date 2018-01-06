import { Document } from "../domain/document.model";
import { Project } from "../domain/project.model";
import { Repo } from "../domain/repo.model";

export interface DocumentClient {

  getDocument(project: Project, repo: Repo, documentId: string): Promise<Document>;

}
