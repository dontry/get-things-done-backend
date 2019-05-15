import { Entry } from "./Entry";
import { Entity, Column, ObjectID } from "typeorm";
import { IReminder, IRepeater } from "../types";
import { IsNotEmpty } from "class-validator";
import { toHexString } from "../../utils";
import { Exclude, Transform } from "class-transformer";
import { ObjectId } from "bson";

@Entity()
export class Task extends Entry {
  @Column({ default: [] })
  public reminders: IReminder[];

  @Column({ default: [] })
  public repeaters: IRepeater[];

  @Column({ default: [] })
  public tags: string[];

  @Column()
  public projectId: string | ObjectID;

  @Exclude()
  @Transform((id: any) => {
    return toHexString(id.id);
  })
  @IsNotEmpty()
  @Column()
  public userId: string | ObjectID | ObjectId;

  public create(
    title: string,
    userId: string | ObjectID | ObjectId,
    attribute: string,
    createdAt: number
  ) {
    this.title = title;
    this.userId = userId;
    this.createdAt = createdAt;
    this.attribute = attribute;
  }
}
