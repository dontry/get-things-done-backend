import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments
} from "class-validator";

@ValidatorConstraint({ name: "PasswordPattern", async: false })
export class PasswordPattern implements ValidatorConstraintInterface {
  // Minimum eight characters, Maximum 16 characters, at least one letter, one number and one special character:
  private passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%.*#?&])[A-Za-z\d@.$!%*#?&]{8,24}$/g;

  public validate(password: string, args: ValidationArguments): boolean {
    return this.passwordRegex.test(password);
  }

  public defaultMessage(args: ValidationArguments) {
    // tslint:disable-next-line:max-line-length
    return "The password is not secure enough.\n It should contain mi nimum eight characters, at least one letter, one number and one special character.";
  }
}
