require('dotenv').config(); // eslint-disable-line

module.exports = {
  dialect: 'mariadb',
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  port: process.env.DATABASE_PORT,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  dialectOptions: {

  },
  timezone: 'America/Sao_Paulo',
  logging: false, // desabilita o log das queries SQL

};
