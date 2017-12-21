import { Project, ProjectOptions } from "../domain";
import { Body, Delete, Get, JsonController, NotFoundError, OnNull, Param, Post, Put } from "routing-controllers";
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
  public getProjects(): Promise<Project[]> {
    return this.projectService.getAll();
  }

  /**
   * Get project by name
   * @param {string} name
   * @returns {Promise<Project>}
   */
  @Get("/projects/:name")
  @OnNull(404)
  public getProject(@Param("name") name: string): Promise<Project> {
    return this.projectService.getByName(name);
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
   * @param {string} name
   * @param {ProjectOptions} project
   * @returns {Promise<Project>}
   */
  @Put("/projects/:name")
  public editProject(@Param("name") name: string, @Body() project: ProjectOptions): Promise<Project> {
    return this.projectService.editOrCreate(name, project);
  }

  @Delete("/projects/:name")
  public async deleteProject(@Param("name") name: string): Promise<void> {
    if (!await this.projectService.delete(name)) {
      throw new NotFoundError();
    }
  }

}
