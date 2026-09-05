# CLAUDE.md — Financy

## 1. Purpose

This repository contains the **Financy** final practical challenge for the Rocketseat Pós Tech Developer 360 program.

Financy is a full-stack personal finance management application with:

- user registration and login;
- user-owned categories;
- user-owned transactions;
- dashboard summaries;
- transaction filtering and pagination;
- profile editing;
- a React frontend matching the provided Figma as closely as reasonably possible.

The primary goal is to deliver the **mandatory Rocketseat scope correctly, completely, and on time**.

Do not expand the project beyond the mandatory scope before the submission version is complete.

---

## 2. Source of truth and priority

When requirements appear to conflict, use this priority order:

1. **Rocketseat mandatory challenge requirements**
2. **Architecture and implementation decisions in this `CLAUDE.md`**
3. **Provided Financy Figma screenshots and Style Guide**
4. **Rocketseat MindShare project as a conceptual/reference implementation only**

Do not copy MindShare blindly. Use it only to understand patterns taught in the course.

Do not invent product requirements that are not supported by one of the sources above.

---

## 3. Mandatory Rocketseat requirements

### Backend

The backend must:

- allow users to create an account;
- allow users to log in;
- allow each user to access and manage **only their own** categories and transactions;
- create, list, update, and delete transactions;
- create, list, update, and delete categories;
- use CORS;
- include a `.env.example`.

Mandatory technologies:

- TypeScript
- GraphQL
- Prisma
- SQLite

Required backend environment variables:

```env
JWT_SECRET=
DATABASE_URL=
```

If another environment variable is introduced, it must also be added to `.env.example`.

### Frontend

The frontend must:

- use React;
- use TypeScript;
- use Vite without a framework;
- communicate with the API using GraphQL;
- match the provided Figma as closely as reasonably possible;
- include a `.env.example`.

Required frontend environment variable:

```env
VITE_BACKEND_URL=
```

### Repository structure

The public GitHub repository must contain:

```text
financy/
├── backend/
└── frontend/
```

`backend` must contain the complete backend solution.

`frontend` must contain the complete frontend solution.

Optional features must not compromise or replace the mandatory submission scope.

---

# 4. Development principles

## 4.1 Keep the architecture proportional to the challenge

Prefer simple, understandable, maintainable code.

Do **not** introduce:

- Clean Architecture layers for their own sake;
- repository abstractions over Prisma unless a concrete need appears;
- microservices;
- Turborepo;
- Nx;
- npm workspaces;
- Docker as a prerequisite;
- Redis;
- event buses;
- unnecessary state-management libraries;
- unnecessary generic abstractions.

The intended backend flow is:

```text
GraphQL request
      ↓
Resolver
      ↓
Service
      ↓
Prisma
      ↓
SQLite
```

The intended frontend flow is:

```text
React page/component
      ↓
Apollo Client
      ↓
GraphQL API
      ↓
Backend services
      ↓
Prisma / SQLite
```

---

## 4.2 Work incrementally

Do not implement the entire project at once.

Before each sprint:

1. inspect the current repository;
2. read this file;
3. identify the current sprint;
4. briefly state what will be implemented;
5. identify the main files/modules expected to change.

During a sprint:

- implement only the current sprint scope;
- do not start future sprint work unless required as a minimal dependency;
- keep changes coherent and reviewable;
- fix TypeScript/build errors before declaring the sprint complete.

At the end of every sprint, stop and provide a sprint report.

Do **not** automatically start the next sprint.

Wait for Daisy's approval.

---

# 5. Sprint workflow and project completion percentage

The completion percentage refers only to the **mandatory submission scope defined in this document**.

Optional features must not increase or decrease the mandatory project completion percentage.

Use the following fixed weights.

| Sprint | Scope | Weight | Cumulative |
|---|---|---:|---:|
| 0 | Foundation and project setup | 5% | 5% |
| 1 | Prisma, SQLite and data model | 10% | 15% |
| 2 | Authentication and ownership security | 15% | 30% |
| 3 | Categories backend CRUD | 10% | 40% |
| 4 | Transactions backend CRUD, filters and pagination | 15% | 55% |
| 5 | Dashboard API and profile backend | 5% | 60% |
| 6 | Frontend design system and authentication | 10% | 70% |
| 7 | Dashboard and categories frontend | 10% | 80% |
| 8 | Transactions, dialogs and profile frontend | 15% | 95% |
| 9 | QA, Figma polish, README and submission readiness | 5% | 100% |

If a sprint is partially complete, estimate only the completion of that sprint and apply it to its fixed weight.

Example:

```text
Previous completed sprints: 40%
Current sprint weight: 15%
Current sprint estimated completion: 50%

Overall mandatory completion:
40% + 7.5% = 47.5%
```

Do not report a vague or impressionistic percentage.

---

## 5.1 Required sprint report

At the end of every sprint report:

