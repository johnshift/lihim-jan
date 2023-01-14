interface ErrorJsonBody {
  jsonBody: () => Record<string, unknown>;
}

// ApiError is the error thrown by api handlers.
// Every handler checks if the error is an instance of ApiError or throws 500 otherwise.
export class ApiError extends Error implements ErrorJsonBody {
  status = 400;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;

    // Need to set the prototype explicitly (typescript 2.1 breaking change)
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  // Allow custom return types for other classes
  jsonBody() {
    return {
      message: this.message,
    };
  }
}
