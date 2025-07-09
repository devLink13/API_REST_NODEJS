/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('fotos', 'aluno_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'alunos',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down() { } // eslint-disable-line
};
