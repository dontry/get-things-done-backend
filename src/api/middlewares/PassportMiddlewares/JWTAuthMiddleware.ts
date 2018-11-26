import { PassportMiddleware } from "./PassportMiddleware";

export class JWTAuthMiddleware extends PassportMiddleware {
  constructor() {
    super("jwt");
  }
}
