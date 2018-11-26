import { PassportMiddleware } from "./PassportMiddleware";

export class LocalAuthMiddleware extends PassportMiddleware {
  constructor() {
    super("local");
  }
}