1. **Sprint completed**
2. **What was implemented**
3. **Main files/modules created or changed**
4. **Checks performed**
5. **Known issues or technical debt**
6. **What remains for the next sprint**
7. **Current sprint completion**
8. **Overall mandatory project completion percentage**
9. **Whether the sprint Definition of Done was fully met**

Then stop and wait for approval.

---

# 6. Delivery priority

When time is limited, use this priority order:

1. Mandatory Rocketseat functionality
2. User ownership and security
3. Successful local execution
4. Correct GraphQL integration
5. Correct persistence with Prisma/SQLite
6. Figma fidelity
7. Code cleanup/refactoring
8. Optional improvements

Never postpone a mandatory feature to implement an optional enhancement.

---

# 7. Package manager and repository setup

Use **npm**.

Do not introduce pnpm, Yarn, Bun, workspaces, Turborepo, or Nx.

The backend and frontend are independent applications:

```text
backend/
├── package.json
└── package-lock.json

frontend/
├── package.json
└── package-lock.json
```

Typical usage must remain simple:

```bash
cd backend
npm install
npm run dev
```

and:

```bash
cd frontend
npm install
npm run dev
```

---

# 8. Backend architecture

Use:

- Node.js
- TypeScript
- Express
- Apollo Server
- GraphQL
- TypeGraphQL
- Prisma
- SQLite
- JWT
- bcryptjs
- CORS

Use the current stable package versions compatible with each other.

Do not add libraries unless they solve a concrete requirement.

A reasonable backend structure is:

```text
backend/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── src/
│   ├── auth/
│   │   ├── jwt.ts
│   │   └── require-user.ts
│   │
│   ├── errors/
│   │
│   ├── graphql/
│   │   ├── context.ts
│   │   ├── enums.ts
│   │   ├── inputs/
│   │   ├── models/
│   │   └── resolvers/
│   │
│   ├── lib/
│   │   └── prisma.ts
│   │
│   ├── services/
│   │   ├── auth-service.ts
│   │   ├── user-service.ts
│   │   ├── category-service.ts
│   │   ├── transaction-service.ts
│   │   └── dashboard-service.ts
│   │
│   ├── env.ts
│   └── index.ts
│
├── .env.example
├── package.json
└── tsconfig.json
```

Do not create empty folders preemptively. Create a folder when code actually belongs there.

---

# 9. Backend responsibility boundaries

## Resolver

Resolvers should:

- receive GraphQL arguments;
- access the authenticated GraphQL context;
- call services;
- translate expected service errors into useful GraphQL errors when necessary.

Resolvers should not contain large Prisma queries or business rules.

## Service

Services should:

- implement business rules;
- enforce resource ownership;
- validate relationships such as `categoryId`;
- execute Prisma queries;
- return application/domain data.

## Prisma

Prisma is the persistence layer.

Do not add a Repository Pattern around Prisma unless a concrete requirement makes it necessary.

---

# 10. GraphQL approach

Use **code-first GraphQL with TypeGraphQL**.

Use:

- `@ObjectType()`
- `@InputType()`
- `@Resolver()`
- `@Query()`
- `@Mutation()`
- GraphQL enums where appropriate.

Do not maintain a large handwritten schema and a duplicate TypeGraphQL schema.

The generated GraphQL schema is the API contract.

---

# 11. Database model

Use SQLite through Prisma.

The mandatory application domain contains:

- `User`
- `Category`
- `Transaction`

---

## 11.1 User

Conceptual model:

```text
User
├── id
├── name
├── email
├── passwordHash
├── createdAt
├── updatedAt
├── categories[]
└── transactions[]
```

Rules:

- `email` must be unique;
- normalize email consistently before login/registration;
- never store plain-text passwords;
- never expose `passwordHash` through GraphQL;
- profile editing allows changing the user's name;
- the email cannot be changed from the profile screen.

---

## 11.2 Category

Conceptual model:

```text
Category
├── id
├── title
├── description?
├── icon
├── color
├── userId
├── createdAt
├── updatedAt
└── transactions[]
```

### Category color

Store the semantic color key, not a raw hex color.

Allowed UI color keys:

```text
green
blue
purple
pink
red
orange
yellow
```

Example:

```text
color = "blue"
```

Do not store:

```text
color = "#2563EB"
```

The frontend design system is responsible for mapping `blue` to its dark/base/light tokens.

### Category icon

Store a Lucide icon identifier/name, not SVG markup.

The frontend must only allow selection from the icon set exposed in the category dialog.

Do not store raw SVG in the database.

---

## 11.3 Transaction

Conceptual model:

```text
Transaction
├── id
├── description
├── type
├── amountInCents
├── date
├── categoryId
├── userId
├── createdAt
└── updatedAt
```

### Transaction type

Use one internal domain concept:

```text
INCOME
EXPENSE
```

The UI uses different Portuguese labels in different contexts:

```text
INCOME
├── transaction dialog → Receita
└── transaction table  → Entrada

EXPENSE
├── transaction dialog → Despesa
└── transaction table  → Saída
```

