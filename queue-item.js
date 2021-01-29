"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QueueItem {
    constructor(itemId, caller, resolve, reject, complete) {
        this.itemId = itemId;
        this.caller = caller;
        this.resolve = resolve;
        this.reject = reject;
        this.complete = complete;
    }
    run() {
        this.caller()
            .then((val) => {
            this.resolve(val);
        })
            .catch((err) => {
            this.reject(err);
        })
            .then(() => {
            this.complete();
        });
    }
    getItemId() {
        return this.itemId;
    }
}
exports.default = QueueItem;
//# sourceMappingURL=queue-item.js.map