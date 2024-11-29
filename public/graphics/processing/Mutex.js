const locked = 1;
const unlocked = 0;

class Mutex {
    constructor(binarySemaphoreSAB) {
        this.binarySemaphoreSAB = binarySemaphoreSAB || new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);
        this.binarySemaphore = new Int32Array(this.binarySemaphoreSAB);
    }

    lock() {
        for(;;) {
            if (Atomics.compareExchange(this.binarySemaphore, 0, unlocked, locked) == unlocked) {
                return;
            }
            Atomics.wait(this.binarySemaphore, 0, locked);
        }
    }
    
    unlock() {
        if (Atomics.compareExchange(this.binarySemaphore, 0, locked, unlocked) != locked) {
            throw new Error("Bruh.");
        }
        Atomics.notify(this.binarySemaphore, 0, 1);
    }
}
    
export { Mutex };
