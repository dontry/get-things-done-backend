import { Request, Response, NextFunction } from "express";
import { Middleware, ExpressMiddlewareInterface } from "routing-controllers";
import { Logger } from "src/decorators";
import { ILogger } from "src/utils";

@Middleware({ type: "after", priority: 10 })
export class ResponseHandlerMiddleware implements ExpressMiddlewareInterface {
  public isProduction = process.env.ENV_NODE === "production";
  constructor(@Logger() private log: ILogger) {}

  /**
   * use
   */
  public use(request: Request, response: Response, next: NextFunction) {
    response.status(response.statusCode || 200);
    response.json({
      code: response.statusCode,
      message: response.statusMessage
    });
  }
}