Do not create separate concepts for Receita/Entrada or Despesa/Saída.

### Money

Store money as integer cents:

```text
R$ 89,50 → 8950
R$ 2.500,00 → 250000
```

Use:

```text
amountInCents: Int
```

Do not store monetary values as JavaScript floating-point amounts.

The frontend converts cents to BRL for display.

---

# 12. Transaction dates — important rule

Transaction dates are **date-only values**, not timestamps.

Store the transaction date as an ISO string:

```text
YYYY-MM-DD
```

Examples:

```text
2025-11-30
2026-01-07
2026-09-05
```

Do not store the transaction date as a timezone-sensitive JavaScript `Date`.

Do not convert transaction dates to `Date` objects unless strictly necessary.

Do not apply timezone conversion to transaction dates.

In Prisma, the transaction date should remain a string field.

`createdAt` and `updatedAt` remain normal DateTime timestamps because they represent actual instants.

Conceptually:

```text
date      → "2025-11-30"       date-only business value
createdAt → DateTime            creation instant
updatedAt → DateTime            update instant
```

Validate incoming transaction dates so invalid strings are rejected.

A valid input must represent a real calendar date in `YYYY-MM-DD` format.

### Frontend display

Display transaction dates in Brazilian format, for example:

```text
2025-11-30 → 30/11/25
```

Prefer formatting by splitting the ISO date string.

Avoid:

```ts
new Date("2025-11-30")
```

for normal transaction-date formatting.

---

# 13. Authentication

Use JWT and bcryptjs.

## Registration

Registration must:

1. validate name, email, and password;
2. require a valid email;
3. require a password of at least 8 characters;
4. reject duplicate email;
5. hash the password with bcrypt;
6. create the user.

The Figma registration screen contains:

- full name;
- email;
- password;
- password helper saying the password must have at least 8 characters.

After successful registration, keep the implementation simple: navigate the user to the login flow rather than adding additional onboarding.

## Login

Login must:

1. accept email and password;
2. validate credentials;
3. return an authentication payload containing at least the JWT and user information.

The frontend sends authenticated requests through:

```http
Authorization: Bearer <token>
```

The GraphQL context extracts the authenticated user id.

## Remember me

The login screen contains `Lembrar-me`.

Implement it as:

```text
checked   → token stored in localStorage
unchecked → token stored in sessionStorage
```

Do not add refresh tokens for the mandatory version.

## Logout

Logout is client-side:

- clear the token from storage;
- clear/reset Apollo authenticated cache where appropriate;
- clear current-user state;
- navigate to `/`.

A backend logout mutation is not required for stateless JWT authentication.

---

# 14. Authorization and ownership — critical requirement

Every category and transaction belongs to exactly one user.

This rule must be enforced on the **backend**, never only by hiding data in the frontend.

A protected list operation must always filter by the authenticated user.

Conceptually:

```ts
where: {
  userId: authenticatedUserId
}
```

For read/update/delete by id, the backend must verify both:

```text
resource.id = requestedId
AND
resource.userId = authenticatedUserId
```

A user must never be able to:

- list another user's categories;
- list another user's transactions;
- edit another user's category;
- delete another user's category;
- edit another user's transaction;
- delete another user's transaction;
- create a transaction using another user's category.

When creating or updating a transaction with a `categoryId`, verify that the category belongs to the authenticated user.

Never trust `userId` received from the frontend.

The frontend must **not** send `userId` for category or transaction ownership.

The backend derives it from the JWT context.

---

# 15. Category deletion rule

Deleting a category must not silently delete financial history.

Rule:

```text
Category with zero transactions
→ may be deleted

Category with one or more transactions
→ deletion must be rejected
```

Return a clear business error such as:

```text
Esta categoria possui transações e não pode ser excluída.
```

Do not cascade-delete transactions when deleting a category.

Configure the database relation accordingly.

---

# 16. GraphQL API — expected operations

Exact TypeGraphQL class names may vary slightly, but the API must cover the following behavior.

---

## 16.1 Auth and user

Protected query:

```graphql
query Me {
  me {
    id
    name
    email
  }
}
```

Public mutations:

```graphql
mutation Register(...)
mutation Login(...)
```

Protected mutation:

```graphql
mutation UpdateProfile(...)
```

`UpdateProfile` changes the name only.

Do not implement email editing.

---

## 16.2 Categories

Protected query:

```graphql
query Categories {
  categories {
    ...
  }
}
```

Protected mutations:

```graphql
mutation CreateCategory(...)
mutation UpdateCategory(...)
mutation DeleteCategory(...)
```

Category results should provide enough information for the Figma screens, including:

- id;
- title;
- optional description;
- icon;
- color;
- transaction count.

A category statistics query or equivalent backend result should support:

- total categories;
- total transactions;
- most-used category.

Choose the simplest clean GraphQL shape that supports this without duplicating unnecessary queries.

---

## 16.3 Transactions

