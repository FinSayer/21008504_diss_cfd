import { initRenderer } from "./systems/renderer.js";
import { initScene } from "./components/scene.js";
import { Loop } from "./systems/Loop.js";
import { initLight } from "./components/light.js";
import { initCamera } from "./components/camera.js";
import { initParticleRender } from "./components/particleRender.js";
import { ParticleSystem } from "./processing/ParticleSystem.js";
import { initLabelRenderer } from "./systems/labelRenderer.js";
import { initLabelRender } from "./components/labelRender.js";

import * as c from "./constants.js";
import { Color} from "three";


import { OrbitControls } from 'three/addons/controls/OrbitControls.js';//import { OrbitControls } from "three/addons/";
class Graphics {
  constructor() {
    this.renderer = initRenderer(document.getElementById("sceneCanvas"));
    this.labelRenderer = initLabelRenderer(document.getElementById("labelContainer"));
    this.scene = initScene();
    this.camera = initCamera();    
    this.loop = new Loop(this.renderer, this.labelRenderer, this.scene, this.camera);


    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    this.light = initLight();
    this.camera.add(this.light);

    this.particleSystem = new ParticleSystem(c.PARTICLE_COUNT);
    this.particleRender = initParticleRender(this.particleSystem.particleSAB); 
    this.scene.add(this.particleRender);
  

    //this.labelRender = initLabelRender(this.particleRender);
    
    this.loop.updatables.push(this.particleRender, this.controls);

    this.scene.background = new Color(0xFFFFFF);
    // const resizer = new Resizer(container, this.camera, this.renderer);
    // Check if the waiter exists
    
    this.init();
    
  }


  // init() {
  //   this.loop.init(async () => {
  //     return new Promise(resolve => );
  //   });
  // }
  init() {
    console.log("BEGIN ANIMATION");
    this.loop.init(this.particleSystem.waiterPromiseMsg);
  }

  cease() {
    this.loop.cease();
  }
}

export { Graphics };



