import { BaseService } from "./base.service";
import { Project, ProjectOptions } from "@maxxton/microdocs-core";
import { ProjectRepository } from "../repositories/project.repo";
import { Inject, Service } from "typedi";

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
