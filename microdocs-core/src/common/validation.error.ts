
import { ValidationError } from "class-validator";

/**
 * Validation error
 *
 * @author S. Hermans <s.hermans@maxxton.com
 */
export class ValidationException extends Error {

  constructor(message: string, private validationErrors: ValidationError[]) {
    super(message);
  }



}