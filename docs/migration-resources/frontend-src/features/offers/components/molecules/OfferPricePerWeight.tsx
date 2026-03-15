import type { FC } from 'react'

type Props = {
  price: number
  weight: number
}
export const OfferPricePerWeight: FC<Props> = (props) => {
  const { price, weight } = props
  return <div className="text-2xl text-gray-900">{`${price}円 / ${weight} g`}</div>
}
