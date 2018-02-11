import {
  BadRequestError,
  Body, Delete, Get, JsonController, NotFoundError, OnNull, OnUndefined, Param, Post,
  Put, QueryParam
} from "routing-controllers";
import * as uuid from "uuid/v4";
import {Document, DocumentOptions} from "../domain/documents/document.model";
import {DocumentService} from "../services/document.service";
import {ProjectService} from "../services/project.service";
import {RepoService} from "../services/repo.service";
import {RepoTypes} from "../../dist/domain/repos/repo-types.model";

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
   * @param tag create a tag for this document
   * @returns {Promise<Document>}
   */
  @Post("/projects/:project/repos/:repo/documents")
  public async createDocument(@Param("project") projectId: string, @Param("repo") repoId: string,
                              @Body() document: DocumentOptions, @QueryParam("tag") tag?: string): Promise<Document> {
    let project = await this.projectService.getById(projectId);
    if (!project) {
      throw new NotFoundError(`Project '${projectId}' doesn't exists`);
    }
    let repo = await this.repoService.getById(repoId, project);
    if (!repo) {
      throw new NotFoundError(`Repository '${repoId}' doesn't exists`);
    }
    if (repo.type === RepoTypes.Sync) {
      throw new BadRequestError(`Documents cannot be pushed to repository ${repoId}, because it is of type sync`);
    }

    document.id = uuid();
    let newDocument = await this.documentService.create(document, project, repo);
    if (tag) {
      await this.repoService.createTag({
        id: tag,
        name: tag,
        ref: newDocument.id
      }, repo, project);
    }
    return newDocument;
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
    if (repo.type === RepoTypes.Sync) {
      throw new BadRequestError(`Documents cannot be pushed to repository ${repoId}, because it is of type sync`);
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
