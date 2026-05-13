export type StarterCodeRow = {
  key: string;
  raw: unknown;
  language: string;
  functionName: string | null;
  code: string | null;
};

export type ConsoleEntry = {
  id: string;
  level: "info" | "success" | "error";
  message: string;
  createdAt: string;
};
