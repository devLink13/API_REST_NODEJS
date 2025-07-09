// criar um trigger para a pasta upload/images
import chokidar from 'chokidar';
import path, { extname } from 'path';
import fs from 'fs';
import Foto from '../models/Foto';

class Watcher {
  constructor(uploadsPath) {
    this.uploadsPath = uploadsPath || path.resolve(__dirname, '..', '..', 'uploads');
    this.watcher = null; // configurador do watcher
    this.watcherOn = false; // indica se o watcher está ativo
  }

  // INICIAR O SERVIDOR
  async init() { // deixamos em async para podermos usar await
    // caso não haja a pasta nós a criamos
    if (!fs.existsSync(this.uploadsPath)) {
      fs.mkdirSync(this.uploadsPath, { recursive: true });
    }

    return new Promise((resolve) => {
      // configura o watcher do chokidar
      this.watcher = chokidar.watch(this.uploadsPath, {
        ignored: /(^|[\/\\])\../, // ignora arquivos ocultos
        ignoreInitial: true, // não ignora arquivos já existentes
        persistent: true, // mantém o watcher ativo
        usePolling: false, // usa polling em vez de eventos nativos
        awaitWriteFinish: {
          stabilityThreshold: 1000, // tempo em ms para aguardar a finalização da escrita
          pollInterval: 100, // tempo em ms para verificar se a escrita foi finalizada
        },
        alwaysStat: true, // sempre retorna estatísticas do arquivo
      });

      // configura os eventos do watcher e inicia
      this.watcher
        .on('add', (filepath, stats) => this.handleAdd(filepath, stats))
        .on('change', (filepath, stats) => this.handleChange(filepath, stats))
        .on('unlink', (filepath, stats) => this.handleUnlink(filepath, stats))
        .on('ready', () => {
          console.log(`Watcher iniciado e monitorando em: "${this.uploadsPath}"`);
          this.watcherOn = true;
          resolve(this.watcher); // resolve a promise quando o watcher estiver pronto e o retorna.
        });
    });
  }

  // Lida com a adição de arquivos
  async handleAdd(filepath, stats) {
    const file = {
      filepath,
      filename: path.basename(filepath),
      name: path.basename(filepath, extname(filepath)),
      extname: path.extname(filepath),
      directory: path.dirname(filepath),
      stats,
    };
  }

  // Lida com a alteração de arquivos
  async handleChange(filepath, stats) {
    const file = {
      filepath,
      filename: path.basename(filepath),
      name: path.basename(filepath, extname(filepath)),
      extname: path.extname(filepath),
      directory: path.dirname(filepath),
      stats,
    };
  }

  // Lida com a remoção de arquivos
  async handleUnlink(filepath, stats) {
    const file = {
      filepath,
      filename: path.basename(filepath),
      name: path.basename(filepath, extname(filepath)),
      extname: path.extname(filepath),
      directory: path.dirname(filepath),
      stats,
    };
    try {
      await Foto.destroy({
        where: { filename: file.filename },
      });
      console.log({
        script: 'Watcher',
        action: 'delete',
        status: 'success',
        message: `Foto "${file.filename}" deletada do banco de dados.`,
        realizadoEm: new Date().toISOString(),
      });
    } catch (e) {
      console.log('Erro ao deletar foto:', e);
    }
  }
}

export default Watcher;
