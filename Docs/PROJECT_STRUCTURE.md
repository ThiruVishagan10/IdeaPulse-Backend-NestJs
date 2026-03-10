# IdeaPulse Backend - Project Structure

## Overview
NestJS-based backend application for managing ideas with versioning, authentication, and AI-powered enhancements.

---

## 📁 Core Architecture

```
project/
├── src/
│   ├── features/          # Internal business logic (no external APIs)
│   ├── infrastructure/    # External API integrations
│   ├── prisma/           # Database service
│   ├── app.module.ts     # Root module
│   └── main.ts           # Application entry point
├── prisma/               # Database schema & migrations
└── test/                 # E2E tests
```

---

## 🎯 FEATURES (Internal Business Logic)

### 1. **Authentication & Authorization** (`src/features/auth/`)
**Purpose**: User registration, login, and OAuth integration

**Components**:
- `auth.controller.ts` - Endpoints for register, login, Google OAuth
- `auth.service.ts` - Business logic for authentication
- `auth.module.ts` - Module configuration

**DTOs**:
- `dto/register.dto.ts` - Registration validation
- `dto/login.dto.ts` - Login validation

**Guards & Strategies**:
- `guard/jwt-auth.guard.ts` - JWT authentication guard
- `strategies/jwt.strategy.ts` - JWT token validation
- `strategies/google.strategy.ts` - Google OAuth strategy

**Endpoints**:
- `POST /auth/register` - User registration (201)
- `POST /auth/login` - User login (200)
- `POST /auth/google/test` - Dev-only Google OAuth test
- `GET /auth/google` - Google OAuth initiation
- `GET /auth/google/callback` - Google OAuth callback

**Security**:
- bcrypt password hashing
- JWT token generation
- Rate limiting via ThrottlerGuard

---

### 2. **Ideas Management** (`src/features/ideas/`)
**Purpose**: CRUD operations for ideas with atomic versioning

**Components**:
- `ideas.controller.ts` - RESTful endpoints for ideas
- `ideas.service.ts` - Business logic with Prisma transactions
- `ideas.module.ts` - Module configuration

**DTOs**:
- `dto/create-idea.dto.ts` - New idea validation
- `dto/create-version.dto.ts` - Version creation validation

**Entities**:
- `entities/idea.entity.ts` - Idea entity definition

**Endpoints**:
- `POST /ideas` - Create new idea with version 1
- `POST /ideas/:id/version` - Add new version (atomic increment)
- `GET /ideas` - List user's ideas (paginated, excludes DELETED)
- `GET /ideas/:id` - Get idea with full version history
- `DELETE /ideas/:id` - Soft delete (status → DELETED)

**Key Features**:
- Atomic version incrementing using Prisma transactions
- Soft delete pattern (status-based)
- Optimized pagination with latest version fetching
- User ownership validation

---

### 3. **Users Management** (`src/features/users/`)
**Purpose**: User data operations

**Components**:
- `users.service.ts` - User CRUD operations
- `users.module.ts` - Module configuration

**Methods**:
- `findUserbyEmail()` - Find user by email (with optional password)
- `createUsers()` - Create new user

---

### 4. **Database Service** (`src/prisma/`)
**Purpose**: Prisma ORM integration

**Components**:
- `prisma.service.ts` - Prisma client singleton
- `prisma.module.ts` - Global Prisma module

**Features**:
- Connection lifecycle management
- Global module export for DI

---

## 🌐 INFRASTRUCTURE (External API Integrations)

### Current Status: **Empty Directory**
**Location**: `src/infrastructure/`

### Planned Integrations:
Based on the schema's `AIResult` model, this directory should contain:

1. **AI Service Integration** (Future)
   - OpenAI/Anthropic API clients
   - Prompt engineering utilities
   - AI result processing
   - Types: SUGGESTION, SUMMARY, ENHANCEMENT, ANALYSIS

2. **Potential Services**:
   - `src/infrastructure/ai/` - AI API integrations
   - `src/infrastructure/email/` - Email service (SendGrid, SES)
   - `src/infrastructure/storage/` - File storage (S3, CloudFlare R2)
   - `src/infrastructure/analytics/` - Analytics tracking

---

## 📊 Database Schema (PostgreSQL + Prisma)

### Models:

**User**
- Authentication & profile data
- One-to-many with Ideas

**Idea**
- Core idea container
- Status: ACTIVE, ARCHIVED, DELETED
- Atomic version tracking
- Soft delete support

