import { Enforcer } from "casbin";
import { Service } from "typedi";

@Service()
export class Authorizer {
  private enforcer: Enforcer;
  public async initialize() {
    this.enforcer = await Enforcer.newEnforcer(
      "authz_model.conf",
      "authz_policy.csv"
    );
  }

  public checkPermission(role: string, path: string, method: string) {
    // const { originalUrl: path, method } = req;
    // const user = this.getUserName();
    return this.enforcer.enforce(role, path, method);
  }
}
