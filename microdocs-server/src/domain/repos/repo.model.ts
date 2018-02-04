import {ArrayMaxSize, IsArray, IsEmpty, IsEnum, IsOptional, IsString, MaxLength} from "class-validator";
import {BaseModel, BaseOptions} from "../common/base.model";
import {ProjectOptions} from "../projects/project.model";
import {RepoTypes} from "./repo-types.model";
import {Tag} from "./tag.model";

/**
 * /api/v2/projects/:project/repos
 *
 * @author S. Hermans <s.hermans@maxxton.com>
 */
export class Repo extends BaseModel<RepoOptions> {

  public tags: Tag[];
  public latestTag: string;
  @IsEnum(RepoTypes)
  public type: string;

  constructor(options: RepoOptions) {
    super(options);
    if (options.tags) {
      this.tags = options.tags.map(tag => new Tag(tag));
    } else {
      this.tags = [];
    }
    this.latestTag = options.latestTag || null;
  }

  /**
   * Update properties of this project
   * @param {ProjectOptions} options
   */
  public edit(options: RepoOptions) {
    super.edit(options);
    if (options) {
      this.type = options.type || RepoTypes.Static;
    }
  }

  /**
   * Add a tag
   * @param {Tag} tag
   */
  public addTag(tag: Tag): void {
    let oldTag = this.getTag(tag.id);
    if (oldTag) {
      this.removeTag(oldTag);
    }
    this.tags.push(tag);
    this.updateTags();
  }

  /**
   * Remove a tag
   * @param {Tag|string} tag or tagId
   */
  public removeTag(tag: Tag | string): void {
    let id;
    if (typeof(tag) === "string") {
      id = tag.toLowerCase();
    } else {
      id = tag.id.toLowerCase();
    }
    let tagsInList = this.tags.filter(t => t.id === id);
    if (tagsInList.length > 0) {
      tagsInList.forEach(tagInList => {
        let index = this.tags.indexOf(tagInList);
        if (index > -1) {
          this.tags.splice(index, 1);
        }
      });
    }
    this.updateTags();
  }

  /**
   * Find tag by Id
   * @param {string} tagId
   * @return {}
   */
  public getTag(tagId: string): Tag {
    return this.tags.filter(t => t.id === tagId.toLowerCase())[0] || null;
  }

  /**
   * Sort tags and set latest tag
   */
  private updateTags() {
    this.tags = this.sortTagsByDate(this.tags);
    if (this.tags.length > 0) {
      this.latestTag = this.tags[0].id;
    } else {
      this.latestTag = null;
    }
  }

  /**
   * Sort tags by date
   * @param {Tag[]} tags
   * @return {Tag[]}
   */
  private sortTagsByDate(tags: Tag[]): Tag[] {
    return tags.sort((t1, t2) => {
      return new Date(t2.taggedOn).valueOf() - new Date(t1.taggedOn).valueOf();
    });
  }

}

export interface RepoOptions extends BaseOptions {

  tags?: Tag[];
  latestTag?: string;
  type?: string;

}
