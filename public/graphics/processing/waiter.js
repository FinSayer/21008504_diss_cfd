import { WaitGroup } from "./WaitGroup.js";
import * as c from "../constants.js";


onmessage = (event) => {
    // console.log("CALLING WAITER")
    const waitGroupMsg = event.data;
    const waitGroup = new WaitGroup(0, waitGroupMsg.binarySemaphoreSAB);
    waitGroup.wait();
    console.log("waitgroup before reset", Atomics.load(waitGroup.binarySemaphore, 0))
    waitGroup.add(c.CPU_CORES);
    console.log("waitgroup after reset", Atomics.load(waitGroup.binarySemaphore, 0))
    self.postMessage({});
};
