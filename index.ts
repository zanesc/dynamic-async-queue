import QueueItem from './queue-item'

import { PromiseCaller } from './types'

export default class AsyncQueue<T> {
    protected waitingList: QueueItem<T>[] = []
    protected running = 0

    constructor(public concurrency: number) {
    }

    async enqueue(caller: PromiseCaller<T>) {
        var ret = new Promise<T>((resolve, reject) => {
            var item = new QueueItem<T>(
                caller,
                resolve,
                reject,
                () => {
                    this.running--
                    this.process()
                })
            this.waitingList.push(item)
        })

        this.process()

        return ret
    }

    protected process() {
        while (this.running < this.concurrency && this.waitingList.length > 0) {
            this.running++
            this.waitingList.shift().run()
        }
    }
}
