import { registerDecorator, ValidationOptions } from 'class-validator';
import { isObjectId } from './is-object-id.util';

export function IsObjectId(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      name: 'isObjectId',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: {
        message:
          validationOptions?.message || `${propertyName} must be an object id`,
        ...validationOptions,
      },
      validator: {
        validate(value: unknown) {
          return typeof value === 'string' && isObjectId(value);
        },
      },
    });
  };
}
