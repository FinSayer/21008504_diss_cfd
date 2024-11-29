import { Mutex } from "./Mutex.js";
import { WaitGroup } from "./WaitGroup.js";
import * as c from "../constants.js";

class ParticleSystem {
  constructor(n) {
    this.particleSAB = new SharedArrayBuffer(n * c.BYTE_STRIDE); // For each particle; Serialised data of x, y, z, i, j, k; 4 bytes (32 bits) for each data point
    const mutex = new Mutex();
    const waitGroup = new WaitGroup(c.CPU_CORES); // To avoid race conditions intial count of workers is set before worker initiation

    // init workers and waiter
    this.waiter = new Worker("/graphics/processing/waiter.js", { type: "module" });
    this.waiter.postMessage(waitGroup);
    this.waiterPromiseMsg = this.recursiveWaiterMsg();
    
    this.workerPool = [];
    let cores = c.CPU_CORES;
    while (cores) {
      --cores
      const worker = new Worker("/graphics/processing/worker.js", { type: 'module' });
      this.workerPool.push(worker);
      worker.postMessage({
        particleSABMsg: this.particleSAB,
        waitGroupMsg: waitGroup,
        mutexMsg: mutex,
        coreMsg: cores
      });

    }
  
  }
  recursiveWaiterMsg() {
    return new Promise((resolve) => {
      this.waiter.onmessage = () => {
        console.log("NEW WAITER")
        this.workerPool.forEach((worker) => {
          worker.postMessage({});
        });
        this.waiter.postMessage({});
        resolve()};
    }).then(() => {
      return this.recursiveWaiterMsg();
    });
  } 

}

export { ParticleSystem };