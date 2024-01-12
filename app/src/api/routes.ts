import { Router } from 'express';
import { CreateMiddleware } from '@use-cases/create/create.middleware';

const router = Router();

router.post('/products', new CreateMiddleware().handle);

export { router };
