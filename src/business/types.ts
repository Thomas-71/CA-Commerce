export interface Usecase {
    execute<T>(): Result<T, Error>,
}

export type Result<T, E extends Error = Error> = { success: true, value: T } | { success: false, error: E }
