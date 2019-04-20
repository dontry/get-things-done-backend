import {
  Entity,
  ObjectIdColumn,
  Column,
  Index,
  ObjectID,
  BeforeInsert,
  BeforeUpdate
} from "typeorm";
import { Transform } from "class-transformer";
import { toHexString } from "../../utils";
import { IsNotEmpty, Min, Max } from "class-validator";
import { isAfter } from "date-fns";
import Note from "./Note";

@Entity()
export abstract class Entry {
  @ObjectIdColumn()
  @Transform((id: any) => {
    return toHexString(id.id);
  })
  public id: string | ObjectID;

  @IsNotEmpty()
  @Column()
  public title: string;

  @Column()
  public attribute: string;

  @Min(1)
  @Max(5)
  @Column()
  public priority: number;

  @Min(0)
  @Column()
  public now: number;

  @Column({
    default: Date.now()
  })
  public createdAt: number;

  @Min(0)
  @Column({ name: "start_at", default: 0 })
  public startAt: number;

  @Min(0)
  @Column({ name: "end_at", default: 0 })
  public endAt: number;

  @Min(0)
  @Column({ name: "estimated_time", default: 0 })
  public estimatedTime: number;

  @Min(0)
  @Column({ name: "spent_time", default: 0 })
  public spentTime: number;

  @Column({ name: "all_day", default: true })
  public allDay: boolean;

  @Column()
  public source: string;

  @Column({ default: false })
  public deleted: boolean;

  @Column({ default: false })
  public archived: boolean;

  @Column({ default: false })
  public completed: boolean;

  @Column({ default: false })
  public hidden: boolean;

  @Column({ default: [] })
  public tags: string[];

  @Column()
  public note: Note;

  public toString(): string {
    return `${this.title}`;
  }

  @BeforeUpdate()
  @BeforeInsert()
  public validateDate(): void {
    const startAtDate = new Date(this.startAt);
    const endAtDate = new Date(this.endAt);

    if (isAfter(startAtDate, endAtDate)) {
      throw new Error("Validation error: startAt should be prior to endAt");
    }
  }
}
