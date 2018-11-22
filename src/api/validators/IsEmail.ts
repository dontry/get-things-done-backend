import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments
} from "class-validator";

@ValidatorConstraint({ name: "IsEmail", async: false })
export class IsEmail implements ValidatorConstraintInterface {
  // tslint:disable-next-line:max-line-length
  private emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  public validate(email: string, args: ValidationArguments): boolean {
    return this.emailRegex.test(email);
  }

  public defaultMessage(args: ValidationArguments) {
    // tslint:disable-next-line:max-line-length
    return "Sorry, the email address is invalid.";
  }
}
