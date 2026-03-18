# Idea Vault Features Documentation

## Overview

The Idea Vault is a core feature of IdeaPulse that provides version-controlled storage for user ideas with AI integration capabilities.

---

## Features

### 1. Idea Management
- Create new ideas with title and description
- Retrieve all user ideas
- Get specific idea with full version history
- Soft delete ideas (marks as DELETED)
- Track idea status (ACTIVE, ARCHIVED, DELETED)
- Favorite/unfavorite ideas

### 2. Version Control
- Automatic versioning for each idea modification
- Track version source (USER or AI-generated)
- Maintain complete version history
- Link AI results to specific versions
- Parent-child version relationships

### 3. AI Integration
- Save AI-generated results linked to idea versions
- Track which AI tools were used
- Store AI metadata (model, timestamp)
- Support multiple AI operations per version

### 4. Timeline & History
- View complete idea evolution timeline
- Track when each version was created
- See which AI tools were applied at each stage

---

## API Endpoints

### Base URL
```
/idea-vault
```

### 1. Create Idea
**POST** `/ideas`

Creates a new idea with initial version 1.

**Request:**
```json
{
  "title": "My Idea Title",
  "description": "Detailed description of the idea"
}
```

**Response:**
```json
{
  "id": "uuid",
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
      "title": "My Idea Title",
      "content": "Detailed description of the idea",
      "sourceType": "USER",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 2. Get All Ideas
**GET** `/ideas`

Retrieves all ideas for the authenticated user.

**Response:**
```json
[
  {
    "id": "uuid",
    "userId": "user-uuid",
    "status": "ACTIVE",
    "currentVersion": 3,
    "isFavorite": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z",
    "version": [...]
  }
]
```

---

### 3. Get Single Idea
**GET** `/ideas/:id`

Retrieves a specific idea with all versions and AI results.

**Response:**
```json
{
  "id": "uuid",
  "userId": "user-uuid",
  "status": "ACTIVE",
  "currentVersion": 3,
  "isFavorite": false,
  "version": [
    {
      "id": "version-3-uuid",
      "version": 3,
      "title": "Latest Title",
      "content": "Latest content",
      "sourceType": "AI",
      "aiResults": [
        {
          "id": "ai-result-uuid",
          "tool": "REFINE",
          "response": {...},
          "createdAt": "2024-01-02T00:00:00.000Z"
        }
      ],
      "createdAt": "2024-01-02T00:00:00.000Z"
    },
    {
      "id": "version-2-uuid",
      "version": 2,
      "title": "Updated Title",
      "content": "Updated content",
      "sourceType": "USER",
      "aiResults": [],
      "createdAt": "2024-01-01T12:00:00.000Z"
    },
    {
      "id": "version-1-uuid",
      "version": 1,
      "title": "Original Title",
      "content": "Original content",
      "sourceType": "USER",
      "aiResults": [],
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 4. Create New Version
**POST** `/ideas/:id/version`

Adds a new version to an existing idea.

**Request:**
```json
{
  "title": "Updated Title",
  "content": "Updated content with improvements"
}
```

**Response:**
```json
{
  "id": "version-uuid",
  "ideaId": "idea-uuid",
  "version": 4,
  "title": "Updated Title",
  "content": "Updated content with improvements",
  "sourceType": "USER",
  "createdAt": "2024-01-03T00:00:00.000Z"
}
```

---

### 5. Get Idea Timeline
**GET** `/ideas/:id/timeline`

Retrieves the evolution timeline of an idea.

**Response:**
```json
{
  "ideaId": "uuid",
  "title": "Idea Title",
  "timeline": [
    {
      "version": 1,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "tools": []
    },
    {
      "version": 2,
      "createdAt": "2024-01-01T12:00:00.000Z",
      "tools": [
        { "tool": "REFINE" },
        { "tool": "EXPAND" }
      ]
    },
    {
      "version": 3,
      "createdAt": "2024-01-02T00:00:00.000Z",
      "tools": [
        { "tool": "GENERATE_TAGS" }
      ]
    }
  ]
}
```

---

## Data Models

### Idea
```typescript
{
  id: string;              // UUID
  userId: string;          // Foreign key to User
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
  ideaId: string;                // Foreign key to Idea
  version: number;               // Version number (1, 2, 3...)
  title: string;
  content: string;
  sourceType: "USER" | "AI";     // Who created this version
  parentVersionId?: string;      // Optional parent version
  createdAt: Date;
  aiResults: AIResult[];         // AI operations on this version
}
```

### AIResult
```typescript
{
  id: string;                    // UUID
  ideaVersionId: string;         // Foreign key to IdeaVersion
  domain: "IDEA_VAULT";
  tool: string;                  // AI tool name (REFINE, EXPAND, etc.)
  response: JSON;                // AI output
  createdAt: Date;
}
```

---

## Use Cases

### 1. Basic Idea Creation Flow
```
User creates idea → Version 1 (USER) created → Idea stored
```

### 2. AI Enhancement Flow
```
User creates idea → AI refines content → Version 2 (AI) created → AI result linked
```

### 3. Iterative Refinement Flow
```
Version 1 (USER) → AI REFINE → Version 2 (AI) → User edits → Version 3 (USER) → AI EXPAND → Version 4 (AI)
```

### 4. Version History Review
```
User views idea → See all versions → Compare changes → Revert to previous version
```

---

## Integration with AI Service

The Idea Vault integrates with the AI Service through the `saveAIResult` method:

```typescript
// AI Service calls this after generating content
await ideaVaultService.saveAIResult(
  ideaVersionId,
  toolName,
  aiOutput
);
```

This creates a link between:
- The specific idea version
- The AI tool used
- The generated output

---

## Testing Examples

### Create and Evolve an Idea

```bash
# 1. Create initial idea
POST /idea-vault/ideas
{
  "title": "Smart Home Energy Manager",
  "description": "IoT device that optimizes home energy usage"
}

# 2. Add refined version
POST /idea-vault/ideas/{id}/version
{
  "title": "Smart Home Energy Manager - Enhanced",
  "content": "AI-powered IoT system with predictive analytics, solar integration, and mobile app control"
}

# 3. View complete history
GET /idea-vault/ideas/{id}

# 4. View timeline
GET /idea-vault/ideas/{id}/timeline
```

---

## Future Enhancements

- [ ] Idea collaboration (sharing with other users)
- [ ] Version comparison/diff view
- [ ] Idea templates
- [ ] Export ideas to various formats
- [ ] Idea categories and tags
- [ ] Search and filter capabilities
- [ ] Idea analytics and insights
- [ ] Version rollback functionality
- [ ] Bulk operations
- [ ] Idea archiving automation

---

## Notes

- All endpoints require authentication (except in test mode)
- Version numbers are auto-incremented
- Soft delete preserves data for recovery
- AI results are stored as JSON for flexibility
- Timeline provides quick overview of idea evolution
