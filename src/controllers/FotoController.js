import multer from 'multer';
import multerConfig from '../config/multerConfig';

import Foto from '../models/Foto';
import Aluno from '../models/Aluno';
import User from '../models/User';

const upload = multer(multerConfig).single('foto');

class FotoController {
  async store(req, res) {
    try {
      // verificar se o aluno existe
      const { id } = req.params;
      const aluno = await Aluno.findByPk(id);
      if (!aluno) {
        return res.status(404).json({
          error: ['Aluno não encontrado'],
        });
      }

      // verificar se o aluno já possui foto registrada
      if (await Foto.findOne({ where: { aluno_id: id } })) {
        return res.status(400).json({
          error: ['Aluno já possui foto registrada'],
        });
      }

      return upload(req, res, async (err) => {
        if (err) {
          return res.status(400).json({
            errors: [err.code],
          });
        }
        try {
          // verificar se o arquivo foi enviado
          if (!req.file) {
            return res.status(400).json({
              error: ['Nenhum arquivo enviado'],
            });
          }

          // extrair informações do arquivo
          const { originalname, filename } = req.file;

          // criar um registro da foto
          const foto = await Foto.create({
            originalname,
            filename,
            aluno_id: id,
          });

          // retornar a resposta
          const user = await User.findByPk(req.userId);
          return res.status(200).json({
            message: ['Foto enviada com sucesso!'],
            executado_por: {
              idUser: req.userId,
              nome: user.nome,
              sobrenome: user.sobrenome,
            },
            foto_de: {
              idAluno: aluno.id,
              nome: aluno.nome,
              sobrenome: aluno.sobrenome,
            },
            foto,
          });
        } catch (e) {
          return res.status(500).json({
            error: ['Erro ao criar registro da foto'],
            code_errors: e.errors.map((error) => error.message),
          });
        }
      });
    } catch (e) {
      return res.status(500).json({
        error: ['Erro ao enviar foto'],
        code_errors: e.errors.map((error) => error.message),
      });
    }
  }
}
export default new FotoController();
