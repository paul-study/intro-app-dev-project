# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
npx sv@0.16.1 create --template minimal --types jsdoc --add prettier eslint --install npm ./
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.


## Backend API Endpoints

### Base URL
`http://localhost:3000/api`

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user (requires authentication)

### Users
- `POST /api/users` - Create a new user (requires authentication)
- `GET /api/users` - Get all users (admin only, requires authentication)
- `GET /api/users/:id` - Get user by ID (owner or admin, requires authentication)
- `PUT /api/users/:id` - Update user (owner or admin, requires authentication)
- `DELETE /api/users/:id` - Delete user (admin only, requires authentication)

### Conversations
- `POST /api/conversations` - Create a new conversation (requires authentication)
- `GET /api/conversations` - Get all conversations (requires authentication)
- `GET /api/conversations/:id` - Get conversation by ID (requires authentication)
- `PUT /api/conversations/:id` - Update conversation (requires authentication)
- `DELETE /api/conversations/:id` - Delete conversation (requires authentication)

### Messages
- `POST /api/messages` - Create a new message (requires authentication)
- `GET /api/messages` - Get all messages (requires authentication)
- `GET /api/messages/:id` - Get message by ID (requires authentication)
- `PUT /api/messages/:id` - Update message (requires authentication)
- `DELETE /api/messages/:id` - Delete message (requires authentication)

### Friendships
- `POST /api/friendships` - Create a friendship (requires authentication)
- `GET /api/friendships` - Get all friendships (requires authentication)
- `GET /api/friendships/:id` - Get friendship by ID (requires authentication)
- `PATCH /api/friendships/:id` - Update friendship (requires authentication)
- `DELETE /api/friendships/:id` - Delete friendship (requires authentication)

### Conversation Participants
- `POST /api/conversation-participants` - Add participant (requires authentication)
- `GET /api/conversation-participants` - Get all participants (requires authentication)
- `GET /api/conversation-participants/:id` - Get participant by ID (requires authentication)
- `PUT /api/conversation-participants/:id` - Update participant (requires authentication)
- `DELETE /api/conversation-participants/:id` - Delete participant (requires authentication)

### User Settings
- `POST /api/user-settings` - Create user settings (requires authentication)
- `GET /api/user-settings` - Get all user settings (requires authentication)
- `GET /api/user-settings/:id` - Get user settings by ID (requires authentication)
- `PUT /api/user-settings/:id` - Update user settings (requires authentication)
- `DELETE /api/user-settings/:id` - Delete user settings (requires authentication)

### Health
- `GET /health` - Health check endpoint


### Deployed on netlify frontend
- https://intro-app-dev-project.netlify.app/

### Deployed on render backend
- https://id607001-s1-26-paul-study-messenger-db.onrender.com

