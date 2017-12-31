import { Project } from "../../domain/project.model";
import { ProjectClient } from "../project.client";

export class ProjectFetchClient implements ProjectClient {

  public async getProjects(): Promise<Project[]> {
    let response = await fetch("http://localhost:8000/api/v2/projects");
    let json = await response.json();
    return json as Project[];
  }

}
