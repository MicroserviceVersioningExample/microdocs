import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface} from "class-validator";
import { Container } from "typedi";
import { BaseRepository } from "../../repositories/base.repo";

@ValidatorConstraint({ async: true })
export class IsUserAlreadyExistConstraint implements ValidatorConstraintInterface {

  public validate(userName: any, args: ValidationArguments) {
    let repo: BaseRepository<any> = Container.get(args.targetName + ".repo");
    return repo.exists(userName);
  }

}

export function Unique(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUserAlreadyExistConstraint
    });
  };
}