**IdeaVersion**
- Immutable version history
- Unique constraint on (ideaId, version)
- Indexed for fast retrieval
- Source tracking: USER or AI
- Supports AI-generated versions

**AIResult** (Prepared for future use)
- Stores AI-generated content
- Links to IdeaVersion
- Types: SUGGESTION, SUMMARY, ENHANCEMENT, ANALYSIS

---

## 🔧 Configuration & Middleware

### Global Middleware:
- **ThrottlerGuard**: Rate limiting (10 req/60s)
- **JwtAuthGuard**: JWT authentication
- **Helmet**: Security headers (configured in main.ts)
- **CORS**: Cross-origin support

### Environment Variables:
- `DATABASE_URL` - PostgreSQL connection
- `JWT_SECRET` - JWT signing key
- `GOOGLE_CLIENT_ID` - Google OAuth
- `GOOGLE_CLIENT_SECRET` - Google OAuth
- `GOOGLE_CALLBACK_URL` - OAuth redirect

---

## 🧪 Testing Structure

```
test/
├── app.e2e-spec.ts      # E2E tests
├── jest-e2e.json        # E2E Jest config
├── test.controller.ts   # Test endpoints (dev only)
└── test.module.ts       # Test module
```

**Test Endpoints** (Development only):
- `GET /test` - Health check
- `GET /test/find-user` - Find user by email
- `POST /test/create-user` - Create test user

---

## 📦 Key Dependencies

### Production:
- `@nestjs/core` - Framework core
- `@nestjs/jwt` - JWT authentication
- `@nestjs/passport` - Authentication strategies
- `@nestjs/throttler` - Rate limiting
- `@prisma/client` - Database ORM
- `bcrypt` - Password hashing
- `passport-google-oauth20` - Google OAuth
- `helmet` - Security headers

### Development:
- `prisma` - Database migrations & schema
- `typescript` - Type safety
- `jest` - Testing framework
- `eslint` & `prettier` - Code quality

---

## 🚀 API Flow Examples

### User Registration Flow:
1. `POST /auth/register` → AuthController
2. AuthService validates & hashes password
3. UsersService creates user in DB
4. JWT token generated & returned

### Idea Creation Flow:
1. `POST /ideas` → IdeasController (JWT protected)
2. IdeasService starts Prisma transaction
3. Create Idea record (currentVersion: 1)
4. Create IdeaVersion record (version: 1)
5. Commit transaction atomically
6. Return idea with latest version

### Version Addition Flow:
1. `POST /ideas/:id/version` → IdeasController
2. Validate ownership & ACTIVE status
3. Atomic increment currentVersion
4. Create new IdeaVersion with incremented number
5. Transaction ensures consistency

---

## 🔐 Security Features

1. **Authentication**: JWT-based with bcrypt hashing
2. **Authorization**: User ownership validation on all operations
3. **Rate Limiting**: 10 requests per 60 seconds
4. **Input Validation**: class-validator DTOs
5. **SQL Injection Protection**: Prisma ORM parameterization
6. **Soft Deletes**: Data retention with status flags
7. **Cascade Deletes**: Automatic cleanup of related records

---

## 📈 Scalability Considerations

1. **Database Indexing**:
   - User email (unique)
   - Idea userId
   - IdeaVersion (ideaId, version DESC)
   - AIResult ideaVersionId

2. **Pagination**: Implemented on ideas listing

3. **Atomic Operations**: Prisma transactions for consistency

4. **Optimized Queries**: Selective field fetching

---

## 🎯 Next Steps / Roadmap

### Infrastructure Layer (To Be Implemented):
1. **AI Integration** (`src/infrastructure/ai/`)
   - OpenAI/Anthropic API client
   - Generate suggestions, summaries, enhancements
   - Store results in AIResult table

2. **Email Service** (`src/infrastructure/email/`)
   - Welcome emails
   - Password reset
   - Notifications

3. **File Storage** (`src/infrastructure/storage/`)
   - Idea attachments
   - User avatars

4. **Analytics** (`src/infrastructure/analytics/`)
   - Usage tracking
   - Performance monitoring

### Feature Enhancements:
1. Password reset flow
2. Email verification
3. Idea sharing & collaboration
4. Search functionality
5. Tags & categories
6. Export ideas (PDF, Markdown)

---

## 📝 Notes

- **Current State**: Core features complete, infrastructure layer empty
- **Architecture**: Clean separation between features (internal) and infrastructure (external)
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: JWT + Google OAuth
- **Versioning**: Atomic, immutable version history
- **Status**: Production-ready for core features, AI integration pending
