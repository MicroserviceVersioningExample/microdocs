import { Project } from "../../domain/project.model";
import { Repo } from "../../domain/repo.model";
import { RepoClient } from "../repo.client";
import { BaseFetchClient } from "./base-fetch.client";

export class RepoFetchClient extends BaseFetchClient implements RepoClient {

  public async getRepos(project: Project): Promise<Repo[]> {
    let response = await this.request("get", `/api/v2/projects/${project.id}/repos`);
    let json = await response.json();
    return json as Repo[];
  }

}
