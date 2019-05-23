import faker from "faker";
import { Task } from "../../src/api/models";

const attributes = ["next", "plan", "inbox"];

export default function createTask(): any {
  const task = new Task();
  task.create(
    faker.lorem.words(3),
    faker.name.findName(),
    faker.random.arrayElement(attributes),
    faker.date.recent().getDate()
  );
  return task;
}
