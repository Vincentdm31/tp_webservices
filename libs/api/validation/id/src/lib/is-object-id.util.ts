import { Types } from 'mongoose';

export const isObjectId = (value: string): boolean =>
  Types.ObjectId.isValid(value);
