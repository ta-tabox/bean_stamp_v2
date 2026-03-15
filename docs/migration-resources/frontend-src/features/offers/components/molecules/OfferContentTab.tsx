import type { FC } from 'react'

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

import { BeanDetail, BeanTasteChart } from '@/features/beans'
import { OfferSchedule } from '@/features/offers/components/molecules/OfferSchedule'
import type { Offer } from '@/features/offers/types'

type Props = {
  offer: Offer
}

export const OfferContentTab: FC<Props> = (props) => {
  const { offer } = props
  const { bean } = offer
  return (
    <Tabs>
      <TabList>
        <Tab>Overview</Tab>
        <Tab>Taste</Tab>
        <Tab>Schedule</Tab>
      </TabList>
      <div className="w-full lg:h-80">
        <TabPanel>
          <BeanDetail bean={bean} />
        </TabPanel>

        <TabPanel>
          {/* テイストチャート */}
          <div className="max-w-sm mx-auto">
            <BeanTasteChart
              acidity={bean.acidity}
              flavor={bean.flavor}
              body={bean.body}
              bitterness={bean.bitterness}
              sweetness={bean.sweetness}
            />
          </div>
        </TabPanel>

        <TabPanel>
          {/* スケジュール */}
          <OfferSchedule offer={offer} />
        </TabPanel>
      </div>
    </Tabs>
  )
}
