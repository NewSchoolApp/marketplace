import { ErrorEnum, ErrorEnumKey } from '../enum/error.enum';

export class ErrorObject {
  message: string;
  errorCode: string;
  constructor(errorEnumKey: ErrorEnumKey) {
    const { message, errorCode } = ErrorEnum[errorEnumKey];
    this.message = message;
    this.errorCode = errorCode;
  }

  public customMessage(customMessage: string) {
    this.message = customMessage;
    return this;
  }
}
