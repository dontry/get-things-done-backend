import * as bcrypt from "bcrypt";

class User {
  public static async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, 10);
    } catch (error) {
      throw error;
    }
  }

  public static async comparePassword(
    user: User,
    password: string
  ): Promise<boolean> {
    try {
      const res = await bcrypt.compare(password, user.password);
      return res;
    } catch (error) {
      throw error;
    }
  }

  public id: string;

  public username: string;

  public email: string;

  public password: string;

  public firstName: string;

  public lastName: string;

  public age: string;

  public sex: string;

  public toString(): string {
    return `${this.firstName} ${this.lastName} (${this.email})`;
  }
}

export default User;
