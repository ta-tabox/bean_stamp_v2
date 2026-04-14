"use client"

import { useMemo, useState } from "react"

type SearchPrefectureMultiSelectProps = {
  defaultValues: string[]
  label: string
  name: string
  options: ReadonlyArray<{ label: string; value: string }>
}

export function SearchPrefectureMultiSelect({
  defaultValues,
  label,
  name,
  options,
}: SearchPrefectureMultiSelectProps) {
  const [selectedValues, setSelectedValues] = useState<string[]>(defaultValues)

  const selectedOptions = useMemo(
    () => options.filter((option) => selectedValues.includes(option.value)),
    [options, selectedValues],
  )

  function toggleValue(value: string) {
    setSelectedValues((current) => {
      if (current.includes(value)) {
        return current.filter((currentValue) => currentValue !== value)
      }

      return [...current, value]
    })
  }

  function removeValue(value: string) {
    setSelectedValues((current) => current.filter((currentValue) => currentValue !== value))
  }

  return (
    <div className="space-y-4">
      <div className="field-label">{label}</div>

      <div className="flex flex-wrap gap-2">
        {selectedOptions.length ? (
          selectedOptions.map((option) => (
            <span
              key={option.value}
              className="bean-selected-tag"
            >
              <span>{option.label}</span>
              <button
                type="button"
                onClick={() => removeValue(option.value)}
                className="bean-selected-tag-button"
                aria-label={`${option.label}を選択解除`}
              >
                ×
              </button>
            </span>
          ))
        ) : (
          <span className="text-sm text-[var(--color-muted)]">
            クリックして都道府県を選択してください
          </span>
        )}
      </div>

      <div
        role="group"
        aria-label={label}
        className="bean-tag-picker-panel"
      >
        {options.map((option) => {
          const selected = selectedValues.includes(option.value)

          return (
            <label
              key={option.value}
              className={selected ? "bean-tag-option bean-tag-option-selected" : "bean-tag-option"}
            >
              <input
                type="checkbox"
                name={name}
                value={option.value}
                aria-label={option.label}
                checked={selected}
                onChange={() => toggleValue(option.value)}
                className="bean-tag-option-input"
              />
              <span className="pointer-events-none">{option.label}</span>
            </label>
          )
        })}
      </div>

      <p className="text-xs text-[var(--color-muted)]">
        複数選択できます。{selectedValues.length}件選択中
      </p>
    </div>
  )
}
