import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ExhibitionEditForm } from '@/app/exhibition/[id]/edit/_components/ExhibitionEditForm'
import { Exhibition } from '@/schema/exhibition'

// Mock useRouter
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock db from firestore
vi.mock('@/lib/firestore', () => ({
  default: {
    collection: vi.fn(() => ({
      doc: vi.fn(() => ({
        update: vi.fn(),
      })),
    })),
  },
}))

// Mock revalidatePath and redirect
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

vi.mock('next/navigation', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    ...actual,
    useRouter: () => ({
      push: mockPush,
    }),
    redirect: vi.fn(),
  }
})

describe('ExhibitionEditForm', () => {
  const dummyExhibition: Exhibition = {
    id: '1',
    title: 'テスト展覧会',
    venue: 'テスト会場',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'active',
  }

  describe('基本レンダリング', () => {
    test('初期表示時に、編集対象の展覧会データがフォームフィールドに表示されている', () => {
      // ACT
      render(<ExhibitionEditForm exhibition={dummyExhibition} />)

      // ASSERT
      // Check that all form fields are populated with the exhibition data
      const titleInput = screen.getByLabelText(/展覧会名/)
      expect(titleInput).toHaveValue('テスト展覧会')

      const venueInput = screen.getByLabelText(/会場/)
      expect(venueInput).toHaveValue('テスト会場')

      const startDateInput = screen.getByLabelText(/開始日/)
      expect(startDateInput).toHaveValue('2024-01-01')

      const endDateInput = screen.getByLabelText(/終了日/)
      expect(endDateInput).toHaveValue('2024-12-31')

      const statusSelect = screen.getByRole('combobox')
      expect(statusSelect).toHaveTextContent('Active')
    })
  })

  describe('バリデーション', () => {
    test('展覧会名が空で送信した場合、エラーメッセージが表示される', async () => {
      // ARRANGE
      const user = userEvent.setup()
      render(<ExhibitionEditForm exhibition={dummyExhibition} />)

      // ACT
      // Clear the title field and remove required attribute to allow submission
      const titleInput = screen.getByLabelText(/展覧会名/) as HTMLInputElement
      titleInput.removeAttribute('required')
      await user.clear(titleInput)

      // Submit the form by calling the form's requestSubmit
      const form = titleInput.closest('form')!
      form.requestSubmit()

      // ASSERT
      // Wait for the error message to appear
      await waitFor(() => {
        expect(screen.getByText('展覧会名は必須項目です。')).toBeInTheDocument()
      })
    })

    test('会場が空で送信した場合、エラーメッセージが表示される', async () => {
      // ARRANGE
      const user = userEvent.setup()
      render(<ExhibitionEditForm exhibition={dummyExhibition} />)

      // ACT
      // Clear the venue field and remove required attribute to allow submission
      const venueInput = screen.getByLabelText(/会場/) as HTMLInputElement
      venueInput.removeAttribute('required')
      await user.clear(venueInput)

      // Submit the form by calling the form's requestSubmit
      const form = venueInput.closest('form')!
      form.requestSubmit()

      // ASSERT
      // Wait for the error message to appear
      await waitFor(() => {
        expect(screen.getByText('会場は必須項目です。')).toBeInTheDocument()
      })
    })

    test('開始日が空で送信した場合、エラーメッセージが表示される', async () => {
      // ARRANGE
      const user = userEvent.setup()
      render(<ExhibitionEditForm exhibition={dummyExhibition} />)

      // ACT
      // Clear the start date field and remove required attribute to allow submission
      const startDateInput = screen.getByLabelText(/開始日/) as HTMLInputElement
      startDateInput.removeAttribute('required')
      await user.clear(startDateInput)

      // Submit the form by calling the form's requestSubmit
      const form = startDateInput.closest('form')!
      form.requestSubmit()

      // ASSERT
      // Wait for the error message to appear
      await waitFor(() => {
        expect(screen.getByText(/開始日は有効な日付を入力してください。/)).toBeInTheDocument()
      })
    })

    test('終了日が空で送信した場合、エラーメッセージが表示される', async () => {
      // ARRANGE
      const user = userEvent.setup()
      render(<ExhibitionEditForm exhibition={dummyExhibition} />)

      // ACT
      // Clear the end date field and remove required attribute to allow submission
      const endDateInput = screen.getByLabelText(/終了日/) as HTMLInputElement
      endDateInput.removeAttribute('required')
      await user.clear(endDateInput)

      // Submit the form by calling the form's requestSubmit
      const form = endDateInput.closest('form')!
      form.requestSubmit()

      // ASSERT
      // Wait for the error message to appear
      await waitFor(() => {
        expect(screen.getByText(/終了日は有効な日付を入力してください。/)).toBeInTheDocument()
      })
    })
  })

  describe('フォーム送信', () => {
    test('「変更を保存」ボタンをクリックするとフォームが送信される', async () => {
      // ARRANGE
      const user = userEvent.setup()
      const mockUpdate = vi.fn()
      const mockDoc = vi.fn(() => ({ update: mockUpdate }))
      const mockCollection = vi.fn(() => ({ doc: mockDoc }))

      // Mock the db to track the update call
      const db = await import('@/lib/firestore')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      vi.mocked(db.default.collection).mockImplementation(mockCollection)

      render(<ExhibitionEditForm exhibition={dummyExhibition} />)

      // ACT
      const submitButton = screen.getByRole('button', { name: /変更を保存/ })
      await user.click(submitButton)

      // ASSERT
      // Wait for the form submission to complete
      await waitFor(() => {
        expect(mockCollection).toHaveBeenCalledWith('exhibition')
        expect(mockDoc).toHaveBeenCalledWith('1')
        expect(mockUpdate).toHaveBeenCalled()
      })
    })

    test('送信中は「保存中...」と表示され、ローディングアイコンが表示される', async () => {
      // ARRANGE
      const user = userEvent.setup()

      // Create a promise that we control to simulate a pending state
      let resolveUpdate: () => void
      const updatePromise = new Promise<void>((resolve) => {
        resolveUpdate = resolve
      })

      const mockUpdate = vi.fn(() => updatePromise)
      const mockDoc = vi.fn(() => ({ update: mockUpdate }))
      const mockCollection = vi.fn(() => ({ doc: mockDoc }))

      const db = await import('@/lib/firestore')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      vi.mocked(db.default.collection).mockImplementation(mockCollection)

      render(<ExhibitionEditForm exhibition={dummyExhibition} />)

      // ACT
      const submitButton = screen.getByRole('button', { name: /変更を保存/ })
      await user.click(submitButton)

      // ASSERT
      // Check that the button shows loading state
      await waitFor(() => {
        expect(screen.getByText('保存中...')).toBeInTheDocument()
        expect(submitButton).toBeDisabled()
      })

      // Clean up - resolve the promise
      resolveUpdate!()
    })

    test('送信が成功すると、展覧会一覧ページに遷移する', async () => {
      // ARRANGE
      const user = userEvent.setup()

      // Mock successful update
      const mockUpdate = vi.fn()
      const mockDoc = vi.fn(() => ({ update: mockUpdate }))
      const mockCollection = vi.fn(() => ({ doc: mockDoc }))

      const db = await import('@/lib/firestore')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      vi.mocked(db.default.collection).mockImplementation(mockCollection)

      render(<ExhibitionEditForm exhibition={dummyExhibition} />)

      // ACT
      const submitButton = screen.getByRole('button', { name: /変更を保存/ })
      await user.click(submitButton)

      // ASSERT
      // Wait for the form submission to complete and router.push to be called
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/exhibition')
      })
    })
  })

  describe('キャンセル機能', () => {
    test('「キャンセル」ボタンをクリックすると展覧会一覧ページに遷移する', async () => {
      // ARRANGE
      const user = userEvent.setup()
      render(<ExhibitionEditForm exhibition={dummyExhibition} />)

      // ACT
      const cancelButton = screen.getByRole('button', { name: 'キャンセル' })
      await user.click(cancelButton)

      // ASSERT
      // Verify that router.push was called with the exhibition list page
      expect(mockPush).toHaveBeenCalledWith('/exhibition')
    })

    test('送信中は「キャンセル」ボタンが無効化される', async () => {
      // ARRANGE
      const user = userEvent.setup()

      // Create a promise that we control to simulate a pending state
      let resolveUpdate: () => void
      const updatePromise = new Promise<void>((resolve) => {
        resolveUpdate = resolve
      })

      const mockUpdate = vi.fn(() => updatePromise)
      const mockDoc = vi.fn(() => ({ update: mockUpdate }))
      const mockCollection = vi.fn(() => ({ doc: mockDoc }))

      const db = await import('@/lib/firestore')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      vi.mocked(db.default.collection).mockImplementation(mockCollection)

      render(<ExhibitionEditForm exhibition={dummyExhibition} />)

      // ACT
      const submitButton = screen.getByRole('button', { name: /変更を保存/ })
      await user.click(submitButton)

      // ASSERT
      // Check that the cancel button is disabled during submission
      const cancelButton = screen.getByRole('button', { name: 'キャンセル' })
      await waitFor(() => {
        expect(cancelButton).toBeDisabled()
      })

      // Clean up - resolve the promise
      resolveUpdate!()
    })
  })
})
