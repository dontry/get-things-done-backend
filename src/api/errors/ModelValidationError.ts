import { BadRequestError } from "routing-controllers";
import { ValidationError } from "class-validator";

export class ModelValidationError extends BadRequestError {
  constructor(private errors: ValidationError[]) {
    super("Model validation Error");
  }
}
