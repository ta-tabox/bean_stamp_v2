/* eslint-disable @next/next/no-img-element */
import Link from "next/link"
import type { ReactNode } from "react"

type DetailItem = {
  label: string
  value: string
}

type ActionLink = {
  href: string
  label: string
  tone?: "primary" | "secondary"
}

type FooterLink = {
  href: string
  label: string
}

type ProfileSummaryCardProps = {
  actions?: ReactNode
  children?: ReactNode
  description: string
  details: readonly DetailItem[]
  handle: string
  imageUrl?: string | null
  kind: string
  name: string
  placeholder: "roaster" | "user"
}

type ProfileListSectionProps = {
  children?: ReactNode
  emptyAction?: ActionLink
  emptyDescription: string
  emptyTitle: string
  hasItems: boolean
  title: string
}

type ProfileListItemLinkProps = {
  badge: string
  description: string
  href: string
  imageUrl?: string | null
  placeholder?: "roaster" | "user"
  subtitle: string
  title: string
}

type ProfileFormShellProps = {
  children: ReactNode
  description: string
  footerLinks?: readonly FooterLink[]
  handle?: string
  imageUrl?: string | null
  kind: string
  name: string
  placeholder: "roaster" | "user"
  submitLabel: string
  title: string
}

type ProfileFieldProps = {
  defaultValue: string
  label: string
  name: string
  required?: boolean
  type?: "email" | "text" | "url"
}

type ProfileSelectFieldProps = {
  defaultValue: string
  label: string
  name: string
  options: ReadonlyArray<{ label: string; value: string }>
  required?: boolean
}

type ProfileTextareaProps = {
  defaultValue: string
  label: string
  name: string
  rows?: number
}

type StatusBannerProps = {
  children: ReactNode
}

