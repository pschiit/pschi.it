import Box from '../../../libs/math/Box';
import Int8Vector3 from '../../../libs/math/Int8Vector3';
import Plane from '../../../libs/math/Plane';
import Ray from '../../../libs/math/Ray';
import Uint8Vector3 from '../../../libs/math/Uint8Vector3';
import Vector3 from '../../../libs/math/Vector3';
import BoxObject from './BoxObject';

export default class BoxObjectEditor {
    constructor(target = new BoxObject()) {
        this.target = target;
        this.previousStates = [[]];
        this.nextStates = [[]];
    }

    get boundingBox() {
        return this.target.boundingBox;
    }

    get previousState() {
        return this.previousStates[this.frame];
    }

    get nextState() {
        return this.nextStates[this.frame];
    }

    get boxes() {
        return this.target.boxes;
    }

    get frame() {
        return this.target.frame;
    }

    set frame(v) {
        if (v == this.target.frameCount) {
            const boxes = this.target.boxes;
            this.target.addFrame();
            this.target.load(boxes);
            this.previousStates.push([]);
            this.nextStates.push([]);
        }
        this.target.frame = v;
    }

    intersect(ray, addNormal = false) {
        let intersection = addNormal ? ray.intersectPlane(planeXZ) : null;
        const position = this.target.position;
        boundingBox.set(this.boundingBox);
        boundingBox.translate(position);
        const spriteIntersection = ray.intersectBox(boundingBox);
        if (spriteIntersection) {
            const direction = ray.direction.clone().scale(0.5);
            do {
                vector3.set(spriteIntersection)
                vector3.floor();
                const hex = positionVector3.set(vector3).hex;
                if (this.boxes.has(hex)) {
                    if (addNormal) {
                        testingBox.min.set(position);
                        testingBox.max.set(testingBox.min).addScalar(1);
                        testingBox.translate(positionVector3);
                        const boxelIntersection = ray.intersectBox(testingBox);
                        if (boxelIntersection) {
                            if (addNormal) {
                                boxelIntersection.add(testingBox.normalFrom(boxelIntersection).scale(0.5));
                            } else {
                                boxelIntersection.add(testingBox.normalFrom(boxelIntersection).scale(-0.5));
                            }
                            return boxelIntersection;
                        } else {
                            alert('error ray casting');
                        }
                    }
                    return spriteIntersection;
                }
                spriteIntersection.add(direction);
            } while (boundingBox.containsPoint(spriteIntersection));
        };

        return intersection;
    }

    read = (position) => {
        if (position instanceof Ray) {
            position = this.intersect(position)?.floor();
        }
        if (position) {
            if (!Number.isFinite(position)) {
                positionVector3.set(position);
                position = positionVector3.hex;
            }
            const result = this.target.read(position);
            if (result) {
                return Uint8Vector3.fromHex(result);
            }
        }

        return null;
    }

    write = (position, color, add = false) => {
        if (position instanceof Ray) {
            position = this.intersect(position, add)?.floor();
        }
        if (position) {
            if (!Number.isFinite(position)) {
                positionVector3.set(position);
                position = positionVector3.hex;
            }
            if (color != null && !Number.isFinite(color)) {
                colorVector3.set(color);
                color = colorVector3.hex;
            }
            const previousColor = this.target.read(position);
            const action = {
                undo: () => {
                    this.target.write(position, previousColor)
                },
                redo: () => {
                    this.target.write(position, color)
                }
            };
            const result = this.target.write(position, color);
            if (result) {
                this.previousState.push(action);
                if (this.nextState.length > 0) {
                    this.nextState.splice(0, this.nextState.length);
                }
            }
            return result;

        }
        return false;
    }

    drawPlane(from, to, color) {
        if (from[0] > to[0]) {
            const cache = from[0];
            from[0] = to[0];
            to[0] = cache;
        }
        if (from[1] > to[1]) {
            const cache = from[1];
            from[1] = to[1];
            to[1] = cache;
        }
        if (from[2] > to[2]) {
            const cache = from[2];
            from[2] = to[2];
            to[2] = cache;
        }
        const colorHex = colorVector3.set(color).hex;
        const undoIndex = this.previousState.length;
        for (let x = from[0]; x <= to[0]; x++) {
            for (let y = from[1]; y <= to[1]; y++) {
                for (let z = from[2]; z <= to[2]; z++) {
                    positionVector3[0] = x;
                    positionVector3[1] = y;
                    positionVector3[2] = z;
                    this.write(positionVector3.hex, colorHex);
                }
            }
        }
        const redoIndex = this.previousState.length;
        const action = {
            undo: () => {
                while (this.previousState.length > undoIndex) {
                    this.undo();
                }
            },
            redo: () => {
                while (this.previousState.length < redoIndex) {
                    this.redo();
                }
            }
        };
        this.previousState.push(action);

        return this;
    }

    fill(position, color) {
        if (position instanceof Ray) {
            position = this.intersect(position)?.floor();
        }
        if (position) {
            if (!Number.isFinite(position)) {
                positionVector3.set(position);
                position = positionVector3.hex;
            }
            if (color != null && !Number.isFinite(color)) {
                colorVector3.set(color);
                color = colorVector3.hex;
            }
            const colorToReplace = this.target.read(position);
            if (colorToReplace >= 0 && colorToReplace != color) {
                const editor = this;
                const boxes = this.boxes;
                const undoIndex = this.previousState.length;
                fill(position, color);
                const redoIndex = this.previousState.length;
                const action = {
                    undo: () => {
                        while (this.previousState.length > undoIndex) {
                            this.undo();
                        }
                    },
                    redo: () => {
                        while (this.previousState.length < redoIndex) {
                            this.redo();
                        }
                    }
                };
                this.previousState.push(action);

                function fill(position, color) {
                    editor.write(position, color);
                    const frontColor = boxes.get(position + 1);
                    if (frontColor === colorToReplace) {
                        fill(position + 1, color)
                    }
                    const backColor = boxes.get(position - 1);
                    if (backColor === colorToReplace) {
                        fill(position - 1, color)
                    }
                    const leftColor = boxes.get(position - 65536);
                    if (leftColor === colorToReplace) {
                        fill(position - 65536, color)
                    }
                    const rightColor = boxes.get(position + 65536);
                    if (rightColor === colorToReplace) {
                        fill(position + 65536, color)
                    }
                    const bottomColor = boxes.get(position + 256);
                    if (bottomColor === colorToReplace) {
                        fill(position - 256, color)
                    }
                    const topColor = boxes.get(position - 256);
                    if (topColor === colorToReplace) {
                        fill(position + 256, color)
                    }
                }
            }
        }

        return null;
    }

    undo() {
        if (this.previousState.length > 0) {
            const action = this.previousState.pop();
            action.undo();
            this.nextState.unshift(action);
        }
        return this;
    }

    redo() {
        if (this.nextState.length > 0) {
            const action = this.nextState.splice(0, 1)[0];
            action.redo();
            this.previousState.push(action);
        }
        return this;
    }

    empty() {
        this.target.empty();
        this.previousState.splice(0, this.previousState.length);
        this.nextState.splice(0, this.nextState.length);
        return this;
    }

    save() {
        return this.target.toJSON();
    }

    load(json) {
        return this.target.loadJSON(json);
    }
}
const planeXZ = new Plane();
const boundingBox = new Box();
const testingBox = new Box(new Vector3(), new Vector3(1, 1, 1));

const vector3 = new Vector3();
const int8Vector = new Int8Vector3();
const positionVector3 = new Int8Vector3();
const colorVector3 = new Uint8Vector3();