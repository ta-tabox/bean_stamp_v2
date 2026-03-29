import { asAppError } from "@/server/errors";

export type ApiErrorPayload = {
  error: {
    code: string;
    message: string;
  };
};

export type ApiErrorResponse = {
  payload: ApiErrorPayload;
  status: number;
};

export function toApiErrorResponse(error: unknown): ApiErrorResponse {
  const appError = asAppError(error);

  return {
    payload: {
      error: {
        code: appError.code,
        message: appError.userMessage,
      },
    },
    status: appError.status,
  };
}
