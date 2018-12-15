import {
  MicroframeworkLoader,
  MicroframeworkSettings
} from "microframework-w3tec";
import { Container } from "typedi";
import { useContainer as routingUseContainer } from "routing-controllers";
import { useContainer as ormUseContainer } from "typeorm";
import { Authorizer } from "../auth";
import { logger } from "../utils";

export const iocLoader: MicroframeworkLoader = (
  settings: MicroframeworkSettings | undefined
) => {
  logger.debug("iocLoader is loaded");
  routingUseContainer(Container);
  ormUseContainer(Container);
  const authorizer = Container.get(Authorizer);
  authorizer.initialize();
};
