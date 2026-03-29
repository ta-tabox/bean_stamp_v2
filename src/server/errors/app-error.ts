export type AppErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "INTERNAL_ERROR"

export type AppErrorOptions = {
  cause?: unknown
  code: AppErrorCode
  status: number
  userMessage: string
}

export class AppError extends Error {
  readonly cause?: unknown
  readonly code: AppErrorCode
  readonly status: number
  readonly userMessage: string

  constructor(message: string, options: AppErrorOptions) {
    super(message)
    this.name = "AppError"
    this.cause = options.cause
    this.code = options.code
    this.status = options.status
    this.userMessage = options.userMessage
  }
}

export function asAppError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error
  }

  return new AppError("Unexpected server error", {
    cause: error,
    code: "INTERNAL_ERROR",
    status: 500,
    userMessage: "予期しないエラーが発生しました。時間を置いて再度お試しください。",
  })
}
