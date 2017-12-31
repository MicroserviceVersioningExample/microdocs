import {
  Body, Delete, Get, JsonController, NotFoundError, OnNull, OnUndefined, Param, Post,
  Put
} from "routing-controllers";
import { Stream } from "stream";
import { Project, Repo } from "../domain";
import { RepoOptions } from "../domain/repos/repo.model";
import { ProjectService } from "../services/project.service";
import { RepoService } from "../services/repo.service";

@JsonController("/api/v2")
export class RepoController {

  constructor(private projectService: ProjectService, private repoService: RepoService) {
  }

  /**
   * Get All repos
   * @param projectId
   * @returns {Promise<Repo[]>}
   */
  @Get("/projects/:project/repos")
  public async getRepos(@Param("project") projectId: string): Promise<Stream> {
    let project = await this.projectService.getById(projectId);
    if (!project) {
      throw new NotFoundError(`Project '${projectId}' doesn't exists`);
    }
    return this.repoService.getAllAsStream(project);
  }

  /**
   * Get repo by repoId
   * @param projectId
   * @param {string} repoId
   * @returns {Promise<Repo>}
   */
  @Get("/projects/:project/repos/:repo")
  @OnNull(404)
  public async getRepo(@Param("project") projectId: string, @Param("repo") repoId: string): Promise<Repo> {
    let project = await this.projectService.getById(projectId);
    if (!project) {
      throw new NotFoundError(`Project '${projectId}' doesn't exists`);
    }
    return this.repoService.getById(repoId, project);
  }

  /**
   * Create Repo
   * @param projectId
   * @param {RepoOptions} repo
   * @returns {Promise<Repo>}
   */
  @Post("/projects/:project/repos")
  public async createRepo(@Param("project") projectId: string, @Body() repo: RepoOptions): Promise<Repo> {
    let project = await this.projectService.getById(projectId);
    if (!project) {
      throw new NotFoundError(`Project '${projectId}' doesn't exists`);
    }
    return this.repoService.create(repo, project);
  }

  /**
   * Edit or create repo
   * @param projectId
   * @param {string} repoId
   * @param {RepoOptions} repo
   * @returns {Promise<Repo>}
   */
  @Put("/projects/:project/repos/:id")
  public async editRepo(@Param("project") projectId: string, @Param("id") repoId: string,
                           @Body() repo: RepoOptions): Promise<Repo> {
    let project = await this.projectService.getById(projectId);
    if (!project) {
      throw new NotFoundError(`Project '${projectId}' doesn't exists`);
    }
    return this.repoService.editOrCreate(repoId, repo, project);
  }

  /**
   * Delete a repo
   * @param projectId
   * @param {string} repoId
   * @returns {Promise<void>}
   */
  @Delete("/projects/:project/repos/:id")
  @OnUndefined(204)
  public async deleteRepo(@Param("project") projectId: string, @Param("id") repoId: string): Promise<void> {
    let project = await this.projectService.getById(projectId);
    if (!project) {
      throw new NotFoundError(`Project '${projectId}' doesn't exists`);
    }
    if (!await this.repoService.delete(repoId, project)) {
      throw new NotFoundError();
    }
  }

}