Protected query must support:

```text
search by description
type filter
category filter
period/month filter
pagination
```

Conceptual arguments:

```ts
{
  search?: string
  type?: INCOME | EXPENSE
  categoryId?: string
  month?: string       // YYYY-MM
  page?: number
  pageSize?: number
}
```

Default:

```text
pageSize = 10
```

Conceptual response:

```ts
{
  items
  total
  page
  pageSize
  totalPages
}
```

Protected mutations:

```graphql
mutation CreateTransaction(...)
mutation UpdateTransaction(...)
mutation DeleteTransaction(...)
```

---

## 16.4 Dashboard

Use a dedicated protected backend query/service for dashboard summaries.

Do not load the user's entire transaction history into React merely to calculate dashboard totals.

The dashboard response must support:

```text
balance
incomeThisMonth
expensesThisMonth
recentTransactions
categorySummaries
```

Rules:

### Total balance

```text
all income - all expenses
```

### Income of the month

```text
transactions in current/selected month
AND type = INCOME
```

### Expenses of the month

```text
transactions in current/selected month
AND type = EXPENSE
```

### Recent transactions

Return the 5 most recent transactions.

### Category summaries

Provide enough data to reproduce the Figma list:

- category information;
- transaction count;
- financial total.

Do not invent an unsupported ranking rule. Use a stable, understandable order unless a later explicit requirement defines another one.

---

# 17. Backend validation

Backend validation is mandatory even when frontend validation exists.

At minimum validate:

### User

```text
name       required
email      required + valid
password   required + minimum 8 characters
```

### Category

```text
title       required
description optional
icon        required
color       required and limited to supported values
```

### Transaction

```text
type          INCOME or EXPENSE
description   required
amountInCents integer > 0
date          valid YYYY-MM-DD date
categoryId    required and owned by logged-in user
```

Return understandable GraphQL errors.

Do not leak internal database errors or password information.

---

# 18. CORS and environment variables

Enable CORS.

Backend `.env.example` should include at least:

```env
JWT_SECRET=
DATABASE_URL="file:./dev.db"
FRONTEND_URL=http://localhost:5173
```

If `FRONTEND_URL` is not used in the final implementation, do not keep it unnecessarily.

Frontend `.env.example`:

```env
VITE_BACKEND_URL=http://localhost:3333/graphql
```

Do not commit actual secrets.

A reasonable local default is:

```text
backend  → http://localhost:3333
frontend → http://localhost:5173
GraphQL  → http://localhost:3333/graphql
```

---

# 19. Frontend stack

Use:

- React
- TypeScript
- Vite
- Apollo Client
- React Router
- TailwindCSS
- React Hook Form
- Zod
- Lucide React
- Radix primitives where useful for accessible Dialog/Select behavior

Do not use React Query.

Apollo Client already owns remote GraphQL state and caching.

Do not use Redux.

Use a small React `AuthContext` or equivalent simple state for authentication/session behavior.

Do not use Shadcn as the visual design system.

The Figma already provides the application's design system.

Radix primitives may be used underneath custom-styled components such as:

- Dialog
- Select

The visual result must remain Financy, not Shadcn defaults.

---

# 20. Frontend structure

A reasonable structure is:

```text
frontend/src/
├── assets/
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── transactions/
│   └── categories/
│
├── contexts/
│   └── auth-context.tsx
│
├── graphql/
│   ├── fragments/
│   ├── mutations/
│   └── queries/
│
├── lib/
│   ├── apollo.ts
│   ├── currency.ts
│   └── date.ts
│
├── pages/
│   ├── login/
│   ├── register/
│   ├── dashboard/
│   ├── transactions/
│   ├── categories/
│   └── profile/
│
├── styles/
│   └── globals.css
│
└── App.tsx
```

Do not create generic `helpers`, `services`, or `hooks` folders unless code actually requires them.

---

# 21. Routes

The challenge explicitly requires special behavior on `/`.

Use:

```text
/
├── logged out → Login
└── logged in  → Dashboard
```

Additional routes:

```text
/register
/transactions
/categories
/profile
```

Protected:

```text
/
/transactions
/categories
/profile
```

when authenticated.

The profile avatar/button in the header opens `/profile`.

---

# 22. Apollo Client behavior

Configure Apollo Client with the backend URL from:

```env
VITE_BACKEND_URL=
```

Authenticated requests must include the current token.

The token may exist in:

- `localStorage`, or
- `sessionStorage`.

Provide one small utility to obtain the current token consistently.

After mutations, prefer straightforward and predictable cache behavior.

For this challenge, using `refetchQueries` for affected lists/dashboard is acceptable and often preferable to complex manual cache manipulation.

Do not add unnecessary cache complexity under time pressure.

---

# 23. Frontend forms

Use React Hook Form + Zod for form state and client-side validation.

Use backend errors as the final authority.

Required forms:

- Login
- Registration
- Profile name edit
- Create/edit transaction dialog
- Create/edit category dialog

