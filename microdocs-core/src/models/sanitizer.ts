
export interface Sanitizer<Model extends any> {

  /**
   * Sanitize input
   * @param {Model} model
   */
  sanitize(model: Model): void;

}
