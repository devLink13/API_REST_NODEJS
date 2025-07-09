import User from '../models/User';

/**
 * Padrão de nomeclaturas:
 *
 * index -> listar usuários -> GET
 * store/create -> criar usuário -> POST
 * show -> exibir usuário -> GET
 * update -> atualizar usuário -> PATCH OU PUT
 * destroy/delete -> deletar usuário -> DELETE
 */

class UserController {
  async store(req, res) {
    try {
      const novoUser = await User.create(req.body);
      return res.json({ id: novoUser.id, nome: novoUser.nome, email: novoUser.email });
    } catch (e) {
      return res.status(500).json({
        errors: e.errors.map((error) => error.message),
      });
    }
  }

  // index
  async index(req, res) {
    try {
      const users = await User.findAll();

      const usersResponse = users.map((user) => ({
        id: user.id,
        nome: user.nome,
        email: user.email,
      }));

      return res.json(usersResponse);
    } catch (e) {
      return res.json(null);
    }
  }

  // show
  async show(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({
          errors: ['usuário não encontrado'],
        });
      }
      const userResponse = {
        id: user.id,
        nome: user.nome,
        email: user.email,
      };
      return res.json(userResponse);
    } catch (e) {
      return res.status(500).json({
        errors: e.errors.map((error) => error.message),
      });
    }
  }

  // update
  async update(req, res) {
    try {
      const id = req.userId;

      // caso usuário não exista
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({
          errors: ['Usuário não encontrado'],
        });
      }

      // faz o put
      const novosDados = await user.update(req.body);
      return res.json({
        id: novosDados.id,
        nome: novosDados.nome,
        email: novosDados.email,
      });
    } catch (e) {
      return res.status(500).json({
        errors: e.errors.map((error) => error.message),
      });
    }
  }

  // delete
  async delete(req, res) {
    try {
      const id = req.userId;

      // caso usuário não exista
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({
          errors: ['Usuário não encontrado'],
        });
      }

      // faz o delete
      await user.destroy();
      return res.json({
        message: 'Usuário deletado com sucesso',
        usuario_deletado: {
          id: user.id,
          nome: user.nome,
          email: user.email,
        },
      });
    } catch (e) {
      return res.status(500).json({
        errors: e.errors.map((error) => error.message),
      });
    }
  }
}

export default new UserController();
