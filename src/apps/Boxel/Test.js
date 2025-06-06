import OrthographicCamera from '../../libs/3d/camera/OrthographicCamera';
import DirectionalLight from '../../libs/3d/light/DirectionalLight';
import InstanceLightMaterial from '../../libs/3d/material/InstanceLightMaterial';
import Node3d from '../../libs/3d/Node3d';
import App from '../../libs/core/App';
import Color from '../../libs/core/Color';
import Box from '../../libs/math/Box';
import Int8Vector3 from '../../libs/math/Int8Vector3';
import Vector2 from '../../libs/math/Vector2';
import Vector3 from '../../libs/math/Vector3';
import RenderTarget from '../../libs/renderer/graphics/RenderTarget';
import landJSON from './land.json';
import BoxObject from './node/BoxObject';
import womanJSON from './woman.json';

export default class Test extends App {
    constructor(canvas) {
        super(canvas);
        canvas.renderTarget.backgroundColor = Color.white();

        //World
        const world = new Node3d();
        // light
        const sun = new DirectionalLight(
            new Color(0.878, 0.810, 0.798, 1),
            new Vector3(32, 64, -32),
            new Vector3());
        sun.light.ambientStrength = 0.8;
        world.appendChild(sun);
        const shadow = new RenderTarget(new OrthographicCamera(-64, 64, -64, 64, 0, 128), 1024, 1024);
        shadow.data.updateAspectRatio = false;
        shadow.material = InstanceLightMaterial.shadowMaterial;
        sun.shadow = shadow;

        //box
        const boxObject = new BoxObject();
        world.appendChild(boxObject);

        const land = new BoxObject().loadJSON(landJSON);
        world.appendChild(land);
        const woman = new BoxObject().loadJSON(womanJSON);
        world.appendChild(woman);
        woman.castShadow = true;
        const runAnimation = [0, 1, 0, 2];
        let animationIndex = 0;

        //camera
        const camera = new OrthographicCamera();
        world.appendChild(camera);
        camera.target = woman;
        camera.zoom = 24;

        //update
        let previousScale = 0;

        //control
        const zoomStep = 0.1;
        const cameraStep = 1;
        const cameraMovement = new Vector2();
        const womanMovement = new Vector2();
        let zoom = 0;
        let rightClick = null;
        let middleClick = null;
        let leftClick = null;
        let inputs = [];
        let distance = 0;
        let jump = false;

        canvas.addEventListener('wheel', e => {
            zoom -= e.deltaY * zoomStep;
        });
        canvas.addEventListener('pointerdown', e => {
            canvas.setPointerCapture(e.pointerId);
            if (e.pointerType == 'touch' && inputs.length < 2) {
                inputs.push(e);
            } else if (e.pointerType == 'mouse') {
                if (e.button === 0) {
                    leftClick = e;
                } else if (e.button === 2) {
                    rightClick = e;
                } else if (e.button === 1) {
                    middleClick = e;
                }
            }
        });
        canvas.addEventListener('pointerup', e => {
            canvas.releasePointerCapture(e.pointerId);
            if (e.pointerType == 'mouse') {
                if (leftClick && e.pointerId == leftClick.pointerId) {
                    leftClick = null;
                } else if (rightClick && e.pointerId == rightClick.pointerId) {
                    rightClick = null;
                } else if (middleClick && e.pointerId == middleClick.pointerId) {
                    middleClick = null;
                }
            }
            if (inputs.length > 0) {
                const index = inputs.findIndex(i => i.pointerId == e.pointerId);
                if (index !== -1) {
                    inputs.splice(index, 1);
                    if (inputs.length < 1) {
                        distance = 0;
                    }
                }
            }
        });
        canvas.addEventListener('pointermove', (e) => {
            if (e.pointerType == 'mouse') {
                if (rightClick && e.pointerId == rightClick.pointerId) {
                    cameraMovement[0] -= cameraStep * e.movementX;
                    cameraMovement[1] += cameraStep * e.movementY;
                    rightClick = e;
                }
            }
        });
        this.canvas.addEventListener('keydown', (e) => {
            switch (e.code) {
                case 'Space':
                    if (woman.position[1] < 0.1) {
                        jump = true;
                    }
                    break;
                case 'a':
                case 'KeyA':
                case 'ArrowLeft':
                    womanMovement[0] = 1;
                    break;
                case 'd':
                case 'KeyD':
                case 'ArrowRight':
                    womanMovement[0] = -1;
                    break;
                case 'w':
                case 'KeyW':
                case 'ArrowUp':
                    womanMovement[1] = 1;
                    break;
                case 's':
                case 'KeyS':
                case 'ArrowDown':
                    womanMovement[1] = -1;
                    break;
                default:
                    break;
            }
        });

        function physics() {
            if (jump) {
                if (woman.position[1] < 3) {
                    woman.translate(0, 0.5, 0);
                } else {
                    jump = false;
                }
            } else {
                landBounding.set(land.boundingBox).translate(land.position);
                womanBounding.set(woman.boundingBox).translate(woman.position);
                const yDistance = womanBounding.min[1] - landBounding.max[1];
                if (yDistance > 0) {
                    woman.translate(0, -0.5, 0);
                } else if (yDistance < 0) {
                    woman.translate(0, -yDistance, 0);
                }
                a[0] = woman.boundingBox.min[0];
                a[1] = -1;
                a[2] = woman.boundingBox.min[2];
                b[0] = woman.boundingBox.max[0];
                b[1] = -1;
                b[2] = woman.boundingBox.max[2];
                if (a[0] > b[0]) {
                    const cache = a[0];
                    a[0] = b[0];
                    b[0] = cache;
                }
                if (a[1] > b[1]) {
                    const cache = a[1];
                    a[1] = b[1];
                    b[1] = cache;
                }
                if (a[2] > b[2]) {
                    const cache = a[2];
                    a[2] = b[2];
                    b[2] = cache;
                }
                land.shadowMap.clear();
                for (let x = a[0]; x <= b[0]; x++) {
                    for (let y = a[1]; y <= b[1]; y++) {
                        for (let z = a[2]; z <= b[2]; z++) {
                            positionVector[0] = x;
                            positionVector[1] = y;
                            positionVector[2] = z;
                            land.shadowMap.add(positionVector.hex);
                        }
                    }
                }
            }
        }

        //update
        let then = 0;
        this.run = (time) => {
            time *= 0.001
            if (time > then) {
                then = time + 0.05;
                if (womanMovement[0]) {
                    woman.rotate(0, womanMovement[0] * 10, 0);
                    womanMovement[0] = 0;
                }
                if (womanMovement[1]) {
                    woman.translate(woman.zAxis.scale(womanMovement[1]));
                    camera.translate(woman.zAxis.scale(womanMovement[1]));
                    womanMovement[1] = 0;
                    woman.frame = runAnimation[animationIndex++];
                    animationIndex %= 4;
                }
                this.canvas.render(shadow);
            }
            physics();


            const renderTarget = canvas.renderTarget;

            const scale = renderTarget.maxY * 0.5;

            if (camera.top != scale) {
                camera.top = scale;
                camera.translate(new Vector3(-previousScale, -previousScale, +previousScale)).translate(new Vector3(scale, scale, -scale));
                previousScale = scale;
            }
            if (zoom) {
                camera.zoom += zoom;
                zoom = 0;
            }
            if (camera.zoom > scale) {
                camera.zoom = scale;
            } else if (camera.zoom < 6) {
                camera.zoom = 6;
            }
            let cameraTranslation = new Vector3();
            if (cameraMovement[0]) {
                cameraTranslation.add(camera.xAxis.scale(cameraMovement[0]));
            }
            if (cameraMovement[1]) {
                cameraTranslation.add(camera.yAxis.scale(cameraMovement[1]));
            }
            if (cameraTranslation[0] || cameraTranslation[2]) {
                camera.translate(cameraTranslation);
                cameraMovement.empty();
            }
            this.canvas.render(camera);
        }
    }
}
const landBounding = new Box();
const womanBounding = new Box();
const a = new Vector3();
const b = new Vector3();
const positionVector = new Int8Vector3();