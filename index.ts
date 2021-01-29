import QueueItem from './queue-item'

import { PromiseCaller } from './types'

export default class AsyncQueue<T> {
  protected waitingList: QueueItem<T>[] = []
  protected running = 0

  constructor(public concurrency: number) {}

  async enqueue(
    itemId: string,
    removeDuplicateQueuedItems: boolean,
    caller: PromiseCaller<T>,
  ) {
    var ret = new Promise<T>((resolve, reject) => {
      var item = new QueueItem<T>(itemId, caller, resolve, reject, () => {
        this.running--
        this.process()
      })
      this.addToWaitingList(item, removeDuplicateQueuedItems)
      this.waitingList.push(item)
    })

    this.process()

    return ret
  }

  addToWaitingList(item: QueueItem<T>, removeDuplicateQueuedItems: boolean) {
    if (removeDuplicateQueuedItems) {
      this.waitingList = this.waitingList.filter(function (element) {
        return element.getItemId() !== item.getItemId()
      })
    }
    this.waitingList.push(item)
  }

  protected process() {
    while (this.running < this.concurrency && this.waitingList.length > 0) {
      this.running++
      this.waitingList.shift().run()
    }
  }
}
