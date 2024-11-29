class WaitGroup {
    constructor(initial, binarySemaphoreSAB) {
        this.binarySemaphoreSAB = binarySemaphoreSAB || new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);
        this.binarySemaphore = new Int32Array(this.binarySemaphoreSAB);
        this.add(initial);
    }

    add(n) {
        // console.log(Atomics.load(this.binarySemaphore, 0), n)
        if (n === 0) {
            return;
        }
        let current = n + Atomics.add(this.binarySemaphore, 0, n);
        if (current < 0) {
            throw new Error("NEGATIVE!");
        }
        if (current > 0){
            return;
        }
        Atomics.notify(this.binarySemaphore, 0);

    }

    wait() {
        for (;;) {
            let count = Atomics.load(this.binarySemaphore, 0);
            if (count == 0) {
                return;
            }
            if (Atomics.wait(this.binarySemaphore, 0, count) == 'ok') {
                return;
            }
        }
    }
    
}


export { WaitGroup };
