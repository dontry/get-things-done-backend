import { Container } from "typedi";
import { logger } from "../utils";

// TODO: scope
export const Logger = (scope?: string): any => {
  return (object: any, propertyName: string, index?: number): any => {
    Container.registerHandler({
      object,
      propertyName,
      index,
      value: () => logger
    });
  };
};
