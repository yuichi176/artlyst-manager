# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Artbase Manager is a Next.js 15 application for managing art exhibitions. It uses:

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

### Key Architectural Patterns

#### 1. Server Actions Pattern
Server actions live in `src/lib/actions/`. They use the `'use server'` directive and follow these patterns:

- Use `revalidatePath()` to invalidate Next.js cache after mutations
- Use `redirect()` for navigation after successful operations
- Example: `src/lib/actions/exhibition.ts` shows the standard pattern

#### 2. Schema Validation with Zod

All data schemas are defined in `src/schema/` using Zod:

- **RawExhibition**: Type for Firestore documents
- **Exhibition**: Type for client-side use
- **exhibitionFormDataSchema**: Validation schema for form submissions

#### 3. Firestore Integration

- Firestore instance is exported from `src/lib/firestore.ts`
- Uses Google Cloud Application Default Credentials (ADC) for authentication
- Collections are accessed via `db.collection('exhibition')`
- Dates are stored as Firestore Timestamps and converted using `@date-fns/tz` with 'Asia/Tokyo' timezone

#### 4. Component Organization

- Feature-specific components in `app/[feature]/_components/`
- Shared UI components in `components/ui/`
- Layout components in `components/layout/`
- Use `Suspense` with skeleton loading states for async components

#### 5. Testing Setup

- Vitest configured with jsdom environment
- Testing Library for React component testing
- Test files co-located with components (e.g., `ExhibitionTable.test.tsx`)
- Global test utilities configured in `vitest.setup.ts`

### Important Technical Details

#### Git Hooks (Lefthook)

Pre-commit hooks automatically run:
1. `pnpm lint` - Auto-fixes and stages changes
2. `pnpm format:fix` - Auto-formats and stages changes
3. `pnpm typecheck` - Validates TypeScript types

#### Force Dynamic Rendering

Pages that need real-time data from Firestore use `export const dynamic = 'force-dynamic'` to disable static generation.

## Common Patterns

### Creating a New Feature

1. Create feature directory in `src/app/[feature]/`
2. Add Zod schemas in `src/schema/[feature].ts`
3. Create server actions in `src/lib/actions/[feature].ts`
4. Build UI components in `src/app/[feature]/_components/`
5. Add tests alongside components

### Form Handling

Forms use Server Actions with `useActionState`:

- Define validation schema in `src/schema/`
- Server action validates with `safeParse()`
- Return structured errors: `{ errors: Record<string, string> }`
- Display errors in form fields (see `ExhibitionEditForm.tsx` for reference)

### Date Handling

- Store dates in Firestore as Timestamp
- Convert to/from dates using `@date-fns/tz` with 'Asia/Tokyo' timezone
- Use `date-fns` for date manipulation
- Display dates as ISO strings on client

## Language

- UI text and error messages are in Japanese
- Code comments and documentation are in English

## Coding Conventions

### TypeScript Guidelines

1. Nomenclature

- Use `PascalCase` for classes.
- Use `camelCase` for variables, functions, and methods.
- Use `UPPERCASE` for environment variables.
- Start each function with a verb.
- Use verbs for boolean variables. Example: `isLoading`, `hasError`, `canDelete`, etc.
- Use complete words instead of abbreviations and correct spelling.
- Except for standard abbreviations like API, URL, etc.

2. Type Annotations

- All exported functions, variables, and components must have explicit type annotations.
- Avoid using `any` unless absolutely necessary and justified with a comment.
- Use `unknown` instead of `any` when the type is not known at compile time.

3. Interfaces and Types

- Prefer `interface` over `type` for object shapes and public APIs.
- Use `type` for unions, intersections, and utility types.
- Extend interfaces for shared structures instead of duplicating properties.

4. Strictness

- The project must enable strict mode in `tsconfig.json`:

```json
{
    "compilerOptions": {
        "strict": true
    }
}
```
- No disabling of strict options unless discussed and documented.

5. Utility Types

- Use built-in utility types (`Partial`, `Pick`, `Omit`, `Record`, etc.) for type transformations.
- Prefer `Readonly` and `ReadonlyArray` for immutable data structures.

6. Enum Usage

- Avoid using `enum` unless interoperability with other systems or libraries requires it.
- Prefer union string literal types for simple cases:
```typescript
type ButtonVariant = 'primary' | 'secondary' | 'danger';
```

7. Type Inference

- Leverage TypeScript's type inference for local variables where the type is obvious.
- For function parameters and return types, always specify types explicitly.

8. Third-Party Types

- Always install and use type definitions for third-party libraries (`@types/*`).
- Do not use untyped libraries unless absolutely necessary and with team approval.

