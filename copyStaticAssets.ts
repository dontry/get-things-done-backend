import * as shell from "shelljs";

shell.cp("-R", "api/swagger", "dist/api");
shell.cp("-R", "api/mocks", "dist/api");
