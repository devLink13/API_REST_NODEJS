/**
 * Resumo do que é seeds:
 * Seeds são arquivos que contêm dados iniciais para popular o banco de dados
 * durante o desenvolvimento ou testes. Eles permitem que você crie um conjunto
 * de dados padrão que pode ser facilmente inserido no banco de dados, garantindo
 * que você tenha dados consistentes para trabalhar.
 */
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.bulkInsert(
      'users',
      [
        {
          nome: 'John Doe',
          email: 'john.doe@example.com',
          password_hash: await bcrypt.hash('123456', 8),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          nome: 'Jane Doe',
          email: 'jane.doe@example.com',
          password_hash: await bcrypt.hash('123456', 8),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          nome: 'Alice Smith',
          email: 'alice.smith@example.com',
          password_hash: await bcrypt.hash('123456', 8),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          nome: 'Bob Johnson',
          email: 'bob.johnson@example.com',
          password_hash: await bcrypt.hash('123456', 8),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {},
    );
  },

  async down() { }, //eslint-disable-line
};
