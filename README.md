# Financy

Aplicação de controle financeiro pessoal desenvolvida como desafio prático final do programa **Pós Tech Developer 360** da Rocketseat.

Permite cadastrar receitas e despesas, organizá-las por categorias e acompanhar saldo, entradas e saídas do mês em um dashboard. Cada usuário acessa exclusivamente os próprios dados.

## Funcionalidades

- Cadastro e login com autenticação JWT
- "Lembrar-me" para manter a sessão entre visitas
- Dashboard com saldo total, receitas e despesas do mês, transações recentes e resumo por categoria
- Categorias com ícone e cor, contagem de uso e proteção contra exclusão indevida
- Transações com busca, filtros de tipo, categoria e período, e paginação
- Edição do nome no perfil

## Stack

**Backend** — Node.js, TypeScript, Express, Apollo Server, GraphQL (code-first com TypeGraphQL), Prisma, SQLite, JWT, bcryptjs, CORS

**Frontend** — React, TypeScript, Vite, Apollo Client, React Router, TailwindCSS, React Hook Form, Zod, Lucide, Radix primitives

## Pré-requisitos

- **Node.js 22 ou superior** — o Prisma 7 exige `^20.19 || ^22.12 || >=24`, e o Vite exige `^20.19 || >=22.12`
- **npm**

O arquivo `.nvmrc` na raiz fixa a versão. Com [nvm](https://github.com/nvm-sh/nvm) instalado:

```bash
nvm use
```

## Estrutura

```
financy/
├── backend/    API GraphQL
└── frontend/   Aplicação React
```

Os dois são aplicações independentes, cada uma com seu `package.json`. Rode cada uma em seu próprio terminal.

## Instalação e execução

### Backend

```bash
cd backend
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev
```

A API sobe em **http://localhost:3333/graphql**.

O `npm install` já gera o Prisma Client automaticamente (script `postinstall`). O `prisma migrate dev` cria o arquivo `dev.db` do SQLite e aplica as migrations.

Preencha o `JWT_SECRET` no `.env` antes de subir a aplicação. Para gerar um valor:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

#### Variáveis de ambiente do backend

| Variável | Obrigatória | Descrição |
|---|---|---|
| `JWT_SECRET` | sim | Chave de assinatura dos tokens |
| `DATABASE_URL` | sim | Caminho do banco SQLite. Padrão: `file:./dev.db` |
| `PORT` | não | Porta da API. Padrão: `3333` |
| `FRONTEND_URL` | não | Origem liberada no CORS. Padrão: `http://localhost:5173` |

### Frontend

Em outro terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

A aplicação sobe em **http://localhost:5173**.

#### Variáveis de ambiente do frontend

| Variável | Obrigatória | Descrição |
|---|---|---|
| `VITE_BACKEND_URL` | sim | Endereço da API GraphQL. Padrão: `http://localhost:3333/graphql` |

> Variáveis `VITE_` são embutidas no código durante o build. Se alterar o
> `.env` depois de gerar o build de produção, rode `npm run build` de novo.

## Scripts

### Backend

| Comando | O que faz |
|---|---|
| `npm run dev` | Sobe a API com recarregamento automático |
| `npm start` | Sobe a API |
| `npm run typecheck` | Verificação de tipos |
| `npm run db:migrate` | Cria e aplica migrations |
| `npm run db:generate` | Regenera o Prisma Client |
| `npm run db:studio` | Abre o Prisma Studio |

### Frontend

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Verificação de tipos e build de produção |
| `npm run preview` | Serve o build de produção |
| `npm run lint` | Análise estática |

## Como usar

1. Acesse http://localhost:5173 e clique em **Criar conta**
2. Faça login
3. Em **Categorias**, crie ao menos uma categoria escolhendo ícone e cor
4. Em **Transações**, cadastre receitas e despesas
5. O **Dashboard** consolida saldo, movimentação do mês e as transações mais recentes

## Decisões de implementação

**Datas sem fuso horário.** A data da transação é um valor de calendário, não um instante. É armazenada como texto `AAAA-MM-DD` e formatada por manipulação de string, nunca convertida para `Date`. Isso evita que uma transação de 30/11 apareça como 29/11 dependendo do fuso.

**Dinheiro em centavos inteiros.** Valores trafegam e são armazenados como inteiros (`R$ 89,50` → `8950`), eliminando erros de ponto flutuante. A conversão para reais acontece apenas na exibição.

**Posse verificada no servidor.** Toda consulta e alteração é filtrada pelo usuário do token. O identificador do usuário nunca vem do cliente. Ao vincular uma transação a uma categoria, o servidor confirma que a categoria pertence a quem está autenticado.

**Histórico financeiro preservado.** Categorias com transações não podem ser excluídas — a regra é aplicada no serviço e reforçada por uma restrição de chave estrangeira no banco.

## Melhorias além do escopo obrigatório

Estas funcionalidades vivem na branch `feature/melhorias`. A branch `main`
contém exatamente o escopo pedido pela Rocketseat.

- **Busca sem acentos** — procurar por `salario` encontra `Salário`. Uma
  cópia normalizada da descrição é mantida no banco, já que o `LIKE` do
  SQLite só ignora maiúsculas em caracteres ASCII.
- **Confirmação ao excluir** — transações e categorias pedem confirmação,
  mostrando o item que será removido (ícone, descrição, categoria e valor).
- **Foto de perfil** — a imagem é recortada e reduzida a 256px no próprio
  navegador antes do envio, então nenhum servidor de arquivos é necessário.
  O servidor valida formato e tamanho.

## Licença

Projeto desenvolvido para fins educacionais.
