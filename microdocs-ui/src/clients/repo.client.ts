import { Project } from "../domain/project.model";
import { Repo } from "../domain/repo.model";

export interface RepoClient {

  getRepos(project: Project): Promise<Repo[]>;
  
  createRepo(project: Project, repo: Repo): Promise<Repo>;
  
  deleteRepo(project: Project, repoId: string): Promise<void>;

}
