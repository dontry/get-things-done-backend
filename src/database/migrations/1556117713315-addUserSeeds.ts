import {
  MigrationInterface,
  QueryRunner,
  getMongoManager,
  getConnectionOptions,
  getConnection,
  createConnection
} from "typeorm";
import { User } from "../../api/models";
import FullName from "../../api/models/FullName";
import { Sex } from "../../api/types";
import { Role } from "../../api/types/Role";
import { Sequence } from "../../api/models/Sequence";
import { logger } from "../../utils";

export class addUserSeeds1556117713315 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    logger.debug("migraton starts");
    let connection = getConnection();
    // const loadedConnectionOptions: ConnectionOptions = await getConnectionOptions();
    // const connection = await createConnection(connectionOptions);
    if (!connection) {
      logger.debug("create connection");
      const loadedConnectionOptions = await getConnectionOptions();
      connection = await createConnection(loadedConnectionOptions);
    }

    const mongoManager = await connection.createEntityManager();
    const user = new User();
    user.username = "admin";
    user.email = "admin@admin.com";
    user.password = "admin";
    const fullName = new FullName();
    fullName.firstName = "super";
    fullName.lastName = "admin";
    user.fullName = fullName;
    user.sex = Sex.FEMALE;
    user.role = Role.ADMIN;

    await mongoManager.save(user);

    const sequence = new Sequence();
    sequence.name = "taskPosition";
    sequence.value = 0;
    await mongoManager.save(sequence);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const mongoManager = getMongoManager();
    await mongoManager.clear(User);
    await mongoManager.clear(Sequence);
  }
}
