import {BufferGeometry, InterleavedBuffer, InterleavedBufferAttribute, PointsMaterial, Points} from "three";

import * as c from "../constants.js";
// import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.17.0/dist/lil-gui.esm.min.js';
// const gui = new GUI();
// const variables = {
//   particleCount: 5000};

// gui.add(variables, 'particleCount', 1, 10000000, 1).onChange(() => { fluidInstance = new Fluid(sceneInstance); });



function initParticleRender(particleSAB) {
  const geometry = new BufferGeometry();
  const interleavedBuffer = new InterleavedBuffer(new Float32Array(particleSAB), c.STRIDE);
  geometry.setAttribute('position', new InterleavedBufferAttribute(interleavedBuffer, c.STRIDE/2, 0));
  geometry.setAttribute('color', new InterleavedBufferAttribute(interleavedBuffer, c.STRIDE/2, c.STRIDE/2,true));
  const material = new PointsMaterial({vertexColors: true, size: 1, sizeAttenuation: true});
  const particleMesh = new Points(geometry, material);

  particleMesh.update = (deltaTime) => {
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
  }
  return particleMesh;
}




export { initParticleRender };

