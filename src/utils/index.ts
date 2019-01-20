export { logger, ILogger } from "./logger";
export { yamlConverter } from "./yamlConverter";

// should return a 24  hex characters;
export const toHexString = (obj: object): string => {
  return Object.keys(obj)
    .map(key => {
      const hex = Number(obj[key]).toString(16);
      return hex.length < 2 ? `0${hex}` : hex; // Always two digits
    })
    .join("");
};
