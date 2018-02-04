import {Project} from "../../domain/project.model";
import {Repo} from "../../domain/repo.model";
import {RepoClient} from "../repo.client";
import {BaseFetchClient} from "./base-fetch.client";

export class RepoFetchClient extends BaseFetchClient implements RepoClient {
  
  public async getRepos(project: Project): Promise<Repo[]> {
    let response = await this.request("get", `/api/v2/projects/${project.id}/repos`);
    let json = await response.json();
    return json as Repo[];
  }
  
  public async createRepo(project: Project, repo: Repo): Promise<Repo> {
    let response = await this.request("post", `/api/v2/projects/${project.id}/repos`, {
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(repo)
    });
    let json = await response.json();
    return json as Repo;
  }
  
  public async deleteRepo(project: Project, repoId: string): Promise<void> {
    let response = await this.request("delete", `/api/v2/projects/${project.id}/repos/${repoId}`);
    if (!response.ok) {
      let json = await response.json();
      throw new Error(json.message);
    }
  }
  
}