Use one reusable transaction dialog for both create and edit.

Example conceptual API:

```tsx
<TransactionDialog
  mode="create"
/>
```

and:

```tsx
<TransactionDialog
  mode="edit"
  transaction={transaction}
/>
```

Do the same for categories.

Do not duplicate create/edit forms into separate implementations.

---

# 24. Currency formatting

Display currency in Brazilian Real.

Use:

```ts
Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})
```

Convert from integer cents only for display.

Example:

```text
8950 cents → R$ 89,50
250000 cents → R$ 2.500,00
```

Do not use floating-point amounts as the source of truth.

---

# 25. Figma pages

The application contains six main pages.

---

## 25.1 Login

Contains:

- Financy logo;
- title `Fazer login`;
- subtitle `Entre na sua conta para continuar`;
- email field;
- password field;
- `Lembrar-me`;
- `Recuperar senha`;
- primary `Entrar` button;
- separator;
- `Ainda não tem uma conta?`;
- outlined `Criar conta` button.

### Password recovery

The Figma includes `Recuperar senha`, but password recovery is **not** part of the mandatory Rocketseat scope.

For the mandatory branch:

- reproduce the link visually;
- do not build email delivery;
- do not build reset tokens;
- do not add a password-reset backend flow;
- do not create extra reset-password pages.

The link may remain non-functional/disabled for the mandatory version.

---

## 25.2 Registration

Contains:

- Financy logo;
- title `Criar conta`;
- subtitle;
- full name;
- email;
- password;
- password helper with minimum 8 characters;
- primary `Cadastrar` button;
- separator;
- `Já tem uma conta?`;
- outlined `Fazer login` button.

---

## 25.3 Dashboard

Header navigation:

- Dashboard
- Transações
- Categorias
- user initials/avatar

Main cards:

- Saldo total
- Receitas do mês
- Despesas do mês

Sections:

### Transações recentes

- 5 recent transactions;
- description;
- date;
- category tag;
- amount;
- transaction type visual indicator;
- `Ver todas`;
- `Nova transação`.

### Categorias

Each summary shows:

- category tag/name;
- number of items;
- financial total;
- `Gerenciar`.

---

## 25.4 Transactions page

Header and title:

```text
Transações
Gerencie todas as suas transações financeiras
```

Primary action:

```text
+ Nova transação
```

Filters:

- search by description;
- type;
- category;
- period/month.

Table columns:

- Descrição
- Data
- Categoria
- Tipo
- Valor
- Ações

Actions:

- delete
- edit

Pagination:

- 10 items per page by default;
- previous;
- numbered pages;
- next;
- result count.

---

## 25.5 Categories page

Header/title:

```text
Categorias
Organize suas transações por categorias
```

Primary action:

```text
+ Nova categoria
```

Summary cards:

- total categories;
- total transactions;
- most-used category.

Category cards show:

- category icon;
- title;
- optional description;
- category tag;
- transaction/item count;
- edit action;
- delete action.

---

## 25.6 Profile page

Profile card shows:

- user initials avatar;
- full name;
- email;
- editable full name field;
- disabled email field;
- helper text that email cannot be changed;
- `Salvar alterações`;
- `Sair da conta`.

Avatar upload is **not** part of the mandatory version.

Generate initials from the user's name.

Examples:

```text
Conta teste  → CT
Daisy Oliani → DO
```

---

# 26. Figma dialogs

The application has two reusable dialogs.

---

## 26.1 Transaction dialog

Used for both creation and editing.

Contains:

### Type selector

```text
Despesa
Receita
```

Maps internally to:

```text
Despesa → EXPENSE
Receita → INCOME
```

Fields:

- description;
- date;
- amount;
- category.

Primary action:

```text
Salvar
```

The amount input is visually BRL, but send/store integer cents.

---

## 26.2 Category dialog

Used for both creation and editing.

Contains:

- title;
- description;
- description marked as optional;
- icon selector;
- color selector;
- `Salvar`.

Only expose the color choices defined in this document.

Use Lucide icons matching the Figma icon-picker intent.

---

# 27. Financy design system

Implement the design system before building page-specific styling.

Do not scatter raw design values across page files.

Centralize them as CSS variables, Tailwind theme values, or an equivalent single source.

---

## 27.1 Typography

Font family:

```text
Inter
```

Load Inter from Google Fonts or another standard web method.

Do not substitute another font unless the environment makes Inter unavailable.

---

## 27.2 Brand colors

```text
brand-dark  #124B2B
brand-base  #1F6F43
```

---

## 27.3 Grayscale

```text
gray-800  #111827
gray-700  #374151
gray-600  #4B5563
gray-500  #6B7280
gray-400  #9CA3AF
gray-300  #D1D5DB
gray-200  #E5E7EB
gray-100  #F8F9FA
```

Note: the Figma screenshot contains a label typo around `gray-500`; use the token naming above consistently.

---

## 27.4 Neutral

