import path from 'path';
import app from './app';
import Watcher from './src/services/Watcher';
import FotosMonitor from './src/services/MonitorDbTable';

// usando uma IIFE para inicializar o servidor e o watcher em ordem
(async () => {
  // iniciar o watcher primeiro
  const watcher = new Watcher(path.resolve(__dirname, 'uploads', 'images'));
  await watcher.init();

  // iniciar o monitoramento da tabela de fotos
  const fotosMonitor = new FotosMonitor(1000 * 60 * 1, 'fotos'); // 24h = 1000 * 60 * 60 * 24
  await fotosMonitor.init();

  // inicializa o servidor
  app.listen(3001, () => {
    console.log('Servidor rodando na porta 3001');
    console.log('http://localhost:3001');
  });
})();
