import { Sex } from "../../src/api/types";
import { User } from "../../src/api/models";
import { Role } from "../../src/api/types/Role";
import FullName from "../../src/api/models/FullName";

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
user.isVerified = true;

export default user;
