export type OfferFormField =
  | "amount"
  | "beanId"
  | "endedAt"
  | "price"
  | "receiptEndedAt"
  | "receiptStartedAt"
  | "roastedAt"
  | "weight"

export type OfferFormValues = Record<OfferFormField, string>

export type OfferFormErrors = Partial<Record<OfferFormField, string>>

type ValidateOfferFormOptions = {
  requireBeanSelection: boolean
  today?: string
}

export function validateOfferForm(
  values: OfferFormValues,
  options: ValidateOfferFormOptions,
): OfferFormErrors {
  const errors: OfferFormErrors = {}
  const today = options.today ?? currentDateKey()

  if (options.requireBeanSelection && !values.beanId.trim()) {
    errors.beanId = "コーヒー豆を選択してください"
  }

  validateRequiredIntegerField(errors, values.price, "price", "価格")
  validateRequiredIntegerField(errors, values.weight, "weight", "内容量")
  validateRequiredIntegerField(errors, values.amount, "amount", "数量")
  validateRequiredDateField(errors, values.endedAt, "endedAt", "オファー終了日")
  validateRequiredDateField(errors, values.roastedAt, "roastedAt", "焙煎日")
  validateRequiredDateField(errors, values.receiptStartedAt, "receiptStartedAt", "受け取り開始日")
  validateRequiredDateField(errors, values.receiptEndedAt, "receiptEndedAt", "受け取り終了日")

  if (!errors.endedAt && values.endedAt < today) {
    errors.endedAt = "オファー終了日は本日以降の日付を指定してください"
  }

  if (!errors.endedAt && !errors.roastedAt && values.roastedAt <= values.endedAt) {
    errors.roastedAt = "焙煎日はオファー終了日より後の日付を指定してください"
  }

  if (
    !errors.roastedAt &&
    !errors.receiptStartedAt &&
    values.receiptStartedAt <= values.roastedAt
  ) {
    errors.receiptStartedAt = "受け取り開始日は焙煎日より後の日付を指定してください"
  }

  if (
    !errors.receiptStartedAt &&
    !errors.receiptEndedAt &&
    values.receiptEndedAt <= values.receiptStartedAt
  ) {
    errors.receiptEndedAt = "受け取り終了日は受け取り開始日より後の日付を指定してください"
  }

  return errors
}

export function hasMissingRequiredOfferFields(
  values: OfferFormValues,
  requireBeanSelection: boolean,
) {
  const requiredFields: OfferFormField[] = [
    "price",
    "weight",
    "amount",
    "endedAt",
    "roastedAt",
    "receiptStartedAt",
    "receiptEndedAt",
  ]

  if (requireBeanSelection) {
    requiredFields.push("beanId")
  }

  return requiredFields.some((field) => !values[field].trim())
}

function validateRequiredIntegerField(
  errors: OfferFormErrors,
  value: string,
  field: "amount" | "price" | "weight",
  label: string,
) {
  if (!value.trim()) {
    errors[field] = `${label}を入力してください`
    return
  }

  const parsed = Number(value)

  if (!Number.isInteger(parsed) || parsed < 1) {
    errors[field] = `${label}は1以上の整数を入力してください`
  }
}

function validateRequiredDateField(
  errors: OfferFormErrors,
  value: string,
  field: "endedAt" | "receiptEndedAt" | "receiptStartedAt" | "roastedAt",
  label: string,
) {
  if (!value.trim()) {
    errors[field] = `${label}を入力してください`
  }
}

function currentDateKey(now = new Date()) {
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-")
}
