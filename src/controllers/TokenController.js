import jwt from 'jsonwebtoken';
import User from '../models/User';

class TokenController {
  async store(req, res) { //eslint-disable-line
    try {
      const { email = '', password = '' } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          errors: ['Email e senha são obrigatórios'],
        });
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({
          errors: ['Usuário não encontrado.'],
        });
      }

      const hashIsValid = await user.password_isValid(password);
      if (!hashIsValid) {
        return res.status(401).json({
          errors: ['Senha inválida.'],
        });
      }

      // gerar o token
      const token = jwt.sign({ id: user.id, email }, process.env.TOKEN_SECRET, {
        expiresIn: process.env.TOKEN_EXPIRATION,
      });

      return res.status(200).json({
        message: 'Token gerado com sucesso',
        token,
      });
    } catch (e) {
      return res.status(500).json({ // Adiciona status 500 para erros
        errors: ['Erro interno do servidor'],
      });
    }
  }
}
export default new TokenController();
