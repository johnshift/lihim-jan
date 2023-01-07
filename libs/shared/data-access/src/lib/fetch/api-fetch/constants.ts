import { ErrorResponse } from './types';

// FetchError is used to distinguish non 200 errors
export class FetchError extends Error {
  body: ErrorResponse;

  constructor(body: ErrorResponse) {
    super();
    this.body = body;
    // Need to set the prototype explicitly (typescript 2.1 breaking change)
    Object.setPrototypeOf(this, FetchError.prototype);
  }
}
