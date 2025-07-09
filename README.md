# 📚 API REST - Sistema de Gestão de Alunos

Uma API REST completa desenvolvida em Node.js para gerenciar alunos, usuários e fotos, utilizando autenticação JWT e banco de dados MariaDB.

## 📋 Índice

- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Arquitetura](#-arquitetura)
- [Configuração do Ambiente](#-configuração-do-ambiente)
- [Instalação](#-instalação)
- [Configuração do Banco de Dados](#-configuração-do-banco-de-dados)
- [Autenticação JWT](#-autenticação-jwt)
- [Rotas da API](#-rotas-da-api)
- [Testando a API](#-testando-a-api)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Contribuição](#-contribuição)

## 🚀 Funcionalidades

- ✅ **Autenticação JWT** - Sistema seguro de login e autorização
- 👥 **Gestão de Usuários** - CRUD completo para usuários do sistema
- 🎓 **Gestão de Alunos** - Cadastro, listagem, edição e exclusão de alunos
- 📸 **Upload de Fotos** - Sistema de upload e associação de fotos aos alunos
- 🔐 **Middleware de Segurança** - Proteção de rotas sensíveis
- 📊 **Validação de Dados** - Validação robusta usando Sequelize
- 🔄 **Relacionamentos** - Associações entre tabelas (Aluno ↔ Foto)
- 📁 **Monitoramento de Arquivos** - Sistema de monitoramento automático

## 💻 Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web minimalista
- **Sequelize** - ORM para banco de dados
- **MariaDB** - Sistema de gerenciamento de banco de dados
- **JWT (jsonwebtoken)** - Autenticação baseada em tokens
- **Bcrypt.js** - Hash de senhas
- **Multer** - Middleware para upload de arquivos
- **Dotenv** - Gerenciamento de variáveis de ambiente

### Desenvolvimento
- **Nodemon** - Reinicialização automática do servidor
- **ESLint** - Linting de código JavaScript
- **Sucrase** - Transpilador ES6+
- **Sequelize CLI** - Interface de linha de comando do Sequelize

## 🏗 Arquitetura

O projeto segue o padrão **MVC (Model-View-Controller)** com a seguinte estrutura:

```
src/
├── config/          # Configurações (DB, Multer, App)
├── controllers/     # Controladores (lógica de negócio)
├── models/          # Modelos do banco de dados
├── routes/          # Definição de rotas
├── middlewares/     # Middlewares customizados
├── services/        # Serviços auxiliares
└── database/        # Migrações e seeds
```

## ⚙️ Configuração do Ambiente

### 1. Pré-requisitos

- **Node.js** v16+ instalado
- **MariaDB** ou **MySQL** instalado e rodando
- **DBeaver** ou outro cliente de banco de dados (recomendado)
- **Postman** ou **Insomnia** para testar as rotas

### 2. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Configurações do Banco de Dados
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USERNAME=seu_usuario
DATABASE_PASSWORD=sua_senha
DATABASE_NAME=api_rest_db

# Configurações JWT
TOKEN_SECRET=sua_chave_secreta_super_forte_aqui
TOKEN_EXPIRATION=7d

# Configurações da Aplicação
APP_URL=http://localhost:3001
APP_PORT=3001
```

⚠️ **Importante**: Nunca commite o arquivo `.env` no Git!

## 📦 Instalação

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd API-REST
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o banco de dados
```bash
# Execute as migrações
npx sequelize-cli db:migrate

# Execute os seeds (dados iniciais)
npx sequelize-cli db:seed:all
```

### 4. Inicie o servidor
```bash
# Desenvolvimento (com nodemon)
npm run dev

# Produção
npm start
```

O servidor estará rodando em: `http://localhost:3001`

## 🗄️ Configuração do Banco de Dados

### DBeaver - Cliente Recomendado

1. **Baixe e instale o DBeaver**: [https://dbeaver.io/download/](https://dbeaver.io/download/)

2. **Configure a conexão**:
   - Tipo: MariaDB ou MySQL
   - Host: localhost
   - Porta: 3306
   - Database: api_rest_db
   - Usuário: seu_usuario
   - Senha: sua_senha

3. **Estrutura das Tabelas**:

#### Tabela `users`
```sql
- id (INT, AUTO_INCREMENT, PRIMARY KEY)
- nome (VARCHAR(255))
- email (VARCHAR(255), UNIQUE)
- password_hash (VARCHAR(255))
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### Tabela `alunos`
```sql
- id (INT, AUTO_INCREMENT, PRIMARY KEY)
- nome (VARCHAR(255))
- sobrenome (VARCHAR(255))
- email (VARCHAR(255), UNIQUE)
- idade (INT)
- peso (DECIMAL)
- altura (DECIMAL)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### Tabela `fotos`
```sql
- id (INT, AUTO_INCREMENT, PRIMARY KEY)
- originalname (VARCHAR(255))
- filename (VARCHAR(255))
- aluno_id (INT, FOREIGN KEY)
- url (VARCHAR(255))
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## 🔐 Autenticação JWT

### Como funciona

1. **Login**: O usuário envia email e senha para `/tokens`
2. **Token**: A API retorna um JWT válido por 7 dias
3. **Autorização**: O token deve ser enviado no header `Authorization: Bearer <token>`
4. **Middleware**: Rotas protegidas verificam automaticamente o token

### Exemplo de uso do token

```javascript
// Header da requisição
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Middleware de Segurança

O arquivo `src/middlewares/loginRequired.js` protege rotas sensíveis:

- ✅ Verifica se o token foi fornecido
- ✅ Valida a assinatura do token
- ✅ Verifica se o usuário ainda existe no banco
- ✅ Adiciona `userId` e `userEmail` à requisição

## 🛣️ Rotas da API

### 🏠 Home
```
GET /
```
**Descrição**: Rota de teste/boas-vindas
**Autenticação**: ❌ Não requerida

---

### 🔑 Autenticação

#### Fazer Login
```
POST /tokens
```
**Descrição**: Gera um token JWT para autenticação
**Autenticação**: ❌ Não requerida

**Body (JSON):**
```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Token gerado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Resposta de Erro (401):**
```json
{
  "errors": ["Usuário não encontrado."]
}
```

---

### 👥 Usuários

#### Listar Todos os Usuários
```
GET /users
```
**Descrição**: Lista todos os usuários cadastrados
**Autenticação**: ✅ **Token JWT obrigatório**

**Headers:**
```
Authorization: Bearer <seu_token_jwt>
```

**Resposta (200):**
```json
[
  {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@exemplo.com"
  }
]
```

#### Criar Usuário
```
POST /users
```
**Descrição**: Cadastra um novo usuário
**Autenticação**: ❌ Não requerida

**Body (JSON):**
```json
{
  "nome": "Maria Santos",
  "email": "maria@exemplo.com",
  "password": "senha123"
}
```

**Resposta (200):**
```json
{
  "id": 2,
  "nome": "Maria Santos",
  "email": "maria@exemplo.com"
}
```

#### Buscar Usuário por ID
```
GET /users/:id
```
**Descrição**: Exibe um usuário específico
**Autenticação**: ❌ Não requerida

**Parâmetros:**
- `id`: ID do usuário

#### Atualizar Usuário
```
PUT /users
```
**Descrição**: Atualiza os dados do usuário logado
**Autenticação**: ✅ **Token JWT obrigatório**

**Body (JSON):**
```json
{
  "nome": "Novo Nome",
  "email": "novo@email.com",
  "password": "nova_senha"
}
```

#### Deletar Usuário
```
DELETE /users
```
**Descrição**: Remove o usuário logado
**Autenticação**: ✅ **Token JWT obrigatório**

---

### 🎓 Alunos

#### Listar Todos os Alunos
```
GET /alunos
```
**Descrição**: Lista todos os alunos com suas fotos
**Autenticação**: ❌ Não requerida

**Resposta (200):**
```json
[
  {
    "id": 1,
    "nome": "Ana",
    "sobrenome": "Costa",
    "email": "ana@escola.com",
    "idade": 20,
    "peso": 65.5,
    "altura": 1.70,
    "foto": {
      "id": 1,
      "originalname": "ana_foto.jpg",
      "filename": "1752032559240_ana_foto.jpg",
      "aluno_id": 1,
      "url": "http://localhost:3001/images/1752032559240_ana_foto.jpg"
    }
  }
]
```

#### Criar Aluno
```
POST /alunos
```
**Descrição**: Cadastra um novo aluno
**Autenticação**: ✅ **Token JWT obrigatório**

**Body (JSON):**
```json
{
  "nome": "Pedro",
  "sobrenome": "Oliveira",
  "email": "pedro@escola.com",
  "idade": 22,
  "peso": 75.0,
  "altura": 1.80
}
```

#### Buscar Aluno por ID
```
GET /alunos/:id
```
**Descrição**: Exibe um aluno específico com sua foto
**Autenticação**: ❌ Não requerida

#### Atualizar Aluno
```
PUT /alunos/:id
```
**Descrição**: Atualiza os dados de um aluno
**Autenticação**: ✅ **Token JWT obrigatório**

#### Deletar Aluno
```
DELETE /alunos/:id
```
**Descrição**: Remove um aluno do sistema
**Autenticação**: ✅ **Token JWT obrigatório**

---

### 📸 Fotos

#### Upload de Foto do Aluno
```
POST /fotos/:id
```
**Descrição**: Faz upload da foto de um aluno
**Autenticação**: ✅ **Token JWT obrigatório**

**Parâmetros:**
- `id`: ID do aluno

**Body (form-data):**
- `foto`: Arquivo de imagem (campo obrigatório)

**Tipos aceitos**: JPG, JPEG, PNG
**Tamanho máximo**: 2MB

**Resposta (200):**
```json
{
  "message": ["Foto enviada com sucesso!"],
  "executado_por": {
    "idUser": 1,
    "nome": "João Silva"
  },
  "foto_de": {
    "idAluno": 1,
    "nome": "Ana",
    "sobrenome": "Costa"
  },
  "foto": {
    "id": 1,
    "originalname": "ana_foto.jpg",
    "filename": "1752032559240_ana_foto.jpg",
    "aluno_id": 1,
    "url": "http://localhost:3001/images/1752032559240_ana_foto.jpg"
  }
}
```

**Limitações:**
- Cada aluno pode ter apenas uma foto
- O aluno deve existir no sistema

---

## 🧪 Testando a API

### Postman - Ferramenta Recomendada

1. **Baixe o Postman**: [https://www.postman.com/downloads/](https://www.postman.com/downloads/)

2. **Importe a Collection**: Crie uma nova collection com as rotas

### Fluxo de Teste Completo

#### 1. Criar um usuário
```http
POST http://localhost:3001/users
Content-Type: application/json

{
  "nome": "Teste Usuario",
  "email": "teste@exemplo.com",
  "password": "123456"
}
```

#### 2. Fazer login e obter token
```http
POST http://localhost:3001/tokens
Content-Type: application/json

{
  "email": "teste@exemplo.com",
  "password": "123456"
}
```

#### 3. Criar um aluno (com token)
```http
POST http://localhost:3001/alunos
Authorization: Bearer <seu_token_aqui>
Content-Type: application/json

{
  "nome": "João",
  "sobrenome": "Silva",
  "email": "joao@escola.com",
  "idade": 25,
  "peso": 80.5,
  "altura": 1.85
}
```

#### 4. Upload de foto (com token)
```http
POST http://localhost:3001/fotos/1
Authorization: Bearer <seu_token_aqui>
Content-Type: multipart/form-data

[Selecione um arquivo de imagem no campo 'foto']
```

#### 5. Listar alunos
```http
GET http://localhost:3001/alunos
```

### Exemplos de Resposta de Erro

#### Token inválido (401):
```json
{
  "errors": ["Token de autorização expirado ou inválido."]
}
```

#### Dados inválidos (500):
```json
{
  "error": ["erro interno do servidor"],
  "code_errors": ["O nome deve ter entre 3 e 255 caracteres"]
}
```

#### Aluno não encontrado (404):
```json
{
  "error": ["Aluno não encontrado"]
}
```

---

## 📁 Estrutura do Projeto

```
API-REST/
├── 📄 app.js                 # Configuração principal da aplicação
├── 📄 server.js              # Inicialização do servidor
├── 📄 package.json           # Dependências e scripts
├── 📄 nodemon.json           # Configuração do nodemon
├── 📄 .env                   # Variáveis de ambiente (criar)
├── 📄 README.md              # Documentação
│
├── 📁 src/
│   ├── 📁 config/
│   │   ├── 📄 appConfig.js       # Configurações gerais
│   │   ├── 📄 database.js        # Configuração do banco
│   │   └── 📄 multerConfig.js    # Configuração de upload
│   │
│   ├── 📁 controllers/
│   │   ├── 📄 AlunoController.js     # CRUD de alunos
│   │   ├── 📄 FotoController.js      # Upload de fotos
│   │   ├── 📄 HomeController.js      # Rota inicial
│   │   ├── 📄 TokenController.js     # Autenticação JWT
│   │   └── 📄 UserController.js      # CRUD de usuários
│   │
│   ├── 📁 database/
│   │   ├── 📄 index.js              # Inicialização do banco
│   │   ├── 📁 migrations/           # Estrutura das tabelas
│   │   └── 📁 seeds/                # Dados iniciais
│   │
│   ├── 📁 middlewares/
│   │   └── 📄 loginRequired.js      # Verificação de token
│   │
│   ├── 📁 models/
│   │   ├── 📄 Aluno.js              # Modelo do aluno
│   │   ├── 📄 Foto.js               # Modelo da foto
│   │   └── 📄 User.js               # Modelo do usuário
│   │
│   ├── 📁 routes/
│   │   ├── 📄 alunoRoutes.js        # Rotas dos alunos
│   │   ├── 📄 fotoRoutes.js         # Rotas das fotos
│   │   ├── 📄 homeRoutes.js         # Rota inicial
│   │   ├── 📄 tokenRoutes.js        # Rota de login
│   │   └── 📄 userRoutes.js         # Rotas dos usuários
│   │
│   └── 📁 services/
│       ├── 📄 MonitorDbTable.js     # Monitoramento de tabelas
│       └── 📄 Watcher.js            # Monitoramento de arquivos
│
└── 📁 uploads/
    └── 📁 images/                   # Fotos dos alunos
```

---

## 🔧 Scripts Disponíveis

```bash
# Iniciar em modo desenvolvimento
npm run dev

# Executar migrações
npx sequelize-cli db:migrate

# Reverter última migração
npx sequelize-cli db:migrate:undo

# Executar seeds
npx sequelize-cli db:seed:all

# Reverter seeds
npx sequelize-cli db:seed:undo:all

# Verificar código com ESLint
npx eslint src/
```

---

## 🛡️ Segurança

### Práticas Implementadas

- 🔐 **Hash de senhas** com bcrypt
- 🎫 **Autenticação JWT** com expiração
- ✅ **Validação de entrada** no Sequelize
- 🚫 **Middleware de autorização** para rotas protegidas
- 📝 **Logs de erro** controlados
- 🔒 **Variáveis de ambiente** para dados sensíveis

### Recomendações

- Use senhas fortes para `TOKEN_SECRET`
- Configure HTTPS em produção
- Implemente rate limiting
- Use CORS adequadamente
- Monitore logs de segurança

---

## 🚀 Deploy

### Preparação para Produção

1. **Configurar variáveis de ambiente**
2. **Usar banco de dados remoto**
3. **Configurar HTTPS**
4. **Implementar PM2 ou similar**
5. **Configurar proxy reverso (Nginx)**

### Exemplo de deploy com PM2

```bash
# Instalar PM2
npm install -g pm2

# Iniciar aplicação
pm2 start server.js --name "api-rest"

# Monitorar
pm2 monit

# Salvar configuração
pm2 save
pm2 startup
```

---

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença ISC. Veja o arquivo `package.json` para mais detalhes.

---

## 🆘 Troubleshooting

### Problemas Comuns

#### Erro de conexão com banco
```bash
# Verificar se o MariaDB está rodando
sudo systemctl status mariadb

# Verificar credenciais no .env
cat .env
```

#### Token JWT inválido
- Verificar se o token não expirou
- Confirmar se `TOKEN_SECRET` está correto
- Verificar formato do header: `Bearer <token>`

#### Upload de arquivo falha
- Verificar permissões da pasta `uploads/`
- Confirmar tamanho do arquivo (max 2MB)
- Verificar formato (JPG, JPEG, PNG)

#### Porta já em uso
```bash
# Verificar processos na porta 3001
lsof -i :3001

# Matar processo
kill -9 <PID>
```

---

## 📞 Suporte

Para dúvidas ou problemas:

1. Verifique este README
2. Consulte os logs do servidor
3. Teste com Postman
4. Verifique o banco com DBeaver
5. Abra uma issue no repositório

---

**Developed with ❤️ using Node.js + Express**
