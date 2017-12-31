import { Inject, Service } from "typedi";
import { Project, ProjectOptions } from "../domain/projects/project.model";
import { ProjectRepository } from "../repositories/project.repo";
import { BaseService } from "./base.service";

/**
 * Project Service
 *
 * @author S. Hermans <s.hermans@maxxton.com
 */
@Service()
export class ProjectService extends BaseService<Project, ProjectOptions> {

  constructor(@Inject("project.repo") private projectRepo: ProjectRepository) {
    super(Project, projectRepo);
  }

}
