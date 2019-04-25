import { ObjectIdColumn, Column, ObjectID, Entity } from "typeorm";

@Entity()
export class Sequence {
  @ObjectIdColumn()
  public id: ObjectID;

  @Column()
  public categoryName: string;

  @Column({ default: 0 })
  public value: number;

  // constructor(categoryName: string) {
  //   this.categoryName = categoryName;
  //   this.sequenceValue = 0;
  // }
}
