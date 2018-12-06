import { Column } from "typeorm";
import { IsNotEmpty } from "class-validator";

class Note {
  @IsNotEmpty()
  @Column()
  public content: string;
}

export default Note;
