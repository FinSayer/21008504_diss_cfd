import * as THREE from '/three.module.js';
import { OrbitControls } from '/OrbitControls.js';
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.17.0/dist/lil-gui.esm.min.js';

const gui = new GUI();
const variables = {
  particalRadius: 0.5, // Updated to make particles smaller by default
  cubeSize: 10,        // Size of the cube (in grid units)
  particleCount: 1000, // Number of particles
};
// Add GUI controls with change listeners
gui.add(variables, 'particalRadius', 0, 1, 0.01).onChange(() => {
  fluidInstance.updateMaterial(); // Update the particle material
});
gui.add(variables, 'cubeSize', 1, 50, 1).onChange(() => {
  fluidInstance.generateCubicPositions(); // Regenerate positions based on new cube size
});
gui.add(variables, 'particleCount', 100, 10000, 100).onChange(() => {
  fluidInstance.updateParticleCount(variables.particleCount); // Update the particle count
});
class Scene {
  constructor(canvas, viewX = 0, viewY = 0) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
    // Ambient light
    this.light = new THREE.AmbientLight(0xffffff, 0.3);
    this.scene.add(this.light);
    // Directional light
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    this.directionalLight.castShadow = true;
    this.scene.add(this.directionalLight);

    // Renderer setup
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.shadowMap.enabled = true;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.setViewPosition(viewX, viewY);
  }

  setViewPosition(x, y, z = -20) {
    this.camera.position.set(x, y, z);
    this.directionalLight.position.set(x, y, z);
  }

  setSceneSize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.renderer.setSize(this.canvas.width, this.canvas.height);
  }

  animate(fluidInstance) {
    requestAnimationFrame(() => this.animate(fluidInstance)); 
    this.controls.update();
    fluidInstance.update();
    this.renderer.render(this.scene, this.camera);
  }
}

class Fluid {
  constructor(count) {
    this.count = count;
    this.gravity = -0.01; // Gravity value
    this.bounceFactor = 0.7; // Factor for bouncing (less than 1 to lose energy)
    this.velocity = new Float32Array(this.count * 3);
    this.geometry = new THREE.BufferGeometry();
    this.positions = new Float32Array(this.count * 3);
    this.generateCubicPositions();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    this.material = new THREE.PointsMaterial({
      color: 0xff6347,
      size: variables.particalRadius,
      sizeAttenuation: true,
    });
    this.particles = new THREE.Points(this.geometry, this.material);
  }

  generateCubicPositions(x=0, y=variables.cubeSize+10, z=0, r=variables.cubeSize) {
    const spacing = (r * 2) / Math.cbrt(this.count); // Calculate spacing based on the cube size and number of particles
    for (let i = 0; i < this.count; i++) {
      this.positions[i * 3] = x + ((i % Math.cbrt(this.count)) * spacing) - r;
      this.positions[i * 3 + 1] = y + (Math.floor(i / Math.cbrt(this.count)) % Math.cbrt(this.count) * spacing) - r;
      this.positions[i * 3 + 2] = z + (Math.floor(i / (Math.cbrt(this.count) ** 2)) * spacing) - r;

      this.velocity[i * 3] = (Math.random() - 0.5) * 0.2; // Random x velocity
      this.velocity[i * 3 + 1] = Math.random() * 0.1; // Random y velocity
      this.velocity[i * 3 + 2] = (Math.random() - 0.5) * 0.2; // Random z velocity
    }
  }

  update() {
    for (let i = 0; i < this.count; i++) {
      const index = i * 3;

      // Apply gravity to y velocity
      this.velocity[index + 1] += this.gravity;

      // Update position
      this.positions[index + 1] += this.velocity[index + 1];
      this.positions[index] += this.velocity[index]; // Update x position
      this.positions[index + 2] += this.velocity[index + 2]; // Update z position

      // Check for collision with the ground
      if (this.positions[index + 1] < 0) {
        this.positions[index + 1] = 0; // Reset position to ground level
        this.velocity[index + 1] = -this.velocity[index + 1] * this.bounceFactor; // Reverse velocity and apply bounce factor
      }
    }

    // Check for collisions between particles
    for (let i = 0; i < this.count; i++) {
      for (let j = i + 1; j < this.count; j++) {
        const indexI = i * 3;
        const indexJ = j * 3;

        const dx = this.positions[indexI] - this.positions[indexJ];
        const dy = this.positions[indexI + 1] - this.positions[indexJ + 1];
        const dz = this.positions[indexI + 2] - this.positions[indexJ + 2];

        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const minDistance = variables.particalRadius * 2; // Minimum distance for collision

        // Check for collision
        if (distance < minDistance) {
          const overlap = minDistance - distance; // Amount of overlap

          // Adjust positions to resolve collision
          const normalX = dx / distance;
          const normalY = dy / distance;
          const normalZ = dz / distance;

          this.positions[indexI] += normalX * (overlap / 2);
          this.positions[indexI + 1] += normalY * (overlap / 2);
          this.positions[indexI + 2] += normalZ * (overlap / 2);
          this.positions[indexJ] -= normalX * (overlap / 2);
          this.positions[indexJ + 1] -= normalY * (overlap / 2);
          this.positions[indexJ + 2] -= normalZ * (overlap / 2);

          // Elastic collision response
          const tempX = this.velocity[indexI];
          const tempY = this.velocity[indexI + 1];
          const tempZ = this.velocity[indexI + 2];

          this.velocity[indexI] = this.velocity[indexJ];
          this.velocity[indexI + 1] = this.velocity[indexJ + 1];
          this.velocity[indexI + 2] = this.velocity[indexJ + 2];

          this.velocity[indexJ] = tempX;
          this.velocity[indexJ + 1] = tempY;
          this.velocity[indexJ + 2] = tempZ;
        }
      }
    }
    
    this.geometry.attributes.position.needsUpdate = true; // Mark the geometry for update
  }
   
  updateMaterial() {
    this.material.size = variables.particalRadius; // Update the particle size
    this.material.needsUpdate = true; // Mark the material for update
  }

  updateParticleCount(newCount) {
    this.count = newCount;
    this.positions = new Float32Array(this.count * 3);
    this.velocity = new Float32Array(this.count);  // Reinitialize the positions array
    this.geometry.dispose(); // Dispose of the old geometry
    this.geometry = new THREE.BufferGeometry(); // Create a new geometry
    this.generateCubicPositions(); // Generate new positions
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3)); // Set new attribute
    this.particles.geometry = this.geometry; // Update particles with new geometry
  }
}

const sceneInstance = new Scene(document.getElementById('bg'));
const fluidInstance = new Fluid(variables.particleCount);
sceneInstance.scene.add(fluidInstance.particles);

const gridHelper = new THREE.GridHelper(100, 100);
sceneInstance.scene.add( gridHelper );

sceneInstance.animate(fluidInstance);