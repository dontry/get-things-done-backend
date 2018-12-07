import { Task } from "./Task";
import { Entity, OneToMany, ManyToOne, Column } from "typeorm";
import { Entry } from "./Entry";
import { User } from "./User";
import { IsNotEmpty } from "class-validator";

@Entity()
export class Project extends Entry {
  @IsNotEmpty()
  @Column({ name: "user_id" })
  public userId: string;
}
