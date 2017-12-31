import { Inject, Service } from "typedi";
import { Repo, RepoOptions } from "../domain/repos/repo.model";
import { BaseService } from "./base.service";
import { RepoRepository } from "../repositories/repo.repo";
import { Project } from "../domain/projects/project.model";

/**
 * Repo Service
 *
 * @author S. Hermans <s.hermans@maxxton.com
 */
@Service()
export class RepoService extends BaseService<Repo, RepoOptions, Project> {

  constructor(@Inject("repo.repo") private repoRepository: RepoRepository) {
    super(Repo, repoRepository);
  }

}
