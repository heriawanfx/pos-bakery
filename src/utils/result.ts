export type Result<T> =
    | { success: true; data: T }
    | { success: false; error: string };

export function ResultSuccess<T>(data: T): Result<T> {
    return { success: true, data };
}

export function ResultError<T = never>(message: string): Result<T> {
    return { success: false, error: message };
}