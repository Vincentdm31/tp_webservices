export enum ApiErrorCode {
  ResourceNotFound = 'RESOURCE_NOT_FOUND',
  ResourceTypeNotFound = 'RESOURCE_TYPE_NOT_FOUND',
  ResourceIdInvalid = 'RESOURCE_ID_INVALID',
  ResourceStructureInvalid = 'RESOURCE_STRUCTURE_INVALID',
  ParamsStructureInvalid = 'PARAMS_STRUCTURE_INVALID',
  UnknownError = 'UNKNOWN_ERROR',
}

export interface ErrorDto {
  timestamp: string;
  path: string;
  statusCode: number;
  code: ApiErrorCode;
  message: string;
  details?: Record<string, string | string[]>[];
}
