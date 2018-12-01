import * as bcrypt from "bcrypt";
import { IsNotEmpty, Min, IsInt, IsEmail, Validate } from "class-validator";
import {
  Entity,
  ObjectIdColumn,
  Column,
  ObjectID,
  BeforeInsert,
  Unique,
  Index
} from "typeorm";
import { Exclude, Transform } from "class-transformer";
import FullName from "./FullName";
import { PasswordPattern } from "../validators";
import { Sex } from "../types/Sex";
import { toHexString } from "../../utils";

@Entity()
@Unique(["username"])
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
  @Transform((id: any) => {
    return toHexString(id.id);
  })
  public id: ObjectID;

  // Unique column: https://github.com/typeorm/typeorm/issues/2034
  @Index({ unique: true })
  @IsNotEmpty()
  @Column({ unique: true })
  public username: string;

  @IsEmail()
  @IsNotEmpty()
  @Column()
  public email: string;

  @Validate(PasswordPattern)
  @IsNotEmpty()
  @Column()
  @Exclude({ toPlainOnly: true })
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
            full name: ${this.fullName ? this.fullName.toString() : ""}
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

  @BeforeInsert()
  public async hasPassword(): Promise<void> {
    this.password = await User.hashPassword(this.password);
  }
}
