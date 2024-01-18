/* eslint-disable max-classes-per-file */
import { ApplicationError } from '@errors/application-error';

export abstract class ProductError extends ApplicationError {}

export class NotUniqueId extends ProductError {
  constructor(id: string) {
    super();
    this.name = 'NotUniqueId';
    this.stack = new Error().stack;
    this.message = id;
  }
}

export class NotFoundItem extends ProductError {
  constructor(id: string) {
    super();
    this.name = 'NotFoundItem';
    this.stack = new Error().stack;
    this.message = id;
  }
}
