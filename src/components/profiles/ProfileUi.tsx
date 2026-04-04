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
  handle: string
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
    <section className="page-card overflow-hidden">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-1 flex-col gap-5 sm:flex-row sm:items-start">
          <ProfileAvatar
            name={name}
            imageUrl={imageUrl}
            placeholder={placeholder}
          />
          <div className="min-w-0 flex-1">
            <p className="panel-label">{kind}</p>
            <h2 className="title-font mt-3 text-3xl text-[var(--color-fg)]">{name}</h2>
            <p className="mt-2 text-sm text-[var(--color-muted)]">{handle}</p>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-[var(--color-fg)]">{description}</p>
          </div>
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap gap-3">{actions}</div> : null}
      </div>

      <dl className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {details.map((detail) => (
          <div
            key={`${detail.label}-${detail.value}`}
            className="detail-tile"
          >
            <dt className="panel-label">{detail.label}</dt>
            <dd className="mt-2 text-base font-medium text-[var(--color-fg)]">{detail.value}</dd>
          </div>
        ))}
      </dl>

      {children ? (
        <div className="mt-8 border-t border-[var(--color-border)] pt-6">{children}</div>
      ) : null}
    </section>
  )
}

export function ProfileLinksRow({ links, title }: { links: readonly ActionLink[]; title: string }) {
  return (
    <div className="space-y-3">
      <h3 className="title-font text-lg text-[var(--color-fg)]">{title}</h3>
      <div className="flex flex-wrap gap-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={link.tone === "primary" ? "btn btn-primary" : "btn btn-secondary"}
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
      <div className="flex flex-col gap-2 border-b border-[var(--color-border)] pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="panel-label">List</p>
          <h3 className="title-font mt-2 text-2xl text-[var(--color-fg)]">{title}</h3>
        </div>
      </div>
      {hasItems ? (
        <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-[var(--color-border)] bg-white/75">
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
      <div className="flex min-w-0 flex-1 items-start gap-4">
        <ProfileAvatar
          name={title}
          compact
          imageUrl={imageUrl}
          placeholder={placeholder}
        />
        <div className="min-w-0 flex-1">
          <p className="title-font truncate text-lg text-[var(--color-fg)]">{title}</p>
          <p className="mt-1 truncate text-sm text-[var(--color-muted)]">{subtitle}</p>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--color-fg)]">
            {description}
          </p>
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
  return (
    <section className="form-shell">
      <div className="flex flex-col gap-4 border-b border-[var(--color-border)] pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="panel-label">{kind}</p>
          <h2 className="title-font mt-3 text-2xl text-[var(--color-fg)]">{title}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
            {description}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="title-font text-sm text-[var(--color-fg)]">{name}</p>
            <p className="mt-1 text-xs text-[var(--color-muted)]">{handle}</p>
          </div>
          <ProfileAvatar
            name={name}
            imageUrl={imageUrl}
            placeholder={placeholder}
          />
        </div>
      </div>
      <div className="mt-6 space-y-5">{children}</div>
      <div className="mt-8 flex flex-wrap items-center gap-3">
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
              placeholder === "user" ? "/images/default-user.svg" : "/images/default-roaster.svg"
            }
            alt=""
            aria-hidden="true"
            className="h-full w-full rounded-full object-cover"
          />
          <span className="sr-only">{`${name}の画像`}</span>
          <span className="logo-font absolute text-lg text-[var(--color-accent-strong)]/70">
            {initials}
          </span>
        </>
      )}
    </div>
  )
}
