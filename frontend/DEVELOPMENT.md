# Frontend Development Guide

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Git

### Installation

```bash
npm install
# or
yarn install
```

### Development

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
frontend/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   ├── config/          # Configuration files
│   ├── constants/       # Application constants
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API and external services
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── public/              # Static assets
└── package.json
```

## Key Features

### Components

- **Reusable Components**: Button, Input, Toast, LoadingSkeleton
- **Error Boundaries**: Improved error handling with error reporting
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

### Hooks

- `useDebounce`: Debounce values for search/API calls
- `useLocalStorage`: Type-safe localStorage management
- `useMediaQuery`: Responsive design hooks
- `useToast`: Toast notification system
- `useClickOutside`: Detect clicks outside elements
- `useWindowSize`: Track window dimensions

### Utilities

- **Validation**: Input validation for forms
- **Formatting**: Currency, addresses, numbers, dates
- **Performance**: Throttle, memoize, lazy loading
- **Accessibility**: Screen reader announcements, focus management
- **Errors**: Error parsing and user-friendly messages

### Constants

All magic numbers and configuration values are centralized in `src/constants/index.ts`.

## Development Guidelines

### TypeScript

- Use strict type checking
- Define types in `src/types/` for shared types
- Avoid `any` types

### Component Guidelines

- Use functional components with hooks
- Implement proper error boundaries
- Add accessibility attributes (ARIA labels, roles)
- Support keyboard navigation
- Handle loading and error states

### Styling

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Support dark mode (if implemented)
- Respect `prefers-reduced-motion`

### Performance

- Use React.memo for expensive components
- Implement lazy loading for heavy components
- Debounce/throttle user inputs
- Optimize images and assets

### Testing

- Write unit tests for utilities
- Test component rendering
- Test user interactions
- Test accessibility

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id
```

## Building for Production

```bash
npm run build
npm start
```

## Code Quality

- ESLint for linting
- Prettier for formatting (if configured)
- TypeScript for type safety

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

