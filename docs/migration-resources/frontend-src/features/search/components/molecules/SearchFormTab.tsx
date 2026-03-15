import type { FC, MouseEventHandler } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

import { FormContainer, FormMain } from '@/components/Form'
import { OfferSearchForm } from '@/features/search/components/organisms/OfferSearchForm'
import { RoasterSearchForm } from '@/features/search/components/organisms/RoasterSearchFrom'

export const SearchFormTab: FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const onClickTab: MouseEventHandler<HTMLLIElement> = () => {
    navigate('/search')
  }

  return (
    <FormContainer>
      <Tabs defaultIndex={location.pathname === '/search/offers' ? 1 : 0}>
        <div className="">
          <TabList>
            <Tab onClick={onClickTab}>Roaster</Tab>
            <Tab onClick={onClickTab}>Offer</Tab>
          </TabList>
        </div>

        <div className="mt-8">
          <FormMain>
            <TabPanel>
              <RoasterSearchForm />
            </TabPanel>
            <TabPanel>
              <OfferSearchForm />
            </TabPanel>
          </FormMain>
        </div>
      </Tabs>
    </FormContainer>
  )
}
