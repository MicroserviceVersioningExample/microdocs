import { Inject, Service } from "typedi";
import { Project } from "../domain/projects/project.model";
import { Template, TemplateOptions } from "../domain/templates/template.model";
import { BaseService } from "./base.service";
import { TemplateRepository } from "../repositories/template.repo";

/**
 * Template Service
 *
 * @author S. Hermans <s.hermans@maxxton.com>
 */
@Service()
export class TemplateService extends BaseService<Template, TemplateOptions, Project> {

  constructor(@Inject("template.repo") private templateRepository: TemplateRepository) {
    super(Template, templateRepository);
  }

}
