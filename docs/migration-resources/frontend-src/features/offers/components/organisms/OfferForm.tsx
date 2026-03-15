import type { FC } from 'react'

import { useForm } from 'react-hook-form'

import { PrimaryButton, SecondaryButton } from '@/components/Elements/Button'
import { OfferAmountInput } from '@/features/offers/components/molecules/OfferAmountInput'
import { OfferEndedAtInput } from '@/features/offers/components/molecules/OfferEndedAtInput'
import { OfferPriceInput } from '@/features/offers/components/molecules/OfferPriceInput'
import { OfferReceiptEndedAtInput } from '@/features/offers/components/molecules/OfferReceiptEndedAt'
import { OfferReceiptStartedAt } from '@/features/offers/components/molecules/OfferReceiptStartedAt'
import { OfferRoastedAtInput } from '@/features/offers/components/molecules/OfferRoastedAtInput'
import { OfferWeightInput } from '@/features/offers/components/molecules/OfferWeightInput'
import type { Offer, OfferCreateUpdateData } from '@/features/offers/types'

import type { SubmitHandler } from 'react-hook-form'

type Props = {
  beanId: number
  offer?: Offer | null
  loading: boolean
  submitTitle: string
  onSubmit: SubmitHandler<OfferCreateUpdateData>
  onClose: () => void
}

export const OfferForm: FC<Props> = (props) => {
  const { beanId, offer = null, loading, submitTitle, onSubmit, onClose } = props

  // フォーム初期値の設定 RoasterNew -> {}, Roaster Edit -> {初期値}
  const defaultValues = () => {
    let values: OfferCreateUpdateData | Pick<OfferCreateUpdateData, 'beanId'>
    if (offer) {
      values = {
        beanId,
        price: offer.price,
        weight: offer.weight,
        amount: offer.amount,
        endedAt: offer.endedAt,
        roastedAt: offer.roastedAt,
        receiptStartedAt: offer.receiptStartedAt,
        receiptEndedAt: offer.receiptEndedAt,
      }
    } else {
      values = {
        beanId,
      }
    }

    return values
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { isDirty, dirtyFields, errors },
  } = useForm<OfferCreateUpdateData>({
    mode: 'onTouched',
    criteriaMode: 'all',
    defaultValues: defaultValues(),
  })

  const onClickCancel = (): void => {
    // モーダルを閉じる
    onClose()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <OfferEndedAtInput label="endedAt" register={register} error={errors.endedAt} roastedAt={watch('roastedAt')} />
      <OfferRoastedAtInput
        label="roastedAt"
        register={register}
        error={errors.roastedAt}
        endedAt={watch('endedAt')}
        receiptStartedAt={watch('receiptStartedAt')}
      />
      <OfferReceiptStartedAt
        label="receiptStartedAt"
        register={register}
        error={errors.receiptStartedAt}
        roastedAt={watch('roastedAt')}
        receiptEndedAt={watch('receiptEndedAt')}
      />
      <OfferReceiptEndedAtInput
        label="receiptEndedAt"
        register={register}
        error={errors.receiptEndedAt}
        receiptStartedAt={watch('receiptStartedAt')}
      />

      <OfferPriceInput label="price" register={register} error={errors.price} />
      <OfferWeightInput label="weight" register={register} error={errors.weight} />
      <OfferAmountInput label="amount" register={register} error={errors.amount} />

      <div className="flex items-center justify-center space-x-4 mt-4">
        <SecondaryButton onClick={onClickCancel} isButton>
          キャンセル
        </SecondaryButton>
        {/* offerあり(更新時)→ どれか変更, なし(新規作成時)→ 該当項目変更必須 */}
        <PrimaryButton
          disabled={
            offer
              ? !isDirty
              : !dirtyFields.endedAt ||
                !dirtyFields.roastedAt ||
                !dirtyFields.receiptStartedAt ||
                !dirtyFields.receiptEndedAt ||
                !dirtyFields.price ||
                !dirtyFields.weight ||
                !dirtyFields.amount
          }
          loading={loading}
        >
          {submitTitle}
        </PrimaryButton>
      </div>
    </form>
  )
}
