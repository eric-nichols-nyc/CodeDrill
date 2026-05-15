export type WorkspaceCodeErrorCode =
  | "NOT_SIGNED_IN"
  | "INVALID_SESSION"
  | "MISSING_INTERNAL_SECRET"
  | "UPSTREAM_UNAUTHORIZED"
  | "NETWORK"
  | "UNKNOWN";

export class WorkspaceCodeApiError extends Error {
  readonly status: number;
  readonly code: WorkspaceCodeErrorCode;
  readonly hint?: string;

  constructor(
    message: string,
    options: {
      status: number;
      code?: WorkspaceCodeErrorCode;
      hint?: string;
    }
  ) {
    super(message);
    this.name = "WorkspaceCodeApiError";
    this.status = options.status;
    this.code = options.code ?? "UNKNOWN";
    this.hint = options.hint;
  }

  /** Copy suitable for console / inline alerts. */
  get userMessage(): string {
    switch (this.code) {
      case "NOT_SIGNED_IN":
        return "Sign in to save your code and restore it when you return.";
      case "INVALID_SESSION":
        return "Your session could not be verified. Try signing out and back in.";
      case "MISSING_INTERNAL_SECRET":
      case "UPSTREAM_UNAUTHORIZED":
        return this.hint
          ? `${this.message} ${this.hint}`
          : this.message;
      default:
        return this.message;
    }
  }
}

export function isWorkspaceCodeApiError(
  error: unknown
): error is WorkspaceCodeApiError {
  return error instanceof WorkspaceCodeApiError;
}
