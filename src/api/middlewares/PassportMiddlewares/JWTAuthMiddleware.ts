import { PassportMiddleware } from "./PassportMiddleware";

export class JwtAuthMiddleware extends PassportMiddleware {
  constructor() {
    super("jwt");
  }
}
