import { bootstrapMicroframework } from "microframework-w3tec";
import { expressLoader, iocLoader, typeormLoader } from "./loaders/index";
import { logger } from "./utils/index";

export class Server {
  public run() {
    bootstrapMicroframework({
      loaders: [iocLoader, typeormLoader, expressLoader]
    })
      .then(() => {
        logger.debug("Server is running");
      })
      .catch(error => logger.error(`Server is crashed: ${error}`));
  }
}
