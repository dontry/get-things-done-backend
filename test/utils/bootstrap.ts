import { bootstrapMicroframework, Microframework } from "microframework-w3tec";
import { iocLoader, expressLoader } from "../../src/loaders";
import { typeormLoader } from "./typeormloader";

export const bootstrapApp = async (): Promise<Microframework> => {
  const framework = await bootstrapMicroframework({
    loaders: [iocLoader, typeormLoader, expressLoader]
  });

  return framework;
};
