import multer from 'multer';
import { extname, resolve } from 'path';
import Aluno from '../models/Aluno';

const aleatorio = () => Math.floor(Math.random() * 10000 + 10000);

export default {
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
      return cb(new multer.MulterError('Formato de arquivo inválido. Apenas JPEG e PNG são permitidos.'));
    }
    return cb(null, true);
  },
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, resolve(__dirname, '..', '..', 'uploads', 'images'));
    },
    filename: async (req, file, cb) => {
      let nomeAluno = '';
      try {
        const aluno = await Aluno.findByPk(req.params.id);
        nomeAluno = aluno ? aluno.nome.replace(' ', '') : 'NoName';
      } catch (e) {
        nomeAluno = 'NoName';
      }
      cb(null, `${Date.now()}_${nomeAluno}_${aleatorio()}${extname(file.originalname)}`);
    },
  }),
};
