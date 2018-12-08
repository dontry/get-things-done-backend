import { Entry } from "./Entry";
import { Entity, Column, ObjectID } from "typeorm";
import { IReminder, IRepeater } from "../types";
import { IsNotEmpty } from "class-validator";

@Entity()
export class Task extends Entry {
  @Column()
  public reminders: IReminder[];

  @Column()
  public repeater: IRepeater[];

  @Column()
  public tags: string[];

  @Column()
  public projectId: string | ObjectID;

  @IsNotEmpty()
  @Column()
  public userId: string | ObjectID;
}
