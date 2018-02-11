import {
  Body, Delete, Get, JsonController, NotFoundError, OnNull, OnUndefined, Param, Post,
  Put
} from "routing-controllers";
import { Tag, TagOptions } from "../domain/repos/tag.model";
import { ProjectService } from "../services/project.service";
import { RepoService } from "../services/repo.service";

@JsonController("/api/v2")
export class TagController {

  constructor(private projectService: ProjectService, private repoService: RepoService) {
  }

  /**
   * Get All tags
   * @param projectId
   * @param repoId
   * @returns {Promise<Tag[]>}
   */
  @Get("/projects/:project/repos/:repo/tags")
  public async getTags(@Param("project") projectId: string, @Param("repo") repoId: string): Promise<Tag[]> {
    let project = await this.projectService.getById(projectId);
    if (!project) {
      throw new NotFoundError(`Project '${projectId}' doesn't exists`);
    }
    let repo = await this.repoService.getById(repoId, project);
    if (!repo) {
      throw new NotFoundError(`Repository '${repoId}' doesn't exists`);
    }
    return repo.tags;
  }

  /**
   * Get tag by id
   * @param projectId
   * @param {string} repoId
   * @param {string} tagId
   * @returns {Promise<Tag>}
   */
  @Get("/projects/:project/repos/:repo/tags/:tag")
  @OnNull(404)
  public async getTag(@Param("project") projectId: string, @Param("repo") repoId: string,
                      @Param("tag") tagId: string): Promise<Tag> {
    let project = await this.projectService.getById(projectId);
    if (!project) {
      throw new NotFoundError(`Project '${projectId}' doesn't exists`);
    }
    let repo = await this.repoService.getById(repoId, project);
    if (!repo) {
      throw new NotFoundError(`Repository '${repoId}' doesn't exists`);
    }
    return repo.getTag(tagId.toLowerCase());
  }

  /**
   * Create tag
   * @param projectId
   * @param {string} repoId
   * @param {TagOptions} tag
   * @returns {Promise<Tag>}
   */
  @Post("/projects/:project/repos/:repo/tags")
  public async createTag(@Param("project") projectId: string,
                         @Param("repo") repoId: string, @Body() tag: TagOptions): Promise<Tag> {
    let project = await this.projectService.getById(projectId);
    if (!project) {
      throw new NotFoundError(`Project '${projectId}' doesn't exists`);
    }
    let repo = await this.repoService.getById(repoId, project);
    if (!repo) {
      throw new NotFoundError(`Repository '${repoId}' doesn't exists`);
    }
    return this.repoService.createTag(tag, repo, project);
  }

  /**
   * Edit or create tag
   * @param projectId
   * @param {string} repoId
   * @param {string} tagId
   * @param {TagOptions} tag
   * @returns {Promise<Tag>}
   */
  @Put("/projects/:project/repos/:repo/tags/:tag")
  public async editTag(@Param("project") projectId: string, @Param("repo") repoId: string, @Param("tag") tagId: string,
                       @Body() tag: TagOptions): Promise<Tag> {
    let project = await this.projectService.getById(projectId);
    if (!project) {
      throw new NotFoundError(`Project '${projectId}' doesn't exists`);
    }
    let repo = await this.repoService.getById(repoId, project);
    if (!repo) {
      throw new NotFoundError(`Repository '${repoId}' doesn't exists`);
    }
    return this.repoService.createTag(tag, repo, project);
  }

  /**
   * Delete a tag
   * @param projectId
   * @param {string} repoId
   * @param {string} tagId
   * @returns {Promise<void>}
   */
  @Delete("/projects/:project/repos/:repo/tags/:tag")
  @OnUndefined(204)
  public async deleteRepo(@Param("project") projectId: string, @Param("repo") repoId: string, @Param(
    "tag") tagId: string): Promise<void> {
    let project = await this.projectService.getById(projectId);
    if (!project) {
      throw new NotFoundError(`Project '${projectId}' doesn't exists`);
    }
    let repo = await this.repoService.getById(repoId, project);
    if (!repo) {
      throw new NotFoundError(`Repository '${repoId}' doesn't exists`);
    }
    if (!await this.repoService.removeTag(tagId, repo, project)) {
      throw new NotFoundError();
    }
  }

}
