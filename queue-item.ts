import * as Types from './types'

export default class QueueItem<T> {
    constructor(
        protected caller: Types.PromiseCaller<T>,
        protected resolve: Types.ResolverCB<T>,
        protected reject: (reason: any) => void,
        protected complete: () => void
    ) {
    }

    run() {
        this.caller().then(val => {
            this.resolve(val)
        }).catch(err => {
            this.reject(err)
        }).then(() => {
            this.complete()
        })
    }
}
