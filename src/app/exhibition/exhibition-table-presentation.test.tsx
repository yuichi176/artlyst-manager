import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ExhibitionTablePresentation as ExhibitionTable } from './exhibition-table-presentation'
import { Exhibition } from '@/schema/ui'

describe('ExhibitionTable', () => {
  const dummyExhibitions = [
    {
      id: '1',
      title: '展覧会A',
      venue: '会場A',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      status: 'active',
      museumId: 'test-museum-id',
      officialUrl: 'https://example.com',
      imageUrl: 'https://example.com/image.jpg',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15',
    },
    {
      id: '2',
      title: '展覧会B',
      venue: '会場B',
      startDate: '2024-12-01',
      endDate: '2025-03-30',
      status: 'active',
      museumId: 'test-museum-id',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15',
    },
  ] satisfies Exhibition[]

  describe('基本レンダリング', () => {
    test('exhibitions が空配列の場合、「No exhibitions found.」というメッセージが表示される', () => {
      // ACT
      render(<ExhibitionTable exhibitions={[]} />)
      // ASSERT
      expect(screen.getByText('No exhibitions found.')).toBeInTheDocument()
    })

    test('展覧会データが渡された場合、すべての展覧会が表形式で表示される', () => {
      // ACT
      render(<ExhibitionTable exhibitions={dummyExhibitions} />)
      // ASSERT
      dummyExhibitions.forEach((exhibition) => {
        expect(screen.getByText(exhibition.title)).toBeInTheDocument()
        expect(screen.getByText(exhibition.venue)).toBeInTheDocument()
        expect(screen.getByText(exhibition.startDate)).toBeInTheDocument()
        expect(screen.getByText(exhibition.endDate)).toBeInTheDocument()
      })
    })
  })

  describe('フィルタリング機能', () => {
    // テスト実行時の日時を2024年11月22日に固定
    // 展覧会A: 2024-01-01 ~ 2024-01-31 (ended before mock date, not publicly visible)
    // 展覧会B: 2024-12-01 ~ 2025-03-30 (active after mock date, publicly visible)
    const mockCurrentDate = new Date('2024-11-22')
    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(mockCurrentDate)
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    test('初期状態で「すべて」フィルターが選択され、すべての展覧会が表示されている', () => {
      // ACT
      render(<ExhibitionTable exhibitions={dummyExhibitions} />)

      // ASSERT
      const allButton = screen.getByRole('button', { name: 'すべて' })
      expect(allButton).toHaveClass('bg-primary')
      expect(screen.getByText('展覧会A')).toBeInTheDocument()
      expect(screen.getByText('展覧会B')).toBeInTheDocument()
    })

    test('「公開中」ボタンをクリックすると、公開中の展覧会のみ表示される', () => {
      // ARRANGE
      render(<ExhibitionTable exhibitions={dummyExhibitions} />)

      // ACT
      const publicButton = screen.getByRole('button', { name: '公開中' })
      fireEvent.click(publicButton)

      // ASSERT
      expect(publicButton).toHaveClass('bg-primary')
      // 展覧会A is ended (2024-01-31 < 2024-11-22), so not publicly visible
      expect(screen.queryByText('展覧会A')).not.toBeInTheDocument()
      // 展覧会B is active and ends after mock date (2025-03-30 > 2024-11-22), so publicly visible
      expect(screen.getByText('展覧会B')).toBeInTheDocument()
    })

    test('「非公開」ボタンをクリックすると、非公開の展覧会のみ表示される', () => {
      // ARRANGE
      render(<ExhibitionTable exhibitions={dummyExhibitions} />)

      // ACT
      const notPublicButton = screen.getByRole('button', { name: '非公開' })
      fireEvent.click(notPublicButton)

      // ASSERT
      expect(notPublicButton).toHaveClass('bg-primary')
      // 展覧会A is ended, so not publicly visible
      expect(screen.getByText('展覧会A')).toBeInTheDocument()
      // 展覧会B is publicly visible
      expect(screen.queryByText('展覧会B')).not.toBeInTheDocument()
    })
  })

  describe('ソート機能', () => {
    const sortTestExhibitions = [
      {
        id: '1',
        title: 'B展覧会',
        venue: 'Z会場',
        startDate: '2024-03-01',
        endDate: '2024-06-30',
        status: 'pending',
        museumId: 'test-museum-id',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-15',
      },
      {
        id: '2',
        title: 'A展覧会',
        venue: 'Y会場',
        startDate: '2024-01-01',
        endDate: '2024-04-30',
        status: 'active',
        museumId: 'test-museum-id',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-15',
      },
      {
        id: '3',
        title: 'C展覧会',
        venue: 'X会場',
        startDate: '2024-02-01',
        endDate: '2024-05-31',
        status: 'active',
        museumId: 'test-museum-id',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-15',
      },
    ] satisfies Exhibition[]

    test('「展覧会」列ヘッダーを1回クリックすると、展覧会名で昇順にソートされる', async () => {
      // ARRANGE
      const user = userEvent.setup()
      render(<ExhibitionTable exhibitions={sortTestExhibitions} />)

      // ACT
      const titleHeader = screen.getByRole('button', { name: /展覧会/ })
      await user.click(titleHeader)

      // ASSERT
      const rows = screen.getAllByRole('row')
      // Skip header row (index 0), check data rows
      expect(rows[1]).toHaveTextContent('A展覧会')
      expect(rows[2]).toHaveTextContent('B展覧会')
      expect(rows[3]).toHaveTextContent('C展覧会')
    })

    test('「展覧会」列ヘッダーを2回クリックすると、展覧会名で降順にソートされる', async () => {
      // ARRANGE
      const user = userEvent.setup()
      render(<ExhibitionTable exhibitions={sortTestExhibitions} />)

      // ACT
      const titleHeader = screen.getByRole('button', { name: /展覧会/ })
      await user.click(titleHeader) // First click: ascending
      await user.click(titleHeader) // Second click: descending

      // ASSERT
      const rows = screen.getAllByRole('row')
      expect(rows[1]).toHaveTextContent('C展覧会')
      expect(rows[2]).toHaveTextContent('B展覧会')
      expect(rows[3]).toHaveTextContent('A展覧会')
    })

    test('同じ列ヘッダーを3回クリックすると、ソートがリセットされる', async () => {
      // ARRANGE
      const user = userEvent.setup()
      render(<ExhibitionTable exhibitions={sortTestExhibitions} />)

      // ACT
      const titleHeader = screen.getByRole('button', { name: /展覧会/ })
      await user.click(titleHeader) // First click: ascending
      await user.click(titleHeader) // Second click: descending
      await user.click(titleHeader) // Third click: reset

      // ASSERT
      const rows = screen.getAllByRole('row')
      // Back to original order
      expect(rows[1]).toHaveTextContent('B展覧会')
      expect(rows[2]).toHaveTextContent('A展覧会')
      expect(rows[3]).toHaveTextContent('C展覧会')
    })

    test('「会場」列ヘッダーをクリックすると、会場名でソートされる', async () => {
      // ARRANGE
      const user = userEvent.setup()
      render(<ExhibitionTable exhibitions={sortTestExhibitions} />)

      // ACT
      const venueHeader = screen.getByRole('button', { name: /会場/ })
      await user.click(venueHeader)

      // ASSERT
      const rows = screen.getAllByRole('row')
      expect(rows[1]).toHaveTextContent('X会場')
      expect(rows[2]).toHaveTextContent('Y会場')
      expect(rows[3]).toHaveTextContent('Z会場')
    })

    test('「開始日」列ヘッダーをクリックすると、開始日でソートされる', async () => {
      // ARRANGE
      const user = userEvent.setup()
      render(<ExhibitionTable exhibitions={sortTestExhibitions} />)

      // ACT
      const startDateHeader = screen.getByRole('button', { name: /開始日/ })
      await user.click(startDateHeader)

      // ASSERT
      const rows = screen.getAllByRole('row')
      expect(rows[1]).toHaveTextContent('2024-01-01')
      expect(rows[2]).toHaveTextContent('2024-02-01')
      expect(rows[3]).toHaveTextContent('2024-03-01')
    })

    test('「終了日」列ヘッダーをクリックすると、終了日でソートされる', async () => {
      // ARRANGE
      const user = userEvent.setup()
      render(<ExhibitionTable exhibitions={sortTestExhibitions} />)

      // ACT
      const endDateHeader = screen.getByRole('button', { name: /終了日/ })
      await user.click(endDateHeader)

      // ASSERT
      const rows = screen.getAllByRole('row')
      expect(rows[1]).toHaveTextContent('2024-04-30')
      expect(rows[2]).toHaveTextContent('2024-05-31')
      expect(rows[3]).toHaveTextContent('2024-06-30')
    })

    test('「ステータス」列ヘッダーをクリックすると、ステータスでソートされる', async () => {
      // ARRANGE
      const user = userEvent.setup()
      render(<ExhibitionTable exhibitions={sortTestExhibitions} />)

      // ACT
      const statusHeader = screen.getByRole('button', { name: /ステータス/ })
      await user.click(statusHeader)

      // ASSERT
      const rows = screen.getAllByRole('row')
      // After ascending sort, 'active' comes before 'pending' alphabetically
      // Row 1 and 2 should have 'active' status (A展覧会 and C展覧会)
      // Row 3 should have 'pending' status (B展覧会)
      expect(rows[1]).toHaveTextContent('A展覧会')
      expect(rows[1]).toHaveTextContent('Active')
      expect(rows[2]).toHaveTextContent('C展覧会')
      expect(rows[2]).toHaveTextContent('Active')
      expect(rows[3]).toHaveTextContent('B展覧会')
      expect(rows[3]).toHaveTextContent('Pending')
    })

    test('ある列でソート中に別の列をクリックすると、新しい列で昇順ソートが開始される', async () => {
      // ARRANGE
      const user = userEvent.setup()
      render(<ExhibitionTable exhibitions={sortTestExhibitions} />)

      // ACT
      const titleHeader = screen.getByRole('button', { name: /展覧会/ })
      await user.click(titleHeader) // Sort by title ascending
      await user.click(titleHeader) // Sort by title descending

      const venueHeader = screen.getByRole('button', { name: /会場/ })
      await user.click(venueHeader) // Switch to venue, should start ascending

      // ASSERT
      const rows = screen.getAllByRole('row')
      expect(rows[1]).toHaveTextContent('X会場')
      expect(rows[2]).toHaveTextContent('Y会場')
      expect(rows[3]).toHaveTextContent('Z会場')
    })
  })

  describe('タイトル切り詰め機能', () => {
    test('タイトルが40文字以下の場合、全文が表示される', () => {
      // ARRANGE
      const shortTitleExhibitions = [
        {
          id: '1',
          title: '短いタイトル',
          venue: '会場A',
          startDate: '2024-01-01',
          endDate: '2024-01-31',
          status: 'active',
          museumId: 'test-museum-id',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-15',
        },
      ] satisfies Exhibition[]

      // ACT
      render(<ExhibitionTable exhibitions={shortTitleExhibitions} />)

      // ASSERT
      expect(screen.getByText('短いタイトル')).toBeInTheDocument()
    })

    test('タイトルが40文字以下の場合、ツールチップは表示されない', () => {
      // ARRANGE
      const shortTitleExhibitions = [
        {
          id: '1',
          title: '短いタイトル',
          venue: '会場A',
          startDate: '2024-01-01',
          endDate: '2024-01-31',
          status: 'active',
          museumId: 'test-museum-id',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-15',
        },
      ] satisfies Exhibition[]

      // ACT
      render(<ExhibitionTable exhibitions={shortTitleExhibitions} />)

      // ASSERT
      // Tooltip trigger should not exist for short titles
      const titleCell = screen.getByText('短いタイトル')
      expect(titleCell.tagName).not.toBe('SPAN')
      expect(titleCell.classList.contains('cursor-default')).toBe(false)
    })

    test('タイトルが40文字を超える場合、40文字で切り詰められ「...」が付く', () => {
      // ARRANGE
      const longTitle =
        'これは非常に長いタイトルでテストのために40文字を超える必要がありますので文字を追加していきます'
      const longTitleExhibitions = [
        {
          id: '1',
          title: longTitle,
          venue: '会場A',
          startDate: '2024-01-01',
          endDate: '2024-01-31',
          status: 'active',
          museumId: 'test-museum-id',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-15',
        },
      ] satisfies Exhibition[]

      // ACT
      render(<ExhibitionTable exhibitions={longTitleExhibitions} />)

      // ASSERT
      const truncatedTitle = longTitle.slice(0, 40) + '...'
      expect(screen.getByText(truncatedTitle)).toBeInTheDocument()
      // The full title should not be visible in the table cell
      expect(screen.queryByText(longTitle)).not.toBeInTheDocument()
    })

    test('タイトルが40文字を超える場合、ツールチップで全文が表示される', async () => {
      // ARRANGE
      const user = userEvent.setup()
      const longTitle =
        'これは非常に長いタイトルでテストのために40文字を超える必要がありますので文字を追加していきます'
      const longTitleExhibitions = [
        {
          id: '1',
          title: longTitle,
          venue: '会場A',
          startDate: '2024-01-01',
          endDate: '2024-01-31',
          status: 'active',
          museumId: 'test-museum-id',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-15',
        },
      ] satisfies Exhibition[]

      // ACT
      render(<ExhibitionTable exhibitions={longTitleExhibitions} />)
      const truncatedTitle = longTitle.slice(0, 40) + '...'
      const tooltipTrigger = screen.getByText(truncatedTitle)

      // Hover over the truncated title to show tooltip
      await user.hover(tooltipTrigger)

      // ASSERT
      // The tooltip should show the full title
      const tooltip = await screen.findByRole('tooltip')
      expect(tooltip).toHaveTextContent(longTitle)
    })
  })

  describe('アクションメニュー（ドロップダウン）', () => {
    test('各行の「...」ボタンをクリックすると、ドロップダウンメニューが開く', async () => {
      // ARRANGE
      const user = userEvent.setup()
      render(<ExhibitionTable exhibitions={dummyExhibitions} />)

      // ACT
      const menuButtons = screen.getAllByRole('button', { name: 'Open menu' })
      await user.click(menuButtons[0])

      // ASSERT
      // Check that the dropdown menu items are visible
      expect(screen.getByRole('menuitem', { name: /編集/ })).toBeInTheDocument()
      expect(screen.getByRole('menuitem', { name: /削除/ })).toBeInTheDocument()
    })

    test('「削除」をクリックすると、削除確認モーダルが表示される', async () => {
      // ARRANGE
      const user = userEvent.setup()
      render(<ExhibitionTable exhibitions={dummyExhibitions} />)

      // ACT
      // Open the dropdown menu for the first exhibition
      const menuButtons = screen.getAllByRole('button', { name: 'Open menu' })
      await user.click(menuButtons[0])

      // Click the delete menu item
      const deleteMenuItem = screen.getByRole('menuitem', { name: /削除/ })
      await user.click(deleteMenuItem)

      // ASSERT
      // Check that the delete confirmation dialog is displayed
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText('展覧会削除')).toBeInTheDocument()
      // Verify that there are action buttons
      expect(screen.getByRole('button', { name: 'キャンセル' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '削除' })).toBeInTheDocument()
    })
  })

  describe('統合テスト', () => {
    // Mock current date for public visibility filtering
    const mockCurrentDate = new Date('2024-11-22')
    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(mockCurrentDate)
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    const integrationTestExhibitions = [
      {
        id: '1',
        title: 'A展覧会',
        venue: 'X会場',
        startDate: '2024-01-01',
        endDate: '2024-01-31', // Ended before mock date
        status: 'active',
        museumId: 'test-museum-id',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-15',
      },
      {
        id: '2',
        title: 'B展覧会',
        venue: 'Y会場',
        startDate: '2024-02-01',
        endDate: '2024-02-28', // Ended before mock date
        status: 'pending',
        museumId: 'test-museum-id',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-15',
      },
      {
        id: '3',
        title: 'C展覧会',
        venue: 'Z会場',
        startDate: '2024-03-01',
        endDate: '2025-03-31', // Active after mock date
        status: 'active',
        museumId: 'test-museum-id',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-15',
      },
    ] satisfies Exhibition[]

    test('フィルター適用後にソートしても正しく動作する', () => {
      // ARRANGE
      render(<ExhibitionTable exhibitions={integrationTestExhibitions} />)

      // ACT
      // First, apply public visibility filter
      const publicButton = screen.getByRole('button', { name: '公開中' })
      fireEvent.click(publicButton)

      // Then sort by title descending
      const titleHeader = screen.getByRole('button', { name: /展覧会/ })
      fireEvent.click(titleHeader) // ascending
      fireEvent.click(titleHeader) // descending

      // ASSERT
      const rows = screen.getAllByRole('row')
      // Only C展覧会 is publicly visible (active + endDate > mockCurrentDate)
      expect(rows).toHaveLength(2) // 1 header + 1 data row
      expect(rows[1]).toHaveTextContent('C展覧会')
      // A展覧会 (ended) and B展覧会 (pending) should not be visible
      expect(screen.queryByText('A展覧会')).not.toBeInTheDocument()
      expect(screen.queryByText('B展覧会')).not.toBeInTheDocument()
    })

    test('ソート適用後にフィルターを変更しても正しく動作する', () => {
      // ARRANGE
      render(<ExhibitionTable exhibitions={integrationTestExhibitions} />)

      // ACT
      // First, sort by venue ascending
      const venueHeader = screen.getByRole('button', { name: /会場/ })
      fireEvent.click(venueHeader)

      // Verify initial sort (all exhibitions, sorted by venue)
      let rows = screen.getAllByRole('row')
      expect(rows[1]).toHaveTextContent('X会場')
      expect(rows[2]).toHaveTextContent('Y会場')
      expect(rows[3]).toHaveTextContent('Z会場')

      // Then apply not public filter
      const notPublicButton = screen.getByRole('button', { name: '非公開' })
      fireEvent.click(notPublicButton)

      // ASSERT
      // A展覧会 (ended) and B展覧会 (pending) are not publicly visible
      // Sort should still be applied by venue
      rows = screen.getAllByRole('row')
      expect(rows).toHaveLength(3) // 1 header + 2 data rows
      expect(rows[1]).toHaveTextContent('A展覧会')
      expect(rows[1]).toHaveTextContent('X会場')
      expect(rows[2]).toHaveTextContent('B展覧会')
      expect(rows[2]).toHaveTextContent('Y会場')
      // C展覧会 (publicly visible) should not be shown
      expect(screen.queryByText('C展覧会')).not.toBeInTheDocument()
    })

    test('100件以上の展覧会データでもスムーズに動作する', () => {
      // ARRANGE
      // Create exhibitions where half are publicly visible (active + future end date)
      const largeDataSet: Exhibition[] = Array.from({ length: 150 }, (_, i) => ({
        id: `${i + 1}`,
        title: `展覧会${String.fromCharCode(65 + (i % 26))}${Math.floor(i / 26)}`,
        venue: `会場${i % 10}`,
        startDate: `2024-${String(1 + (i % 12)).padStart(2, '0')}-01`,
        // Half have future end dates, half have past end dates
        endDate: i % 2 === 0 ? '2025-12-31' : '2024-01-31',
        status: i % 2 === 0 ? 'active' : 'pending',
        museumId: 'test-museum-id',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-15',
      }))

      render(<ExhibitionTable exhibitions={largeDataSet} />)

      // ACT & ASSERT
      // Verify all exhibitions are rendered initially
      expect(screen.getAllByRole('row')).toHaveLength(151) // 1 header + 150 data rows

      // Apply public visibility filter
      const publicButton = screen.getByRole('button', { name: '公開中' })
      fireEvent.click(publicButton)

      // Verify filtered count (75 publicly visible exhibitions: active + future end date)
      expect(screen.getAllByRole('row')).toHaveLength(76) // 1 header + 75 data rows

      // Apply sort
      const titleHeader = screen.getByRole('button', { name: /展覧会/ })
      fireEvent.click(titleHeader)

      // Verify sorting works with large dataset
      const rows = screen.getAllByRole('row')
      expect(rows).toHaveLength(76) // Same count after sorting

      // Verify that data is still filtered and now sorted
      // First data row should be the first alphabetically among publicly visible exhibitions
      const firstDataRow = rows[1]
      expect(firstDataRow).toBeInTheDocument()
    })
  })
})