```text
black  #000000
white  #FFFFFF
```

---

## 27.5 Feedback

```text
danger   #EF4444
success  #19AD70
```

---

## 27.6 Auxiliary color families

### Blue

```text
blue-dark   #1D4ED8
blue-base   #2563EB
blue-light  #DBEAFE
```

### Purple

```text
purple-dark   #7E22CE
purple-base   #9333EA
purple-light  #F3E8FF
```

### Pink

```text
pink-dark   #BE185D
pink-base   #DB2777
pink-light  #FCE7F3
```

### Red

```text
red-dark   #B91C1C
red-base   #DC2626
red-light  #FEE2E2
```

### Orange

```text
orange-dark   #C2410C
orange-base   #EA580C
orange-light  #FFEDD5
```

### Yellow

```text
yellow-dark   #A16207
yellow-base   #CA8A04
yellow-light  #FEF3CA
```

### Green

```text
green-dark   #15803D
green-base   #16A34A
green-light  #E0FAE9
```

---

# 28. Icons and logo

Use **Lucide Icons / lucide-react**.

Do not add a second icon library.

The Figma includes:

- the full Financy logo;
- the Financy symbol by itself.

Use provided/exported project assets if available.

If the exact logo asset has not yet been added to the repository, do not invent a different logo. Use a temporary clearly marked asset placeholder only until the correct Financy asset is available.

---

# 29. Reusable UI components

Build reusable components based on the Figma Style Guide.

At minimum:

```text
Input
LabelButton / Button
IconButton
Link
PaginationButton
Tag
TransactionType
Dialog
Select
```

---

## 29.1 Input states

Support:

```text
Empty
Active
Filled
Error
Disabled
Select
```

Inputs may include:

- label;
- icon;
- placeholder/value;
- helper text;
- error state.

---

## 29.2 LabelButton / Button

Support two sizes:

```text
MD
SM
```

Support two visual variants:

```text
Primary / filled
Secondary / outlined
```

Support states:

```text
Default
Hover
Disabled
```

---

## 29.3 IconButton

Support:

```text
Default
Hover
Disabled
```

Destructive icon actions use danger styling consistent with the Figma.

---

## 29.4 Link

Support:

```text
Default
Hover
```

---

## 29.5 PaginationButton

Support:

```text
Default
Hover
Active
Disabled
```

---

## 29.6 Tag

Support semantic category colors using the auxiliary color families.

Prefer:

```text
light background
dark/base readable foreground
```

consistent with the Figma.

---

## 29.7 TransactionType

Render:

```text
Entrada → green/success styling
Saída   → red/danger styling
```

This is presentation only.

The domain type remains:

```text
INCOME
EXPENSE
```

---

# 30. Exact Figma values vs inferred values

Some Figma screenshots do not provide exact numeric values for:

- font sizes;
- line heights;
- button heights;
- input heights;
- spacing;
- gap;
- padding;
- border radius;
- border thickness;
- shadows;
- icon sizes.

Do not claim inferred values are exact Figma tokens.

For values explicitly available in this document, reproduce them exactly.

For values not explicitly available:

- infer them visually;
- keep them internally consistent;
- prefer reusable spacing/radius tokens;
- prioritize overall fidelity over arbitrary pixel perfection.

---

# 31. Responsive behavior

The supplied screenshots primarily define the desktop experience.

Implement a sensible responsive layout without redesigning the product.

Priorities:

1. preserve all mandatory functionality;
2. avoid horizontal overflow where reasonably possible;
3. stack cards/forms on narrow screens;
4. allow tables to use a controlled horizontal scroll if necessary;
5. keep dialogs usable on smaller viewports.

Do not spend mandatory-scope time inventing a separate mobile product design.

---

# 32. Error, loading and empty states

Even if they are not shown in the supplied Figma, the application must not break when data is absent or requests are pending.

Provide simple, non-invasive states for:

- loading;
- GraphQL errors;
- empty transaction list;
- empty category list;
- failed form submission.

Keep these states visually compatible with the design system.

Do not introduce elaborate extra screens.

---

# 33. Optional features — do not implement before mandatory submission is complete

The following are explicitly outside the main mandatory branch unless Daisy later asks for them after 100% mandatory completion:

- avatar image upload;
- password recovery backend;
- password reset email;
- OAuth/social login;
- refresh tokens;
- dark mode;
- PWA;
- charts not present in the Figma;
- notifications;
- Redis/cache infrastructure;
- Docker as a project requirement;
- CI/CD expansion;
- extra financial analytics;
- export/import;
- recurring transactions.

If optional work is later implemented, preserve the original mandatory solution in the appropriate branch as required by Rocketseat.

---

# 34. Definition of Done by sprint

---

## Sprint 0 — Foundation and project setup — 5%

### Scope

Create:

```text
financy/
├── backend/
└── frontend/
```

Backend:

- TypeScript initialized;
- Express/Apollo/TypeGraphQL basic setup;
- CORS enabled;
- GraphQL endpoint running.

