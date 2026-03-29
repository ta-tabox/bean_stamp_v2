export type SessionPrincipal = {
  email: string
  id: string
  roasterId?: string | null
}

export async function requireSession(): Promise<SessionPrincipal> {
  throw new Error("Auth.js 導入後に実装します。Issue 02 では境界のみ定義します。")
}
