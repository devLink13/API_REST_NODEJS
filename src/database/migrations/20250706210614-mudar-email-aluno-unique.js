/** @type {import('sequelize-cli').Migration} */
/**
 * migration para mudar o email do aluno para ser único
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('alunos', 'email', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });
  },

  async down() { } //eslint-disable-line
};
