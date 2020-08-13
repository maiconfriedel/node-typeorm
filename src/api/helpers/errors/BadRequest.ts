export default class BadRequest extends Error {
  public statusCode: number = 400;

  constructor(message: string, public errors: string[]) {
    super(message);
  }
}
