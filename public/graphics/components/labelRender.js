import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

function initLabelRender(particleMesh) {
    
    const labelDiv = document.createElement('div');
    labelDiv.className = 'label';
    labelDiv.textContent = `Particle ${2}`;
    const label = new CSS2DObject(labelDiv);
    particleMesh.add(label);
}

export { initLabelRender};