import { Entry } from "./Entry";
import { Entity, Column, ManyToOne } from "typeorm";
import { IReminder, IRepeater } from "../types";
import { Project } from "./Project";
import { User } from "./User";

@Entity()
export class Task extends Entry {
  @Column()
  public reminders: IReminder[];

  @Column()
  public repeater: IRepeater[];

  @Column()
  public tags: string[];

  @ManyToOne(type => Project, project => project.tasks)
  public project: Project;

  @ManyToOne(type => User, user => user.tasks)
  public user: User;

  constructor(title: string) {
    super(title);
  }
}
