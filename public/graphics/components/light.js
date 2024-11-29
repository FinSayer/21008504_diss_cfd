import { DirectionalLight } from "three";

function initLight() {
    const light = new DirectionalLight("white", 8);
    return light;
}


export { initLight };
