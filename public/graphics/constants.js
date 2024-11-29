export const NANOSCOPIC_SCALE = 1;//1e-9;

// PARTICLES
export const PARTICLE_COUNT = 10;
export const STRIDE = 6; // xyzijk
export const BYTE_STRIDE = STRIDE * Int32Array.BYTES_PER_ELEMENT;

// WORKERS
export const CPU_CORES = 1;//navigator.hardwareConcurrency-1;
export const CHUNK_SIZE = Math.floor((PARTICLE_COUNT*STRIDE)/CPU_CORES);