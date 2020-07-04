import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { async_queue } from "./mod.js";

Deno.test("async_queue return object", function () {
  const q = async_queue();
  assertEquals(typeof q, "object");
  assertEquals(typeof q[Symbol.asyncIterator], "function");
  assertEquals(typeof q.push, "function");
  assertEquals(typeof q.pull, "function");
});

Deno.test("async_queue push pull", async function () {
  const q = async_queue(3, 100);
  [1, 2, 3, 9, 8, 7].forEach((j) => q.push(j));
  const v1 = await q.pull();
  assertEquals(v1, 1);
  await q.pull();
  await q.pull();
  const v2 = await q.pull();
  assertEquals(v2, 9);
});

Deno.test("async_queue for await", async function () {
  const q = async_queue(3, 100);
  [1, 2, 3, 9, 8, 7].forEach((j) => q.push(j));
  const r = [];
  const later_push_to_queue = new Promise((resolve) =>
    setTimeout(() => {
      q.push(10);
      resolve();
    }, 10)
  );
  for await (const j of q) {
    r.push(j);
  }
  await later_push_to_queue;
  assertEquals(r, [1, 2, 3, 9, 8, 7, 10]);
});

Deno.test("async_queue for await with timeout", async function () {
  const q = async_queue(3, 10);
  [1, 2, 3, 9, 8, 7].forEach((j) => q.push(j));
  const r = [];
  const later_push_to_queue = new Promise((resolve) =>
    setTimeout(() => {
      q.push(10);
      resolve();
    }, 100)
  );
  for await (const j of q) {
    r.push(j);
  }
  await later_push_to_queue;
  assertEquals(r, [1, 2, 3, 9, 8, 7]);
});
