import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments
} from "class-validator";
import { logger } from "../../utils";

@ValidatorConstraint({ name: "PasswordPattern", async: false })
export class PasswordPattern implements ValidatorConstraintInterface {
  // Minimum eight characters, Maximum 16 characters, at least one letter, one number and one special character:
  private passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%.*#?&])[A-Za-z\d@.$!%*#?&]{8,24}$/;

  public validate(password: string): boolean {
    return this.passwordRegex.test(password);
  }

  public defaultMessage(args: ValidationArguments) {
    // tslint:disable-next-line:max-line-length
    return "The password is not secure enough.\n It should contain minimum 8 characters, at least one letter, one number and one special character.";
  }
}
