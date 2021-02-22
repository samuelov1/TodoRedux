export default class NotFoundError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundError);
    }

    this.name = this.constructor.name;
    this.statusCode = 404;
  }
}
