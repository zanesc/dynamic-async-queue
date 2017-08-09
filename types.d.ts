export type PromiseCaller<T> = () => Promise<T>
export type ResolverCB<T> = (args: T | PromiseLike<T>) => void
