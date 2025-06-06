import Buffer from '../../../core/Buffer';
import Box from '../../../math/Box';
import FloatArray from '../../../math/FloatArray';
import Triangle from '../../../math/Triangle';
import GraphicsNode from '../GraphicsNode';
import Material from '../Material';

export default class VertexBuffer extends GraphicsNode {
    constructor() {
        super();
        this._index = null;
        this.primitive = null;
        this.count = 0;
        this.offset = 0;

        this.positionLength = 3;
        this.normalLength = 3;
        this.colorLength = 4;
        this.uvLength = 2;
    }

    get index() {
        return this._index;
    }

    set index(v) {
        if (v) {
            if (Array.isArray(v)) {
                v = this.count < 255 ? new Uint8Array(v)
                    : this.count < 65535 ? new Uint16Array(v)
                        : new Uint32Array(v);
            }
            if (this.index) {
                this.index.data = v;
            } else {
                this._index = new Buffer(v);
            }
        } else {
            this.index = null;
        }
    }

    get count() {
        return this._count ? this._count : this.index?.length ?? 0;
    }

    set count(v) {
        this._count = v;
    }

    get offset() {
        const offset = this._offset ?? 0;
        return this.index ? this.index.offset + offset : offset;
    }

    set offset(v) {
        this._offset = v;
    }

    get position() {
        return this.getParameter(Material.parameters.position);
    }

    set position(v) {
        this.setParameter(Material.parameters.position.name, v, this.positionLength);
    }

    get boundingBox() {
        const box = new Box();
        if (this.position) {
            this.position.dispatch((vector3) => {
                box.expandByPoint(vector3)
            });
        }

        return box;
    }

    get normal() {
        return this.getParameter(Material.parameters.normal);
    }

    set normal(v) {
        this.setParameter(Material.parameters.normal.name, v, this.normalLength);
    }

    get color() {
        return this.getParameter(Material.parameters.color);
    }

    set color(v) {
        this.setParameter(Material.parameters.color.name, v, this.colorLength);
    }

    get uv() {
        return this.getParameter(Material.parameters.uv);
    }

    set uv(v) {
        this.setParameter(Material.parameters.uv.name, v, this.uvLength);
    }

    get buffers() {
        const result = [];
        for (const name in this.parameters) {
            const parameter = this.getParameter(name);
            if (parameter instanceof Buffer) {
                result.push(parameter);
            }
        }
        return result;
    }

    get arrayBuffer() {
        if (!this._arrayBuffer) {
            this._arrayBuffer = new Buffer();
        }
        this.buffers.forEach(b => {
            if (!b.divisor && b.parent != this._arrayBuffer) {
                this._arrayBuffer.appendChild(b);
            }
        });
        return this._arrayBuffer;
    }

    setParameter(name, v, step) {
        let buffer = this.getParameter(name);
        if (v) {
            if (v instanceof Buffer && v != buffer) {
                super.setParameter(name, v);
            } else {
                if (Array.isArray(v)) {
                    v = new Float32Array(v);
                }
                if (!buffer) {
                    buffer = new Buffer(v, step);
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

    transform(matrix) {
        let buffer = this.position;
        if (buffer) {
            buffer.transform(matrix);
        }
        buffer = this.normal;
        if (buffer) {
            buffer.transform(matrix.inverse.transpose());
        }
    }

    generateNormal(type = Float32Array) {
        const index = this.index;
        const position = this.position;

        if (position !== undefined) {
            const result = new type(position.count * 3)
            const triangle = new Triangle();
            if (index) {
                for (let i = 0; i < index.count; i += 3) {
                    const a = position.step * index.data[i + 0];
                    const b = position.step * index.data[i + 1];
                    const c = position.step * index.data[i + 2];
                    position.setFloatArray(a, triangle.a);
                    position.setFloatArray(b, triangle.b);
                    position.setFloatArray(c, triangle.c);

                    const normal = triangle.normal;

                    result.set(normal, a);
                    result.set(normal, b);
                    result.set(normal, c);
                }
            } else {
                for (let i = 0; i < position.count; i += 3) {
                    const a = position.step * i;
                    const b = position.step * (i + 3);
                    const c = position.step * (i + 6);
                    position.setFloatArray(a, triangle.a);
                    position.setFloatArray(b, triangle.b);
                    position.setFloatArray(c, triangle.c);

                    const normal = triangle.normal;

                    result.set(normal, a);
                    result.set(normal, b);
                    result.set(normal, c);
                }
            }
            this.normal = result;
        }
    }

    generateColor(color, type = Float32Array) {
        const position = this.position;

        if (position !== undefined) {
            this.colorLength = color.length;
            const result = new type(position.count * color.length);
            for (let i = 0; i < result.length; i++) {
                result[i] = color[i % color.length];
            }
            this.color = result;
        }
    }
}