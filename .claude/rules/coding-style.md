# Coding Style Guide

This guide defines the coding patterns, conventions, and best practices for the Artlyst Manager project. Follow these guidelines to maintain consistency and code quality across the codebase.

## Table of Contents

- [Architecture Patterns](#architecture-patterns)
- [Implementation Patterns](#implementation-patterns)
- [Feature Development Workflow](#feature-development-workflow)
- [Project Conventions](#project-conventions)

## Architecture Patterns

### Component Architecture Pattern

This project follows a layered component architecture to separate concerns between data fetching, state management, and presentation:

#### 1. **Page Components** (`page.tsx`)
- Entry point for each route
- Typically, renders a `*-section` component
- May include route-specific configurations (e.g., `export const dynamic = 'force-dynamic'`)

#### 2. **Section Components** (`*-section.tsx`) - **Server Components**
- **Responsibility**: Data fetching and data transformation
- **Location**: Placed in the same directory as `page.tsx`
- **Characteristics**:
    - Server Components by default (may use `'use cache'` directive)
    - Fetch data directly from Firestore (no API routes)
    - Transform raw data (e.g., `RawExhibition` → `Exhibition`)
    - Pass processed data to presentation components
- **Example**: `top-page-section.tsx` fetches exhibitions from Firestore and passes them to `TopPagePresentation`

#### 3. **Presentation Components** (`*-presentation.tsx`) - **Client Components**
- **Responsibility**: UI rendering and state management
- **Location**: Placed in the same directory as corresponding section component
- **Characteristics**:
    - Client Components (use `'use client'` directive)
    - Handle user interactions and UI state (filters, search, dialogs, etc.)
    - Manage local state with React hooks
    - Receive data as props from section components
    - Do NOT fetch data directly
- **Example**: `top-page-presentation.tsx` manages filter states and renders museum cards

#### 4. **Page-Specific Components** (`_components/`)
- **Responsibility**: Reusable UI components specific to a page or feature
- **Location**: `_components/` directory within the page route
- **Characteristics**:
    - Can be either Server Components or Client Components
    - Split into appropriate granularity for readability and reusability
    - Used by presentation components or other page-specific components
- **Examples**: `search-input.tsx`, `museum-card.tsx`, `filter-drawer.tsx`

#### Data Fetching Rules

1. **Server Components** (`*-section.tsx`):
    - Fetch data directly from Firestore
    - Do NOT use API routes for read operations
    - Perform data transformations (Timestamp → ISO strings, etc.)

2. **Client Components** (`*-presentation.tsx`, `_components/`):
    - Do NOT fetch data directly from Firestore
    - Use API routes for all write/update operations (POST, PATCH, DELETE)
    - Receive data via props from parent Server Components (or parent Client Components for auth-required pages)

#### Example Flow

**Public Pages (Standard Flow)**
```
page.tsx (Server)
  ↓
*-section.tsx (Server Component)
  ├─ Fetch from Firestore
  ├─ Transform data
  ↓
*-presentation.tsx (Client Component)
  ├─ Manage UI state
  ├─ Handle user interactions
  ├─ Call API routes for mutations
  ↓
_components/*.tsx (Server/Client Components)
  └─ Render specific UI elements
```

### Feature-Based Organization

Organize code by feature rather than by type. Each feature is self-contained with its own routes, components, and logic.

**Structure:**

```
src/app/[feature]/
├── _components/           # Feature-specific components
├── [id]/                  # Dynamic routes
│   └── edit/
│       └── page.tsx
└── page.tsx               # Feature index page
```

**Example:** Exhibition feature

- Route: `/exhibition`
- Components: `src/app/exhibition/_components/ExhibitionTable.tsx`
- Server Actions: `src/lib/actions/exhibition.ts`
- Schema: `src/schema/exhibition.ts`

### Server Actions Pattern

Server actions handle all data mutations and server-side logic. They live in `src/lib/actions/[feature].ts`.

**Key Principles:**

- Use the `'use server'` directive at the top of the file
- Validate input with Zod schemas using `safeParse()`
- Return structured errors for form validation: `{ errors: Record<string, string> }`
- Use `revalidatePath()` to invalidate Next.js cache after mutations
- Use `redirect()` for navigation after successful operations

**Example Pattern:**

```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { exhibitionFormDataSchema } from '@/schema/exhibition'
import { db } from '@/lib/firestore'

export async function updateExhibition(
  id: string,
  formData: FormData
) {
  // 1. Validate input
  const result = exhibitionFormDataSchema.safeParse({
    title: formData.get('title'),
    venue: formData.get('venue'),
    // ...
  })

  if (!result.success) {
    return {
      errors: Object.fromEntries(
        result.error.issues.map(issue => [
          issue.path[0],
          issue.message
        ])
      )
    }
  }

  // 2. Perform mutation
  await db.collection('exhibition').doc(id).update(result.data)

  // 3. Revalidate cache
  revalidatePath('/exhibition')
  revalidatePath(`/exhibition/${id}`)

  // 4. Navigate to success page
  redirect('/exhibition')
}
```

**Reference:** `src/lib/actions/exhibition.ts`

### Data Flow

```
Client Form → Server Action → Validation → Firestore → Revalidation → Redirect
                                    ↓
                            Return Errors (if invalid)
```

## Schema Organization

The project separates type definitions into **DB layer** and **UI layer** to maintain clear boundaries between Firestore types and application types.

### Directory Structure

```
src/schema/
├── db/              # Database layer types (Firestore)
└── ui/              # UI layer types (Application)
```

### DB Layer Types (`src/schema/db/`)

- **Purpose**: Define Firestore document schemas with native Firestore types
- **Characteristics**:
    - Contains `Timestamp` objects for date/time fields
    - Matches the exact structure stored in Firestore
    - Used in Server Components and API routes for database operations
- **Naming Convention**: `RawExhibition`, `RawUser`, `RawBookmark`, etc.

### UI Layer Types (`src/schema/ui/`)

- **Purpose**: Define serializable application types for Client Components
- **Characteristics**:
    - Uses ISO date strings or JavaScript `Date` objects instead of `Timestamp`
    - Fully serializable (can be passed through Server/Client boundary)
    - Used in Client Components and as props
    - May include computed fields (e.g., `ongoingStatus`)
- **Naming Convention**: `Exhibition`, `User`, `Bookmark`, etc. (no "Raw" prefix)

### Type Conversion Responsibilities

1. **Server Components** (`*-section.tsx`):
    - Import from `src/schema/db/` for Firestore reads
    - Transform DB types → UI types before passing to Client Components
    - Convert `Timestamp` → ISO strings using `TZDate` with 'Asia/Tokyo' timezone

2. **API Routes** (`app/api/`):
    - Import from `src/schema/db/` for Firestore writes
    - Import from `src/schema/ui/` for request/response validation
    - Convert UI types → DB types when writing to Firestore

3. **Client Components**:
    - Only import from `src/schema/ui/`
    - Never import or use DB layer types
    - Work exclusively with serializable types

### Benefits of This Approach

- **Type Safety**: Enforces correct type usage at compile time
- **Clear Boundaries**: Separates concerns between database and application layers
- **Serializability**: Prevents non-serializable types from crossing Server/Client boundary
- **Maintainability**: Changes to database schema are isolated to DB layer
- **Flexibility**: UI types can include computed fields without affecting database schema

## Implementation Patterns

### Schema Validation with Zod

All data schemas are defined in `src/schema/[feature].ts` using Zod. Define three types of schemas:

1. **Raw Schema**: Type for Firestore documents (includes Firestore-specific types like `Timestamp`)
2. **Client Schema**: Type for client-side use (converted types like `Date`)
3. **Form Schema**: Validation schema for form submissions

**Example Pattern:**

```typescript
import { z } from 'zod'
import { Timestamp } from 'firebase-admin/firestore'

// 1. Raw schema (Firestore document)
export const rawExhibitionSchema = z.object({
  id: z.string(),
  title: z.string(),
  startDate: z.instanceof(Timestamp),
  endDate: z.instanceof(Timestamp),
  createdAt: z.instanceof(Timestamp),
  updatedAt: z.instanceof(Timestamp),
})

export type RawExhibition = z.infer<typeof rawExhibitionSchema>

// 2. Client schema (converted types)
export const exhibitionSchema = z.object({
  id: z.string(),
  title: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Exhibition = z.infer<typeof exhibitionSchema>

// 3. Form validation schema
export const exhibitionFormDataSchema = z.object({
  title: z.string().min(1, '展示会名を入力してください'),
  startDate: z.string().min(1, '開始日を入力してください'),
  endDate: z.string().min(1, '終了日を入力してください'),
})
```

**Reference:** `src/schema/exhibition.ts`

### Form Handling

Forms use React Server Actions with the `useActionState` hook for progressive enhancement.

**Pattern:**

```typescript
'use client'

import { useActionState } from 'react'
import { updateExhibition } from '@/lib/actions/exhibition'

export function ExhibitionEditForm({ exhibition }: Props) {
  const [state, formAction] = useActionState(
    updateExhibition.bind(null, exhibition.id),
    { errors: {} }
  )

  return (
    <form action={formAction}>
      <input name="title" defaultValue={exhibition.title} />
      {state.errors?.title && (
        <p className="text-red-500">{state.errors.title}</p>
      )}

      <button type="submit">保存</button>
    </form>
  )
}
```

**Best Practices:**

- Use `defaultValue` instead of `value` for form inputs (uncontrolled components)
- Display validation errors below each field
- Use `bind()` to pass additional parameters to server actions
- Initialize state with `{ errors: {} }` to avoid null checks

**Reference:** `src/app/exhibition/_components/ExhibitionEditForm.tsx`

### Date Handling

All dates use Asia/Tokyo timezone and follow a consistent conversion pattern.

**Storage:**

- Store dates in Firestore as `Timestamp`
- Always use server-side timezone conversion

**Display:**

- Convert to Date objects for client-side use
- Display dates as ISO strings or formatted strings

**Example Pattern:**

```typescript
import { Timestamp } from 'firebase-admin/firestore'
import { toZonedTime, fromZonedTime } from '@date-fns/tz'
import { format } from 'date-fns'

const TIMEZONE = 'Asia/Tokyo'

// Converting Firestore Timestamp to Date
function timestampToDate(timestamp: Timestamp): Date {
  return toZonedTime(timestamp.toDate(), TIMEZONE)
}

// Converting Date to Firestore Timestamp
function dateToTimestamp(date: Date): Timestamp {
  return Timestamp.fromDate(fromZonedTime(date, TIMEZONE))
}

// Converting form input (ISO string) to Timestamp
function isoStringToTimestamp(isoString: string): Timestamp {
  const date = new Date(isoString)
  return dateToTimestamp(date)
}

// Formatting date for display
function formatDate(date: Date): string {
  return format(date, 'yyyy年MM月dd日')
}
```

**Best Practices:**

- Always specify timezone explicitly
- Use `@date-fns/tz` for timezone-aware operations
- Use `date-fns` for date manipulation and formatting
- Avoid using `Date` constructor without timezone conversion

### Component Organization

Components are organized by scope and reusability.

**Directory Structure:**

```
src/
├── app/[feature]/_components/     # Feature-specific components
├── components/
│   ├── shadcn-ui/                 # Radix UI components (shadcn/ui)
│   └── layout/                    # Layout components
```

**Component Types:**

1. **Feature Components**: Specific to a single feature, not reusable
   - Location: `src/app/[feature]/_components/`
   - Example: `ExhibitionTable.tsx`, `ExhibitionEditForm.tsx`

2. **UI Components**: Reusable design system components
   - Location: `src/components/shadcn-ui/`
   - Example: `Button.tsx`, `Input.tsx`, `Dialog.tsx`

3. **Layout Components**: App-wide layout elements
   - Location: `src/components/layout/`
   - Example: `Header.tsx`, `AppSidebar.tsx`

**Async Components:**

Use `Suspense` with skeleton loading states for async Server Components:

```typescript
import { Suspense } from 'react'
import { ExhibitionTable } from './_components/ExhibitionTable'
import { ExhibitionTableSkeleton } from './_components/ExhibitionTableSkeleton'

export default function ExhibitionPage() {
  return (
    <Suspense fallback={<ExhibitionTableSkeleton />}>
      <ExhibitionTable />
    </Suspense>
  )
}
```

### Testing

Tests are co-located with components and use Vitest + Testing Library.

**Test File Naming:**

- Component: `ExhibitionTable.tsx`
- Test: `ExhibitionTable.test.tsx`

**Testing Pattern:**

```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ExhibitionTable } from './ExhibitionTable'

describe('ExhibitionTable', () => {
  it('renders exhibition data', () => {
    const exhibitions = [
      { id: '1', title: 'Test Exhibition', venue: 'Test Venue' }
    ]

    render(<ExhibitionTable exhibitions={exhibitions} />)

    expect(screen.getByText('Test Exhibition')).toBeInTheDocument()
    expect(screen.getByText('Test Venue')).toBeInTheDocument()
  })
})
```

**Best Practices:**

- Test user-visible behavior, not implementation details
- Use `screen.getByRole()` instead of `getByTestId()` when possible
- Test error states and edge cases
- Keep tests simple and focused on a single behavior

**Reference:** `vitest.config.ts`, `vitest.setup.ts`

### Firestore Integration

Firestore is the primary database for the application.

**Setup:**

- Instance exported from `src/lib/firestore.ts`
- Uses Google Cloud Application Default Credentials (ADC) for authentication
- Initialize once and reuse the instance

**Usage Pattern:**

```typescript
import { db } from '@/lib/firestore'

// Read
const exhibitionDoc = await db.collection('exhibition').doc(id).get()
const exhibition = exhibitionDoc.data()

// Write
await db.collection('exhibition').doc(id).set({
  title: 'New Exhibition',
  createdAt: Timestamp.now(),
})

// Update
await db.collection('exhibition').doc(id).update({
  title: 'Updated Title',
  updatedAt: Timestamp.now(),
})

// Delete
await db.collection('exhibition').doc(id).delete()

// Query
const snapshot = await db
  .collection('exhibition')
  .where('status', '==', 'active')
  .orderBy('startDate', 'desc')
  .get()

const exhibitions = snapshot.docs.map(doc => ({
  id: doc.id,
  ...doc.data()
}))
```

**Best Practices:**

- Store dates as Firestore `Timestamp`, not `Date` or strings
- Use transactions for operations with race conditions (see `.claude/rules/firestore/transaction.md`)
- Follow data modeling guidelines (see `.claude/rules/firestore/data-modeling.md`)
- Always add `createdAt` and `updatedAt` timestamps

## Feature Development Workflow

Follow this workflow when creating a new feature:

### 1. Create Feature Directory

```bash
mkdir -p src/app/[feature]/_components
```

### 2. Define Data Schema

Create `src/schema/[feature].ts` with Raw, Client, and Form schemas:

```typescript
// Raw schema (Firestore)
export const rawFeatureSchema = z.object({ /* ... */ })
export type RawFeature = z.infer<typeof rawFeatureSchema>

// Client schema
export const featureSchema = z.object({ /* ... */ })
export type Feature = z.infer<typeof featureSchema>

// Form validation schema
export const featureFormDataSchema = z.object({ /* ... */ })
```

### 3. Create Server Actions

Create `src/lib/actions/[feature].ts`:

```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { featureFormDataSchema } from '@/schema/[feature]'
import { db } from '@/lib/firestore'

export async function createFeature(formData: FormData) {
  // Validation → Mutation → Revalidation → Redirect
}

export async function updateFeature(id: string, formData: FormData) {
  // ...
}

export async function deleteFeature(id: string) {
  // ...
}
```

### 4. Build UI Components

Create components in `src/app/[feature]/_components/`:

- List component (e.g., `FeatureTable.tsx`)
- Form component (e.g., `FeatureEditForm.tsx`)
- Detail component (e.g., `FeatureDetail.tsx`)
- Loading skeleton (e.g., `FeatureTableSkeleton.tsx`)

### 5. Create Routes

- Index page: `src/app/[feature]/page.tsx`
- Create page: `src/app/[feature]/new/page.tsx` (if needed)
- Edit page: `src/app/[feature]/[id]/edit/page.tsx`
- Detail page: `src/app/[feature]/[id]/page.tsx` (if needed)

### 6. Add Tests

Create test files alongside components:

- `FeatureTable.test.tsx`
- `FeatureEditForm.test.tsx`

### 7. Update Navigation

Add links to the new feature in `src/components/layout/AppSidebar.tsx`.

## Project Conventions

### Language

- **UI Text and Error Messages**: Japanese
- **Code Comments and Documentation**: English
- **Variable Names**: English
- **Commit Messages**: English

**Example:**

```typescript
// Get active exhibitions (English comment)
const exhibitions = await getActiveExhibitions()

if (!exhibitions.length) {
  return { error: '展示会が見つかりません' } // Japanese error message
}
```

### File Naming

- **Components**: PascalCase (e.g., `ExhibitionTable.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Server Actions**: camelCase (e.g., `exhibition.ts`)
- **Schemas**: camelCase (e.g., `exhibition.ts`)
- **Routes**: kebab-case (e.g., `exhibition/[id]/edit`)

### Import Order

Organize imports in the following order:

1. React and Next.js imports
2. Third-party libraries
3. Internal modules (aliases like `@/`)
4. Relative imports
5. Type imports (if not inline)

**Example:**

```typescript
import { Suspense } from 'react'
import { redirect } from 'next/navigation'

import { format } from 'date-fns'
import { z } from 'zod'

import { db } from '@/lib/firestore'
import { exhibitionSchema } from '@/schema/exhibition'

import { ExhibitionTable } from './_components/ExhibitionTable'

import type { Exhibition } from '@/schema/exhibition'
```

### Best Practices Summary

- **Keep it simple**: Don't over-engineer. Write code for the current requirements.
- **Be explicit**: Avoid magic values. Use constants and types.
- **Validate early**: Validate input at the boundary (Server Actions).
- **Handle errors gracefully**: Return structured errors, don't throw.
- **Test user behavior**: Test what users see and do, not implementation.
- **Document the why**: Code comments explain why, not what.
- **Reuse with caution**: Create abstractions when you have 3+ similar uses, not before.