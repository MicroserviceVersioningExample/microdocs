import { Project, ProjectOptions } from "../../domain/projects/project.model";
import { ProjectRepository } from "../project.repo";
import { BaseJsonRepository } from "./base-json.repo";

export class ProjectJsonRepository extends BaseJsonRepository<Project> implements ProjectRepository {

  constructor() {
    super("projects");
  }

  protected deserialize(data: string): Project {
    let json = JSON.parse(data);
    return new Project(json as ProjectOptions);
  }

}
