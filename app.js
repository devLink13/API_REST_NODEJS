import dotenv from 'dotenv'; // eslint-disable-line
dotenv.config();

import './src/database'; // eslint-disable-line

import express from 'express';  // eslint-disable-line
import path from 'path';

import homeRoutes from './src/routes/homeRoutes'; // eslint-disable-line
import userRoutes from './src/routes/userRoutes'; // eslint-disable-line
import tokenRoutes from './src/routes/tokenRoutes'; // eslint-disable-line
import alunoRoutes from './src/routes/alunoRoutes'; // eslint-disable-line
import fotoRoutes from './src/routes/fotoRoutes'; // eslint-disable-line

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(express.static(path.resolve(__dirname, 'uploads')));
  }

  routes() {
    this.app.use('/', homeRoutes);
    this.app.use('/users/', userRoutes);
    this.app.use('/tokens/', tokenRoutes);
    this.app.use('/alunos/', alunoRoutes);
    this.app.use('/fotos/', fotoRoutes);
  }
}

export default new App().app;
