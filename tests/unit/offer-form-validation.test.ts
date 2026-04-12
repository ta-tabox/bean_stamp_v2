import { describe, expect, it } from "vitest"

import {
  hasMissingRequiredOfferFields,
  validateOfferForm,
  type OfferFormValues,
} from "@/features/offers/components/offer-form-validation"

const validValues: OfferFormValues = {
  amount: "12",
  beanId: "4",
  endedAt: "2026-04-13",
  price: "1800",
  receiptEndedAt: "2026-04-16",
  receiptStartedAt: "2026-04-15",
  roastedAt: "2026-04-14",
  weight: "200",
}

describe("offer form validation", () => {
  it("未入力の必須項目を検出する", () => {
    expect(
      validateOfferForm(
        {
          ...validValues,
          amount: "",
          beanId: "",
          endedAt: "",
        },
        {
          requireBeanSelection: true,
          today: "2026-04-12",
        },
      ),
    ).toMatchObject({
      amount: "数量を入力してください",
      beanId: "コーヒー豆を選択してください",
      endedAt: "オファー終了日を入力してください",
    })
  })

  it("日付の前後関係が不正な場合に対応する項目へエラーを返す", () => {
    expect(
      validateOfferForm(
        {
          ...validValues,
          endedAt: "2026-04-12",
          receiptEndedAt: "2026-04-14",
          receiptStartedAt: "2026-04-14",
          roastedAt: "2026-04-12",
        },
        {
          requireBeanSelection: true,
          today: "2026-04-13",
        },
      ),
    ).toEqual({
      endedAt: "オファー終了日は本日以降の日付を指定してください",
      receiptEndedAt: "受け取り終了日は受け取り開始日より後の日付を指定してください",
    })
  })

  it("基準日が正しい場合は次の比較エラーを返す", () => {
    expect(
      validateOfferForm(
        {
          ...validValues,
          receiptEndedAt: "2026-04-15",
          receiptStartedAt: "2026-04-15",
          roastedAt: "2026-04-13",
        },
        {
          requireBeanSelection: true,
          today: "2026-04-12",
        },
      ),
    ).toEqual({
      receiptEndedAt: "受け取り終了日は受け取り開始日より後の日付を指定してください",
      roastedAt: "焙煎日はオファー終了日より後の日付を指定してください",
    })
  })

  it("必須項目が揃うまでは送信不可判定になる", () => {
    expect(hasMissingRequiredOfferFields(validValues, true)).toBe(false)
    expect(
      hasMissingRequiredOfferFields(
        {
          ...validValues,
          weight: "",
        },
        true,
      ),
    ).toBe(true)
  })
})
