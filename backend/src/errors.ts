export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "Forbidden";
  }
}

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "Unauthorized";
  }
}

export class RequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "Bad Request";
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "Not Found";
  }
}
