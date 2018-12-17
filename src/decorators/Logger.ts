import { Container } from "typedi";
import { logger } from "src/utils";
import { string } from "joi";

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
