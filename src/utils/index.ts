export { logger, ILogger } from "./logger";

export const toHexString = (obj: Object): string => {
  return Object.keys(obj)
    .map(key => obj[key].toString(16))
    .join("");
};
