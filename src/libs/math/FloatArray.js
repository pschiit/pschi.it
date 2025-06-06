export default class FloatArray extends Float32Array {
    constructor(length) {
        super(length);
    }

    /** Return whether or not a Matrix4 array is equals the current Matrix4
     * @param {FloatArray} mathArray the matrix to compare
     * @return {Boolean} true if matrices are equals
    */
    equals(mathArray) {
        return mathArray?.every((e, i) => e == this[i]);
    }

    min(mathArray) {
        for (let i = 0; i < this.length; i++) {
            this[i] = Math.min(this[i], mathArray[i]);
        }
        return this;
    }

    max(mathArray) {
        for (let i = 0; i < this.length; i++) {
            this[i] = Math.max(this[i], mathArray[i]);
        }
        return this;
    }

    clamp(a, b) {
        for (let i = 0; i < this.length; i++) {
            this[i] = Math.max(a[i], Math.min(b[i], this[i]));
        }

        return this;
    }

    floor() {
        for (let i = 0; i < this.length; i++) {
            this[i] = Math.floor(this[i]);
        }
        return this;
    }

    round() {
        for (let i = 0; i < this.length; i++) {
            this[i] = Math.round(this[i]);
        }
        return this;
    }

    empty() {
        for (let i = 0; i < this.length; i++) {
            this[i] = 0;
        }
        return this;
    }

    clone() {
        return new this.constructor(this);
    }

    concat(data) {
        if (Number.isFinite(data)) {
            data = [data];
        }
        const result = new FloatArray(this.length + data.length);

        result.set(this);
        result.set(data, this.length);

        return result;
    }

    toInt8() {
        return new Int8Array(this);
    }

    toInt16() {
        return new Int16Array(this);
    }

    toint32() {
        return new Int32Array(this);
    }

    toUint8() {
        return new Uint8Array(this);
    }

    toUint16() {
        return new Uint16Array(this);
    }

    toUint32() {
        return new Uint32Array(this);
    }

    toUint8Clamped() {
        return new Uint8ClampedArray(this);
    }

    static clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    /** Convert radians to degrees
     * @param {Number} radian Angle in radians
     * @return {Number} angle in degrees
    */
    static toDegree(radian) {
        return radian * 180 / Math.PI;
    }

    /** Convert degrees to radians
     * @param {Number} degree Angle in degrees
     * @return {Number} angle in radians
    */
    static toRadian(degree) {
        return Math.PI * (degree) / 180.0;
    }
}