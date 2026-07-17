# Self Consistency Answer Engine - Project Architecture Notes
# Overall Architecture

```
                User
                  │
                  ▼
        React Frontend (Vite)
                  │
                  ▼
      Express API (/api/orchestrate)
                  │
                  ▼
          Orchestrator Layer
          /server/orchestrator
                  │
      ┌───────────┴───────────┐
      ▼                       ▼
 OpenAI Service         Gemini Service
      │                       │
      └───────────┬───────────┘
                  ▼
        Evaluator Service
                  │
                  ▼
      Final Synthesized Response
                  │
                  ▼
          React UI Rendering
```

---

# Root Folder

## package.json

Purpose

- Stores project metadata
- Stores dependencies
- Defines scripts

Examples

- npm install
- npm run dev
- npm run build
- npm start

---

## server.ts

Purpose

Main backend entry point.

Responsibilities

- Creates Express app
- Registers routes
- Starts server
- Loads Vite middleware in development
- Serves React build in production

Think of it as

> Main gate of the backend.

---

## metadata.json

Purpose

Contains project metadata.

Useful for

- Versioning
- UI metadata
- Future analytics

---

## README.md

Project documentation.

---

## .env

Contains

- OpenAI API Key
- Gemini API Key
- Environment variables

Never push this file to GitHub.

---

# server/

This folder contains the complete backend.

---

# server/config

## config.ts

Purpose

Loads environment variables.

Responsibilities

- PORT
- API Keys
- Model names
- Limits

Instead of writing

```
process.env.OPENAI_API_KEY
```

everywhere,

all files simply import

```
config
```

---

# server/controllers

## orchestrationController.ts

Purpose

Controller layer.

Responsibilities

- Receive HTTP Request
- Validate request
- Call orchestrator
- Return response

Does NOT contain business logic.

---

# server/routes

## orchestrationRoutes.ts

Purpose

Maps URL to controller.

Example

```
POST /api/orchestrate
```

↓

```
Controller
```

---

# server/middleware

## validation.ts

Purpose

Validate user input.

Checks

- Empty prompt
- Prompt length
- Invalid request

Stops bad requests before they reach backend.

---

# server/orchestrator

## orchestrator.ts

Most important backend file.

Responsibilities

- Call OpenAI
- Call Gemini
- Run both in parallel
- Handle failures
- Call evaluator
- Return final response

Think of it as

Project Manager.

It never generates AI output itself.

It coordinates every service.

---

# server/services

Contains all AI services.

---

## openaiService.ts

Purpose

Communicates with OpenAI.

Responsibilities

- Send prompt
- Measure response time
- Count words
- Return structured response

Only talks to OpenAI.

Nothing else.

---

## geminiService.ts

Same as OpenAI service.

Only communicates with Gemini.

---

## evaluatorService.ts

Brain of the project.

Responsibilities

Receives

- Original Prompt
- OpenAI Response
- Gemini Response

Produces

- Synthesized Answer
- Confidence
- Evaluation Summary

This file makes the project unique.

---

# server/utils

## types.ts

Contains all interfaces.

Example

```
ModelResponse

EvaluationResult

OrchestrationResponse
```

Instead of rewriting interfaces,

every file imports them.

---

# src/

Entire React frontend.

---

# src/services

## api.ts

Purpose

Communicates with backend.

React

↓

Express

Never talks directly to OpenAI.

---

# src/components

Each component has one responsibility.

---

## Header.tsx

Project title.

---

## PromptForm.tsx

Prompt textbox.

Generate button.

Sends request.

---

## LoadingState.tsx

Loading animation.

---

## MetadataPanel.tsx

Shows

- Response time
- Confidence
- Status

---

## ResponseCard.tsx

Displays

- OpenAI response
- Gemini response
- Synthesized response

Also handles

- Copy button
- Markdown rendering

---

## EvaluationSummary.tsx

Displays evaluator bullets.

Example

- OpenAI added technical depth
- Gemini improved clarity

---

# App.tsx

Frontend orchestrator.

Responsibilities

- State Management
- API Call
- Loading
- Rendering Components

Equivalent of backend orchestrator,

but for UI.

---

# Workflow

Step 1

User enters prompt.

↓

PromptForm

↓

App.tsx

↓

api.ts

↓

POST /api/orchestrate

↓

Route

↓

Controller

↓

Validation

↓

Orchestrator

↓

OpenAI Service

↓

Gemini Service

↓

Evaluator Service

↓

Controller

↓

Express Response

↓

React

↓

App.tsx

↓

ResponseCard

↓

EvaluationSummary

↓

User

---

# Responsibilities Summary

server.ts

Starts backend.

---

Routes

Map URL.

---

Controller

Receives request.

---

Middleware

Validates request.

---

Orchestrator

Coordinates entire project.

---

Services

Talk to AI models.

---

Evaluator

Creates best answer.

---

React

Displays everything.

---

# Data Flow

```
User

↓

PromptForm

↓

App

↓

api.ts

↓

Express

↓

Route

↓

Controller

↓

Validation

↓

Orchestrator

↓

OpenAI

+

Gemini

↓

Evaluator

↓

Final JSON

↓

React

↓

Cards

↓

User
```

---

# Future Improvements

> Potential enhancements for the next version of the Self Consistency Answer Engine.

---

## 1. Handle Long Request Timeouts

### Current Limitation
Large prompts may take more than 30 seconds because multiple AI models are called before returning the final response.

### Possible Solution
- Increase the frontend request timeout (e.g., 60–90 seconds).
- Implement response streaming for better user experience.

---

## 2. Add User Authentication

### Current Limitation
Anyone with the application URL can access the service.

### Possible Solution
- Implement JWT Authentication.
- Add Google OAuth or GitHub OAuth.
- Restrict API access to authenticated users.

---

## 3. Store Chat History

### Current Limitation
All conversations disappear after refreshing the page.

### Possible Solution
- Integrate PostgreSQL or MongoDB.
- Store prompts, responses, timestamps, and user information.
- Allow users to revisit previous conversations.

---

## 4. Introduce Response Caching

### Current Limitation
Repeated prompts trigger new API requests, increasing cost and response time.

### Possible Solution
- Use Redis to cache frequently requested prompts.
- Return cached responses when appropriate.
- Reduce API costs and improve performance.

---

## 5. Add Retrieval-Augmented Generation (RAG)

### Current Limitation
The application relies only on general-purpose LLM knowledge.

### Possible Solution
- Integrate a Vector Database (e.g., Pinecone or ChromaDB).
- Retrieve relevant documents before generating responses.
- Improve accuracy for domain-specific queries.

---

## 6. Support Streaming Responses

### Current Limitation
Users must wait until the complete response is generated.

### Possible Solution
- Use Server-Sent Events (SSE) or WebSockets.
- Stream model responses token by token.
- Display real-time generation progress.

---

## 7. Improve Scalability

### Current Limitation
The application is designed for small-scale usage.

### Possible Solution
- Add rate limiting.
- Introduce request queues.
- Deploy behind a load balancer.
- Add centralized logging and monitoring for production environments.

---

# Version 2 Roadmap

- Authentication
- Chat History
- PostgreSQL / MongoDB
- Redis Caching
- RAG Integration
- Vector Database
- Streaming Responses
- Multi-Model Support (Claude, Grok, Llama)
- Conversation Memory
- Production Monitoring