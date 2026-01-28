# Project Overview

Artlyst Manager is a Next.js 15 application for managing art exhibitions. It uses:

- **Next.js 15** with App Router and React Server Components
- **Google Cloud Firestore** as the database
- **Radix UI** components with Tailwind CSS v4 for styling
- **Vitest** for testing
- **TypeScript** with strict mode enabled
- **pnpm** as the package manager

## Development Commands

### Core Development

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build production bundle with Turbopack
- `pnpm start` - Start production server

### Code Quality

- `pnpm lint` - Run ESLint and auto-fix issues
- `pnpm lint:fix` - Run ESLint without auto-fixing
- `pnpm typecheck` - Run TypeScript type checking (no emit)
- `pnpm format` - Check formatting with Prettier
- `pnpm format:fix` - Auto-fix formatting with Prettier

### Testing

- `pnpm test` - Run all tests with Vitest
- `vitest` - Run tests in watch mode (useful during development)

## Architecture

### Directory Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── exhibition/               # Exhibition feature routes
│   │   ├── _components/          # Feature-specific components
│   │   ├── [id]/edit/            # Dynamic edit route
│   │   └── page.tsx
│   └── layout.tsx                # Root layout with sidebar
├── components/
│   ├── shadcn-ui/                # Radix UI components (shadcn/ui style)
│   └── layout/                   # Layout components (Header, AppSidebar)
├── hooks/                        # Custom React hooks
├── lib/
│   ├── actions/                  # Next.js Server Actions
│   └── firestore.ts              # Firestore database instance              
├── utils/                        # Utility functions
└── schema/                       # Zod schemas for data validation
```
