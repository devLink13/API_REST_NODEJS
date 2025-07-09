// criar um monitor para uma tabela do banco e dados e comparar seu registro
// com os arquivos da pasta de uploads do sistema

// IMPORTS
import path from 'path';
import { promises as fs } from 'fs';
import Foto from '../models/Foto';

class MonitorDbTable {
  constructor(interval, tablename) {
    this.tableName = tablename;
    this.uploadsPath = path.resolve(__dirname, '..', '..', 'uploads', 'images');
    this.checkInterval = interval;
    this.interval = null;
  }

  async init() {
    // Verifica se a pasta existe e cria se não existir
    try {
      await fs.access(this.uploadsPath);
    } catch {
      await fs.mkdir(this.uploadsPath, { recursive: true });
    }

    // Inicia o monitoramento da tabela
    this.startMonitoring();
    console.log(`Monitorando a tabela "${this.tableName}" e a pasta de uploads: "${this.uploadsPath}" a cada ${this.checkInterval} ms.`);
  }

  // inicia o monitoramento da tabela
  startMonitoring() {
    this.interval = setInterval(async () => {
      const files = await this.readFiles();
      if (!files || files.len === 0) {
        const status = {
          script: 'MonitorDbTable',
          action: 'checkConsistency',
          status: 'info',
          message: 'Nenhum arquivo encontrado na pasta de uploads, ignorando a verificação.',
          arquivosOrfaos: [],
          removidosCount: 0,
          realizadoEm: new Date().toISOString(),
        };
        console.log(status);
        return;
      }

      // checa a consistência entre os arquivos da pasta e os registros no banco de dados
      const status = await this.checkConsistency(files.files);
      // exibe o status da operação
      console.log(status);
    }, this.checkInterval);
  }

  // para o monitoramento da tabela
  stopMonitoring() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      console.log(`Monitoramento da tabela ${this.tableName} parado.`);
    } else {
      console.log('Nenhum monitoramento ativo para parar.');
    }
  }

  // método principal para checar a consistência entre os arquivos do sistema de arquivos
  // e os registros na tabela
  async checkConsistency(files) {
    if (!files || files.length === 0) {
      return {
        script: 'MonitorDbTable',
        action: 'checkConsistency',
        status: 'info',
        message: 'Nenhum arquivo para verificar a consistência.',
        arquivosOrfaos: [],
        removidosCount: 0,
        realizadoEm: new Date().toISOString(),
      };
    }

    try {
      // Usando Promise.all com map para processar todos os arquivos em paralelo
      const resultados = await Promise.all(
        files.map(async (file) => {
          const foto = await Foto.findOne({ where: { filename: file } });
          return foto ? null : file; // retorna o arquivo se for órfão, null caso contrário
        }),
      );

      // Filtra apenas os arquivos órfãos (remove os nulls), ou seja,
      // arquivos que estão no sistema de arquivos mas não estão na tabela
      // Exemplo: se temos arquivos ['foto1.jpg', 'foto2.jpg', 'foto3.jpg']
      // E apenas 'foto2.jpg' não existe no banco:
      // resultados = [null, 'foto2.jpg', null]
      const arquivosOrfaos = resultados.filter((file) => file !== null);

      // se não houver arquivos órfaos, não faz nada - tabela consistente
      if (!arquivosOrfaos || arquivosOrfaos.length === 0) {
        return {
          script: 'MonitorDbTable',
          action: 'checkConsistency',
          status: 'success',
          message: 'Todos os arquivos estão consistentes com a tabela.',
          arquivosOrfaos: [],
          removidosCount: 0,
          realizadoEm: new Date().toISOString(),
        };
      }

      // se houver arquivos órfãos, chame a função para lidar com eles.
      const removidos = await this.handleRemoveOrfaos(arquivosOrfaos);

      // retorna um objeto com o status da operação
      return {
        script: 'MonitorDbTable',
        action: 'checkConsistency',
        status: 'success',
        message: `Monitoramento da tabela ${this.tableName} concluído.`,
        arquivosOrfaos: removidos,
        removidosCount: removidos.length,
        realizadoEm: new Date().toISOString(),
      };
    } catch (error) {
      return {
        script: 'MonitorDbTable',
        action: 'checkConsistency',
        status: 'error',
        message: 'Erro ao verificar a consistência entre a tabela e os arquivos.',
        error: error.message,
      };
    }
  }

  // remove os arquivos órfãos do sistema de arquivos
  async handleRemoveOrfaos(arquivosOrfaos) {
    try {
      const removidos = await Promise.all(
        arquivosOrfaos.map(async (filename) => {
          await fs.unlink(path.join(this.uploadsPath, filename));
          return filename; // retorna o nome do arquivo removido
        }),
      );
      return removidos;
    } catch (error) {
      console.log('Erro ao lidar com arquivos órfãos:', error);
      return [];
    }
  }

  // lê os arquivos da pasta de uploads
  async readFiles() {
    try {
      const files = await fs.readdir(this.uploadsPath);
      return {
        len: files.length,
        files,
      };
    } catch (error) {
      console.error('Erro ao ler os arquivos da pasta de uploads:', error);
      return {
        len: 0,
        files: [],
      };
    }
  }
}

export default MonitorDbTable;
