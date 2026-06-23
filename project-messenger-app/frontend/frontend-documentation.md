# Frontend Documentation — Messenger App

## Project Description

A real-time messenger web application frontend built with **SvelteKit 2** and **Svelte 5**. It provides a full-featured chat interface that connects to a REST API backend and supports user authentication, conversations, messages, friendships, and user settings.

---

## Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- The backend API must be running (see backend documentation)

---

## Installation

```bash
cd frontend
npm install
```

---

## Environment Variables

Copy the example environment file and configure it:

```bash
npm run env:copy
```

This creates `.env.local` from `.env.example`. Open `.env.local` and set:

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | URL of the backend API | `https://your-backend.onrender.com` |

For local development, the default fallback is `http://localhost:3000` if `VITE_API_URL` is not set.

---

## Running in Development

```bash
npm run dev
```

The application will start at [http://localhost:5173](http://localhost:5173).

---

## Building for Production

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## Project Structure

```
frontend/
├── src/
│   ├── app.html              # HTML shell
│   ├── lib/
│   │   ├── api.js            # Central API fetch utility with token + 401 handling
│   │   ├── auth.js           # Svelte store for current user + logout helper
│   │   └── components/
│   │       ├── Alert.svelte      # Error/success/info alert banner
│   │       ├── Button.svelte     # Reusable button with disabled state
│   │       ├── Card.svelte       # Styled card wrapper
│   │       ├── Input.svelte      # Text/select input with bind support
│   │       ├── Loading.svelte    # Spinner loading indicator
│   │       ├── Message.svelte    # Single chat message bubble
│   │       ├── Modal.svelte      # Confirmation dialog overlay
│   │       └── Navbar.svelte     # Top navigation bar
│   └── routes/
│       ├── +layout.svelte        # App shell: auth guard + token expiry check
│       ├── +error.svelte         # 404 / error page
│       ├── +page.svelte          # Landing / home page
│       ├── dashboard/            # Dashboard with stats and quick links
│       ├── login/                # Login form with validation
│       ├── register/             # Registration form with validation
│       ├── conversations/        # Conversation list + create + delete
│       │   └── [id]/             # Conversation detail + edit
│       ├── messages/             # Message view for a conversation
│       ├── friendships/          # Friends list + send/accept/block/remove
│       └── usersettings/         # User settings create/update
```

---

## Pages

| Route | Description |
|---|---|
| `/` | Landing page with login/register links |
| `/login` | Login with email or username |
| `/register` | New account registration |
| `/dashboard` | Overview of conversations and friends count |
| `/conversations` | List, create, and delete conversations |
| `/conversations/[id]` | Conversation detail and inline edit |
| `/messages?conversationId=…` | Chat messages view |
| `/friendships` | Friends list with send/accept/block/remove |
| `/usersettings` | User settings form |

---

## Linting and Formatting

```bash
npm run lint      # Check ESLint + Prettier
npm run format    # Auto-format with Prettier
```

---

## Deployment

The frontend is deployed to **[Render / Vercel / Netlify]** as a static site.

**Live URL:** `https://your-app-url.example.com`

### Deploy steps (Render static site example):

1. Push code to GitHub
2. Create a new **Static Site** on Render
3. Set build command: `npm run build`
4. Set publish directory: `build`
5. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com`

---

## Authentication

- JWT tokens are stored in `localStorage`
- Tokens are sent with every authenticated API request via `Authorization: Bearer <token>`
- Expired tokens are detected on app load and the user is redirected to `/login`
- A 401 response from the API automatically clears the token and redirects to `/login`
