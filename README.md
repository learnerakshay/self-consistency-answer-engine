# Self Consistency Answer Engine

An advanced AI orchestration full-stack application built using React and Node.js. It implements **Self-Consistency and LLM Cross-Evaluation**. Instead of relying on a single language model response (which may contain bias, localized error, or styling inconsistencies), this engine queries multiple LLMs simultaneously, aggregates their outputs, normalizes latencies, and passes them to an evaluator model to synthesize a single high-quality, consolidated response.

---

## Architecture Diagram

```
                       [ User Prompt Input ]
                                 │
                                 ▼
                     [ POST /api/orchestrate ]
                                 │
                  ┌──────────────┴──────────────┐
                  ▼                             ▼
         [ OpenAI Service ]            [ Gemini Service ]
         (gpt-4o-mini call)           (gemini-3.5-flash)
                  │                             │
                  └──────────────┬──────────────┘
                                 ▼
                    [ Collected & Normalized ]
                 (Word counts & response latencies)
                                 │
                                 ▼
                    [ Evaluator Synthesis ]
                 (Logical cross-examination via 
                  structured JSON response Schema)
                                 │
                                 ▼
                   [ Consolidated Response & ]
                  [ Evaluation Summary Bullets ]
                                 │
                                 ▼
                       [ Display to User ]
```

---

## Tech Stack

### Frontend
- **React** (v19.0)
- **Vite** (v6.2)
- **Tailwind CSS** (v4.0) with custom Inter/JetBrains fonts
- **Axios** (v1.7) for clean relative api request management

### Backend
- **Node.js**
- **Express.js** (v4.21)
- **dotenv** (v17.2) for workspace secrets loading
- **cors** (v2.8)

### AI Models & SDKs
- **Google Gemini API** (utilizing the official `@google/genai` v2.4.0 SDK)
  - Core Generator: `gemini-3.5-flash`
  - Evaluator: `gemini-3.5-flash` (using JSON Schema Mode)
- **OpenAI API** (using `openai` v4.x SDK)
  - Core Generator: `gpt-4o-mini`

---

## Folder Structure

The project has been organized with clean separation of concerns:

```
Root
├── package.json
├── index.html
├── metadata.json
├── server.ts                    # Main full-stack entry point
├── README.md                    # This instruction documentation
├── server/                      # Express Backend
│   ├── config/
│   │   └── config.ts            # Env parsing & lazy config check
│   ├── utils/
│   │   └── types.ts             # Backend JSON contract definitions
│   ├── services/
│   │   ├── geminiService.ts     # Official @google/genai caller
│   │   ├── openaiService.ts     # OpenAI client caller
│   │   └── evaluatorService.ts  # Model synthesis & consensus engine
│   ├── orchestrator/
│   │   └── orchestrator.ts      # Multi-model execution coordinator
│   ├── middleware/
│   │   └── validation.ts        # Input validator and trim sanitize
│   ├── controllers/
│   │   └── orchestrationController.ts # controller route mapper
│   └── routes/
│       └── orchestrationRoutes.ts     # Express orchestrator routes
└── src/                         # React Frontend (Vite SPA)
    ├── types.ts                 # Type-safe client telemetry specs
    ├── services/
    │   └── api.ts               # Axios network requester
    ├── components/
    │   ├── Header.tsx           # App identity & engine indicators
    │   ├── PromptForm.tsx       # Prompt submission & presets suggestions
    │   ├── MetadataPanel.tsx    # Telemetry board for latency comparison
    │   ├── ResponseCard.tsx     # Copyable model cards with prominent highlights
    │   ├── EvaluationSummary.tsx # Synthesis bullets and confidence score displays
    │   └── LoadingState.tsx     # Custom minimal step-by-step pipeline loading
    ├── App.tsx                  # Root page component
    ├── index.css                # Tailwind imports & premium font pairing
    └── main.tsx                 # Client bundler entry
```

---

## Environment Variables

To operate both model pipelines, create a `.env` file in the project root containing:

```env
# Google Gemini Credentials
GEMINI_API_KEY="your_gemini_api_key_here"

# OpenAI API Credentials
OPENAI_API_KEY="your_openai_api_key_here"

# Server Port (default 3000)
PORT=3000
```

*Note: In the Google AI Studio container preview environment, `GEMINI_API_KEY` is automatically injected at runtime from your **Secrets** panel.*

---

## Running Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Boot the Development Server**:
   ```bash
   npm run dev
   ```
   *The dev server automatically boots on port `3000` via Express, mounting the API routers and hooking Vite's hot-reload middleware.*

3. **Check Build Output**:
   ```bash
   npm run build
   ```
   *This compiles the React static files and bundles the Express server using `esbuild` into `dist/server.cjs`.*

---

## Future Improvements

1. **Streaming Responses**: Modify the orchestrator and controllers to handle partial Server-Sent Events (SSE) so users see answers rendering in real-time.
2. **Flexible Evaluator Choice**: Allow users to select which model acts as the Evaluator/Synthesizer (e.g. comparing Gemini-engineered evaluation vs OpenAI-engineered evaluation).
3. **Pluggable LLM Nodes**: Support adding custom model endpoints (e.g., Anthropic, Cohere, Llama index) easily via the modular orchestrator interface.
