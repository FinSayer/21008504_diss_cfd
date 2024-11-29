import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';

function initLabelRenderer(labelContainer) {
  const labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
  labelContainer.appendChild(labelRenderer.domElement);
  return labelRenderer
}

export {initLabelRenderer};