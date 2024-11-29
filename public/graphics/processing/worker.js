import { WaitGroup } from "./WaitGroup.js";
import { Mutex } from "./Mutex.js";
import * as c from "../constants.js"

//Cache Globals
const CHUNK_SIZE = c.CHUNK_SIZE;

let simulate = null;

onmessage = (event) => {
  // console.log("WORKER CALLED");
  if (simulate) {
    simulate();
    return;
  }
  const {
    particleSABMsg,
    waitGroupMsg,
    mutexMsg,
    coreMsg
  } = event.data;
  const particleSABFloat32 = new Float32Array(particleSABMsg);
  const mutex = new Mutex(mutexMsg.binarySemaphoreSAB);
  const waitGroup = new WaitGroup(0, waitGroupMsg.binarySemaphoreSAB);
  console.log("worker",coreMsg ,":\nview:",waitGroup.binarySemaphore.length, "sab:",waitGroup.binarySemaphoreSAB.length);
  // self.postMessage({});
  
  simulate = () => {
    // mutex.lock();
    let chunk = (CHUNK_SIZE * coreMsg);
    let upperChunk = chunk + CHUNK_SIZE;
    // let i, j, k = 0; // cached
    for (let i = chunk; i<upperChunk; i += 6) {
      particleSABFloat32[i + 1] += 0.00005;
    }
    // mutex.unlock();
    console.log("waitgroup before decrement", Atomics.load(waitGroup.binarySemaphore, 0))
    waitGroup.add(-1);
    console.log("waitgroup after decrement", Atomics.load(waitGroup.binarySemaphore, 0))
  }
  simulate();
}