import { readFileSync } from "fs";

export { Passport } from "./Passport";
export { Authorizer } from "./Authorizer";
export const PUBLIC_KEY = readFileSync("public.key", "utf8");
export const PRIVATE_KEY = readFileSync("private.key", "utf8");
