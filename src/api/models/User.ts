import * as bcrypt from "bcrypt";
import { IsNotEmpty } from "class-validator";
import { Entity, ObjectIdColumn, Column } from "typeorm";
import Name from "./Name";

@Entity()
export class User {
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

  @ObjectIdColumn("uuid")
  public id: string;

  @IsNotEmpty()
  @Column()
  public username: string;

  @IsNotEmpty()
  @Column()
  public email: string;

  @IsNotEmpty()
  @Column()
  public password: string;

  @Column(type => Name)
  public name: Name;

  @Column()
  public age: number;

  @Column()
  public sex: string;

  public toString(): string {
    return `${this.name.toString()} (${this.email})`;
  }
}