9. Error Handling

- Always handle possible `null` and `undefined` values explicitly.
- Use `Optional Chaining (?.)` and `Nullish Coalescing (??)` where appropriate.

10. Function Implementation

- If it returns a boolean, use `isX` or `hasX`, `canX`, etc.
- If it doesn't return anything, use `executeX` or `saveX`, etc.
- Use higher-order functions (map, `filter`, `reduce`, etc.) to avoid function nesting.
- Use arrow functions for simple functions (less than 3 instructions).
- Use named functions for non-simple functions.
- Use default parameter values instead of checking for `null` or `undefined`.
- Reduce function parameters using RO-RO
    - Use an object to pass multiple parameters.
    - Use an object to return results.
    - Declare necessary types for input arguments and output.

11. Class Implementation

- Follow SOLID principles.
- Prefer composition over inheritance.
- Declare interfaces to define contracts.
- Write small classes with a single purpose.
    - Less than 200 instructions.
    - Less than 10 public methods.
    - Less than 10 properties.

### React Guidelines

1. Component Structure

- Use PascalCase for component names
- Use functional components with hooks. Avoid class components unless there is a strong justification.
- Each component should have a single responsibility.

2. State Management

- Use React's built-in hooks (`useState`, `useReducer`, `useContext`) for local state.
- Use jotai for global state.
- Avoid prop drilling by using context or global state where appropriate.

3. Props and Types

- Define prop types using TypeScript interfaces.
- All props must be explicitly typed.
- Use default values for optional props where appropriate.

4. Side Effects

- Use `useEffect` for side effects. Clean up effects when necessary to prevent memory leaks.
- Avoid unnecessary dependencies in effect dependency arrays.

5. Performance Optimization

- Use `React.memo` to prevent unnecessary re-renders of pure components.
- Use `useCallback` and `useMemo` to memoize functions and values passed as props.
- Split large components into smaller, reusable components.

6. JSX and Styling

- Use JSX syntax in `.tsx` files only.
- Use TailwindCSS utility classes for styling.
- Use `clsx` as composition utilities for conditional class names.

7. Accessibility

- Ensure all interactive elements are accessible (e.g., proper roles, aria attributes).
- Use semantic HTML wherever possible.

### Vitest Guidelines

1. Test Structure

- Use `describe` blocks to group related tests for a single component or module.
- Name test cases with `test` followed by a clear, descriptive statement of the expected behavior.
- Follow the AAA pattern for each test:
    - **Arrange**: Set up test conditions and inputs.
    - **Act**: Execute the behavior being tested.
    - **Assert**: Verify the expected outcomes.

2. Best Practices

    1. Focus on Critical Functionality
        - Prioritize tests for business logic, utility functions, and core application flows.
        - Ensure that critical paths are always covered by tests.

    2. Dependency Mocking
        - Always mock external dependencies before importing the module under test using `vi.mock()`.
        - Use spies (`vi.spyOn`) for monitoring function calls when full mocking is unnecessary.

    3. Comprehensive Data Scenarios
        - Test with a variety of input scenarios, including:
            - Valid inputs (expected use cases)
            - Invalid inputs (error or edge cases)
            - Boundary values (minimum/maximum, empty/null/undefined)

    4. Edge Case Coverage

        - Include tests for:
            - `undefined`, `null`, and unexpected data types.
            - Empty arrays, objects, or strings.
            - Error handling and exception cases.

### React Component Test Guidelines

1. Testing Library Best Practices

- Use queries in this order:
    1. `getByRole` (most accessible)
    2. `getByLabelText`
    3. `getByPlaceholderText`
    4. `getByText`
    5. `getByDisplayValue`
    6. `getByAltText`
    7. `getByTitle`
    8. `getByTestId` (last resort)
- Prefer `@testing-library/user-event` over `fireEvent`. (User-Centric Testing)
- Verify DOM roles and ARIA attributes where applicable
- Follow the Arrange-Act-Assert convention.

2. Component Rendering

- Test both presentational and behavioral aspects:
    - Rendering with different props
    - User interactions (clicks, inputs, etc.)
    - Conditional rendering
- Mock external dependencies using `vi.fn()` and `vi.mock()`

3. Test Data Management

- Create reusable test data factories
- Keep test data within the test file unless shared across multiple tests

4. Performance Optimization

- Use `vi.spyOn()` instead of full module mocks when possible
- Clean up resources after tests using `afterEach(cleanup)`
- Use `vi.resetAllMocks()` in `afterEach` to avoid test pollution

5. Assertion Guidelines

- Focus on observable behavior rather than implementation details
- Verify DOM changes rather than state changes
- Use meaningful custom error messages in assertions
