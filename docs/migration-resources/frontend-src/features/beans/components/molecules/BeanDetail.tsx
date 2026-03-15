import type { FC } from 'react'

import { DetailItem } from '@/components/Elements/Card'
import type { Bean } from '@/features/beans/types'

type Props = {
  bean: Bean
}

export const BeanDetail: FC<Props> = (props) => {
  const { bean } = props

  const formatCroppedAt = (croppedAt: string): string => {
    const date = new Date(croppedAt)
    const [year, month] = [date.getFullYear(), date.getMonth()]
    return `${year}年 ${month + 1}月`
  }

  return (
    <>
      <DetailItem name="生産国" value={bean.country.name} />
      <DetailItem name="焙煎度" value={bean.roastLevel.name} />
      <DetailItem name="地域" value={bean.subregion} />
      <DetailItem name="農園" value={bean.farm} />
      <DetailItem name="品種" value={bean.variety} />
      <DetailItem name="精製方法" value={bean.process} />
      <DetailItem name="標高" value={bean.elevation && `${bean.elevation} m`} />
      <DetailItem name="収穫時期" value={bean.croppedAt && formatCroppedAt(bean.croppedAt)} />
    </>
  )
}
