import Aluno from '../models/Aluno';
import Foto from '../models/Foto';

class AlunoController {
  // listar alunos da base de dados
  async index(req, res) {
    const alunos = await Aluno.findAll({
      attributes: ['id', 'nome', 'sobrenome', 'email', 'idade', 'peso', 'altura'],
      order: [['id', 'DESC']],
      include: {
        model: Foto,
        as: 'foto',
        attributes: ['id', 'originalname', 'filename', 'aluno_id', 'url'],
      },
    });
    res.json(alunos);
  }

  // store
  async store(req, res) {
    try {
      if (!req.body) {
        return res.status(400).json({
          error: ['São necessários dados do aluno para cadastrar novo aluno.'],
        });
      }

      // filtra o corpo da requisição
      const objetoAluno = {
        nome: req.body.nome,
        sobrenome: req.body.sobrenome,
        idade: req.body.idade,
        email: req.body.email,
        peso: req.body.peso,
        altura: req.body.altura,
      };

      const aluno = await Aluno.create(objetoAluno);
      return res.status(200).json({
        message: ['sucesso na criacao'],
        aluno,
      });
    } catch (e) {
      return res.status(500).json({
        error: ['erro interno do servidor'],
        code_errors: e.errors.map((err) => err.message),
      });
    }
  }

  // show
  async show(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          error: ['ID do aluno é obrigatório'],
        });
      }

      const aluno = await Aluno.findByPk(id, {
        attributes: ['id', 'nome', 'sobrenome', 'email', 'idade', 'peso', 'altura'],
        order: [['id', 'DESC']],
        include: {
          model: Foto,
          as: 'foto',
          attributes: ['id', 'originalname', 'filename', 'aluno_id', 'url'],
        },
      });
      if (!aluno) {
        return res.status(404).json({
          error: ['Aluno não encontrado'],
        });
      }

      return res.json(aluno);
    } catch (e) {
      return res.status(500).json({
        error: ['erro interno do servidor'],
        code_errors: e.errors.map((err) => err.message),
      });
    }
  }

  // delete
  async delete(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          error: ['ID do aluno é obrigatório'],
        });
      }

      const aluno = await Aluno.findByPk(id);
      if (!aluno) {
        return res.status(404).json({
          error: ['Aluno não encontrado'],
        });
      }
      await aluno.destroy();
      return res.json({
        message: ['Aluno deletado com sucesso'],
        aluno_deletado: aluno,
      });
    } catch (e) {
      return res.status(500).json({
        error: ['erro interno do servidor'],
        code_errors: e.errors.map((err) => err.message),
      });
    }
  }

  // update
  async update(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          error: ['ID do aluno é obrigatório'],
        });
      }

      const aluno = await Aluno.findByPk(id);
      if (!aluno) {
        return res.status(404).json({
          error: ['Aluno não encontrado'],
        });
      }

      const alunoDesatualizado = { ...aluno.dataValues };
      const alunoAtualizado = await aluno.update(req.body);
      return res.json({
        message: ['sucesso na atualizacao'],
        atualizado: alunoAtualizado,
        desatualizado: alunoDesatualizado,
      });
    } catch (e) {
      return res.status(500).json({
        error: ['erro interno do servidor'],
        code_errors: e.errors.map((err) => err.message),
      });
    }
  }
}

export default new AlunoController();
