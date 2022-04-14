import { ApiErrorCode } from '@rendu-tp0/common/resource/error';
import { HttpException, HttpStatus } from '@nestjs/common';

interface ApiExceptionOptions {
  code: ApiErrorCode;
  message?: string;
  details?: Record<string, string | string[]>[];
  originalError?: Error;
}

export class ApiException extends HttpException {
  constructor(private _options: ApiExceptionOptions, status: HttpStatus) {
    super(_options, status);
  }

  get options(): ApiExceptionOptions {
    return this._options;
  }
}

export class ApiResourceNotFoundException extends ApiException {
  constructor(originalError?: Error) {
    super(
      {
        code: ApiErrorCode.ResourceNotFound,
        message: 'Requested resource does not exist',
        originalError,
      },
      HttpStatus.NOT_FOUND
    );
  }
}

export class ApiResourceTypeNotFoundException extends ApiException {
  constructor(originalError?: Error) {
    super(
      {
        code: ApiErrorCode.ResourceTypeNotFound,
        message: 'Requested resource type does not exist',
        originalError,
      },
      HttpStatus.NOT_FOUND
    );
  }
}

export class ApiResourceIdInvalidException extends ApiException {
  constructor(originalError?: Error) {
    super(
      {
        code: ApiErrorCode.ResourceIdInvalid,
        message: 'Requested resource id is invalid',
        originalError,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}

type ApiResourceStructureInvalidExceptionDetail = {
  property: string;
  errors: string[];
};

export class ApiResourceStructureInvalidException extends ApiException {
  constructor(
    originalError?: Error,
    details?: ApiResourceStructureInvalidExceptionDetail[]
  ) {
    super(
      {
        code: ApiErrorCode.ResourceStructureInvalid,
        message: 'Sent resource structure is invalid',
        originalError,
        details,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}

export class ApiParamsStructureInvalidException extends ApiException {
  constructor(
    originalError?: Error,
    details?: ApiResourceStructureInvalidExceptionDetail[]
  ) {
    super(
      {
        code: ApiErrorCode.ParamsStructureInvalid,
        message: 'Sent params structure is invalid',
        originalError,
        details,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}

export class ApiUnknownErrorException extends ApiException {
  constructor(originalError?: Error) {
    super(
      {
        code: ApiErrorCode.UnknownError,
        message: 'An unknown error has occurred',
        originalError,
      },
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
