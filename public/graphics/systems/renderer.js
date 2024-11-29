import { WebGLRenderer, PCFSoftShadowMap} from "three";

function initRenderer(sceneCanvas) {
  const renderer = new WebGLRenderer({ canvas: sceneCanvas });
  // renderer.outputEncoding = LinearEncoding;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.physicallyCorrectLights = true;
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  return renderer;
}

export { initRenderer };
