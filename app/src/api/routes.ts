import { Router } from 'express';
import { SchemaValidator } from '@api/schema-validator';
import { CreateSchema } from '@use-cases/create/create.schema';
import { CreateMiddleware } from '@use-cases/create/create.middleware';
import { ReadBySearchSchema } from '@use-cases/read-by-search/read-by-search.schema';
import { ReadBySearchMiddleware }
  from '@use-cases/read-by-search/read-by-search.middleware';
import { ReadByCodeSchema } from '@use-cases/read-by-code/read-by-code.schema';
import { ReadByCodeMiddleware } from '@use-cases/read-by-code/read-by-code.middleware';
import { UpdateSchema } from '@use-cases/update/update.schema';
import { UpdateMiddleware } from '@use-cases/update/update.middleware';
import { BulkMiddleware } from '@use-cases/bulk/bulk.middleware';
import { CheckTaskStatusMiddleware }
  from '@use-cases/check-task-status/check-task-status.middleware';
import { CheckTaskStatusSchema }
  from '@use-cases/check-task-status/check-task-status.schema';

const router = Router();

router.get(
  '/products',
  SchemaValidator.getMiddleware(ReadBySearchSchema),
  new ReadBySearchMiddleware().handle,
);
router.get(
  '/products/:code',
  SchemaValidator.getMiddleware(ReadByCodeSchema),
  new ReadByCodeMiddleware().handle,
);
router.post(
  '/products',
  SchemaValidator.getMiddleware(CreateSchema),
  new CreateMiddleware().handle,
);
router.patch(
  '/products/:code',
  SchemaValidator.getMiddleware(UpdateSchema),
  new UpdateMiddleware().handle,
);
router.post(
  '/products/bulk',
  new BulkMiddleware().handle,
);
router.get(
  '/products/bulk/:id',
  SchemaValidator.getMiddleware(CheckTaskStatusSchema),
  new CheckTaskStatusMiddleware().handle,
);

export { router };
