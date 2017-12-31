import {
  Body, Delete, Get, JsonController, NotFoundError, OnNull, OnUndefined, Param, Post,
  Put
} from "routing-controllers";
import { Stream } from "stream";
import { Project, ProjectOptions } from "../domain";
import { ProjectService } from "../services/project.service";

@JsonController("/api/v2")
export class ProjectController {

  constructor(private projectService: ProjectService) {
  }

  /**
   * Get All projects
   * @returns {Promise<Project[]>}
   */
  @Get("/projects")
  public getProjects(): Stream {
    return this.projectService.getAllAsStream();
  }

  /**
   * Get project by id
   * @param {string} id
   * @returns {Promise<Project>}
   */
  @Get("/projects/:id")
  @OnNull(404)
  public getProject(@Param("id") id: string): Promise<Project> {
    return this.projectService.getById(id);
  }

  /**
   * Create Project
   * @param {ProjectOptions} project
   * @returns {Promise<Project>}
   */
  @Post("/projects")
  public createProject(@Body() project: ProjectOptions): Promise<Project> {
    return this.projectService.create(project);
  }

  /**
   * Edit or create project
   * @param {string} id
   * @param {ProjectOptions} project
   * @returns {Promise<Project>}
   */
  @Put("/projects/:id")
  public editProject(@Param("id") id: string, @Body() project: ProjectOptions): Promise<Project> {
    return this.projectService.editOrCreate(id, project);
  }

  /**
   * Delete a project
   * @param {string} id
   * @returns {Promise<void>}
   */
  @Delete("/projects/:id")
  @OnUndefined(204)
  public async deleteProject(@Param("id") id: string): Promise<void> {
    if (!await this.projectService.delete(id)) {
      throw new NotFoundError();
    }
  }

  /**
   * Patch a project
   * @param {string} id
   * @returns {Promise<Project>}
   */
  public patchProject(@Param("id") id: string): Promise<Project> {
    return null;
  }

}
