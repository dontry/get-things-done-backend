import { Entry } from "./Entry";
import { Entity, Column } from "typeorm";
import { IReminder, IRepeater } from "../types";
import { Project } from "./Project";
import { User } from "./User";
import { IsNotEmpty } from "class-validator";

@Entity()
export class Task extends Entry {
  @Column()
  public reminders: IReminder[];

  @Column()
  public repeater: IRepeater[];

  @Column()
  public tags: string[];

  @Column({ name: "project_id" })
  public projectId: string;

  @IsNotEmpty()
  @Column({ name: "user_id" })
  public userId: string;

  constructor(title: string) {
    super(title);
  }
}
