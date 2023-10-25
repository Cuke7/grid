import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { HexGrid, State, initState } from "./hex";

const cellSize = 1;

const state = initState({ cols: 25, rows: 12 }, cellSize);

const app = document.getElementById("app");

const { scene, camera, renderer } = init(app, state);

// Main loop
function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}

animate();

function init(app: HTMLElement | null, state: State) {
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(
    app?.getBoundingClientRect().width || 500,
    app?.getBoundingClientRect().height || 500
  );
  app?.appendChild(renderer.domElement);

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  const controls = new OrbitControls(camera, renderer.domElement);

  controls.object.position.set(18, -10, 30);
  controls.target.set(18, 4, 6);
  controls.update();

  const axesHelper = new THREE.AxesHelper(10);
  scene.add(axesHelper);

  const grid = new HexGrid(state);

  for (const cell of grid.state.cells) {
    const hex = createHexagon(cell.radius);
    hex.position.set(cell.x, cell.y, 0);
    scene.add(hex);
  }

  return { scene, renderer, camera, controls, grid };
}

function createHexagon(radius: number) {
  const hexagonMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

  const hexagonShape = new THREE.Shape();
  const numberOfSides = 6;

  for (let i = 0; i < numberOfSides; i++) {
    const angle = (i / numberOfSides) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    if (i === 0) {
      hexagonShape.moveTo(x, y);
    } else {
      hexagonShape.lineTo(x, y);
    }
  }

  hexagonShape.closePath();

  const hexagonGeometry = new THREE.ShapeGeometry(hexagonShape);
  return new THREE.Mesh(hexagonGeometry, hexagonMaterial);
}
