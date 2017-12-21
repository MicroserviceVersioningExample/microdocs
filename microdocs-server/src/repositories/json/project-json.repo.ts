import { Project, ProjectOptions } from "@maxxton/microdocs-core";
import { BaseJsonRepository } from "./base-json.repo";
import { ProjectRepository } from "../project.repo";

export class ProjectJsonRepository extends BaseJsonRepository<Project> implements ProjectRepository {

  constructor() {
    super("projects");
  }

  protected deserialize(data: string): Project {
    let json = JSON.parse(data);
    return new Project(json as ProjectOptions);
  }

}