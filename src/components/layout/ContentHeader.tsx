type ContentHeaderProps = {
  title: string
}

export function ContentHeader({ title }: ContentHeaderProps) {
  return (
    <section className="content-header-panel">
      <div className="flex h-full items-end justify-start">
        <h1 className="title-font text-3xl text-[var(--color-fg)]">{title}</h1>
      </div>
    </section>
  )
}
