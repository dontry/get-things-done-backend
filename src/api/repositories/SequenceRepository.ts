import { MongoRepository, EntityRepository, MongoEntityManager } from "typeorm";
import { Sequence } from "../models/Sequence";
import { InjectManager } from "typeorm-typedi-extensions";
import { POS_SEQUENCE_STEP } from "../../constants";
import { InternalServerError } from "routing-controllers";

@EntityRepository(Sequence)
export class SequenceRepository extends MongoRepository<Sequence> {
  constructor(@InjectManager() private entityManager: MongoEntityManager) {
    super();
  }

  public async getNextSequenceValue(sequenceName: string): Promise<number> {
    const sequence: Sequence | undefined = await this.findOne({
      name: sequenceName
    });
    if (sequence) {
      const value = sequence.value;
      sequence.value += POS_SEQUENCE_STEP;
      await this.save(sequence);
      return value;
    } else {
      throw new InternalServerError("Position sequence does not exist.");
    }
  }
}
