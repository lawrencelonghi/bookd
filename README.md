# Bookd - Plataforma para Amantes de Livros

Aplicação web completa para catalogar, organizar sua jornada literária. Registre livros lidos, acompanhe sua biblioteca pessoal e descubra novos títulos através da integração com a API do Google Books.

## Funcionalidades

- **Autenticação Segura**: Sistema completo de registro e login com JWT e bcrypt
- **Busca de Livros**: Integração com Google Books API para buscar milhares de títulos
- **Biblioteca Pessoal**: Organize seus livros em três categorias:
  - Quero Ler
  - Lendo
  - Lido
- **Gerenciamento de Estante**: Adicione, remova e atualize o status dos seus livros
- **Páginas de Detalhes**: Visualize informações completas sobre cada livro
- **Interface Responsiva**: Design otimizado para desktop e mobile
- **Tema Escuro**: Interface moderna com suporte a tema escuro por padrão

## Stack Tecnológica

### Frontend
- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **HeroUI** - Biblioteca de componentes UI moderna
- **Tailwind CSS** - Framework de estilização utility-first
- **Framer Motion** - Animações fluidas
- **Lucide React** - Ícones

### Backend
- **Next.js API Routes** - Endpoints serverless
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação baseada em tokens
- **bcryptjs** - Hash de senhas

### DevOps
- **Docker & Docker Compose** - Containerização
- **Multi-stage Builds** - Otimização de imagens Docker

## Pré-requisitos

- Docker e Docker Compose instalados
- Node.js 20+ (para desenvolvimento local sem Docker)
- PostgreSQL 16+ (para desenvolvimento local sem Docker)

## Como Começar

### Usando Docker (Recomendado)

#### Produção

1. Clone o repositório:
```bash
git clone https://github.com/seuusuario/bookd.git
cd bookd
```

2. Inicie os serviços:
```bash
docker-compose up
```

A aplicação estará disponível em `http://localhost:3000`

#### Desenvolvimento

Para ambiente de desenvolvimento com hot-reload:

```bash
docker-compose --profile dev up
```

A aplicação de desenvolvimento estará disponível em `http://localhost:3001`

### Desenvolvimento Local (Sem Docker)

1. Clone o repositório:
```bash
git clone https://github.com/seuusuario/bookd.git
cd bookd
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/bookd"
JWT_SECRET="sua-chave-secreta-super-segura"
NODE_ENV="development"
```

4. Execute as migrações do banco de dados:
```bash
npx prisma migrate deploy
npx prisma generate
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## Estrutura do Projeto

```
.
├── app/                          # App Router do Next.js
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Endpoints de autenticação
│   │   │   ├── signin/          # Login
│   │   │   ├── signup/          # Registro
│   │   │   ├── logout/          # Logout
│   │   │   └── me/              # Usuário atual
│   │   ├── books/               # Endpoints de livros
│   │   │   ├── add/             # Adicionar livro
│   │   │   ├── remove/          # Remover livro
│   │   │   ├── update-status/   # Atualizar status
│   │   │   └── user-books/      # Livros do usuário
│   │   └── googleBooks/         # Integração Google Books
│   ├── books/                   # Páginas de livros
│   │   ├── [id]/               # Detalhes do livro
│   │   └── page.tsx            # Lista de livros
│   ├── shelf/                   # Página da estante
│   ├── contexts/                # Context API
│   │   └── AuthContext.tsx     # Contexto de autenticação
│   ├── layout.tsx              # Layout principal
│   └── page.tsx                # Página inicial
├── components/                  # Componentes reutilizáveis
│   ├── books/                  # Componentes de livros
│   │   ├── bookCard.tsx        # Card de livro
│   │   ├── bookList.tsx        # Lista de livros
│   │   └── searchInput.tsx     # Busca de livros
│   ├── navbar.tsx              # Barra de navegação
│   └── primitives.ts           # Componentes base
├── lib/                        # Utilitários e serviços
│   ├── auth.ts                 # Funções de autenticação
│   ├── prisma.ts               # Cliente Prisma
│   └── services/               # Serviços da aplicação
│       └── bookService.ts      # Lógica de negócio de livros
├── prisma/                     # Configuração do banco
│   ├── schema.prisma           # Schema do banco
│   └── migrations/             # Migrações
├── types/                      # Definições TypeScript
│   └── book.ts                 # Tipos relacionados a livros
├── public/                     # Arquivos estáticos
├── Dockerfile                  # Container de produção
├── docker-compose.yml          # Orquestração de containers
└── package.json               # Dependências e scripts
```

## Scripts Disponíveis

### Desenvolvimento
```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Executar migrações do Prisma
npx prisma migrate dev

