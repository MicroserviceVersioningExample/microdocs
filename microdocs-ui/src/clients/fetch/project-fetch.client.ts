import { Project } from "../../domain/project.model";
import { ProjectClient } from "../project.client";
import { BaseFetchClient } from "./base-fetch.client";

export class ProjectFetchClient extends BaseFetchClient implements ProjectClient {

  public async getProjects(): Promise<Project[]> {
    let response = await this.request("get", "/api/v2/projects");
    let json = await response.json();
    return json as Project[];
  }

}
