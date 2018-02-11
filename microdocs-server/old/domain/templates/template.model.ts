import { IsEnum, IsNotEmpty } from "class-validator";
import { BaseModel, BaseOptions } from "../common/base.model";
import { TemplateType } from "./template.types";

/**
 * /api/v2/projects/:project/templates
 *
 * @author S. Hermans <s.hermans@maxxton.com>
 */
export class Template extends BaseModel<TemplateOptions> {

  @IsNotEmpty()
  public template: any;
  @IsEnum([TemplateType.JavaScriptTemplate, TemplateType.SimpleJsonTemplate])
  public type: TemplateType;

  /**
   * Update properties of this template
   * @param {TemplateOptions} options
   */
  public edit(options: TemplateOptions) {
    super.edit(options);
    if (options) {
      this.template = options.template;
      this.type = options.type || TemplateType.SimpleJsonTemplate;
    }
  }

}

export interface TemplateOptions extends BaseOptions {

  template: any;
  type?: TemplateType;

}