Frontend:

- React + TypeScript + Vite initialized;
- basic app running;
- Apollo Client dependency/setup may be scaffolded if needed, but do not build product pages yet.

Environment examples created.

### Definition of Done

- `npm install` succeeds in both apps;
- backend starts locally;
- `/graphql` is reachable;
- frontend starts locally;
- no known TypeScript setup errors;
- required `.env.example` files exist.

---

## Sprint 1 — Prisma, SQLite and data model — 10%

### Scope

Implement Prisma schema for:

- User;
- Category;
- Transaction;
- relations;
- transaction type;
- timestamps;
- ownership fields;
- category delete restriction behavior;
- date-only transaction string;
- integer-cent amount.

Create initial migration.

### Definition of Done

- `prisma generate` succeeds;
- migration succeeds;
- SQLite database is created locally;
- Prisma Client can access all three models;
- schema matches the domain rules in this document.

---

## Sprint 2 — Authentication and ownership security — 15%

### Scope

Implement:

- register;
- login;
- password hashing;
- JWT;
- GraphQL context;
- `me`;
- authentication guard/helper;
- ownership foundations;
- duplicate email handling.

### Definition of Done

Manually verify:

- account can be created;
- duplicate email is rejected;
- valid login returns JWT;
- invalid login is rejected;
- protected query without JWT is rejected;
- `me` returns only the authenticated user;
- password hashes are never exposed.

---

## Sprint 3 — Categories backend CRUD — 10%

### Scope

Implement:

- list categories;
- create category;
- update category;
- delete category;
- category statistics needed by the categories screen;
- ownership enforcement;
- supported color validation;
- category deletion restriction when transactions exist.

### Definition of Done

Manually verify with two users:

- user A cannot see user B categories;
- user A cannot update/delete user B categories;
- category create/update works;
- category with zero transactions can be deleted;
- category with transactions cannot be deleted.

---

## Sprint 4 — Transactions backend CRUD, filters and pagination — 15%

### Scope

Implement:

- list transactions;
- create transaction;
- update transaction;
- delete transaction;
- search by description;
- filter by type;
- filter by category;
- filter by month;
- pagination;
- category ownership validation;
- amount-in-cents validation;
- date-only validation.

### Definition of Done

Manually verify with two users:

- CRUD works for user's own transactions;
- user A cannot access user B transactions;
- user A cannot use user B category;
- search works;
- each filter works;
- combined filters work reasonably;
- pagination reports correct totals;
- default page size is 10;
- date does not shift because of timezone.

---

## Sprint 5 — Dashboard API and profile backend — 5%

### Scope

Implement:

- dashboard query/service;
- total balance;
- income this month;
- expenses this month;
- 5 recent transactions;
- category summaries;
- update profile name.

### Definition of Done

- dashboard values are calculated on the backend;
- values only use authenticated user's data;
- recent transactions are correctly ordered;
- profile name can be updated;
- profile email cannot be updated.

---

## Sprint 6 — Frontend design system and authentication — 10%

### Scope

Implement:

- Inter;
- design tokens;
- brand/grayscale/feedback/auxiliary colors;
- Lucide icons;
- reusable input/button/icon-button/link/tag/type/pagination components;
- Dialog/Select primitives as needed;
- Apollo Client auth header;
- AuthContext;
- Login page;
- Registration page;
- protected routing;
- remember-me local/session storage behavior;
- user initials helper.

### Definition of Done

- login works against real backend;
- registration works against real backend;
- remember-me behavior works;
- refresh keeps expected authenticated state;
- logout foundation works;
- protected routes reject logged-out access;
- auth pages visually follow Figma;
- design tokens are centralized.

---

## Sprint 7 — Dashboard and categories frontend — 10%

### Scope

Implement:

- shared authenticated header/navigation;
- Dashboard page;
- summary cards;
- recent transactions;
- dashboard category summary;
- Categories page;
- category summary cards;
- category cards;
- create/edit category dialog;
- category delete behavior and backend error display.

### Definition of Done

- dashboard uses real GraphQL data;
- categories use real GraphQL data;
- create/update/delete category works;
- deleting a used category gives a clear error;
- no hardcoded demo finance data is used as real application state;
- navigation matches Figma behavior.

---

## Sprint 8 — Transactions, dialogs and profile frontend — 15%

### Scope

Implement:

- Transactions page;
- table;
- search;
- type filter;
- category filter;
- month filter;
- pagination;
- create transaction dialog;
- edit transaction dialog;
- delete transaction;
- Profile page;
- profile name edit;
- logout;
- avatar initials.

### Definition of Done

- all transaction CRUD works end-to-end;
- filters call backend GraphQL filters;
- pagination works with backend pagination;
- amount formatting uses BRL;
- transaction dates render without timezone shift;
- profile name update works;
- email is disabled;
- logout clears auth state and Apollo user data;
- all six Figma pages are implemented.

