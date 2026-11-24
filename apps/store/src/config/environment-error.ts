import { ZodError } from "zod";

export function getInvalidEnvironmentVariables(error: unknown): string[] | null {
  if (!(error instanceof ZodError)) {
    return null;
  }

  return [
    ...new Set(
      error.issues.flatMap((issue) => (typeof issue.path[0] === "string" ? [issue.path[0]] : [])),
    ),
  ];
}
