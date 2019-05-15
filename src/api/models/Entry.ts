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
import { ObjectId } from "bson";

@Entity()
export abstract class Entry {
  @ObjectIdColumn()
  @Transform((id: any) => {
    if (typeof id === "string") {
      return id;
    } else {
      return toHexString(id.id);
    }
  })
  public id: string | ObjectID | ObjectId;

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
  @Column({ default: Date.now() })
  public createdAt: number;

  @Min(0)
  @Column({ default: 0 })
  public startAt: number;

  @Min(0)
  @Column({ default: 0 })
  public pos: number;

  @Min(0)
  @Column({ default: 0 })
  public endAt: number;

  @Min(0)
  @Column({ default: 0 })
  public estimatedTime: number;

  @Min(0)
  @Column({ default: 0 })
  public spentTime: number;

  @Column({ default: true })
  public allDay: boolean;

  @Column()
  public source: string;

  @Column({ default: 0 })
  public deleted: number;

  @Column({ default: 0 })
  public archived: number;

  @Column({ default: 0 })
  public completed: number;

  @Column({ default: 0 })
  public hidden: number;

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

    if (
      this.startAt !== 0 &&
      this.endAt !== 0 &&
      isAfter(startAtDate, endAtDate)
    ) {
      throw new Error("Validation error: startAt should be prior to endAt");
    }
  }
}
