import Buffer from '../../../core/Buffer';
import Box from '../../../math/Box';
import Material from '../Material';
import VertexBuffer from './VertexBuffer';

export default class InstanceBuffer extends VertexBuffer {
    constructor(vertexBuffer, positions, colors) {
        super();
        this.vertexBuffer = vertexBuffer;
        this.instancePositionLength = 3;
        this.instanceColorLength = 3;
        this.instancePosition = positions || [];
        this.instanceColor = colors || [];
        this.instanceColor.normalize = true;
        this.instancePosition.usage = Buffer.usage.stream;
        this.instanceColor.usage = Buffer.usage.stream;
    }

    get index() {
        return this.vertexBuffer.index;
    }

    get arrayBuffer() {
        return this.vertexBuffer.arrayBuffer;
    }

    get buffers() {
        return super.buffers.concat(this.vertexBuffer.buffers);
    }

    get count() {
        return this.vertexBuffer && this.instancePosition?.length > 0 ? this.vertexBuffer.index.length : 0;
    }

    set count(v) {
        this._count = v;
    }

    get divisor() {
        return this.instanceArrayBuffer?.divisor ||
            this.buffers.find(b => b.divisor > 0)?.divisor;
    }

    get divisorCount() {
        return this.instanceArrayBuffer?.divisorCount ||
            this.buffers.find(b => b.divisor > 0)?.divisorCount;
    }

    get instanceBuffers() {
        const result = [];
        for (const name in this.parameters) {
            const parameter = this.getParameter(name);
            if (parameter instanceof Buffer && parameter.divisor > 0) {
                result.push(parameter);
            }
        }
        return result;
    }

    get instanceArrayBuffer() {
        const buffers = this.instanceBuffers;
        if (buffers.length > 1) {
            if (!this._instanceArrayBuffer) {
                this._instanceArrayBuffer = new Buffer();
                this.instanceArrayBuffer.interleaved = true;
                this.instanceArrayBuffer.usage = Buffer.usage.stream;
            }
            buffers.forEach(b => {
                if (b.divisor && b.parent != this._instanceArrayBuffer) {
                    this._instanceArrayBuffer.appendChild(b);
                }
            });
            return this._instanceArrayBuffer;
        }
        return null;
    }

    get instancePosition() {
        return this.getParameter(Material.parameters.instancePosition);
    }

    set instancePosition(v) {
        this.setInstanceParameter(Material.parameters.instancePosition, v, this.instancePositionLength, 1);
    }

    get instanceColor() {
        return this.getParameter(Material.parameters.instanceColor);
    }

    set instanceColor(v) {
        this.setInstanceParameter(Material.parameters.instanceColor, v, this.instanceColorLength, 1);
    }

    get boundingBox() {
        const vertexBufferBox = this.vertexBuffer.boundingBox;
        const box = new Box();
        if (this.instancePosition) {
            this.instancePosition.dispatch((vector3) => {
                vertexBufferBox.translate(vector3);
                box.union(vertexBufferBox);
                vertexBufferBox.translate(vector3.negate());
            });
        }

        return box;
    }

    setInstanceParameter(name, v, step, divisor) {
        let buffer = this.getParameter(name);
        if (v) {
            if (v instanceof Buffer && v != buffer) {
                super.setParameter(name, v);
            } else {
                if (Array.isArray(v)) {
                    v = new Float32Array(v);
                }
                if (!buffer) {
                    buffer = new Buffer(v, step, divisor);
                    super.setParameter(name, buffer);

                } else {
                    buffer.data = v;
                }
                if (buffer.name != name) {
                    buffer.name = name;
                }
            }
        } else if (buffer) {
            super.setParameter(name, null);
        }

        return buffer;
    }
}