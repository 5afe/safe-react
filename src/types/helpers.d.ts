export type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U

export type Await<T> = T extends PromiseLike<infer U> ? U : T
