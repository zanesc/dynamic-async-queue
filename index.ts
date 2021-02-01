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
    })

    this.process()

    return ret
  }

  addToWaitingList(item: QueueItem<T>, replaceDuplicateQueuedItems: boolean) {
    if (replaceDuplicateQueuedItems) {
      var duplicates = this.waitingList.filter(function (element) {
        return element.getItemId() === item.getItemId()
      })
      if (!duplicates || duplicates.length === 0) {
        this.waitingList.push(item)
        return
      }
      var duplicate = duplicates[0]
      var indexOfDuplicate = this.waitingList.indexOf(duplicate)
      if (indexOfDuplicate !== undefined && indexOfDuplicate !== null) {
        this.waitingList[indexOfDuplicate] = item
      } else {
        this.waitingList.push(item)
      }
    } else {
      this.waitingList.push(item)
    }
  }

  protected process() {
    while (this.running < this.concurrency && this.waitingList.length > 0) {
      this.running++
      this.waitingList.shift().run()
    }
  }
}
