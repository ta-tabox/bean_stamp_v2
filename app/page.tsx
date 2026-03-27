export default function Home() {
  return (
    <main className="min-h-screen bg-stone-950 px-6 py-16 text-stone-50">
      <div className="mx-auto flex max-w-4xl flex-col gap-10">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-amber-300">
            Bean Stamp
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            Next.js 置換プロジェクトの初期セットアップ
          </h1>
          <p className="max-w-2xl text-base leading-7 text-stone-300 sm:text-lg">
            Issue 00 では、App Router・TypeScript・Tailwind CSS を備えた最小構成を用意しています。
            以降の Issue で機能実装を積み上げる前提の土台です。
          </p>
        </div>

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-stone-800 bg-stone-900/70 p-5">
            <h2 className="text-lg font-medium text-stone-100">App Router</h2>
            <p className="mt-2 text-sm leading-6 text-stone-400">
              `app/` 配下を起点にルーティングを構成します。
            </p>
          </div>
          <div className="rounded-2xl border border-stone-800 bg-stone-900/70 p-5">
            <h2 className="text-lg font-medium text-stone-100">TypeScript</h2>
            <p className="mt-2 text-sm leading-6 text-stone-400">
              `strict` を有効化し、`pnpm typecheck` で検証します。
            </p>
          </div>
          <div className="rounded-2xl border border-stone-800 bg-stone-900/70 p-5">
            <h2 className="text-lg font-medium text-stone-100">Tailwind CSS</h2>
            <p className="mt-2 text-sm leading-6 text-stone-400">
              グローバル CSS で読み込み済みです。
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
