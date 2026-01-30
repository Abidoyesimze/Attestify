# Attestify Frontend

Next.js 15 frontend for Attestify platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy environment file:
```bash
cp .env.example .env.local
```

3. Run development server:
```bash
npm run dev
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

- `src/app/` - Next.js app router pages
- `src/components/` - React components
- `src/hooks/` - Custom React hooks
- `src/utils/` - Utility functions
- `src/types/` - TypeScript type definitions
- `src/config/` - Configuration files

## Testing

Run tests:
```bash
npm test
```

## Environment Variables

See `.env.example` for required environment variables.
