import { PerspectiveCamera} from "three";


function initCamera() {
    const camera = new PerspectiveCamera(45, window.innerWidth /window.innerHeight, 1, 1000);
    camera.position.set(-40, 40, -40);
    return camera;
}

export {initCamera};