import { Inject, Service } from "typedi";
import { Repo, RepoOptions } from "../domain/repos/repo.model";
import { BaseService } from "./base.service";
import { RepoRepository } from "../repositories/repo.repo";
import { Project } from "../domain/projects/project.model";
import { Tag, TagOptions } from "../domain/repos/tag.model";
import { ValidationException } from "../domain/common/validation.error";

/**
 * Repo Service
 *
 * @author S. Hermans <s.hermans@maxxton.com
 */
@Service()
export class RepoService extends BaseService<Repo, RepoOptions, Project> {

  constructor(@Inject("repo.repo") private repoRepository: RepoRepository) {
    super(Repo, repoRepository);
  }

  /**
   * Create Repo
   * @param {RepoOptions} options
   * @param {Project} p1
   * @return {Promise<Repo>}
   */
  public async create(options: RepoOptions, p1?: Project): Promise<Repo> {
    options.latestTag = null;
    options.tags = [];
    return super.create(options, p1);
  }

  /**
   * Edit Repo
   * @param {string} id
   * @param {RepoOptions} options
   * @param {Project} p1
   * @return {Promise<Project | null>}
   */
  public async edit(id: string, options: RepoOptions, p1?: Project): Promise<Repo | null> {
    options.latestTag = null;
    options.tags = [];
    return super.edit(id, options, p1);
  }

  /**
   * Add tag to repo
   * @param {TagOptions} options
   * @param {Repo} repo
   * @param {Project} project
   * @return {Promise<Repo>}
   */
  public async createTag( options: TagOptions, repo: Repo, project: Project): Promise<Tag>{
    options.taggedOn = new Date().toISOString();
    let tag = new Tag(options);

    // Validate model
    let errors = await tag.validate();
    if (errors.length > 0) {
      throw new ValidationException("Tag is invalid", errors);
    }

    // save and return repo
    repo.addTag(tag);
    let savedRepo = await this.repoRepository.save(repo, project);
    return savedRepo.getTag(tag.id);
  }

  /**
   * Remove tag from repo
   * @param {string} tagId
   * @param {Repo} repo
   * @param {Project} project
   * @return {Promise<boolean>}
   */
  public async removeTag(tagId: string, repo: Repo, project: Project): Promise<boolean> {
    if(!repo.getTag(tagId)){
      return false;
    }
    repo.removeTag(tagId);
    await this.repoRepository.save(repo, project);
    return true;
  }

}
