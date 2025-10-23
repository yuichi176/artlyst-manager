import { render, screen } from '@testing-library/react'
import { ExhibitionTable } from '@/app/exhibition/_components/exhibition-table/ExhibitionTable'
import { Exhibition } from '@/schema/exhibition'

describe('ExhibitionTable', () => {
  const dummyExhibitions = [
    {
      id: '1',
      title: '展覧会A',
      venue: '会場A',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      status: 'active',
    },
    {
      id: '2',
      title: '展覧会B',
      venue: '会場B',
      startDate: '2024-12-01',
      endDate: '2025-03-30',
      status: 'pending',
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
    test.todo(
      '初期状態で「すべて」フィルターが選択され、すべてのステータスの展覧会が表示されている',
    )

    test.todo('「Active」ボタンをクリックすると、ステータスが「active」の展覧会のみ表示される')

    test.todo('「Pending」ボタンをクリックすると、ステータスが「pending」の展覧会のみ表示される')
  })

  describe('ソート機能', () => {
    test.todo('「展覧会」列ヘッダーを1回クリックすると、展覧会名で昇順にソートされる')

    test.todo('「展覧会」列ヘッダーを2回クリックすると、展覧会名で降順にソートされる')

    test.todo('同じ列ヘッダーを3回クリックすると、ソートがリセットされる')

    test.todo('「会場」列ヘッダーをクリックすると、会場名でソートされる')

    test.todo('「開始日」列ヘッダーをクリックすると、開始日でソートされる')

    test.todo('「終了日」列ヘッダーをクリックすると、終了日でソートされる')

    test.todo('「ステータス」列ヘッダーをクリックすると、ステータスでソートされる')

    test.todo('ある列でソート中に別の列をクリックすると、新しい列で昇順ソートが開始される')
  })

  describe('タイトル切り詰め機能', () => {
    test.todo('タイトルが40文字以下の場合、全文が表示される')

    test.todo('タイトルが40文字以下の場合、ツールチップは表示されない')

    test.todo('タイトルが40文字を超える場合、40文字で切り詰められ「...」が付く')

    test.todo('タイトルが40文字を超える場合、ツールチップで全文が表示される')
  })

  describe('アクションメニュー（ドロップダウン）', () => {
    test.todo('各行の「...」ボタンをクリックすると、ドロップダウンメニューが開く')

    test.todo('「削除」をクリックすると、削除確認モーダルが表示される')
  })

  describe('統合テスト', () => {
    test.todo('フィルター適用後にソートしても正しく動作する')

    test.todo('ソート適用後にフィルターを変更しても正しく動作する')

    test.todo('100件以上の展覧会データでもスムーズに動作する')
  })
})
