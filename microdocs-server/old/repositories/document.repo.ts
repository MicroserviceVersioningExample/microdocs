
import { Document } from "../domain/documents/document.model";
import { Project } from "../domain/projects/project.model";
import { Repo } from "../domain/repos/repo.model";
import { BaseRepository } from "./base.repo";

/**
 * Document Repository
 *
 * @author S. Hermans <s.hermans@maxxton.com>
 */
export interface DocumentRepository extends BaseRepository<Document, Project, Repo> {

}
