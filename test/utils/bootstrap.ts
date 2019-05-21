import http from "http";
import { Application } from "express";
import { Connection } from "typeorm";
import { bootstrapMicroframework } from "microframework-w3tec";
import { iocLoader, expressLoader } from "../../src/loaders";
import { typeormLoader } from "./typeormloader";

export interface IBootstrapSettings {
  app: Application;
  server: http.Server;
  connection: Connection;
}

export const bootstrapApp = async (): Promise<IBootstrapSettings> => {
  const framework = await bootstrapMicroframework({
    loaders: [iocLoader, typeormLoader, expressLoader]
  });
  return {
    app: framework.settings.getData("express_app") as Application,
    server: framework.settings.getData("express_server") as http.Server,
    connection: framework.settings.getData("connection") as Connection
  } as IBootstrapSettings;
};
