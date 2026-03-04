# IdeaPulse Backend API

A NestJS-based backend API for IdeaPulse - an AI-powered idea management and refinement platform.

## Description

IdeaPulse Backend provides a robust REST API for managing user ideas with version control, AI-powered content generation, and secure authentication. Built with NestJS, Prisma ORM, and PostgreSQL.

## Tech Stack

- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + Google OAuth 2.0
- **AI Integration**: Google Generative AI (Gemini)
- **Security**: Helmet, Rate Limiting, CORS

## Project Setup

```bash
$ npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ideapulse"
JWT_SECRET="your-secret-key"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:3000/auth/google/callback"
GEMINI_API_KEY="your-gemini-api-key"
FRONTEND_URL="http://localhost:3001"
PORT=3000
```

### Database Setup

```bash
# Generate Prisma Client
$ npx prisma generate

# Run migrations
$ npx prisma migrate deploy

# (Optional) Open Prisma Studio
$ npx prisma studio
```

## Run the Application

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## API Documentation for Frontend Team

### Base URL

```
http://localhost:3000
```

---

## 🔐 Authentication Endpoints

### 1. Register User

**POST** `/auth/register`

Create a new user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response (201):**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Validation:**

- Email must be valid format
- Password minimum 8 characters
- Name is required

---

### 2. Login

**POST** `/auth/login`

Authenticate existing user.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

---

### 3. Google OAuth Login

**GET** `/auth/google`

Initiates Google OAuth flow. Redirect users to this endpoint.

**GET** `/auth/google/callback`

Google OAuth callback endpoint (handled automatically).

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

---

## 💡 Ideas Management Endpoints

**All endpoints require JWT authentication**  
Include header: `Authorization: Bearer <access_token>`

### 1. Create New Idea

**POST** `/ideas`

Create a new idea with initial version.

**Request Body:**

```json
{
  "title": "My Startup Idea",
  "content": "A platform that connects freelancers with clients..."
}
```

**Response (201):**

