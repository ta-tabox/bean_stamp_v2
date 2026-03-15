import type { FC } from 'react'
import { useSearchParams } from 'react-router-dom'

import ReactPaginate from 'react-paginate'

type Props = {
  currentPage: number
  totalPage: number
}

export const Pagination: FC<Props> = (props) => {
  const { currentPage, totalPage } = props
  const [searchParams, setSearchParams] = useSearchParams()

  // page番号をクエリに仕込む
  const handlePageClick = (event: { selected: number }) => {
    const { selected } = event
    const currentParams = Object.fromEntries([...searchParams])

    // URLに?page= をセット・更新, selectedは実際のページ-1が入る
    setSearchParams({ ...currentParams, page: (selected + 1).toString() })
  }

  return (
    <ReactPaginate
      forcePage={currentPage - 1} // 現在のページをreactのstateで管理
      pageCount={totalPage}
      onPageChange={handlePageClick}
      marginPagesDisplayed={1} // 先頭と末尾に表示するページ数
      pageRangeDisplayed={3} // 現在のページの前後をいくつ表示させるか
      containerClassName="pagination" // ul(pagination本体)
      pageClassName="page-item" // li
      pageLinkClassName="page-link" // a
      activeClassName="active" // active.li
      activeLinkClassName="active" // active.li < a
      // 戻る 進む
      previousClassName="page-item" // li
      nextClassName="page-item" // li
      previousLinkClassName="previous-link"
      nextLinkClassName="next-link"
      previousLabel="< Prev" // a
      nextLabel="Next >" // a
      // 先頭 or 末尾に行ったときのクラス
      disabledClassName="disabled"
      disabledLinkClassName="disabled"
      // 中間ページの省略表記関連
      breakLabel="..."
      breakClassName="page-item"
      breakLinkClassName="page-link"
    />
  )
}