export function ProfileSummaryCard({
  actions,
  children,
  description,
  details,
  handle,
  imageUrl,
  kind,
  name,
  placeholder,
}: ProfileSummaryCardProps) {
  return (
    <section className="page-card">
      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_14rem] lg:items-start lg:gap-10">
        <div className="min-w-0 text-center lg:pl-4 lg:text-left">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between lg:gap-4">
            <div className="min-w-0 flex-1">
              <p className="panel-label">{kind}</p>
              <h2 className="title-font mt-2 text-3xl text-[var(--color-fg)]">{name}</h2>
            </div>
            {actions ? (
              <div className="flex justify-center lg:shrink-0 lg:justify-end">{actions}</div>
            ) : null}
          </div>

          <div className="mt-4 max-w-xl text-sm leading-7 text-gray-500">
            <div>{handle}</div>
            <p className="mt-4">{description}</p>
          </div>

          {children ? <div className="mt-6 max-w-xl">{children}</div> : null}

          <dl className="mt-6 max-w-xl space-y-2 text-sm leading-7 text-gray-600">
            {details.map((detail) => (
              <div
                key={`${detail.label}-${detail.value}`}
                className="grid gap-x-3 gap-y-1 border-b border-[var(--color-border)] pb-2 sm:grid-cols-[8rem_minmax(0,1fr)]"
              >
                <dt className="font-medium text-gray-800">{detail.label}</dt>
                <dd className="min-w-0 break-words text-gray-700">{detail.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex justify-center lg:justify-end">
          <ProfileAvatar
            name={name}
            imageUrl={imageUrl}
            placeholder={placeholder}
          />
        </div>
      </div>
    </section>
  )
}

export function ProfileLinksRow({ links, title }: { links: readonly ActionLink[]; title: string }) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <div className="flex flex-wrap items-center gap-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={
              link.tone === "primary"
                ? "btn btn-primary btn-compact"
                : "btn btn-secondary btn-compact"
            }
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

export function ProfileListSection({
  children,
  emptyAction,
  emptyDescription,
  emptyTitle,
  hasItems,
  title,
}: ProfileListSectionProps) {
  return (
    <section className="page-card">
      <div className="border-b border-[var(--color-border)] pb-4">
        <h3 className="title-font text-2xl text-[var(--color-fg)]">{title}</h3>
      </div>
      {hasItems ? (
        <div className="mt-4 overflow-hidden rounded-xl border border-[var(--color-border)] bg-white">
          {children}
        </div>
      ) : (
        <div className="empty-state mt-6">
          <h4 className="title-font text-xl text-[var(--color-fg)]">{emptyTitle}</h4>
          <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">{emptyDescription}</p>
          {emptyAction ? (
            <Link
              href={emptyAction.href}
              className={`mt-5 ${emptyAction.tone === "primary" ? "btn btn-primary" : "btn btn-secondary"}`}
            >
              {emptyAction.label}
            </Link>
          ) : null}
        </div>
      )}
    </section>
  )
}

export function ProfileListItemLink({
  badge,
  description,
  href,
  imageUrl,
  placeholder = "roaster",
  subtitle,
  title,
}: ProfileListItemLinkProps) {
  return (
    <Link
      href={href}
      className="list-item-link"
    >
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <ProfileAvatar
          name={title}
          compact
          imageUrl={imageUrl}
          placeholder={placeholder}
        />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-gray-800">{title}</p>
          <p className="truncate text-sm text-gray-600">{subtitle}</p>
          <p className="truncate text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <span className="metric-chip shrink-0">{badge}</span>
    </Link>
  )
}

export function ProfileFormShell({
  children,
  description,
  footerLinks,
  handle,
  imageUrl,
  kind,
  name,
  placeholder,
  submitLabel,
  title,
}: ProfileFormShellProps) {
  const identity = [name, handle].filter(Boolean).join(" / ")

  return (
    <section className="form-shell">
      <div className="flex justify-end">
        <ProfileAvatar
          compact
          name={name}
          imageUrl={imageUrl}
          placeholder={placeholder}
        />
      </div>
      <div className="-mt-10">
        <div className="text-center">
          <p className="panel-label">{kind}</p>
          <h2 className="title-font mt-2 text-3xl text-[var(--color-fg)]">{title}</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{description}</p>
          {identity ? <p className="mt-2 text-sm text-gray-500">{identity}</p> : null}
        </div>
      </div>
      <div className="mt-6 space-y-5">{children}</div>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="submit"
          className="btn btn-primary"
        >
          {submitLabel}
        </button>
      </div>
      {footerLinks?.length ? (
        <div className="form-footer-links">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[var(--color-muted)] underline decoration-[var(--color-border-strong)] underline-offset-4 transition hover:text-[var(--color-fg)]"
            >
              {link.label}
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  )
}

export function ProfileField({
  defaultValue,
  label,
  name,
  required = true,
  type = "text",
}: ProfileFieldProps) {
  return (
    <label className="field-row">
      <span className="field-label">{label}</span>
      <input
        required={required}
        type={type}
        name={name}
        defaultValue={defaultValue}
        className="field-input"
      />
    </label>
  )
}

export function ProfileTextarea({ defaultValue, label, name, rows = 5 }: ProfileTextareaProps) {
  return (
    <label className="field-row">
      <span className="field-label">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={rows}
        className="field-input min-h-36 resize-y"
      />
    </label>
  )
}

export function ProfileSelectField({
  defaultValue,
  label,
  name,
  options,
  required = true,
}: ProfileSelectFieldProps) {
  return (
    <label className="field-row">
      <span className="field-label">{label}</span>
      <select
        required={required}
        name={name}
        defaultValue={defaultValue}
        className="field-input"
      >
        <option value="">選択してください</option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

export function StatusBanner({ children }: StatusBannerProps) {
  return <p className="status-banner">{children}</p>
}

function ProfileAvatar({
  compact = false,
  imageUrl,
  name,
  placeholder,
}: {
  compact?: boolean
  imageUrl?: string | null
  name: string
  placeholder: "roaster" | "user"
}) {
  const initials =
    name
      .trim()
      .split(/\s+/)
      .map((segment) => segment.slice(0, 1).toUpperCase())
      .join("")
      .slice(0, 2) || "BS"

  return (
    <div className={compact ? "profile-avatar profile-avatar-compact" : "profile-avatar"}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={`${name}の画像`}
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        <>
          <img
            src={
              placeholder === "user" ? "/images/default-user.png" : "/images/default-roaster.png"
            }
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
          <span className="sr-only">{`${name}の画像`}</span>
          <span className="logo-font absolute text-lg text-[var(--color-accent-strong)]/60">
            {initials}
          </span>
        </>
      )}
    </div>
  )
}
