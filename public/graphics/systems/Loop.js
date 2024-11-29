import { Clock } from "three";
const clock = new Clock();

class Loop {
  constructor(renderer, labelRenderer, scene, camera) {
    this.renderer = renderer;
    this.labelRenderer = labelRenderer;
    this.scene = scene;
    this.camera = camera;
    this.updatables = [];
    // this.isRunning = false;
  }

  init(waiterPromise) {
    this.renderer.setAnimationLoop(async () => {
      console.log("Awaiting promise............")
      await waiterPromise;
      console.log("Promise fulfilled, ANIMATING")
      this.update();
      this.labelRenderer.render(this.scene, this.camera);
      this.renderer.render(this.scene, this.camera);
    });
  }

  cease() {
    this.renderer.setAnimationLoop(null);
  }

  update() {
    const deltaTime = clock.getDelta();

    for (const object of this.updatables) {
      object.update(deltaTime);
    }
    
  }
}

export { Loop };
