import { ObjectIdColumn, Column, ObjectID, Entity } from "typeorm";

@Entity()
export class Sequence {
  @ObjectIdColumn()
  public id: ObjectID;

  @Column()
  public name: string;

  @Column({ default: 0 })
  public value: number;
}
