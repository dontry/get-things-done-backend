import yaml from "js-yaml";
import fs from "fs";

export function yamlConverter(file: string): JSON {
  try {
    return yaml.safeLoad(fs.readFileSync(file, "utf8"));
  } catch (error) {
    throw new Error(`Load yaml file failed:  ${error}`);
  }
}
