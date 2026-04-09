# CodeInterview

> A real-time technical interview platform built for engineers — collaborative code editor, live chat, and built-in timer in one room.

---

## Overview

CodeInterview is a full-stack monorepo application that enables interviewers to conduct technical interviews in a shared, real-time environment. Interviewers can create rooms, attach coding questions from a personal question bank, and collaborate with candidates through a Monaco-powered code editor, live chat, and a synchronized countdown timer — all without leaving the browser.

---

## Features

- **Real-time collaborative code editor** — Monaco Editor (same as VS Code) with multi-language support and live sync via Socket.io
- **Built-in timer** — Interviewer-controlled countdown with start, pause, resume, and stop. Client-driven to minimize server load
- **Live chat** — In-room messaging saved to the database, visible to both participants
- **Question bank** — Interviewers can create, organize, and reuse coding questions with starter code and solutions. Supports public and private visibility
- **Role-based access** — Server-determined roles (Interviewer vs Candidate). Candidates can join without creating an account
- **Code snapshots** — Periodic code saves per language so sessions can be reviewed after the interview ends
- **Language switching** — Change the editor language mid-session; previous code is preserved per language
- **Room history** — Room owners can re-enter closed rooms to review code and chat history
- **Dark / Light / System theme** — Fully supported across all pages

---

## Tech Stack

### Frontend (`apps/web`)

| Layer         | Technology                                    |
| ------------- | --------------------------------------------- |
| Framework     | Next.js 16 (App Router)                       |
| Language      | TypeScript                                    |
| Styling       | Tailwind CSS v4                               |
| UI Components | shadcn/ui + Radix UI                          |
| Code Editor   | Monaco Editor (`@monaco-editor/react`)        |
| Real-time     | Socket.io Client                              |
| Data Fetching | TanStack Query v5                             |
| Auth Client   | better-auth                                   |
| Fonts         | Geist (body) + JetBrains Mono (headings/code) |

### Backend (`apps/api`)

| Layer          | Technology                 |
| -------------- | -------------------------- |
| Framework      | Express + TypeScript       |
| Real-time      | Socket.io                  |
| Database ORM   | Prisma                     |
| Database       | PostgreSQL                 |
| Authentication | better-auth (Google OAuth) |
| Logging        | pino                       |

### Shared (`packages/types`)

- Shared TypeScript types for REST API responses and Socket.io event payloads

### Infrastructure

| Concern         | Tool                        |
| --------------- | --------------------------- |
| Monorepo        | pnpm workspaces + Turborepo |
| Package Manager | pnpm                        |
| Deployment      | Render.com                  |

---

## Project Structure

```
mono-repo/
├── apps/
│   ├── api/                      # Express backend
│   │   └── src/
│   │       ├── controllers/      # REST API controllers
│   │       ├── routes/           # Express routers
│   │       ├── socket/           # Socket.io handlers
│   │       ├── middleware/       # Auth middleware
│   │       ├── lib/              # Prisma, logger, auth
│   │       └── utils/            # Helpers (room code, date filter, etc.)
│   └── web/                      # Next.js frontend
│       ├── app/                  # App Router pages
│       │   ├── (public)/         # Landing, Login
│       │   ├── dashboard/        # Interviewer dashboard
│       │   ├── questions/        # Question bank
│       │   └── room/             # Interview room + join page
│       ├── components/
│       │   ├── ui/               # shadcn components
│       │   └── common/           # Shared custom components
│       ├── hooks/                # Custom React hooks
│       └── lib/                  # API client, socket client, auth client, utils
└── packages/
    └── types/                    # Shared TypeScript types
        └── src/
            ├── enums.ts
            ├── user.ts
            ├── room.ts
            ├── question.ts
            └── socket.ts
```

---

## Pages

| Route                  | Description                                  | Access                  |
| ---------------------- | -------------------------------------------- | ----------------------- |
| `/`                    | Landing page with room code input            | Public                  |
| `/login`               | Google sign-in for interviewers              | Public                  |
| `/dashboard`           | List and manage interview rooms              | Interviewer only        |
| `/questions`           | Question bank — browse, create, edit         | Interviewer only        |
| `/questions/new`       | Create a new question                        | Interviewer only        |
| `/questions/[id]/edit` | Edit an existing question                    | Interviewer only        |
| `/room/[code]/join`    | Pre-join page — enter name and see room info | Public                  |
| `/room/[code]`         | Live interview room                          | Interviewer + Candidate |

---

## REST API

All endpoints are prefixed with `/api/v1`.

### Rooms

| Method   | Endpoint       | Auth | Description                                                                          |
| -------- | -------------- | ---- | ------------------------------------------------------------------------------------ |
| `POST`   | `/rooms`       | ✅   | Create a room                                                                        |
| `GET`    | `/rooms`       | ✅   | List interviewer's rooms (supports `search`, `status`, `date`, `dateFrom`, `dateTo`) |
| `GET`    | `/rooms/:code` | ❌   | Get room info (used by candidate on join page)                                       |
| `PATCH`  | `/rooms/:code` | ✅   | Update room (title, language, duration, question, status)                            |
| `DELETE` | `/rooms/:code` | ✅   | Hard delete a room                                                                   |

### Questions

