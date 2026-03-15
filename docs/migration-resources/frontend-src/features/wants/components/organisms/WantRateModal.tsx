import type { Dispatch, FC } from 'react'

import { useForm } from 'react-hook-form'

import { PrimaryButton } from '@/components/Elements/Button'
import { Modal } from '@/components/Elements/Modal'
import { FormContainer, FormTitle } from '@/components/Form'
import { useGetRecommendedOffers } from '@/features/offers'
import { patchWantByRate } from '@/features/wants/api/patchWantByRate'
import { WantRateRadioButton } from '@/features/wants/components/molecules/WantRateRadioButton'
import type { Want } from '@/features/wants/types'
import { useMessage } from '@/hooks/useMessage'

import type { SubmitHandler } from 'react-hook-form'

type Props = {
  isOpen: boolean
  onClose: () => void
  wantId: number
  beanName: string
  setWant: Dispatch<React.SetStateAction<Want | undefined>>
}

export const WantRateModal: FC<Props> = (props) => {
  const { isOpen, onClose, wantId, beanName, setWant } = props
  const { showMessage } = useMessage()
  const { getRecommendedOffers } = useGetRecommendedOffers()

  const {
    register,
    handleSubmit,
    formState: { isDirty },
  } = useForm<Pick<Want, 'rate'>>({})

  const onSubmit: SubmitHandler<Pick<Want, 'rate'>> = (data) => {
    patchWantByRate({ id: wantId, rate: data.rate })
      .then((response) => {
        setWant(response.data)
        getRecommendedOffers() // おすすめのオファーを再計算・取得する
        showMessage({ message: 'コーヒー豆を評価しました', type: 'success' })
      })
      .catch(() => {
        showMessage({ message: 'すでに評価が完了しています', type: 'error' })
      })
      .finally(() => {
        onClose()
      })
  }

  return (
    <Modal contentLabel={`${beanName}の評価`} isOpen={isOpen} onClose={onClose} closeButton>
      <FormContainer>
        <FormTitle>{`${beanName}を評価する`}</FormTitle>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="radio-tile-group">
            <WantRateRadioButton value="bad" label="bad" register={register} />
            <WantRateRadioButton value="so_so" label="so so" register={register} />
            <WantRateRadioButton value="good" label="good" register={register} />
            <WantRateRadioButton value="excellent" label="excellent" register={register} />
          </div>

          <div className="text-center mt-4">
            <PrimaryButton disabled={!isDirty}>評価する</PrimaryButton>
          </div>
        </form>
      </FormContainer>
    </Modal>
  )
}
