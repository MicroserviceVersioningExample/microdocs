import { Project } from "../../domain/project.model";
import { Repo } from "../../domain/repo.model";
import { RepoClient } from "../repo.client";

export class RepoFetchClient implements RepoClient {

  public async getRepos(project: Project): Promise<Repo[]> {
    let response = await fetch(`http://localhost:8000/api/v2/projects/${project.id}/repos`);
    let json = await response.json();
    return json as Repo[];
  }

}