| Method   | Endpoint         | Auth | Description                                                    |
| -------- | ---------------- | ---- | -------------------------------------------------------------- |
| `GET`    | `/questions`     | ✅   | List questions (supports `visibility`, `difficulty`, `search`) |
| `GET`    | `/questions/:id` | ✅   | Get full question detail                                       |
| `POST`   | `/questions`     | ✅   | Create a question                                              |
| `PUT`    | `/questions/:id` | ✅   | Update a question                                              |
| `DELETE` | `/questions/:id` | ✅   | Delete a question                                              |

### Me

| Method | Endpoint | Auth | Description           |
| ------ | -------- | ---- | --------------------- |
| `GET`  | `/me`    | ✅   | Get current user info |

---

## Socket.io Events

### Client → Server

| Event             | Payload                        | Description                               |
| ----------------- | ------------------------------ | ----------------------------------------- |
| `room:join`       | `{ roomCode, name? }`          | Join a room                               |
| `room:leave`      | `{ roomCode, participantId }`  | Leave a room                              |
| `code:change`     | `{ roomCode, content }`        | Broadcast code changes                    |
| `code:snapshot`   | `{ roomCode, code, language }` | Save a code snapshot                      |
| `language:change` | `{ roomCode, language, code }` | Switch editor language                    |
| `chat:message`    | `{ roomCode, content }`        | Send a chat message                       |
| `timer:start`     | `{ roomCode, duration }`       | Start the timer                           |
| `timer:pause`     | `{ roomCode }`                 | Pause the timer                           |
| `timer:resume`    | `{ roomCode }`                 | Resume the timer                          |
| `timer:stop`      | `{ roomCode }`                 | Stop and reset the timer                  |
| `timer:finished`  | `{ roomCode }`                 | Mark timer as finished (interviewer only) |

### Server → Client

| Event                   | Payload                                                 | Description                              |
| ----------------------- | ------------------------------------------------------- | ---------------------------------------- |
| `room:joined`           | `{ roomCode, participantId, role, language, lastCode }` | Confirmed join with initial state        |
| `room:user-joined`      | `{ participantId, name, role }`                         | Another user joined                      |
| `room:user-left`        | `{ participantId, role }`                               | A user left                              |
| `room:closed`           | `{ reason }`                                            | Room was closed by interviewer           |
| `room:error`            | `{ message }`                                           | Error response                           |
| `code:changed`          | `{ content, by }`                                       | Incoming code from the other participant |
| `language:changed`      | `{ language, lastCode }`                                | Language changed, includes restored code |
| `chat:message:received` | `{ id, senderName, content, createdAt }`                | Incoming chat message                    |
| `timer:started`         | `{ duration, startedAt }`                               | Timer started                            |
| `timer:paused`          | `{ remaining }`                                         | Timer paused                             |
| `timer:resumed`         | `{ remaining, startedAt }`                              | Timer resumed                            |
| `timer:stopped`         | —                                                       | Timer reset                              |
| `timer:finished`        | —                                                       | Timer reached zero                       |

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+
- PostgreSQL database

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/code-interview.git
cd code-interview

# Install all dependencies
pnpm install
```

### Environment Variables

**`apps/api/.env`**

```env
DATABASE_URL="postgresql://user:password@localhost:5432/codeinterview"
SERVER_URL="http://localhost"
PORT=4000
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:4000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

**`apps/web/.env.local`**

```env
NEXT_PUBLIC_API_URL="http://localhost:4000/api/v1"
NEXT_PUBLIC_SOCKET_URL="http://localhost:4000"
```

### Database Setup

```bash
cd apps/api

# Run migrations
pnpm prisma migrate dev

# (Optional) Seed the database
pnpm prisma db seed
```

### Development

```bash
# Run all apps simultaneously from root
pnpm dev

# Or run individually
pnpm dev:api    # Express server on port 4000
pnpm dev:web    # Next.js on port 3000
```

---

## Key Design Decisions

**Server-determined roles** — The server decides whether a joining user is an Interviewer or Candidate based on `userId === room.interviewerId`. Clients cannot self-assign roles.

**Client-driven timer** — The countdown runs in the browser from `startedAt + duration`. The server only stores state changes (start, pause, stop) to avoid unnecessary server-side polling.

**Code snapshots over diffs** — Full code content is saved periodically rather than diffs. Simpler to implement and sufficient for interview-length sessions.

**Snapshot-per-language** — When switching languages, the current code is saved as a snapshot before switching. Returning to a language restores the last snapshot automatically.

**Candidate authentication is optional** — Candidates join by entering a name only. No account required. Auth is enforced only for Interviewers.

**Room owner can re-enter closed rooms** — The `room:join` handler checks if the joining user is the room owner. If so, the closed status check is bypassed, allowing post-interview review.

**Tailwind v4 CSS-first config** — All theme customization lives in `globals.css` using `@theme` blocks. No `tailwind.config.ts` needed.

**`data-theme` attribute for dark mode** — Uses `[data-theme=dark]` selector instead of the `.dark` class, enabling a three-way toggle: light, dark, and system preference.

---

## Branch Strategy

```
main
└── dev
    ├── feature/server/room-api
    ├── feature/server/questions-api
    ├── feature/web/setup
    ├── feature/web/landing
    ├── feature/web/dashboard
    └── feature/web/room
```

---

## License

MIT
