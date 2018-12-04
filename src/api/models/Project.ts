import { Task } from "./Task";
import { Entity, OneToMany, ManyToOne } from "typeorm";
import { Entry } from "./Entry";
import { User } from "./User";
import { IsNotEmpty } from "class-validator";

@Entity()
export class Project extends Entry {
  @OneToMany(type => Task, task => task.project, { cascade: true })
  public tasks: Task[];

  @IsNotEmpty()
  @ManyToOne(type => User, user => user.projects)
  public user: User;

  constructor(title: string) {
    super(title);
  }
}
