import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import "./style.css";
import textureImg from "../src/images/sky1.jpg"; // Replace with your image path

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load(textureImg);
scene.background = texture;

// Mesh
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1, 1);

// Vertex Shader
const vertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

// Fragment Shader
const fragmentShader = `
    varying vec2 vUv;

    vec3 getColor(float t) {
        return vec3(
            0.5 + 0.5 * cos(6.2831 * (t + 0.0 / 7.0)),
            0.5 + 0.5 * cos(6.2831 * (t + 2.0 / 7.0)),
            0.5 + 0.5 * cos(6.2831 * (t + 4.0 / 7.0))
        );
    }

    void main() {
        float t = mod(vUv.y * 7.0, 1.0);
        gl_FragColor = vec4(getColor(t), 1.0);
    }
`;

// Create ShaderMaterial
const cubeMaterial = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
});

const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
scene.add(cubeMesh);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
scene.add(camera);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(window.innerWidth, window.innerHeight);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const control = new OrbitControls(camera, canvas);
control.enableDamping = true;

const animate = () => {
  cubeMesh.rotation.x += 0.01;
  cubeMesh.rotation.y += 0.01;

  window.requestAnimationFrame(animate);
  renderer.render(scene, camera);

  control.update();
};

animate();
