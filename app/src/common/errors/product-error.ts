/* eslint-disable max-classes-per-file */
import { ApplicationError } from '@errors/application-error';

export abstract class ProductError extends ApplicationError {}

export class NotUniqueCode extends ProductError {
  constructor(code: string) {
    super();
    this.name = 'NotUniqueCode';
    this.stack = new Error().stack;
    this.message = code;
  }
}

export class NotFoundProduct extends ProductError {
  constructor(code: string) {
    super();
    this.name = 'NotFoundProduct';
    this.stack = new Error().stack;
    this.message = code;
  }
}
