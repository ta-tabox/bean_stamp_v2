"use client"

import type { ChangeEvent } from "react"
import { useEffect, useMemo, useState } from "react"

type ImagePickerProps = {
  beanName?: string
  existingImageUrls?: readonly string[]
}

type TasteTagOption = {
  id: number
  name: string
}

type TasteTagPickerProps = {
  initialSelectedIds?: readonly number[]
  options: readonly TasteTagOption[]
}

type TasteSliderFieldProps = {
  defaultValue: number
  label: string
  name: string
}

const MIN_TASTE_TAGS = 2
const MAX_TASTE_TAGS = 3

export function BeanImagePicker({
  beanName = "コーヒー豆",
  existingImageUrls = [],
}: ImagePickerProps) {
  const [previewUrls, setPreviewUrls] = useState<string[]>([...existingImageUrls])
  const [objectUrls, setObjectUrls] = useState<string[]>([])

  useEffect(() => {
    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [objectUrls])

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    objectUrls.forEach((url) => URL.revokeObjectURL(url))

    const files = Array.from(event.target.files ?? [])

    if (!files.length) {
      setObjectUrls([])
      setPreviewUrls([...existingImageUrls])
      return
    }

    const nextObjectUrls = files.map((file) => URL.createObjectURL(file))
    setObjectUrls(nextObjectUrls)
    setPreviewUrls(nextObjectUrls)
  }

  return (
    <div className="space-y-4">
      <label className="field-row">
        <span className="field-label">画像</span>
        <div className="bean-upload-field">
          <div className="bean-upload-copy">
            <strong className="text-[var(--color-fg)]">画像を選択</strong>
            <span>複数枚アップロードできます</span>
          </div>
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            className="bean-file-input"
            onChange={handleImageChange}
          />
        </div>
      </label>

      <p className="text-xs text-[var(--color-muted)]">
        最大4枚、各5MBまで。編集時に新しい画像を選択すると既存画像を置き換えます。
      </p>

      {previewUrls.length ? (
        <div className="space-y-3">
          <div className="bean-section-title">〜 {objectUrls.length ? "Preview" : "Images"} 〜</div>
          <div className="grid gap-4 sm:grid-cols-2">
            {previewUrls.map((imageUrl, index) => (
              <div
                key={`${imageUrl}-${index}`}
                className="overflow-hidden rounded-xl bg-white shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt={`${beanName}の画像 ${index + 1}`}
                  className="h-40 w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export function BeanTasteTagPicker({
  initialSelectedIds = [],
  options,
}: TasteTagPickerProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>([...initialSelectedIds])

  const selectedTags = useMemo(
    () => options.filter((option) => selectedIds.includes(option.id)),
    [options, selectedIds],
  )

  function toggleTasteTag(id: number) {
    setSelectedIds((current) => {
      if (current.includes(id)) {
        return current.filter((currentId) => currentId !== id)
      }

      if (current.length >= MAX_TASTE_TAGS) {
        return current
      }

      return [...current, id]
    })
  }

  const helperMessage =
    selectedIds.length < MIN_TASTE_TAGS
      ? `あと${MIN_TASTE_TAGS - selectedIds.length}個選択してください`
      : `${selectedIds.length}個選択中`

  return (
    <div className="space-y-4">
      <div className="field-label">フレーバータグ</div>

      <div className="flex flex-wrap gap-2">
        {selectedTags.length ? (
          selectedTags.map((tag) => (
            <span
              key={tag.id}
              className="bean-selected-tag"
            >
              {tag.name}
            </span>
          ))
        ) : (
          <span className="text-sm text-[var(--color-muted)]">2〜3個選択してください</span>
        )}
      </div>

      <div className="bean-tag-picker-panel">
        {options.map((option) => {
          const selected = selectedIds.includes(option.id)
          const disabled = !selected && selectedIds.length >= MAX_TASTE_TAGS

          return (
            <label
              key={option.id}
              className={selected ? "bean-tag-option bean-tag-option-selected" : "bean-tag-option"}
              aria-disabled={disabled}
            >
              <input
                type="checkbox"
                name="tasteTagIds"
                value={option.id}
                aria-label={option.name}
                checked={selected}
                disabled={disabled}
                onChange={() => toggleTasteTag(option.id)}
                className="bean-tag-option-input"
              />
              <span className="pointer-events-none">{option.name}</span>
              <span
                aria-hidden="true"
                className="pointer-events-none text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]"
              >
                {selected ? "ON" : "OFF"}
              </span>
            </label>
          )
        })}
      </div>

      <p className="text-xs text-[var(--color-muted)]">
        2〜3個選択してください。{helperMessage}
      </p>
    </div>
  )
}

export function BeanTasteSliderField({
  defaultValue,
  label,
  name,
}: TasteSliderFieldProps) {
  const [value, setValue] = useState(defaultValue)

  return (
    <div className="bean-slider-card">
      <div className="flex items-center justify-between">
        <label
          htmlFor={name}
          className="text-xl font-semibold text-[var(--color-fg)]"
        >
          {label}
        </label>
        <span className="bean-slider-value">{value}</span>
      </div>

      <div className="bean-slider-wrap">
        <input
          id={name}
          type="range"
          min={1}
          max={5}
          step={1}
          name={name}
          value={value}
          onChange={(event) => setValue(Number(event.target.value))}
          className="bean-range-input"
        />
        <div className="bean-slider-scale">
          {[1, 2, 3, 4, 5].map((scale) => (
            <span key={`${name}-${scale}`}>{scale}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
