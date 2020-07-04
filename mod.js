const w = (msecs = 0, value = false) =>
  new Promise((resolve) => setTimeout(() => resolve(value), msecs));

export {
  async_queue,
};

/**
 * Create a queue, with a soft limit on elements, and a limit on timeout ticks
 * (aprox 1 ms each) after it is emptied during a for await
 * ```
 * async function run_queue(jobs = []) {
 *   const q = async_queue(5, 1000);
 *   jobs.forEach((j) => q.push(j));
 *   for await (const j of q) {
 *     console.log(j);
 *   }
 *   console.log("Queue Timeout Triggered after 1000ms empty");
 * }
 * ``` 
 * @param {number} limit 
 * @param {number} timeout 
 */
function async_queue(limit = 1_000_000, timeout = 0) {
  const specs = {
    q: [],
    pointer: 0,
  };
  return {
    push,
    pull,
    [Symbol.asyncIterator]: iter,
  };
  async function* iter(iter_timeout = 0) {
    const t = ((iter_timeout !== timeout) && iter_timeout) || timeout;
    let i = 0;
    while (i <= t) {
      const v = pull();
      if (!v) {
        await w(1);
        i += 1;
      } else {
        i = 0;
        yield v;
      }
    }
  }
  function clear() {
    const q = [...specs.q.slice(specs.pointer)]||[1];
    specs.q = q;
    specs.pointer = 0;
  }
  function pull() {
    if (specs.pointer < specs.q.length) {
      const v = specs.q[specs.pointer];
      specs.pointer += 1;
      return v;
    }
    if (specs.pointer > limit) {
      clear();
    }
  }
  function push(v = {}) {
    if (specs.q.push(v) > limit && specs.pointer > limit / 2) {
      clear();
    }
  }
}
