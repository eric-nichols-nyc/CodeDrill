export type ProblemChatErrorCode =
  | "NOT_SIGNED_IN"
  | "INVALID_SESSION"
  | "NETWORK"
  | "UNKNOWN";

export class ProblemChatApiError extends Error {
  readonly status: number;
  readonly code: ProblemChatErrorCode;

  constructor(
    message: string,
    options: {
      status: number;
      code?: ProblemChatErrorCode;
    }
  ) {
    super(message);
    this.name = "ProblemChatApiError";
    this.status = options.status;
    this.code = options.code ?? "UNKNOWN";
  }

  get userMessage(): string {
    switch (this.code) {
      case "NOT_SIGNED_IN":
        return "Sign in to use the tutor.";
      case "INVALID_SESSION":
        return "Your session could not be verified. Try signing out and back in.";
      default:
        return this.message;
    }
  }
}

export function isProblemChatApiError(
  error: unknown
): error is ProblemChatApiError {
  return error instanceof ProblemChatApiError;
}
