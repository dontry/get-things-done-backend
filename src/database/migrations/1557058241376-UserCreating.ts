import {
  MigrationInterface,
  QueryRunner,
  getMongoManager,
  getConnectionOptions,
  getConnection,
  createConnection
} from "typeorm";
import { User, Task } from "../../api/models";
import FullName from "../../api/models/FullName";
import { Sex, Priority } from "../../api/types";
import { Role } from "../../api/types/Role";
import { Sequence } from "../../api/models/Sequence";
import { logger } from "../../utils";
import Note from "../../api/models/Note";

export class UserCreating1557058241376 implements MigrationInterface {
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
    user.username = "test";
    user.email = "test@test.com";
    user.password = "test";
    const fullName = new FullName();
    fullName.firstName = "Test";
    fullName.lastName = "Suite";
    user.fullName = fullName;
    user.sex = Sex.FEMALE;
    user.role = Role.ADMIN;
    const savedUser = await mongoManager.save(user);

    const sequence = new Sequence();
    sequence.name = "taskPosition";
    sequence.value = 0;
    await mongoManager.save(sequence);

    const task = new Task();
    task.allDay = false;
    task.archived = 0;
    task.attribute = "inbox";
    task.completed = 0;
    task.createdAt = Date.now();
    task.deleted = 0;
    task.endAt = 0;
    task.estimatedTime = 0;
    task.hidden = 0;
    task.note = new Note();
    task.title = "new task";
    task.pos = sequence.value;
    task.priority = Priority.MEDIUM;
    task.startAt = 0;
    task.spentTime = 0;
    task.tags = [];
    task.userId = savedUser.id;
    await mongoManager.save(task);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const mongoManager = getMongoManager();
    await mongoManager.clear(User);
    await mongoManager.clear(Task);
    await mongoManager.clear(Sequence);
  }
}
