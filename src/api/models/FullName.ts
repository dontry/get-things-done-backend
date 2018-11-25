import { Entity, Column } from "typeorm";
import { IsNotEmpty } from "class-validator";

class FullName {
  @IsNotEmpty()
  @Column({ name: "first_name" })
  public firstName: string;

  @IsNotEmpty()
  @Column({ name: "last_name" })
  public lastName: string;

  public toString(): string {
    if (this.firstName && this.lastName) {
      return `${this.firstName} ${this.lastName}`;
    } else {
      return `No full name.`;
    }
  }
}

export default FullName;
