import BoxBuffer from '../../../libs/3d/buffer/BoxBuffer';
import InstanceLightMaterial from '../../../libs/3d/material/InstanceLightMaterial';
import Node3d from '../../../libs/3d/Node3d';
import Box from '../../../libs/math/Box';
import Int8Vector3 from '../../../libs/math/Int8Vector3';
import Uint8Vector3 from '../../../libs/math/Uint8Vector3';
import Vector3 from '../../../libs/math/Vector3';
import InstanceBuffer from '../../../libs/renderer/graphics/buffer/InstanceBuffer';

export default class BoxObject extends Node3d {
    constructor() {
        super(material, new InstanceBuffer(buffer));
        this._boundingBox = new Box();

        this.shadowMap = new Set();

        this.frames = [];
        this._frame = -1;
        this.addFrame();
        this.updated = false;
    }

    get boundingBox() {
        if (this._boundingBox.isEmpty && this.boxes.size > 0) {
            this.generateBoundingBox();
        }
        return this._boundingBox;
    }

    get positions() {
        return this.boxes.keys();
    }

    get colors() {
        return this.boxes.values();
    }

    get frameCount() {
        return this.frames.length;
    }

    get frame() {
        return this._frame;
    }

    set frame(v) {
        if (v < this.frames.length && v >= 0) {
            this._frame = v;
            this.boundingBox.empty();
            this.updated = true;
        }
    }

    get boxes() {
        return this.frames[this.frame];
    }

    addFrame() {
        if (this.frame == this.frames.length - 1) {
            this.frames.push(new Map());
        } else {
            this.frames.splice(this.frame, 0, new Map());
        }
        this.frame++;

        return this;
    }

    removeFrame(index = this.frame) {
        if (index == this.frame) {
            this.frame--;
        }
        this.frames.splice(index, 1);
    }

    emptyFrames() {
        if (this.frames.length > 1) {
            this.frames.splice(1, this.frames.length - 1, new Map());
            this.frame = 0;
        }
        this.empty();
    }

    /**
     * @param {Number} position Int8 hex value
     */
    read(position) {
        return this.boxes.get(position);
    }

    /**
     * @param {Number} position Int8 hex value
     * @param {Number} color Uint8 hex value
     * @returns {Boolean} true if 
     */
    write(position, color) {
        if (color > 0) {
            const existing = this.read(position);
            if (!existing) {
                positionVector.hex = position;
                testingBox.min.set(positionVector);
                testingBox.max.set(testingBox.min).addScalar(1);
                this.boundingBox.union(testingBox);
                this.boxes.set(position, color);
                this.updated = true;

                return true;
            } else if (existing != color) {
                this.boxes.set(position, color);
                this.updated = true;

                return true;
            }
        } else if (this.boxes.has(position)) {
            this.boxes.delete(position);
            this.boundingBox.empty();
            this.updated = true;

            return true;
        }

        return null;
    }

    generateBoundingBox() {
        const positions = new Set();
        this.frames.forEach(f => f.forEach((c, p) => positions.add(p)));
        for (const hex of positions) {
            positionVector.hex = hex;
            testingBox.min.set(positionVector);
            testingBox.max.set(testingBox.min).addScalar(1);
            this._boundingBox.union(testingBox);
        }
        return this;
    }

    generateBuffer() {
        const positions = [];
        const colors = [];
        const boxes = this.boxes;
        for (const [position, color] of boxes) {
            positionVector.hex = position;
            colorVector.hex = color;
            const frontObstruct = boxes.has(position + 1);
            const backObstruct = boxes.has(position - 1);
            const leftObstruct = boxes.has(position + 65536);
            const rightObstruct = boxes.has(position - 65536);
            const bottomObstruct = boxes.has(position + 256);
            const topObstruct = boxes.has(position - 256);
            if (!frontObstruct
                || !backObstruct
                || !leftObstruct
                || !rightObstruct
                || !bottomObstruct
                || !topObstruct) {
                positions.push(positionVector[0], positionVector[1], positionVector[2]);
                colors.push(colorVector[0], colorVector[1], colorVector[2]);
            }
        }
        this.vertexBuffer.instancePosition = new Int8Array(positions);
        this.vertexBuffer.instanceColor = new Uint8Array(colors);

        return this;
    }

    empty() {
        if (this.boxes.size > 0) {
            this.boxes.clear();
            this.vertexBuffer.instancePosition.empty();
            this.vertexBuffer.instanceColor.empty();
            this.boundingBox.empty();
            this.updated = false;
        }

        return this;
    }

    /**
     * @param {BoxObject|Map[]|Map} boxes 
     */
    load(boxes) {
        if (Array.isArray(boxes)) {
            this.emptyFrames();
            this.frames = boxes;
            this.frame = 0;
            this.updated = true;
        } else if (boxes instanceof BoxObject) {
            this.emptyFrames();
            this.frames = boxes.frames;
            this.frame = boxes.frame;
            this.updated = true;
        } else if (boxes instanceof Map) {
            this.empty();
            for (const [position, color] of boxes) {
                this.write(position, color);
            }
        }

        return this;
    }

    /**
     * @param {String} json 
     */
    loadJSON(json) {
        const frames = JSON.parse(json)
            .map(f => new Map(Object.entries(JSON.parse(f)).map(e => [parseInt(e[0]), e[1]])));
        if (frames) {
            this.load(frames);
        }

        return this;
    }

    /**
     * @return {String} json
     */
    toJSON() {
        return JSON.stringify(this.frames.map(f => JSON.stringify(Object.fromEntries(f))));;
    }

    setScene(parameters) {
        super.setScene(parameters);
        if (this.updated) {
            this.generateBuffer();
            this.updated = false;
        }
    }
}
const buffer = new BoxBuffer(1, 1, 1, 0.06);
const material = new InstanceLightMaterial();

const positionVector = new Int8Vector3();
const colorVector = new Uint8Vector3();
const testingBox = new Box(new Vector3(), new Vector3(1, 1, 1));