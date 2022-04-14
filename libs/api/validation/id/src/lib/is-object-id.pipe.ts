import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { registerDecorator, ValidationOptions } from 'class-validator';
import { Types } from 'mongoose';
import { isObjectId } from './is-object-id.util';

const checkObjectId = (value: string): string => {
  if (isObjectId(value)) {
    return value;
  }
  throw new BadRequestException();
};

@Injectable()
export class IsObjectIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata): string {
    const id = value as string;
    switch (metadata.type) {
      case 'param':
      case 'query':
        return checkObjectId(id);
      default:
        return value;
    }
  }
}
