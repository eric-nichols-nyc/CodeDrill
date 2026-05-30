export type ProblemNotesErrorCode =
  | "NOT_SIGNED_IN"
  | "INVALID_SESSION"
  | "MISSING_INTERNAL_SECRET"
  | "UPSTREAM_UNAUTHORIZED"
  | "NETWORK"
  | "UNKNOWN";

export class ProblemNotesApiError extends Error {
  readonly status: number;
  readonly code: ProblemNotesErrorCode;
  readonly hint?: string;

  constructor(
    message: string,
    options: {
      status: number;
      code?: ProblemNotesErrorCode;
      hint?: string;
    }
  ) {
    super(message);
    this.name = "ProblemNotesApiError";
    this.status = options.status;
    this.code = options.code ?? "UNKNOWN";
    this.hint = options.hint;
  }

  get userMessage(): string {
    switch (this.code) {
      case "NOT_SIGNED_IN":
        return "Sign in to save notes across sessions.";
      case "INVALID_SESSION":
        return "Your session could not be verified. Try signing out and back in.";
      case "MISSING_INTERNAL_SECRET":
      case "UPSTREAM_UNAUTHORIZED":
        return this.hint ? `${this.message} ${this.hint}` : this.message;
      default:
        return this.message;
    }
  }
}

export function isProblemNotesApiError(
  error: unknown
): error is ProblemNotesApiError {
  return error instanceof ProblemNotesApiError;
}
