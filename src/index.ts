import { bootstrapMicroframework } from "microframework-w3tec";
import { expressLoader, iocLoader, typeormLoader } from "./loaders";
import { logger } from "./utils";

bootstrapMicroframework({
  loaders: [iocLoader, typeormLoader, expressLoader]
})
  .then(() => {
    logger.debug("Server is running");
  })
  .catch(error => logger.error(`Server is crashed: ${error}`));
