import { Entity, Column, ObjectID } from "typeorm";
import { Entry } from "./Entry";
import { IsNotEmpty } from "class-validator";

@Entity()
export class Project extends Entry {
  @IsNotEmpty()
  @Column()
  public userId: string | ObjectID;
}
