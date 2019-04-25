import { Column } from "typeorm";
import { IsNotEmpty } from "class-validator";

class FullName {
  @IsNotEmpty()
  @Column()
  public firstName: string;

  @IsNotEmpty()
  @Column()
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
