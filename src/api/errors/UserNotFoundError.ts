import { NotFoundError } from "routing-controllers";

export class UserNotFoundError extends NotFoundError {
  constructor() {
    super("User not found!");
  }
}
