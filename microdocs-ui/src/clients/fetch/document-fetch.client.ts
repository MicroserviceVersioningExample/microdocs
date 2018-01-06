import { Document } from "../../domain/document.model";
import { Project } from "../../domain/project.model";
import { Repo } from "../../domain/repo.model";
import { DocumentClient } from "../document.client";

export class DocumentFetchClient implements DocumentClient {

  public async getDocument(project: Project, repo: Repo, documentId: string): Promise<Document> {
    let response = await fetch(
      `http://localhost:8000/api/v2/projects/${project.id}/repos/${repo.id}/documents/${documentId}`);
    let json = await response.json();
    return json as Document;
  }

}
