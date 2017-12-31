import { Project } from "../domain/project.model";
import { Repo } from "../domain/repo.model";

export interface RepoClient {

  getRepos(project: Project): Promise<Repo[]>;

}
