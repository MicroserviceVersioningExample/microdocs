import { BaseModel, BaseOptions } from "../common";
import { MaxLength, IsDateString, IsString } from "class-validator";
import { ProjectOptions } from "../projects/project.model";

/**
 * /api/v2/projects/:project/repos/:repo/tags
 *
 * @author S. Hermans <s.hermans@maxxton.com>
 */
export class Tag extends BaseModel<TagOptions> {

  @IsDateString()
  public taggedOn: string;

  @MaxLength(30)
  @IsString()
  public documentId: string;

  /**
   * Update properties of this project
   * @param {ProjectOptions} options
   */
  public edit(options: TagOptions) {
    super.edit(options);
    if (options) {
      this.taggedOn = options.taggedOn;
      this.documentId = options.documentId;
    }
  }

}

export interface TagOptions extends BaseOptions {

  taggedOn: string;
  documentId: string;

}