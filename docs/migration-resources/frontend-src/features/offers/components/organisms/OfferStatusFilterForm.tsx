import type { FC } from 'react'
import { useSearchParams } from 'react-router-dom'

import Select from 'react-select'

import type { SingleValue } from 'react-select'

export const OfferStatusFilterForm: FC = () => {
  const [, setSearchParams] = useSearchParams()

  const statusOptions = [
    { label: 'オファー中', value: 'on_offering' },
    { label: 'ロースト期間', value: 'on_roasting' },
    { label: '準備中', value: 'on_preparing' },
    { label: '受け取り期間', value: 'on_selling' },
    { label: '受け取り終了', value: 'end_of_sales' },
  ]

  // サーチパラメータを変更 パラメータを依存配列に設定し、データをfetchさせる
  const onChange = (
    value: SingleValue<{
      label: string
      value: string
    }>
  ) => {
    if (value) {
      setSearchParams({ status: value?.value })
    } else {
      setSearchParams({})
    }
  }

  return (
    <div className="search__form">
      <div className="search__button">
        <svg className="w-4 h-4 sm:w-6 sm:h-6 text-gray-400">
          <use xlinkHref="#search" />
        </svg>
        検索
      </div>
      <Select
        options={statusOptions}
        onChange={onChange}
        isClearable
        styles={{ control: () => ({}), valueContainer: (provided) => ({ ...provided, padding: 0 }) }} // デフォルトのスタイルをクリア
        className="search-container" // react-selectコンポーネントのクラス名
        classNamePrefix="search" // react-selectコンポーネント化のクラスに"search__"プリフィックスをつける
        noOptionsMessage={() => 'ステータスが見つかりませんでした'}
        placeholder="ステータスを選択"
      />
    </div>
  )
}
