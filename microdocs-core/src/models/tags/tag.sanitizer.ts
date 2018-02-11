import { Sanitizer } from "../sanitizer";
import { Tag } from "./tag.model";

export class TagSanitizer implements Sanitizer<Tag> {

  public sanitize(model: Tag): void {
    model.taggedOn = new Date().toISOString();
  }

}
