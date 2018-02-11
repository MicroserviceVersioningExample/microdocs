import {
  Body, Delete, Get, JsonController, NotFoundError, OnNull, OnUndefined, Param, Post,
  Put
} from "routing-controllers";
import { Stream } from "stream";
import { Repo } from "../domain";
import { RepoOptions } from "../domain/repos/repo.model";
import { ProjectService } from "../services/project.service";
import { RepoService } from "../services/repo.service";
import { observableToJsonStream } from "../helpers/stream.helper";
import { TemplateService } from "../services/template.service";
import { Template, TemplateOptions } from "../domain/templates/template.model";

@JsonController("/api/v2")
export class TemplateController {

  constructor(private projectService: ProjectService, private templateService: TemplateService) {
  }

  /**
   * Get All templates
   * @param projectId
   * @returns {Promise<Template[]>}
   */
  @Get("/projects/:project/templates")
  public async getTemplates(@Param("project") projectId: string): Promise<Stream> {
    let project = await this.projectService.getById(projectId);
    if (!project) {
      throw new NotFoundError(`Project '${projectId}' doesn't exists`);
    }
    return observableToJsonStream(this.templateService.getAllAsStream(project));
  }

  /**
   * Get template by id
   * @param projectId
   * @param {string} templateId
   * @returns {Promise<Template>}
   */
  @Get("/projects/:project/templates/:id")
  @OnNull(404)
  public async getTemplate(@Param("project") projectId: string, @Param("id") templateId: string): Promise<Template> {
    let project = await this.projectService.getById(projectId);
    if (!project) {
      throw new NotFoundError(`Project '${projectId}' doesn't exists`);
    }
    return this.templateService.getById(templateId, project);
  }

  /**
   * Create Template
   * @param projectId
   * @param {TemplateOptions} template
   * @returns {Promise<Template>}
   */
  @Post("/projects/:project/templates")
  public async createTemplate(@Param("project") projectId: string, @Body() template: TemplateOptions): Promise<Template> {
    let project = await this.projectService.getById(projectId);
    if (!project) {
      throw new NotFoundError(`Project '${projectId}' doesn't exists`);
    }
    return this.templateService.create(template, project);
  }

  /**
   * Edit or create template
   * @param projectId
   * @param {string} templateId
   * @param {TemplateOptions} template
   * @returns {Promise<Template>}
   */
  @Put("/projects/:project/templates/:id")
  public async editTemplate(@Param("project") projectId: string, @Param("id") templateId: string,
                           @Body() template: TemplateOptions): Promise<Template> {
    let project = await this.projectService.getById(projectId);
    if (!project) {
      throw new NotFoundError(`Project '${projectId}' doesn't exists`);
    }
    return this.templateService.editOrCreate(templateId, template, project);
  }

  /**
   * Delete a template
   * @param projectId
   * @param {string} templateId
   * @returns {Promise<void>}
   */
  @Delete("/projects/:project/templates/:id")
  @OnUndefined(204)
  public async deleteTemplate(@Param("project") projectId: string, @Param("id") templateId: string): Promise<void> {
    let project = await this.projectService.getById(projectId);
    if (!project) {
      throw new NotFoundError(`Project '${projectId}' doesn't exists`);
    }
    if (!await this.templateService.delete(templateId, project)) {
      throw new NotFoundError();
    }
  }

}