# Abrir Prisma Studio (visualizador de dados)
npx prisma studio

# Gerar cliente Prisma
npx prisma generate
```

### Produção
```bash
# Build da aplicação
npm run build

# Iniciar aplicação em produção
npm start

# Executar migrações em produção
npx prisma migrate deploy
```

### Docker
```bash
# Iniciar em produção
docker-compose up

# Iniciar em desenvolvimento
docker-compose --profile dev up

# Rebuild de imagens
docker-compose build

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down
```

## Modelo de Dados

### User (Usuário)
- id: Identificador único
- email: Email único
- password: Senha hasheada
- createdAt: Data de criação
- updatedAt: Data de atualização
- books: Relação com UserBook

### Book (Livro)
- id: Identificador único
- googleBooksId: ID do Google Books (único)
- title: Título do livro
- authors: Array de autores
- imageUrl: URL da capa
- publishedDate: Data de publicação
- description: Descrição
- pageCount: Número de páginas
- categories: Array de categorias
- publisher: Editora
- createdAt: Data de criação
- users: Relação com UserBook

### UserBook (Livro do Usuário)
- id: Identificador único
- userId: Referência ao usuário
- bookId: Referência ao livro
- status: Status do livro (WANT_TO_READ, READING, READ)
- createdAt: Data de criação
- updatedAt: Data de atualização

## API Endpoints

### Autenticação
- `POST /api/auth/signup` - Criar conta
- `POST /api/auth/signin` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Obter usuário atual

### Livros
- `POST /api/books/add` - Adicionar livro à estante
- `DELETE /api/books/remove` - Remover livro da estante
- `PATCH /api/books/update-status` - Atualizar status do livro
- `GET /api/books/user-books` - Obter livros do usuário
- `POST /api/books/user-books` - Obter livros por IDs do Google Books

## Configurações de Segurança

### JWT
- Tokens expiram em 7 dias
- Armazenados em cookies HTTP-only
- Secure flag em produção
- SameSite=lax para proteção CSRF

### Senhas
- Hash com bcrypt (10 rounds)
- Validação de comprimento mínimo (6 caracteres)
- Validação de formato de email

## Docker

### Arquitetura Multi-stage

O Dockerfile utiliza três estágios:

1. **deps**: Instala dependências e gera o cliente Prisma
2. **builder**: Constrói a aplicação Next.js
3. **runner**: Imagem final otimizada para produção

### Serviços Docker Compose

- **postgres**: Banco de dados PostgreSQL 16
- **nextjs**: Aplicação Next.js em produção
- **nextjs-dev**: Aplicação Next.js em desenvolvimento (profile: dev)

## Variáveis de Ambiente

### Obrigatórias
```env
DATABASE_URL=postgresql://usuario:senha@host:porta/database
JWT_SECRET=sua-chave-secreta-segura
```

### Opcionais
```env
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

## Integração com Google Books API

A aplicação utiliza a API pública do Google Books para:
- Buscar livros por título, autor ou palavra-chave
- Obter detalhes completos de livros
- Buscar lançamentos recentes
- Filtrar por categorias

Não é necessária chave de API para uso básico.

## Suporte a Navegadores

- Chrome (recomendado)
- Firefox
- Safari
- Edge
- Navegadores mobile (iOS Safari, Chrome Mobile)

## Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## Contato

Para dúvidas ou suporte, entre em contato através do GitHub Issues.

---

Desenvolvido com Next.js 15 e TypeScript
