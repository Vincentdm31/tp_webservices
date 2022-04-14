import { NotFoundException } from '@nestjs/common';
import { Error } from 'mongoose';

export function apiRepositoryError(): string {
  return 'api-repository-error';
}

export const handleDocumentNotFound = (error: Error): never => {
  if (error instanceof Error.DocumentNotFoundError) {
    throw new NotFoundException();
  }
  throw error;
};