```json
{
  "id": "idea-uuid",
  "userId": "user-uuid",
  "status": "ACTIVE",
  "currentVersion": 1,
  "isFavorite": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "version": [
    {
      "id": "version-uuid",
      "ideaId": "idea-uuid",
      "version": 1,
      "title": "My Startup Idea",
      "content": "A platform that connects freelancers with clients...",
      "sourceType": "USER",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 2. Get All Ideas

**GET** `/ideas?page=0`

Retrieve all user's ideas with pagination.

**Query Parameters:**

- `page` (optional): Page number, default 0

**Response (200):**

```json
{
  "ideas": [
    {
      "id": "idea-uuid",
      "userId": "user-uuid",
      "status": "ACTIVE",
      "currentVersion": 3,
      "isFavorite": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-02T00:00:00.000Z",
      "version": [
        {
          "id": "version-uuid",
          "version": 3,
          "title": "Latest Title",
          "content": "Latest content...",
          "sourceType": "AI",
          "createdAt": "2024-01-02T00:00:00.000Z"
        }
      ]
    }
  ],
  "total": 15,
  "page": 0,
  "pageSize": 10
}
```

---

### 3. Get Single Idea

**GET** `/ideas/:id`

Retrieve a specific idea with all versions.

**Response (200):**

```json
{
  "id": "idea-uuid",
  "userId": "user-uuid",
  "status": "ACTIVE",
  "currentVersion": 3,
  "isFavorite": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-02T00:00:00.000Z",
  "version": [
    {
      "id": "version-3-uuid",
      "version": 3,
      "title": "Refined Title v3",
      "content": "Refined content...",
      "sourceType": "AI",
      "createdAt": "2024-01-02T00:00:00.000Z"
    },
    {
      "id": "version-2-uuid",
      "version": 2,
      "title": "Updated Title v2",
      "content": "Updated content...",
      "sourceType": "USER",
      "createdAt": "2024-01-01T12:00:00.000Z"
    },
    {
      "id": "version-1-uuid",
      "version": 1,
      "title": "Original Title",
      "content": "Original content...",
      "sourceType": "USER",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 4. Add New Version

**POST** `/ideas/:id/version`

Create a new version of an existing idea.

**Request Body:**

```json
{
  "title": "Updated Idea Title",
  "content": "Updated content with more details..."
}
```

**Response (201):**

```json
{
  "id": "idea-uuid",
  "currentVersion": 4,
  "version": [
    {
      "id": "new-version-uuid",
      "version": 4,
      "title": "Updated Idea Title",
      "content": "Updated content with more details...",
      "sourceType": "USER",
      "createdAt": "2024-01-03T00:00:00.000Z"
    }
  ]
}
```

---

### 5. Delete Idea (Soft Delete)

**DELETE** `/ideas/:id`

Soft delete an idea (marks as DELETED, doesn't remove from database).

**Response (200):**

```json
{
  "message": "Idea deleted successfully",
  "id": "idea-uuid"
}
```

---

## 🎨 AI Idea Studio Endpoints

**Requires JWT authentication**

### Generate AI-Enhanced Content

**POST** `/idea-studio/generate`

Use AI to refine, expand, summarize, or restructure idea content.

**Request Body:**

```json
{
  "content": "A mobile app for tracking daily habits",
  "tools": ["REFINE", "EXPAND", "GENERATE_TAGS"],
  "tone": "professional"
}
```

**Available Tools:**

- `REFINE` - Improve clarity and quality
- `EXPAND` - Add more details and depth
- `SUMMARIZE` - Create concise summary
- `TONE` - Adjust writing tone
- `STRUCTURE` - Reorganize content structure
- `GENERATE_TAGS` - Generate relevant tags

**Response (201):**

```json
{
  "results": {
    "REFINE": {
      "content": "A comprehensive mobile application designed to help users track and maintain daily habits through intuitive interfaces and smart reminders...",
      "metadata": {
        "model": "gemini-pro",
        "timestamp": "2024-01-01T00:00:00.000Z"
      }
    },
    "EXPAND": {
      "content": "Detailed expansion of the idea with market analysis, target audience, key features, monetization strategies...",
      "metadata": {
        "model": "gemini-pro",
        "timestamp": "2024-01-01T00:00:00.000Z"
      }
    },
    "GENERATE_TAGS": {
      "tags": [
        "mobile-app",
        "productivity",
        "habit-tracking",
        "health",
        "wellness"
      ],
      "metadata": {
        "model": "gemini-pro",
        "timestamp": "2024-01-01T00:00:00.000Z"
      }
    }
  },
  "aiResultId": "ai-result-uuid"
}
```

---

## 📊 Data Models

### User

```typescript
{
  id: string; // UUID
  name: string;
  email: string; // Unique
  password: string; // Hashed
  createdAt: Date;
  updatedAt: Date;
}
```

### Idea

```typescript
{
  id: string;              // UUID
  userId: string;
  status: "ACTIVE" | "ARCHIVED" | "DELETED";
  currentVersion: number;  // Latest version number
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  version: IdeaVersion[];  // All versions
}
```

### IdeaVersion

```typescript
{
  id: string;                    // UUID
  ideaId: string;
  version: number;               // Version number (1, 2, 3...)
  title: string;
  content: string;
  sourceType: "USER" | "AI";     // Who created this version
  aiResultId?: string;           // If AI-generated
  parentVersionId?: string;
  createdAt: Date;
}
```

---

## 🔒 Authentication Flow

1. **Register/Login** → Receive JWT token
2. **Store token** in localStorage/sessionStorage
3. **Include token** in all API requests:
   ```javascript
   headers: {
     'Authorization': `Bearer ${token}`,
     'Content-Type': 'application/json'
   }
   ```

---

## ⚠️ Error Responses

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be at least 8 characters"
  ],
  "error": "Bad Request"
}
```

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Idea not found",
  "error": "Not Found"
}
```

### 500 Internal Server Error

```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

---

## 🚀 Frontend Integration Example

```javascript
// Login
const login = async (email, password) => {
  const response = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  localStorage.setItem('token', data.access_token);
  return data;
};

// Create Idea
const createIdea = async (title, content) => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:3000/ideas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, content }),
  });
  return response.json();
};

// Generate AI Content
const generateAI = async (content, tools) => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:3000/idea-studio/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content, tools, tone: 'professional' }),
  });
  return response.json();
};
```

---

## 🧪 Testing

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

---

## 📝 Development Notes

- **Rate Limiting**: API has rate limiting enabled (60 requests/minute per IP)
- **CORS**: Configured for frontend URL (default: http://localhost:3001)
- **Validation**: All inputs are validated using class-validator
- **Security**: Passwords are hashed with bcrypt, JWT tokens expire in 7 days
- **Pagination**: Default page size is 10 items

---

## 🔗 Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Google Generative AI](https://ai.google.dev/docs)

---

## 📄 License

UNLICENSED - Private Project
