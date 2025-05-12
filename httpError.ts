export class HttpError extends Error {
  statusCode: number = 400;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "httpError";
  }
}
