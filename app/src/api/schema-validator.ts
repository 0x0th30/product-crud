import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodObject } from 'zod';

export class SchemaValidator {
  constructor(
    private schema: ZodObject<any>,
  ) {}

  public async handle(request: Request, response: Response, next: NextFunction) {
    try {
      await this.schema.parseAsync(request);
      return next();
    } catch (error) {
      const responseContent = {
        success: false,
        error: { details: (error as ZodError).issues },
      };
      return response.status(400).json(responseContent);
    }
  }

  static getMiddleware(schema: ZodObject<any>) {
    const middleware = new SchemaValidator(schema)
      .handle
      .bind(new SchemaValidator(schema));

    return middleware;
  }
}
