import {Document} from "../../domain/document.model";
import {Project} from "../../domain/project.model";
import {Repo} from "../../domain/repo.model";
import {DocumentClient} from "../document.client";
import {BaseFetchClient} from "./base-fetch.client";

export class DocumentFetchClient extends BaseFetchClient implements DocumentClient {
  
  public async getDocument(project: Project, repo: Repo, documentId: string): Promise<Document> {
    let response = await this.request("get",
      `/api/v2/projects/${project.id}/repos/${repo.id}/documents/${documentId}`);
    let json = await response.json();
    return json as Document;
  }
  
  public async createDocument(project: Project, repo: Repo, document: Document, tag?: string): Promise<Document> {
    let url = `/api/v2/projects/${project.id}/repos/${repo.id}/documents`;
    if (tag) {
      url += "?tag=" + tag;
    }
    let response = await this.request("post", url, {
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(document)
    });
    let json = await response.json();
    return json as Document;
  }
  
}
