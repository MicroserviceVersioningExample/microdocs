import { CreateClient } from "../clients/create.client";
import { Project } from "../domain/Project.model";

export class CreateService {

  constructor(private createClient: CreateClient = new CreateClient()) {

  }

  public createProject(name: string): Promise<Project> {
    return this.createClient.createProject(name);
  }

}
