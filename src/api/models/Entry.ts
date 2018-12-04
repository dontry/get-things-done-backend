import { Entity, ObjectIdColumn, Column, Index, ObjectID } from "typeorm";
import { Transform } from "class-transformer";
import { toHexString } from "../../utils";
import { IsNotEmpty, Min, Max } from "class-validator";

@Entity()
export abstract class Entry {
  @ObjectIdColumn()
  @Transform((id: any) => {
    return toHexString(id.id);
  })
  public id: ObjectID;

  @IsNotEmpty()
  @Column()
  public title: string;

  @Column()
  public attribute: string;

  @Min(0)
  @Max(5)
  @Column()
  public priority: number;

  @Min(0)
  @Column()
  public now: number;

  @Min(0)
  @Column({ name: "start_at" })
  public startAt: number;

  @Min(0)
  @Column({ name: "end_at" })
  public endAt: number;

  @Min(0)
  @Column({ name: "estimated_time" })
  public estimatedTime: number;

  @Min(0)
  @Column({ name: "spent_time" })
  public spentTime: number;

  @Column({ name: "all_day" })
  public allDay: boolean;

  @Column()
  public source: string;

  @Column()
  public deleted: boolean;

  @Column()
  public archived: boolean;

  @Column()
  public completed: boolean;

  @Column()
  public hidden: boolean;

  @Column()
  public tags: string[];

  @Column()
  public note: string;

  constructor(title: string) {
    this.title = title;
  }
}
