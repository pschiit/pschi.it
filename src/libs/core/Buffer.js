import FloatArray from '../math/FloatArray';
import Vector2 from '../math/Vector2';
import Vector3 from '../math/Vector3';
import Vector4 from '../math/Vector4';
import Node from './Node';

export default class Buffer extends Node {
    constructor(data, step = 1, divisor = 0) {
        super();
        this.usage = Buffer.usage.static;
        this.data = data;
        this.step = step;
        this.divisor = divisor;
        this.normalize = false;
        this.updated = true;
        this.interleaved = false;

        this.addEventListener(Node.event.nodeInserted, (e) => {
            const child = e.inserted;
            if (!(child instanceof Buffer)) {
                this.removeChild(child);
                return;
            }
        });
    }

    get interleaved() {
        return this.parent?.interleaved || this._interleaved;
    }

    set interleaved(v) {
        this._interleaved = v;
    }

    get type() {
        if (this.childrens.length > 0) {
            return ArrayBuffer;
        }
        return this.data.constructor;
    }

    get data() {
        if (this.childrens.length > 0) {
            const length = this.BYTES_LENGTH;
            const data = new ArrayBuffer(length);
            if (this.interleaved) {
                const step = this.step;
                const startAt = this.root.offset;
                this.dispatchCallback((b) => {
                    if (b.childrens.length < 1) {
                        const view = new b.type(data);
                        const bufferOffset = b.offset;
                        let i = 0;
                        for (let j = startAt + bufferOffset; j < length; j += step) {
                            for (let k = 0; k < b.step; k++) {
                                view[j + k] = b.data[i++];
                            }
                        }
                    }
                }, false);
            } else {
                let offset = 0;
                this.dispatchCallback((b) => {
                    if (b.childrens.length < 1) {
                        const view = new b.type(data);
                        let index = offset / b.BYTES_PER_ELEMENT;
                        for (let i = 0; i < b.data.length; i++) {
                            view[index++] = b.data[i];

                        }
                        offset += b.BYTES_LENGTH;
                    }
                });
            }
            this._data = data;
        }
        return this._data;
    }

    set data(v) {
        if (!(this.childrens.length > 0)) {
            this._data = v;
            this.updated = true;
        }
    }

    get updated() {
        if (this.childrens.length > 0) {
            return this.childrens.some(c => c.updated);
        }
        return this._updated;
    }

    set updated(v) {
        if (this.childrens.length > 0) {
            this.dispatchCallback((buffer) => {
                buffer.updated = v;
            }, false);
        }
        this._updated = v;
    }

    get step() {
        if (this.childrens.length > 0) {
            return this.interleaved ? this.childrens.reduce((r, b) => { return r + b.step; }, 0) : 0;
        }
        return this._step;
    }

    set step(v) {
        this._step = v;
    }

    get count() {
        return this.length / this.step;
    }

    get divisorCount() {
        const child = this.childrens.find(b => b.divisor > 0);
        return this.divisor > 0 ? this.count / this.divisor
            : child ? child.divisorCount
                : 0;
    }

    get offset() {
        if (this.parent instanceof Buffer) {
            const name = this.interleaved ? 'step' : 'length';
            return this.parent.offset + this.parent.childrens
                .slice(0, this.parent.childrens.indexOf(this))
                .reduce((r, b) => { return r + b[name]; }, 0);
        }
        return 0;
    }

    get length() {
        if (this.childrens.length > 0) {
            return this.childrens.reduce((r, b) => { return r + b.length; }, 0);
        }
        return this.data.length;
    }

    get BYTES_PER_STEP() {
        if (this.childrens.length > 0) {
            return this.interleaved ? this.childrens.reduce((r, b) => { return r + b.BYTES_PER_STEP; }, 0) : 0;
        }
        return this.BYTES_PER_ELEMENT * this.step;
    }

    get BYTES_PER_OFFSET() {
        if (this.parent instanceof Buffer) {
            const name = this.interleaved ? 'BYTES_PER_STEP' : 'BYTES_LENGTH';
            return this.parent.BYTES_PER_OFFSET + this.parent.childrens
                .slice(0, this.parent.childrens.indexOf(this))
                .reduce((r, b) => { return r + b[name]; }, 0);
        }
        return 0;
    }

    get BYTES_PER_ELEMENT() {
        if (this.childrens.length > 0) {
            return null;
        }
        return this.type.BYTES_PER_ELEMENT;
    }

    get BYTES_LENGTH() {
        if (this.childrens.length > 0) {
            return this.childrens.reduce((r, b) => { return r + b.BYTES_LENGTH; }, 0);
        }
        return this.BYTES_PER_ELEMENT * this.data.length;
    }

    scale(value) {
        if (this.childrens.length > 0) {
            this.dispatchCallback((buffer) => {
                buffer.scale(value)
            }, false);
        } else {
            for (let i = 0; i < this.data.length; i++) {
                this.data[i] *= value;
            }
        }
    }

    transform(matrix) {
        this.dispatchCallback((buffer) => {
            if (buffer.childrens.length == 0) {
                let vector = buffer.step == 4 ? new Vector4()
                    : buffer.step == 3 ? new Vector3() :
                        new Vector2();
                for (let i = 0; i < buffer.length; i += vector.length) {
                    for (let j = 0; j < vector.length; j++) {
                        vector[j] = buffer.data[i + j];
                    }
                    vector.transform(matrix);
                    for (let j = 0; j < vector.length; j++) {
                        this.data[i + j] = vector[j];
                    }
                }
            }
        },);
    }

    setFloatArray(index, floatArray) {
        for (let i = 0; i < floatArray.length; i++) {
            floatArray[i] = this.data[index + i];
        }
        return floatArray;
    }

    empty(){
        this.data = new this.type.constructor(0);
    }

    /** Dispatches a function to the Buffer elements
     * the function will have each FloatArray element
     * @param {Function} callback the function to dispatch
     * @param {Number} step the FloatArray length used for each callback (default is buffer.step)
    */
    dispatch(callback, step) {
        this.dispatchCallback((buffer) => {
            if (buffer.childrens.length == 0) {
                let floatArray = new FloatArray(step || buffer.step);
                for (let i = 0; i < buffer.length; i += floatArray.length) {
                    for (let j = 0; j < floatArray.length; j++) {
                        floatArray[j] = buffer.data[i + j];
                    }
                    callback(floatArray);
                }
            }
        },);
    }

    static usage = {
        static: 'STATIC',
        dynamic: 'DYNAMIC',
        stream: 'STREAM',
    }
}