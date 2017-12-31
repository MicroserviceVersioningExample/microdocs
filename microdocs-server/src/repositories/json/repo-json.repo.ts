
import { Repo, RepoOptions } from "../../domain/index";
import { RepoRepository } from "../repo.repo";
import { BaseJsonRepository } from "./base-json.repo";
import { Project } from "../../domain/projects/project.model";

export class RepoJsonRepository extends BaseJsonRepository<Repo, Project> implements RepoRepository {

  constructor() {
    super("repos", Project);
  }

  protected deserialize(data: string): Repo {
    let json = JSON.parse(data);
    return new Repo(json as RepoOptions);
  }

}
