"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const queue_item_1 = require("./queue-item");
class AsyncQueue {
    constructor(concurrency) {
        this.concurrency = concurrency;
        this.waitingList = [];
        this.running = 0;
    }
    enqueue(itemId, removeDuplicateQueuedItems, caller) {
        return __awaiter(this, void 0, void 0, function* () {
            var ret = new Promise((resolve, reject) => {
                var item = new queue_item_1.default(itemId, caller, resolve, reject, () => {
                    this.running--;
                    this.process();
                });
                this.addToWaitingList(item, removeDuplicateQueuedItems);
            });
            this.process();
            return ret;
        });
    }
    addToWaitingList(item, removeDuplicateQueuedItems) {
        if (removeDuplicateQueuedItems) {
            this.waitingList = this.waitingList.filter(function (element) {
                return element.getItemId() !== item.getItemId();
            });
        }
        this.waitingList.push(item);
    }
    process() {
        while (this.running < this.concurrency && this.waitingList.length > 0) {
            this.running++;
            this.waitingList.shift().run();
        }
    }
}
exports.default = AsyncQueue;
//# sourceMappingURL=index.js.map