---

## Sprint 9 — QA, Figma polish, README and submission readiness — 5%

### Scope

Verify the complete mandatory solution.

Polish visual inconsistencies.

Create/update README with:

- project description;
- stack;
- prerequisites;
- installation;
- backend environment setup;
- frontend environment setup;
- Prisma migration instructions;
- how to run backend;
- how to run frontend.

### Required final checks

Backend:

- fresh `npm install`;
- Prisma generation/migration instructions work;
- TypeScript/build check passes;
- application starts;
- GraphQL endpoint works.

Frontend:

- fresh `npm install`;
- TypeScript/build check passes;
- Vite production build succeeds;
- application starts.

Functional manual checklist:

- register;
- login;
- remember me;
- dashboard;
- categories CRUD;
- transactions CRUD;
- transaction search;
- type filter;
- category filter;
- month filter;
- pagination;
- user ownership;
- profile name edit;
- logout.

Repository checklist:

- repository can be public;
- root has `backend` and `frontend`;
- no secrets committed;
- `.env.example` exists in both apps;
- SQLite development artifacts are handled appropriately;
- mandatory scope is present in the main submission branch.

### Definition of Done

The mandatory Rocketseat submission scope is complete and locally reproducible.

Overall mandatory completion = **100%**.

---

# 35. Testing strategy under deadline

The challenge does not require a large automated test suite.

Under time pressure, prioritize:

1. TypeScript correctness;
2. successful builds;
3. Prisma migration correctness;
4. manual GraphQL verification;
5. end-to-end manual verification of mandatory user flows;
6. explicit two-user ownership/security checks.

Do not spend mandatory-scope time building a sophisticated test infrastructure unless Daisy specifically requests it or all mandatory work is already complete.

If lightweight automated tests can be added without delaying the required scope, they are welcome but not required by this plan.

---

# 36. Security checklist

Before declaring the project complete, verify:

- passwords are hashed;
- password hashes never appear in GraphQL responses;
- JWT secret comes from environment;
- protected operations require authentication;
- user ownership is enforced in backend queries/mutations;
- `userId` is never trusted from frontend inputs;
- transaction category ownership is checked;
- category deletion cannot delete transaction history;
- secrets are not committed;
- CORS is configured;
- profile email cannot be modified through the update-profile mutation.

---

# 37. Code quality rules

Prefer:

- descriptive names;
- small components/functions;
- clear service boundaries;
- explicit inputs;
- readable GraphQL operations;
- minimal duplication;
- predictable error handling.

Avoid:

- `any` unless unavoidable and documented;
- huge resolver functions;
- huge page components;
- duplicated create/edit forms;
- raw hex colors repeated throughout components;
- raw localStorage/sessionStorage access scattered across pages;
- `new Date(transaction.date)` for date-only transaction values;
- financial amounts as floats;
- hardcoded authenticated user ids;
- user ownership checks only in frontend.

---

# 38. Behavior when blocked or uncertain

If a requirement cannot be implemented because of missing information:

1. do not invent a major product rule;
2. identify the exact blocker;
3. check this `CLAUDE.md` first;
4. inspect existing code;
5. use the simplest interpretation consistent with Rocketseat and the Figma;
6. if the decision could materially change architecture or scope, stop and ask Daisy.

If a minor visual measurement is missing, infer it consistently and continue.

If a missing decision affects:

- security;
- persistent data shape;
- GraphQL contract;
- deletion semantics;
- mandatory functionality;

stop and ask before making a speculative architectural change.

---

# 39. First-session instruction

When starting development from this repository:

1. read this entire `CLAUDE.md`;
2. inspect the repository;
3. determine which sprint is currently active;
4. do not skip ahead;
5. implement only that sprint;
6. provide the sprint report;
7. wait for Daisy's approval before continuing.

If the repository is empty except for this file, start with:

```text
Sprint 0 — Foundation and project setup
```

---

# 40. Final project definition

The mandatory Financy project is complete when:

```text
User
├── can register
├── can log in
├── can remain logged in according to Remember Me
├── can see only own data
├── can update own profile name
└── can log out

Category
├── create
├── list
├── update
├── delete when unused
├── preserve history when used
├── choose icon
└── choose semantic color

Transaction
├── create
├── list
├── update
├── delete
├── search
├── filter by type
├── filter by category
├── filter by month
└── paginate

Dashboard
├── total balance
├── monthly income
├── monthly expenses
├── recent transactions
└── category summaries

Frontend
├── React + TypeScript + Vite
├── Apollo GraphQL
├── Figma-based design system
├── six required pages
└── two reusable dialogs

Backend
├── TypeScript
├── GraphQL
├── TypeGraphQL
├── Apollo Server
├── Prisma
├── SQLite
├── JWT
├── CORS
└── strict user ownership
```

Do not redefine "100% complete" to include optional features.

**100% means the mandatory Rocketseat submission scope above is complete, correct, reproducible locally, and ready to submit.**
