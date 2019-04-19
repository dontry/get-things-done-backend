import { Entry } from "./Entry";
import { Entity, Column, ObjectID } from "typeorm";
import { IReminder, IRepeater } from "../types";
import { IsNotEmpty } from "class-validator";
import { toHexString } from "../../utils";
import { Exclude, Transform } from "class-transformer";

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

  // @Exclude()
  @Transform((id: any) => {
    return toHexString(id.id);
  })
  @IsNotEmpty()
  @Column()
  public userId: string | ObjectID;

  public create(title: string, userId: string | ObjectID, now?: number) {
    this.title = title;
    this.userId = userId;
    if (now) {
      this.now = now;
    }
  }
}
