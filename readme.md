# Campaign Manager

Um sistema de gerenciamento de campanhas construído com TypeScript, Express e Prisma.

## Visão Geral

Este repositório contém o código-fonte da aplicação Campaign Manager. Ele utiliza:
- **TypeScript** para tipagem estática e maior produtividade no desenvolvimento.
- **Express** como framework web.
- **Prisma** como ORM para interações com o banco de dados.
- **Docker Compose** para ajudar a gerenciar o banco de dados de desenvolvimento.
- **Jest** para testes.

Este guia o orientará pelos passos necessários para configurar o projeto para desenvolvimento local.

## Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- [Node.js (v23 ou superior)](https://nodejs.org/)
- [npm](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) (para executar o banco de dados com Docker Compose)

## Instruções de Configuração

### 1. Clone o Repositório

Clone o repositório para sua máquina local:

```bash
git clone https://github.com/kesc23/campaign-manager.git
cd campaign-manager
```

### 2. Instale as Dependências

Usando npm:

```bash
npm install -D
```

ou usando o Yarn:


```bash
yarn install
```

### 3. Configure as Variáveis de Ambiente

Crie um arquivo .env na raiz do projeto. Você pode usar o arquivo .env fornecido como referência.

Ajuste os valores conforme necessário para o seu ambiente.

### 4. Configure o Banco de Dados

Este projeto utiliza o Prisma com um banco de dados PostgreSQL. Você pode usar o Docker Compose para configurar rapidamente um banco de dados de desenvolvimento:

```bash
docker-compose up -d
```

Isso iniciará o container do banco de dados. Verifique se o banco de dados está em execução (geralmente na porta 5432).

### 5. Execute as Migrações do Prisma e Gere o Cliente
Com o banco de dados em execução, aplique as migrações e gere o cliente do Prisma:

```bash
npx prisma generate
npx prisma migrate dev
```

Nota: Se você já possui migrações, ao executar npx prisma migrate dev serão aplicadas as migrações pendentes.

### 6. Inicie o Servidor de Desenvolvimento
Inicie o servidor de desenvolvimento usando 2 terminais:

```bash
npm run dev:compiler # watcher do TypeScript
-----------------------
npm run dev:nodemon # inicia o servidor no modo watch
```

### 7. Executando os Testes
O projeto utiliza o Jest para testes. Para executar os testes, primeiro faça o build do repositório e execute os comandos:

```bash
npm run dev:compile # compilar o código
-----------------------
npm test # realizar o teste
```

### 8. Troubleshoot
caso o banco não queira conectar no Windows, a integração do container com o WSL está melhor.
Para acessar o banco, basta rodar em um ambiente linux como o WSL2