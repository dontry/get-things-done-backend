import { Entity, Column } from "typeorm";
import { IsNotEmpty } from "class-validator";

class Name {
  @IsNotEmpty()
  @Column({ name: "first_name" })
  public firstName: string;

  @IsNotEmpty()
  @Column({ name: "last_name" })
  public lastName: string;

  public toString(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

export default Name;
