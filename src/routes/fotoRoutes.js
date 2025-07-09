import { Router } from 'express';

import fotoController from '../controllers/FotoController';
import loginRequired from '../middlewares/loginRequired';

const router = new Router();

router.post('/:id', loginRequired, fotoController.store);

export default router;
