export type Result<T> =
    | { success: true; data: T }
    | { success: false; error: string };

export const Result = {
  success<T>(data: T): Result<T> {
    return { success: true, data };
  },
  error(message: string): Result<never> {
    return { success: false, error: message };
  }
} as const;