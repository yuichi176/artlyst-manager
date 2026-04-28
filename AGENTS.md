# Contributor Guide

このガイドは、`artlyst-manager` で作業するコントリビューターとエージェント向けの運用ルールです。リポジトリ構成、変更時の境界、検証手順、コミット方針をまとめています。

## Table of Contents

1. [Policies & Mandatory Rules](#policies--mandatory-rules)
2. [Project Structure Guide](#project-structure-guide)
3. [Operation Guide](#operation-guide)

## Policies & Mandatory Rules

### Mandatory Context7 Usage

ライブラリの使い方や最新仕様を確認する必要がある場合は、必ず Context7 MCP を使って一次情報を参照してください。

特に以下の変更では、実装前に Context7 を確認します。

- Next.js App Router, Server Components, Server Actions.
- React 19 hooks and rendering behavior.
- Firestore transactions, `Timestamp`, Application Default Credentials.
- Zod schema design and parsing behavior.
- Tailwind CSS, Radix UI, Vitest, Testing Library.

推測で実装しないこと。既存コードに合っていても、外部ライブラリの仕様に依存する変更は必ず確認してください。

### Verification Rules

ランタイムコード、テスト、ビルド設定、Lint/型検査設定を変更した場合は、完了報告の前にローカル検証を実行します。

対象の目安:

- `src/`
- `package.json`
- `pnpm-lock.yaml`
- `tsconfig.json`
- `eslint.config.mjs`
- `vitest.config.mts`
- `vitest.setup.ts`
- `next.config.ts`
- `postcss.config.mjs`
- `lefthook.yml`

以下のような docs / repo meta のみの変更は、通常はフル検証を省略できます。

- `AGENTS.md`
- `README.md`
- `.github/`

### Mandatory Local Run Order

この repo では `pnpm lint` が `--fix` 付きでファイルを変更するため、検証順は次を基本とします。

1. `pnpm lint`
2. `pnpm format`
3. `pnpm typecheck`
4. `pnpm test`
5. `pnpm build`

補足:

- `pnpm lint` は ESLint 自動修正を実行します。
- `pnpm lint:fix` という名前ですが、実際には `--fix` なしの ESLint 実行です。
- `pnpm format` はチェックのみ、`pnpm format:fix` は書き込みありです。
- `pnpm lint` がファイルを書き換えた場合は、その後の検証を省略しないでください。

### Planning For Larger Changes

複数ページにまたがる機能追加、大きめのリファクタ、データモデル変更では、実装前に簡単な実行計画を作成してください。

ルール:

- リポジトリルートに配置する。
- ファイル名は目的が分かるものにする。例: `exhibition-bulk-edit.plan.md`
- 互換性リスク、Firestore データへの影響、UI 回帰ポイントを明記する。

## Project Structure Guide

### App Architecture

この repo は Next.js App Router ベースです。基本構成は `page / section / presentation` です。

- `page.tsx`: ルート入口。レイアウトや `Suspense` を組み立て、`*-section.tsx` を呼ぶ。
- `*-section.tsx`: 主に Server Component。Firestore から読み取り、UI 用データに変換して presentation に渡す。
- `*-presentation.tsx`: 主に Client Component。表示、入力、ローカル state、`useActionState` を担当する。
- `_components/`: ページ専用の分割 UI。モーダルやセル UI などを置く。

### Data Fetching And Mutation Rules

- 読み取りは Server Component または server-only なコードで行う。
- Firestore への直接アクセスは `src/lib/firestore.ts` を入口にする。
- Client Component から Firestore を直接読まない。
- 更新、作成、削除は `src/lib/actions/*.ts` の Server Actions に集約する。
- Client 側のフォーム送信は `useActionState` を使う既存パターンに合わせる。
- 変更後は必要な `revalidatePath()` を忘れない。

### Schema Layer Boundaries

- `src/schema/common/`: 共有 enum 相当の Zod schema や定数。
- `src/schema/db/`: Firestore 保存形式。`Timestamp` を含む server-only な型。
- `src/schema/ui/`: Client に渡せるシリアライズ可能な schema / type / form schema。
- `src/schema/converters.ts`: `db` レイヤーから `ui` レイヤーへの変換。

禁止事項:

- Client Component から `src/schema/db/` を import しない。
- Firestore の `Timestamp` をそのまま Client Component に渡さない。
- Zod を通さずに `FormData` を直接信用しない。

### Date And Time Rules

- Firestore の `Timestamp` は UI に渡す前に ISO 文字列へ変換する。
- 展覧会の開始日・終了日のような日付ベース項目は、書き込み時に `TZDate(..., 'Asia/Tokyo')` を使う。
- `createdAt` や `updatedAt` は `Timestamp.now()` を使って保存する。

### Firestore Guidelines

#### General

- Firestore の認証は `src/lib/firestore.ts` の Application Default Credentials 前提を維持する。
- 既存コレクション名とドキュメント shape を安易に変えない。

#### Document IDs

- 展覧会ドキュメント ID は `getExhibitionDocumentId()` を使う既存ルールを維持する。
- 一意性や存在確認が重要なデータは、ランダム ID よりも意味のある ID を優先する。

#### Transactions

- 重複防止、存在確認後の作成、複数条件を伴う更新には transaction を使う。
- transaction 内では、すべての read を write より先に行う。
- transaction 内で外部 API 呼び出しや副作用を行わない。

### Frontend Guidelines

- 既存の `shadcn-ui` コンポーネントを優先して使う。
- className の合成には `src/utils/cn.ts` の `cn` を使う。
- フォーム UI では `FormSubmitState` の field error 表示パターンを揃える。
- 大きな presentation component は、近い `_components/` へ分割する。
- アクセシビリティを崩さない。ラベル、`aria-live`、`sr-only` を既存水準で維持する。

### TypeScript Guidelines

- exported symbol には明示的な型を付ける。
- `any` は避け、必要なら `unknown` から絞り込む。
- union は `type`、オブジェクト形状は `interface` を基本にする。
- `null` / `undefined` は明示的に扱う。
- 変換ロジックは `src/schema/converters.ts` など境界で吸収し、UI 側に漏らさない。

### Testing Guidelines

- テストは Vitest + Testing Library + `jsdom` 前提。
- クエリ優先順位は `getByRole` を最優先にする。
- ユーザー操作は `user-event` を優先する。
- schema のパース、改行区切り変換、境界条件はユニットテストで押さえる。
- 外部依存を mock する場合は import 前に準備する。

## Operation Guide

### Prerequisites

- Node.js 22+
- pnpm 10+
- Firestore に接続できる Google Cloud Application Default Credentials

### Common Commands

```bash
pnpm dev
pnpm lint
pnpm lint:fix
pnpm format
pnpm format:fix
pnpm typecheck
pnpm test
pnpm build
```

### Development Workflow

1. デフォルトブランチを最新化する。
2. 意味のあるブランチ名で作業する。
3. 実装前に既存の page / section / presentation 構成を確認する。
4. ライブラリ仕様が絡む場合は Context7 を確認する。
5. 変更後は必要な検証を実行する。
6. PR では変更内容、リスク、検証結果を簡潔にまとめる。

### Pull Request And Commit Guidelines

- コミットメッセージは Conventional Commits を使う。
- 例:

```text
feat(exhibition): support manual genre updates
fix(museum): preserve scrape urls on validation error
docs(repo): add contributor guide for agents
```

- サマリーは短く具体的に書く。
- PR には少なくとも以下を含める。
  - 何を変えたか。
  - なぜ変えたか。
  - Firestore / UI / validation への影響。
  - 実行した検証コマンド。

### Review Focus

レビューでは特に次を重視します。

- Server Component と Client Component の責務分離が守られているか。
- Firestore `Timestamp` が UI 層へ漏れていないか。
- Server Action が Zod で入力検証しているか。
- `revalidatePath()` の不足や対象漏れがないか。
- 既存 UI の操作性やアクセシビリティを壊していないか。
