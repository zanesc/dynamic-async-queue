# dynamic-async-queue

## Background

There are times when you want to limit the number of concurrent asynchronous tasks are running at the same time. For that you can use `Promise.all`. It works great the times that you know exactly how many async tasks there are at that time (static).

But sometimes the number of async tasks is dynamic. `async.queue` exists but it doesn't use ES6 Promises.

So I made this. Of course I could have just tried making this a wrapper of `async.queue` but where's the fun in that?

This is not the most elegant of solutions but it works :D

## Basic Usage

```JavaScript
var AsyncQueue = require('async-queue')

var queue = new AsyncQueue(10) // 10 being the concurrency

// Add a new asynchronous task to the queue.
// Must be a function that returns a promise
queue.enqueue(function () {
    return new Promise(function (resolve, reject) {
        ...
    })
}).then(function () {
    // success
    ...
}).catch(function () {
    // fail
    ...
})

```
