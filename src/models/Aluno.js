import Sequelize, { Model } from 'sequelize';

export default class Aluno extends Model {
  static init(sequelize) {
    super.init({
      nome: {
        type: Sequelize.STRING,
        defaultValue: '',
        validate: {
          len: {
            args: [3, 255],
            msg: 'O nome deve ter entre 3 e 255 caracteres',
          },
        },
      },
      sobrenome: {
        type: Sequelize.STRING,
        defaultValue: '',
        validate: {
          len: {
            args: [3, 255],
            msg: 'O sobrenome deve ter entre 3 e 255 caracteres',
          },
        },
      },
      email: {
        type: Sequelize.STRING,
        defaultValue: '',
        validate: {
          isEmail: {
            msg: 'O email deve ser um endereço de email válido',
          },
        },
        unique: {
          msg: 'Email já cadastrado',
        },
      },
      idade: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        validate: {
          isInt: {
            msg: 'Idade deve ser válida.',
          },
        },
      },
      peso: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
        validate: {
          isFloat: {
            msg: 'Peso deve ser um número válido.',
          },
        },
      },
      altura: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
        validate: {
          isFloat: {
            msg: 'Altura deve ser um número válido.',
          },
        },
      },
    }, {
      sequelize,
    });
    return this;
  }

  static associate(models) {
    this.hasOne(models.Foto, { foreignKey: 'aluno_id', as: 'foto' });
  }
}
