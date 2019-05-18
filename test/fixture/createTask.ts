import faker from "faker";
import { Task } from "../../src/api/models";

const attributes = ["next", "plan", "inbox"];

export default function createTask(): any {
  const task = new Task();
  task.create(
    faker.name.findName(),
    faker.hacker.noun(),
    faker.random.arrayElement(attributes),
    faker.date.recent().getDate()
  );
  return task;
}
