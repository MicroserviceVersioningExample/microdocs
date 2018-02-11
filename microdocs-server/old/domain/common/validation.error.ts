
import { ValidationError } from "class-validator";

/**
 * Validation error
 *
 * @author S. Hermans <s.hermans@maxxton.com
 */
export class ValidationException extends Error {
  
  public readonly validationError = true;

  constructor(message: string, public errors: ValidationError[]) {
    super(message);
  }

}
