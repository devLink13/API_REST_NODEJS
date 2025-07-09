import { Router } from 'express';
import userController from '../controllers/UserController';
import loginRequired from '../middlewares/loginRequired';

const router = new Router();

router.get('/', loginRequired, userController.index); // lista todos usuários
router.get('/:id', userController.show); // exibe um usuário

router.post('/', userController.store); // cria um usuário
router.put('/', loginRequired, userController.update); // atualiza um usuário
router.delete('/', loginRequired, userController.delete); // deleta um usuário

export default router;
