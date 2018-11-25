import * as bcrypt from "bcrypt";
import { IsNotEmpty, Min, IsInt, IsEmail, Validate } from "class-validator";
import { Entity, ObjectIdColumn, Column, ObjectID } from "typeorm";
import FullName from "./FullName";
import { PasswordPattern } from "../validators";
import { Sex } from "../types/Sex";

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

  @IsEmail()
  @IsNotEmpty()
  @Column()
  public email: string;

  @Validate(PasswordPattern)
  @IsNotEmpty()
  @Column()
  public password: string;

  @Column(type => FullName)
  public fullName: FullName;

  @IsInt()
  @Min(10, { message: "The use is too young to get registered" })
  @Column({ default: -1 })
  public age: number | undefined;

  @Column()
  public sex: Sex;

  public toString(): string {
    return `username: ${this.username},
            email: ${this.email},
            full name: ${this.fullName ? this.fullName : ""}
            `;
  }

  public create(
    username: string,
    password: string,
    email: string,
    fullName?: FullName,
    age?: number,
    sex?: Sex
  ) {
    this.username = username;
    this.password = password;
    this.email = email;
    if (fullName) {
      this.fullName = fullName;
    }
    if (age) {
      this.age = age;
    }
    if (sex) {
      this.sex = sex;
    }
  }
}
