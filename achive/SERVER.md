# Achive Express Server

## Description
Express server for the Achive project with TypeScript and OpenAI API integration.

## Installation and Setup

### Install Dependencies
```bash
npm install
```

### Environment Setup
1. Create a `.env` file in the project root
2. Add your OpenAI API key:
```
OPENAI_API_KEY=your_openai_api_key_here
PORT=3001
NODE_ENV=development
```

### Running the Server

#### Development Mode (both client and server)
```bash
npm run dev
```

#### Development Mode (server only with auto-reload)
```bash
npm run server:dev
```

#### Development Mode (client only)
```bash
npm run client:dev
```

#### Run Server (single run)
```bash
npm run server
```

#### Production Build
```bash
npm run server:build
npm run server:start
```

## Configuration

### Environment Variables
- `OPENAI_API_KEY` - OpenAI API key (required)
- `PORT` - server port (default: 3001)
- `NODE_ENV` - environment mode (development/production)

### Endpoints
- `GET /` - basic server information
- `GET /health` - server health check
- `GET /api/*` - API endpoints (placeholder)

## Project Structure
```
server.ts           # Main server file
tsconfig.server.json # TypeScript configuration for server
.env                # Environment variables (not in git)
```

## Development
Server is configured with:
- ✅ Express.js
- ✅ TypeScript
- ✅ CORS
- ✅ dotenv for environment variables
- ✅ OpenAI API key validation
- ✅ Error handling
- ✅ Health check endpoint
