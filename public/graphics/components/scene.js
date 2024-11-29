import { HemisphereLight, Scene, GridHelper } from "three";

function initScene() {
    const scene  = new Scene();
    scene.add(new HemisphereLight(0xffffbb, 0x080820, 1));
    scene.add(new GridHelper( 100, 100));
    return scene;
}

export {initScene};