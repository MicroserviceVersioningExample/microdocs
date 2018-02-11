import { Project } from "../domain/projects/project.model";
import { Template } from "../domain/templates/template.model";
import { BaseRepository } from "./base.repo";

/**
 * Template Repository
 *
 * @author S. Hermans <s.hermans@maxxton.com
 */
export interface TemplateRepository extends BaseRepository<Template, Project> {

}
