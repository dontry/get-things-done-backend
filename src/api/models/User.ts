import * as bcrypt from "bcrypt";
import { IsNotEmpty, IsEmail, Min, IsInt } from "class-validator";
import { Entity, ObjectIdColumn, Column, ObjectID } from "typeorm";
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

  @ObjectIdColumn()
  public id: ObjectID;

  @IsNotEmpty()
  @Column()
  public username: string;

  @IsNotEmpty()
  @IsEmail()
  @Column()
  public email: string;

  @IsNotEmpty()
  @Column()
  public password: string;

  @Column(type => Name)
  public name: Name;

  @IsInt()
  @Min(10, { message: "The use is too young to get registered" })
  @Column()
  public age: number | undefined;

  @Column()
  public sex: string | undefined;

  constructor(
    username: string,
    email: string,
    password: string,
    name: Name,
    age?: number,
    sex?: string
  ) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.name = name;
    this.age = age;
    this.sex = sex;
  }

  public toString(): string {
    return `${this.name.toString()} (${this.email})`;
  }
}
