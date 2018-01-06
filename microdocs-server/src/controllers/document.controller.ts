import {
  Body, Delete, Get, JsonController, NotFoundError, OnNull, OnUndefined, Param, Post,
  Put
} from "routing-controllers";
import * as uuid from "uuid/v4";
import { Document, DocumentOptions } from "../domain/document/document.model";
import { DocumentService } from "../services/document.service";
import { ProjectService } from "../services/project.service";
import { RepoService } from "../services/repo.service";

@JsonController("/api/v2")
export class DocumentController {

  constructor(private projectService: ProjectService,
              private repoService: RepoService,
              private documentService: DocumentService) {
  }

  /**
   * List all documents for a repository
   * @param {string} projectId
   * @param {string} repoId
   * @returns {Promise<string[]>}
   */
  @Get("/projects/:project/repos/:repo/documents")
  public async listDocuments(@Param("project") projectId: string, @Param("repo") repoId: string): Promise<string[]> {
    let project = await this.projectService.getById(projectId);
    if (!project) {
      throw new NotFoundError(`Project '${projectId}' doesn't exists`);
    }
    let repo = await this.repoService.getById(repoId, project);
    if (!repo) {
      throw new NotFoundError(`Repository '${repoId}' doesn't exists`);
    }

    return this.documentService.getAllIds(project, repo);
  }

  /**
   * Create a document
   * @param {string} projectId
   * @param {string} repoId
   * @param document
   * @returns {Promise<Document>}
   */
  @Post("/projects/:project/repos/:repo/documents")
  public async createDocument(@Param("project") projectId: string, @Param("repo") repoId: string,
                              @Body() document: DocumentOptions): Promise<Document> {
    let project = await this.projectService.getById(projectId);
    if (!project) {
      throw new NotFoundError(`Project '${projectId}' doesn't exists`);
    }
    let repo = await this.repoService.getById(repoId, project);
    if (!repo) {
      throw new NotFoundError(`Repository '${repoId}' doesn't exists`);
    }

    document.id = uuid();
    return this.documentService.create(document, project, repo);
  }

  /**
   * Get a document
   * @param {string} projectId
   * @param {string} repoId
   * @param {string} documentId
   * @returns {Promise<Document>}
   */
  @Get("/projects/:project/repos/:repo/documents/:document")
  @OnNull(404)
  public async getDocument(@Param("project") projectId: string, @Param("repo") repoId: string,
                           @Param("document") documentId: string): Promise<Document> {
    let project = await this.projectService.getById(projectId);
    if (!project) {
      throw new NotFoundError(`Project '${projectId}' doesn't exists`);
    }
    let repo = await this.repoService.getById(repoId, project);
    if (!repo) {
      throw new NotFoundError(`Repository '${repoId}' doesn't exists`);
    }

    return this.documentService.getById(documentId, project, repo);
  }

  /**
   * Edit a document
   * @param {string} projectId
   * @param {string} repoId
   * @param {string} documentId
   * @param document
   * @returns {Promise<Document>}
   */
  @Put("/projects/:project/repos/:repo/documents/:document")
  public async editDocument(@Param("project") projectId: string, @Param("repo") repoId: string,
                            @Param("document") documentId: string,
                            @Body() document: DocumentOptions): Promise<Document> {
    let project = await this.projectService.getById(projectId);
    if (!project) {
      throw new NotFoundError(`Project '${projectId}' doesn't exists`);
    }
    let repo = await this.repoService.getById(repoId, project);
    if (!repo) {
      throw new NotFoundError(`Repository '${repoId}' doesn't exists`);
    }

    return this.documentService.editOrCreate(documentId, document, project, repo);
  }

  /**
   * Delete a document
   * @param {string} projectId
   * @param {string} repoId
   * @param {string} documentId
   * @returns {Promise<Document>}
   */
  @Delete("/projects/:project/repos/:repo/documents/:document")
  @OnUndefined(204)
  public async deleteDocument(@Param("project") projectId: string, @Param("repo") repoId: string,
                              @Param("document") documentId: string): Promise<void> {
    let project = await this.projectService.getById(projectId);
    if (!project) {
      throw new NotFoundError(`Project '${projectId}' doesn't exists`);
    }
    let repo = await this.repoService.getById(repoId, project);
    if (!repo) {
      throw new NotFoundError(`Repository '${repoId}' doesn't exists`);
    }

    if (!await this.documentService.delete(documentId, project, repo)) {
      throw new NotFoundError();
    }
  }

}
