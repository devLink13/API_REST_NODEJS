import jwt from 'jsonwebtoken';
import User from '../models/User';

export default async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({
      errors: ['Token de autorização não fornecido.'],
    });
  }

  const [_, token] = authorization.split(' '); //eslint-disable-line
  try {
    const dados = jwt.verify(token, process.env.TOKEN_SECRET);
    const { id, email } = dados;

    // verifica se o id e email contidos no token existem no banco de dados
    const user = await User.findOne({
      where: {
        id,
        email,
      },
    });

    if (!user) {
      return res.status(401).json({
        errors: ['Usuário não encontrado, verifique seu token.'],
      });
    }

    // adiciona informações do usuário à requisição
    req.userId = id;
    req.userEmail = email;
    return next();
  } catch (e) {
    return res.status(401).json({
      errors: ['Token de autorização expirado ou inválido.'],
    });
  }
};
