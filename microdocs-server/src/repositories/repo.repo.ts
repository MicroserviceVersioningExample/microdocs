
import { Repo } from "../domain/repos/repo.model";
import { BaseRepository } from "./base.repo";
import { Project } from "../domain/projects/project.model";

/**
 * Repo Repository
 *
 * @author S. Hermans <s.hermans@maxxton.com
 */
export interface RepoRepository extends BaseRepository<Repo, Project> {

}
