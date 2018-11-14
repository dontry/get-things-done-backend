import { Container } from "typedi";
import winstonLogger from "../utils/logger";

const Logger = (scope: string): any => (
  object: any,
  propertyName: string
): any => {};
