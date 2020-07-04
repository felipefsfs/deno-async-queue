Async Queue
----
Lightweight Async queue with a builtin timeout to exit a for await after inactivity...
Contains a tiny makefile to help with test

### Features

- [Deno](https://deno.land) module.

- Zero dependencies.

- Javascript only

## Usage
```
function async_queue(limit?: number, timeout?: number): {
    push: (v?: {}) => void;
    pull: () => undefined;
    [Symbol.asyncIterator]: (iter_timeout?: number) => AsyncGenerator<any, void, unknown>;
}
Create a queue, with a soft limit on elements, and a limit on timeout ticks (aprox 1 ms each) after it is emptied during a for await

async function run_queue(jobs = []) {
   const q = async_queue(5, 1000);
   jobs.forEach((j) => q.push(j));
   for await (const j of q) {
     console.log(j);
   }
   console.log("Queue Timeout Triggered after 1000ms empty");
}
@param limit

@param timeout
```
## License

MIT &middot;