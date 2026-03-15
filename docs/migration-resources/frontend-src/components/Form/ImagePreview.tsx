import type { FC } from 'react'

type Props = {
  imageUrls: Array<string>
}

export const ImagePreview: FC<Props> = (props) => {
  const { imageUrls } = props
  return (
    <div className="flex flex-wrap">
      {/* NOTE map処理の際のunique keyは正しいか？ */}
      {imageUrls.map((imageUrl) => (
        <img
          key={imageUrl}
          className="w-56 h-40 mx-auto mb-4 rounded object-cover"
          src={imageUrl}
          alt="プレビュー画像"
        />
      ))}
    </div>
  )
}
