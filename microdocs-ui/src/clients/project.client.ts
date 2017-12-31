import { Project } from "../domain/project.model";

export interface ProjectClient {

  getProjects(): Promise<Project[]>;

}
